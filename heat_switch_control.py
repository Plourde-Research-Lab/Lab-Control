import serial as s
import time

ser = s.Serial(port='/dev/tty.usbmodem1411',
               baudrate=9600,
               parity=s.PARITY_NONE,
               stopbits=s.STOPBITS_ONE,
               bytesize=s.EIGHTBITS,
               timeout=None
               )

print("connected to: " + ser.portstr)

allowedCommands = ['O' ,'C', 'R']

print ('Enter your commands below.\r\nInsert "exit" to leave the application.')

input1 = 1
while 1 :

	input1 = input(">> ")
			

	if input1 == 'exit':
		ser.close()
		exit()
		break

	elif input1 in allowedCommands:

		if input1 == 'O' or input1 == 'C' or input1 == 'R':
			ser.write(input1.encode())
			time.sleep(1) #wait 1 sec
			print(ser.readline())

	else:
		print ('bad command') 

		           