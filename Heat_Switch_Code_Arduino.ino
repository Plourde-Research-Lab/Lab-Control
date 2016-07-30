int LED = 13;
int Open = 2; //Opens Switch, pulse for 100ms
int Close = 3; //Closes Switch, pulse for 100ms 
int SwitchControl1 = 6; //D0    Controls relay for +12v power 
int SwitchControl2 = 7; //D1
int Opening = 8; //Read status open
int Closing = 9; //Read status close
int Status1 = 1; //Normally HIGH (+5v)
int Status2 = 1;
int incomingByte; //Variable to store incoming data
int address = 0; //address in the EEPROM (i.e. which byte we're going to write to next)
byte value;

#include <EEPROM.h>

void setup()
{
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  for (int i = 0; i < 255; i++)
  EEPROM.write(i, i);
  pinMode(LED, OUTPUT);
  pinMode(Open, OUTPUT); 
  pinMode(Close, OUTPUT); 
  pinMode(Opening, INPUT); 
  pinMode(Closing, INPUT);
  pinMode(SwitchControl1, OUTPUT);
  pinMode(SwitchControl2, OUTPUT);
} //END Setup
  

void loop() {
  
  if (Serial.available() > 0) { 

    incomingByte = Serial.read();
    
    if (incomingByte == 'O'){ //OPEN
      
     digitalWrite(SwitchControl1, HIGH); 
     delay(500); //(500msec)                 // Supply +12v
     digitalWrite(SwitchControl2, HIGH);
      
     Status1 = 1; //Reset Status to HIGH
            
     digitalWrite(LED, LOW); 
     digitalWrite(Open, LOW);       //All LOW
     digitalWrite(Close, LOW);

     delay(100); 

     digitalWrite(LED, HIGH); 
     digitalWrite(Open, HIGH);     //OPEN
     digitalWrite(Close, LOW);

     delay(100); //100msec

     digitalWrite(LED, LOW); 
     digitalWrite(Open, LOW);      //ALL LOW
     digitalWrite(Close, LOW);

     delay(500);

     Status1 = digitalRead(Opening);// status = 0 means opening
     delay(500);
          if (Status1 == 0){ 
              Serial.println("Opening\n");
          } //End if stat = 1
     
     int val1 = 2;
     int address = 0;
     EEPROM.write(address, val1); //store a value of 2 which means switch opened


     delay(5000); //Wait for status to reset to HIGH

     digitalWrite(SwitchControl1, LOW);
     delay(500);                             // Turn off +12v power
     digitalWrite(SwitchControl2, LOW);
     

     } //End if incomingByte == 'O')


    
    if (incomingByte == 'C'){ //CLOSE
      
     digitalWrite(SwitchControl1, HIGH); 
     delay(500); //(500msec)                 // Supply +12v
     digitalWrite(SwitchControl2, HIGH);
        
     digitalWrite(LED, LOW); 
     digitalWrite(Open, LOW);       //All LOW
     digitalWrite(Close, LOW);

     delay(100);

     digitalWrite(LED, HIGH); 
     digitalWrite(Open, HIGH);     //OPEN
     digitalWrite(Close, LOW);

     delay(100); //100msec

     digitalWrite(LED, LOW); 
     digitalWrite(Open, LOW);      //ALL LOW
     digitalWrite(Close, LOW);

     delay(5000);
      
     Status2 = 1; //Reset Status to LOW so now 1 means closing 
     
     digitalWrite(LED, LOW); 
     digitalWrite(Open, LOW);      //ALL LOW
     digitalWrite(Close, LOW);
     
     delay(100);

     digitalWrite(LED, HIGH); 
     digitalWrite(Open, LOW);           //CLOSE
     digitalWrite(Close, HIGH);

     delay(100);

     digitalWrite(LED, LOW); 
     digitalWrite(Open, LOW);      //ALL LOW
     digitalWrite(Close, LOW);

     delay(500);

     Status2 = digitalRead(Closing);
     
        if (Status2 == 0){
          Serial.println("Closing\n");
             }
    
     int val2 = 3;
     address = 0;
     EEPROM.write(address, val2); //store a value of 3 which means switch closed

     delay(5000);

     digitalWrite(SwitchControl1, LOW);
     delay(500);                             // Turn off +12v power
     digitalWrite(SwitchControl2, LOW);
  
     delay(5000);
    } //END if incomingByte == 'C'

    if (incomingByte == 'R'){

        address = 0;

        while (address <= 0){

            value = EEPROM.read(address);


            if (value == 2)
            {
              delay(1500);
              Serial.println("Open_\n");
            }
            else
            {
              delay(1500);
              Serial.println("Closed_\n");
            }


            address = address + 1;
                if (address == EEPROM.length()) {
                address = 0;
                }//END if address 

         }//END while address < memlength



        }//END Read Memory   

  } //END if Serial.available() > 0
} //END void loop
    
