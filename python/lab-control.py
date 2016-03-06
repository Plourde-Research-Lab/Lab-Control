import sys
from PyQt4 import QtCore, QtGui, uic

import time
import numpy as np
from datetime import datetime
from calendar import timegm
from pymongo import MongoClient, ASCENDING, DESCENDING, ReturnDocument
import pyvisa
import json

class labControl(QtGui.QMainWindow):

    def __init__(self):
        super(labControl, self).__init__()
        uic.loadUi('gui.ui', self)
        self.setWindowTitle('ADR2Control')

        # Load Settings
        self.settings = json.load(open('settings.json'))

        # Initialize parameters
        ## Log parameters
        self.logFileName = self.settings['logFileName']
        self.readLogFile()

        ## Database parameters
        self.mongoAddress = self.settings['mongoClient']
        self.dbAddressInput.setText(self.mongoAddress)

        ## Instrument parameters
        ### Connect to instruments
        # self.connectInstruments()

        ### Power supply parameters


        # Connect to database
        try:
            self.mongoClient = MongoClient(self.mongoAddress)
            self.dataDB = self.mongoClient.data.adr2datas
            self.controlDB = self.mongoClient.control.adr2controls
            self.jobDB = self.mongoClient.jobs.adr2jobs
        except Exception:
            self.writeLog("Databse Error.")

        # Connect UI elements to signals

        ## Instrument Connections
        self.instr0Connect.clicked.connect(lambda : self.instr0Connect)
        self.instr1Connect.clicked.connect(lambda : self.instr1Connect)
        self.instr2Connect.clicked.connect(lambda : self.instr2Connect)

        ## Power Supply Control
        self.magupBtn.clicked.connect(lambda : self.magup)
        self.magdownBtn.clicked.connect(lambda : self.magdown)

        ## Main Control
        self.startBtn.clicked.connect(lambda : self.startControl())

        self.controlTimer = QtCore.QTimer(self)
        self.controlTimer.setInterval(5000)
        self.controlTimer.timeout.connect(self.control)

        ## log
        self.logFileSelectBtn.clicked.connect(lambda : self.selectLogFile())

        ## Start
        # self.startControl()
        self.show()

    def connectInstruments(self):
        self.rm = pyvisa.ResourceManager()
        self.instruments = []
        for i, inst in enumerate(self.settings['instruments']):
            inst['obj'] = self.rm.open_resource(inst['address'])
            self.instruments.append(inst)
            getattr(self, 'instr' + str(i) + 'Address').setText(inst['address'])
            getattr(self, 'instr' + str(i) + 'Status').setText("Connected")

    def connectInstrument(self, name):
        for inst in self.settings['instruments']:
            if inst['name'] == name:
                pass

    def startControl(self):
        if self.startBtn.text() == "Start":
            self.controlTimer.start()
            self.startBtn.setText("Stop")
        elif self.startBtn.text() == "Stop":
            self.controlTimer.stop()
            self.startBtn.setText("Start")

    def writeVolt(self, volt):
        next((x for x in self.instruments if x['name'] == "Agilent 6641A"), None)['obj'].write('VOLT:LEV:IMM ' + str(volt) + 'mV')
        self.writeConsole(str(volt) + "mV\t" + "Current: " + str(self.data['psCurrent']) + "\tVoltage: " + str(self.data['psVoltage']))

    def control(self):
        # Read Data
        try:
            self.getData()

        # Log errors if they occur and reconnect
        except UnicodeDecodeError:
            string = "Read error at " + datetime.now().strftime('%H:%M:%S') + '\n'
            self.writeLog(string)
            self.connectInstruments()

        # Insert Data into Database
        else:
            if (self.data['sixtyKTemp'] <= 300):
                try:
                    self.dataDB.insert(self.data)
                except:
                    self.writeConsole("Database error at " + datetime.now().strftime('%H:%M:%S'))

        # Get information from Database

        self.info = self.controlDB.find().next()

        if self.info['command'] == 'Magup':
            #Ensure fridge is actually cold enough to mag up!
            if self.data['threeKTemp'] > 4.5:
                pass
            elif self.info['currentJob'] != 'Magup':
                self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'Magup', 'jobStart': self.data['timeStamp']}})
                logString = "Start Magup to " + str(self.info['maxVoltage']) + "mV at " + datetime.now().strftime('%a, %c')
                self.writeLog(logString)

        elif self.info['command'] == 'Magdown':
            if self.info['currentJob'] != 'Magdown':
                if self.info['currentJob'] == 'Soak':
                    self.stopSoakTime = datetime.now()
                    t = (self.stopSoakTime - self.startSoakTime)
                    logString = "Soaked for {} days, {}h: {}m: {}s".format(t.days,t.seconds//3600,(t.seconds//60)%60, t.seconds%60)
                    self.writeLog(logString)

                self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'Magdown', 'jobStart': self.data['timeStamp']}})
                logString = "Start Magdown at " + datetime.now().strftime('%a, %c')
                self.writeLog(logString)

        elif self.info['command'] == 'Soak':
            if self.info['currentJob'] != 'Soak':
                self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'Soak', 'jobStart': self.data['timeStamp']}})
                logString = "Start Soak at " + datetime.now().strftime('%a, %c')
                self.startSoakTime = datetime.now()
                self.writeLog(logString)

        else:
            self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'None'}})
            if self.data['baseTemp'] < 3 and self.data['baseTemp'] != 0.0:
                statusString = "Cold (Magged Down)"
            elif self.data['threeKTemp'] < 4.5:
                statusString = "Cold (3K)"
            elif (self.data['sixtyKTemp'] < self.data['threeKTemp']) and (self.data['sixtyKTemp'] > 50):
                statusString = "Cooling Down"
            elif (self.data['threeKTemp'] > 285):
                statusString = "Warm"
            elif (self.data['sixtyKTemp'] > self.data['threeKTemp']) and (self.data['sixtyKTemp'] > 60):
                statusString = "Warming Up"
            else:
                statusString = "Uncertain State"

        # Control Magnet
        self.job = self.info['currentJob']
        self.currentJob.setText(self.job)

        if self.job == 'Magup':
            # Increase Magnet Voltage
            currentV = self.data['psVoltCommand']*1000
            if currentV < self.info['maxVoltage']:
                nextV = currentV + self.info['voltageStep']
                self.writeVolt(nextV)
            else:
                if self.data['psCurrent'] > 9.0:
                    print('9A reached')
                    self.info = self.controlDB.find_one_and_update({},{'$set': {'command': 'Soak'}})
            statusString = "Magup"
        elif self.job == 'Magdown':
            # Decrease Magnet Voltage
            currentV = self.data['psVoltCommand']*1000
            if currentV > 0:
                nextV = currentV - self.info['voltageStep']
                self.writeVolt(nextV)
            else:
                self.info = self.controlDB.find_one_and_update({},{'$set': {'command': 'None'}})
            statusString = "Magdown"
        elif self.job == 'Soak':
            # Soak
            statusString = "Soak"
        else:
            pass

        self.info = self.controlDB.find_one_and_update({},{'$set': {'fridgeStatus': statusString}})
        self.fridgeStatus.setText(statusString)

    def getData(self):
        self.data = {'timeStamp': timegm(datetime.now().timetuple())}
        for reading in self.settings['sensors']:
            inst = next((x for x in self.instruments if x['name'] == reading['instr']), None)['obj']
            value = inst.query(reading['command'])
            self.data[reading['name']] = float(value)
        self.data['percentComplete'] = round(self.data['psCurrent']/9 * 100)
        self.data['switchState'] = "Closed"

    def magup(self):
        if self.magupBtn.text() == "Start":
            self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'Magup', 'jobStart': self.data['timeStamp']}})
            self.magupBtn.setText("Stop")
            self.magdownBtn.setText("Start")
        elif self.magupBtn.text() == "Stop":
            self.controlDB.find_one_and_update({},{'$set': {'command': 'None', 'jobStart': self.data['timeStamp']}})
            self.magupBtn.setText("Start")
            self.magdownBtn.setText("Start")

    def magdown(self):
        if self.magupBtn.text() == "Start":
            self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'Magdown', 'jobStart': self.data['timeStamp']}})
            self.magdownBtn.setText("Stop")
            self.magdupBtn.setText("Start")
        elif self.magupBtn.text() == "Stop":
            self.controlDB.find_one_and_update({},{'$set': {'command': 'None', 'jobStart': self.data['timeStamp']}})
            self.magdownBtn.setText("Start")
            self.magupBtn.setText("Start")

    def writeLog(self, string):
        self.logFile = open(self.logFileName, 'a')
        self.logFile.writelines([string, '\n'])
        self.logFile.close()
        self.logText.append(string)

    def writeConsole(self, string):
        self.consoleText.append(string)

    def selectLogFile(self):
        self.logFileName = QtGui.QFileDialog.getOpenFileName()
        self.readLogFile()

    def readLogFile(self):
        self.logFile = open(self.logFileName)
        self.writeLog(self.logFile.read())
        self.logFile.close()

if __name__ == '__main__':
    app = QtGui.QApplication(sys.argv)
    window = labControl()
    sys.exit(app.exec_())
