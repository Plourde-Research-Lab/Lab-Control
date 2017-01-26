import sys
from os import popen
from PyQt5 import QtCore, QtGui, QtWidgets, uic

import time
import numpy as np
from datetime import datetime
from calendar import timegm
from pymongo import MongoClient, ASCENDING, DESCENDING
import pyvisa
import serial
import json

class labControl(QtWidgets.QMainWindow):

    def __init__(self):
        super(labControl, self).__init__()
        uic.loadUi('DRGUI.ui', self)
        self.setWindowTitle('DRControl')

        # Load Settings
        self.settings = json.load(open('./dr1settings.json'))

        # Initialize parameters
        ## Log parameters
        self.logFileName = self.settings['logFileName']
        self.readLogFile()

        ## Database parameters
        self.mongoAddress = self.settings['mongoClient']
        self.dbAddressInput.setText(self.mongoAddress)

        ## Instrument parameters
        ### Connect to instruments
        self.connectInstruments()

        self.statusString = ""
        # Connect to database

        try:
            print("Connecting to Database for fridge {}".format(self.settings['fridge'].lower()))
            self.mongoClient = MongoClient(self.mongoAddress)
            self.dataDB = getattr(self.mongoClient.data, self.settings['fridge'].lower() + "datas")
            self.controlDB = getattr(self.mongoClient.control, self.settings['fridge'].lower() + "controls")
            self.jobDB = getattr(self.mongoClient.jobs, self.settings['fridge'].lower() + "jobs")
        except Exception:
            self.writeLog("Databse Error.")

        # Connect UI elements to signals

        ## Instrument Connections
        self.instr0Connect.clicked.connect(lambda : self.connectInstrument(0))
        self.instr1Connect.clicked.connect(lambda : self.connectInstrument(1))

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
                if inst['name'] == "PDR2000":
                    inst['obj'] = serial.Serial(inst['address'])
                else:
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

    def control(self):
        # Read Data
        try:
            self.getData()
            # self.writeConsole(str(self.data))

        # Log errors if they occur and reconnect
        except UnicodeDecodeError:
            string = "Read error at " + datetime.now().strftime('%H:%M:%S') + '\n'
            self.writeLog(string)
            self.connectInstruments()

        # Insert Data into Database
        else:
            if (self.data['LN2Out'] <= 290):
                try:
                    self.dataDB.insert(self.data)
                    if self.data['MXCD'] > 350:
                        self.statusString = "Cold"
                    else:
                        self.statusString = "Cooling"
                except:
                    self.writeConsole("Database error at " + datetime.now().strftime('%H:%M:%S'))
            else:
                self.statusString = "Warm"

        # Get information from Database

        self.info = self.controlDB.find_one()

        self.info = self.controlDB.update_one({},{'$set': {'fridgeStatus': self.statusString}})
        self.fridgeStatus.setText(self.statusString)

    def getData(self):
        self.data = {'timeStamp': timegm(datetime.now().timetuple())}
        for reading in self.settings['sensors']:
            # print(reading)
            inst = next((x for x in self.instruments if x['name'] == reading['instr']), None)
            if inst['connected']:
                # print("Getting Data from " + inst['name'])
                if inst['name'] == "Picowatt":
                    value = inst['obj'].query(reading['command']).split(" ")[2]
                elif reading['name'] == "stillPressure":
                    inst['obj'].writelines('p')
                    value = float(inst['obj'].readline().strip().split(' ')[1])
                elif reading['name'] == "1KPotPressure":
                    inst['obj'].writelines('p')
                    value = float(inst['obj'].readline().strip().split(' ')[0])
                else:
                    value = inst['obj'].query(reading['command'])
            else:
                # print("Not from " + inst['name'])
                value = 0 #Return 0 if instrument is not connected
            self.data[reading['name']] = float(value)
        # self.data['percentComplete'] = round(self.data['psCurrent']/9 * 100)

    def writeLog(self, string):
        self.logFile = open(self.logFileName, 'a')
        self.logFile.writelines([string, '\n'])
        self.logFile.close()
        # self.logText.append(string)

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

if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    window = labControl()
    sys.exit(app.exec_())
