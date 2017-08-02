import sys
from os import popen
from PyQt5 import QtCore, QtGui, QtWidgets, uic

import time
import numpy as np
from datetime import datetime
from calendar import timegm
from pymongo import MongoClient, ASCENDING, DESCENDING, ReturnDocument
import pyvisa
from serial import Serial
import json

class labControl(QtWidgets.QMainWindow):

    def __init__(self):
        super(labControl, self).__init__()
        uic.loadUi('gui.ui', self)
        self.setWindowTitle('ADRControl')

        self.debugLog = True

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
        self.heatSwitch = Serial(self.settings['heatSwitch']['address'], 9600, timeout=1)
        self.connectInstruments()

        ### Power supply parameters
        self.powerSupply = next((x for x in self.instruments if x['name'] == "Agilent 6641A"), None)['obj']
        self.initMagnet()

        # Connect to database

        try:
            self.mongoClient = MongoClient(self.mongoAddress)
            self.dataDB = getattr(self.mongoClient.data, self.settings['fridge'].lower() + "datas")
            self.controlDB = getattr(self.mongoClient.control, self.settings['fridge'].lower() + "controls")
            self.jobDB = getattr(self.mongoClient.jobs, self.settings['fridge'].lower() + "jobs")
            if self.debugLog: print("Connected to databases.")
        except Exception:
            self.writeLog("Databse Error.")

        # Connect UI elements to signals

        ## Instrument Connections
        self.instr0Connect.clicked.connect(lambda : self.connectInstrument(0))
        self.instr1Connect.clicked.connect(lambda : self.connectInstrument(1))
        self.instr2Connect.clicked.connect(lambda : self.connectInstrument(2))

        ## Power Supply Control
        self.magupBtn.clicked.connect(lambda : self.magup())
        self.magdownBtn.clicked.connect(lambda : self.magdown())

        ## Main Control
        self.startBtn.clicked.connect(lambda : self.startControl())

        self.controlTimer = QtCore.QTimer(self)
        self.controlTimer.setInterval(5000)
        self.controlTimer.timeout.connect(self.control)

        ## log
        self.logFileSelectBtn.clicked.connect(lambda : self.selectLogFile())

        ## Start
        self.startControl()
        self.show()

    def connectInstruments(self):
        self.rm = pyvisa.ResourceManager()
        self.instruments = []
        for i, inst in enumerate(self.settings['instruments']):
            if inst['connected']:
                print("Connecting to " + inst['name'])
                inst['obj'] = self.rm.open_resource(inst['address'])
                self.instruments.append(inst)
                getattr(self, 'instr' + str(i) + 'Address').setText(inst['address'])
                getattr(self, 'instr' + str(i) + 'Status').setText("Connected")
            else:
                print("Not Connecting to " + inst['name'])
                self.instruments.append(inst)
                getattr(self, 'instr' + str(i) + 'Address').setText(inst['address'])
                getattr(self, 'instr' + str(i) + 'Status').setText("Not Connected")

    def toggleConnection(self, index):
        if self.instruments[i]['connected']:
            self.instruments[i]['obj'].close()
            self.instruments[i]['connected'] = False
            getattr(self, 'instr' + str(i) + 'Status').setText("Not Connected")
        else:
            self.instruments[i]['obj'] = self.rm.open_resource(self.instruments[i]['address'])
            self.instruments[i]['connected'] = True
            getattr(self, 'instr' + str(i) + 'Status').setText("Connected")

    def startControl(self):
        if self.startBtn.text() == "Start":
            self.controlTimer.start()
            self.startBtn.setText("Stop")
            # self.connectInstruments()
        elif self.startBtn.text() == "Stop":
            self.controlTimer.stop()
            self.startBtn.setText("Start")
            # for i in [0,1,2]:
            #     self.toggleConnection(i)

    def writeVolt(self, volt):
        self.powerSupply.write('VOLT:LEV:IMM ' + str(volt) + 'mV')
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
        self.lastCommand = self.info['command']

        if self.info['command'] == 'Magup':
            #Ensure fridge is actually cold enough to mag up!
            if self.data['threeKTemp'] > 4.5:
                pass
            elif self.info['currentJob'] != 'Magup':
                self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'Magup', 'jobStart': self.data['timeStamp']}})
                logString = "Start Magup to " + str(self.info['maxVoltage']) + "mV at " + datetime.now().strftime('%a, %c')
                self.writeLog(logString)

        elif self.info['command'] in ['Open', 'Close']:
            self.heatSwitchControl(self.info['command'])

        elif self.info['command'] == 'Magdown':
            if self.info['currentJob'] != 'Magdown':
                if self.info['currentJob'] == 'Soak':
                    self.stopSoakTime = datetime.now()
                    self.startSoakTime = datetime.fromtimestamp(self.info['jobStart'])
                    # print(self.startSoakTime)
                    t = (self.stopSoakTime - self.startSoakTime)
                    logString = "Soaked for {} days, {}h: {}m: {}s".format(t.days,t.seconds//3600,(t.seconds//60)%60, t.seconds%60)
                    self.writeLog(logString)
                    # Open Heat Switch
                    print("Opening HS to Magdown")
                    self.heatSwitchControl('Open')

                self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'Magdown', 'jobStart': self.data['timeStamp']}})
                logString = "Start Magdown at " + datetime.now().strftime('%a, %c')
                self.writeLog(logString)

        elif self.info['command'] == 'Soak':
            if self.info['currentJob'] != 'Soak':
                self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'Soak', 'jobStart': self.data['timeStamp']}})
                logString = "Start Soak at " + datetime.now().strftime('%a, %c')
                self.startSoakTime = datetime.now()
                self.writeLog(logString)
                self.heatSwitchControl('Close')

        else:
            self.info = self.controlDB.find_one_and_update({},{'$set': {'currentJob': 'None'}})
            if self.data['baseTemp'] < 3 and self.data['baseTemp'] != 0.0:
                self.statusString = "Cold (Magged Down)"
            elif self.data['threeKTemp'] < 4.5:
                self.statusString = "Cold (3K)"
            elif (self.data['sixtyKTemp'] < self.data['threeKTemp']) and (self.data['sixtyKTemp'] > 50):
                self.statusString = "Cooling Down"
            elif (self.data['threeKTemp'] > 285):
                self.statusString = "Warm"
            elif (self.data['sixtyKTemp'] > self.data['threeKTemp']) and (self.data['sixtyKTemp'] > 60):
                self.statusString = "Warming Up"
            else:
                self.statusString = "Uncertain State"


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
            self.statusString = "Magup"

            ## Close Heat Switch if oneKTemp surpasses threeKTemp, and only check every 3 steps.
            if (self.data['oneKTemp'] - self.data['threeKTemp'] > .5) and (self.data['switchState'] == 'Open') and (nextV % 3 == 0):
                self.heatSwitchControl('Close')

        elif self.job == 'Magdown':
            # Decrease Magnet Voltage
            currentV = self.data['psVoltCommand']*1000
            if currentV > 0:
                nextV = currentV - self.info['voltageStep']
                self.writeVolt(nextV)
            else:
                self.info = self.controlDB.find_one_and_update({},{'$set': {'command': 'None'}})
            self.statusString = "Magdown"
        elif self.job == 'Soak':
            # Soak
            self.statusString = "Soak"
        ## Close Heat Switch when warming up
        elif self.job == 'None':
            if (self.data['threeKTemp'] > 10) and (self.data['switchState'] == 'Open'):
                self.heatSwitchControl('Close')
        else:
            pass

        self.info = self.controlDB.find_one_and_update({},{'$set': {'fridgeStatus': self.statusString}})
        self.fridgeStatus.setText(self.statusString)

    def getData(self):
        self.data = {'timeStamp': timegm(datetime.now().timetuple())}
        for reading in self.settings['sensors']:
            # print(reading)
            inst = next((x for x in self.instruments if x['name'] == reading['instr']), None)
            if inst['connected']:
                # print("Getting Data from " + inst['name'])
                value = inst['obj'].query(reading['command'])
            else:
                # print("Not from " + inst['name'])
                value = 0 #Return 0 if instrument is not connected
            self.data[reading['name']] = float(value)
        self.data['percentComplete'] = round(self.data['psCurrent']/9 * 100)


        self.heatSwitch.write(b'R') #Read Heat Switch

        self.data['switchState'] = str(self.heatSwitch.readline().strip(), 'utf-8')
        # print(self.data['switchState'])
        self.switchStatus.setText(self.data['switchState'])

    def heatSwitchControl(self, cmd):
        print("Controlling HS")
        if cmd == 'Open':
            print("Opening HS")
            self.heatSwitch.write(b'O')
            # pass
        elif cmd == 'Close':
            print("Closing HS")
            self.heatSwitch.write(b'C')
            # pass

        if hasattr(self, 'lastCommand') and not self.lastCommand in ['Open', 'Close']:
            self.controlDB.find_one_and_update({},{'$set': {'command': self.lastCommand}})
        else:
            self.controlDB.find_one_and_update({},{'$set': {'command': 'None'}})

    def magup(self):
        if self.magupBtn.text() == "Start":
            self.info = self.controlDB.find_one_and_update({},{'$set': {'command': 'Magup', 'jobStart': self.data['timeStamp']}})
            self.magupBtn.setText("Stop")
            self.magdownBtn.setText("Start")
        elif self.magupBtn.text() == "Stop":
            self.controlDB.find_one_and_update({},{'$set': {'command': 'None', 'jobStart': self.data['timeStamp']}})
            self.magupBtn.setText("Start")
            self.magdownBtn.setText("Start")

    def magdown(self):
        if self.magupBtn.text() == "Start":
            self.info = self.controlDB.find_one_and_update({},{'$set': {'command': 'Magdown', 'jobStart': self.data['timeStamp']}})
            self.magdownBtn.setText("Stop")
            self.magupBtn.setText("Start")
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
        print("Reading Log file " + self.logFileName + "...")
        self.logFile = popen("tail -n 50 " + self.logFileName)
        self.writeLog(self.logFile.read())
        self.logFile.close()
        print("Read last 50 lines")

    def initMagnet(self):
        if not bool(float(self.powerSupply.query('OUTPUT?'))):
            self.powerSupply.
                write('VOLT:LEV:IMM 0V\nCURRENT:LEV:IMM 9.2A\nOUTPUT 1')
            self.writeConsole("Magnet Initialized")

if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    window = labControl()
    sys.exit(app.exec_())
