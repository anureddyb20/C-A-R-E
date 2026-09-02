// Wearable Transmitter (STM32 Blue Pill)
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

// --- PIN DEFINITIONS ---
#define ECG_PIN PA0       // AD8232 Output
#define GSR_PIN PA1       // GSR Voltage Divider
#define LO_PLUS PB0       // AD8232 Leads Off +
#define LO_MINUS PB1      // AD8232 Leads Off -
#define MOTOR_PIN PB10    // Vibration Motor (via 2N2222)
#define BUTTON_PIN PB12   // Panic Button (Active Low)

// nRF24L01 Pins (SPI1)
#define CE_PIN PA4
#define CSN_PIN PA3

RF24 radio(CE_PIN, CSN_PIN);
const byte address[6] = "00001";

// --- DATA STRUCTURE ---
struct SensorData {
  uint16_t ecg_value;
  uint8_t heart_rate;
  uint16_t gsr_value;
  bool panic_button;
  bool leads_off;
};

SensorData payload;

// --- HR CALCULATION VARIABLES ---
unsigned long lastBeatTime = 0;
int threshold = 3000; // Adjust based on ADC (12-bit STM32 is 0-4095)
bool peakDetected = false;
unsigned long lastSampleTime = 0;

void setup() {
  Serial.begin(115200);
  
  pinMode(ECG_PIN, INPUT_ANALOG);
  pinMode(GSR_PIN, INPUT_ANALOG);
  pinMode(LO_PLUS, INPUT);
  pinMode(LO_MINUS, INPUT);
  
  pinMode(MOTOR_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  digitalWrite(MOTOR_PIN, LOW);
  
  // Initialize Radio
  if (!radio.begin()) {
    Serial.println("Radio hardware not responding!");
    while (1) {} // Hold
  }
  radio.openWritingPipe(address);
  radio.setPALevel(RF24_PA_MAX);
  radio.stopListening(); // Transmitter mode
}

void loop() {
  unsigned long currentTime = millis();
  
  // Sample at ~100Hz (every 10ms)
  if (currentTime - lastSampleTime >= 10) {
    lastSampleTime = currentTime;
    
    // Read Sensors
    payload.ecg_value = analogRead(ECG_PIN);
    payload.gsr_value = analogRead(GSR_PIN);
    payload.panic_button = (digitalRead(BUTTON_PIN) == LOW);
    payload.leads_off = (digitalRead(LO_PLUS) == HIGH || digitalRead(LO_MINUS) == HIGH);
    
    // Basic Peak Detection for Heart Rate
    if (payload.ecg_value > threshold && !peakDetected) {
      peakDetected = true;
      unsigned long beatInterval = currentTime - lastBeatTime;
      lastBeatTime = currentTime;
      
      if (beatInterval > 300 && beatInterval < 2000) { // Valid interval (30-200 BPM)
        payload.heart_rate = 60000 / beatInterval;
      }
    } else if (payload.ecg_value < threshold - 200) {
      peakDetected = false;
    }
    
    // Alert System: Trigger Motor
    if (payload.panic_button || (payload.heart_rate > 120) || (payload.heart_rate > 0 && payload.heart_rate < 50)) {
      digitalWrite(MOTOR_PIN, HIGH);
    } else {
      digitalWrite(MOTOR_PIN, LOW);
    }
    
    // Transmit
    radio.write(&payload, sizeof(SensorData));
  }
}
