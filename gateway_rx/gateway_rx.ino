// Gateway Receiver (ESP32)
#include <WiFi.h>
#include <WebSocketsServer.h> // Requires WebSockets by Markus Sattler
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

// --- WIFI SETTINGS ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// --- NRF24 PINS ---
#define CE_PIN 4
#define CSN_PIN 5
// Default ESP32 SPI: SCK=18, MISO=19, MOSI=23

RF24 radio(CE_PIN, CSN_PIN);
const byte address[6] = "00001";

// --- WEBSOCKET SERVER ---
WebSocketsServer webSocket = WebSocketsServer(81);

struct SensorData {
  uint16_t ecg_value;
  uint8_t heart_rate;
  uint16_t gsr_value;
  bool panic_button;
  bool leads_off;
};

SensorData payload;
unsigned long lastSend = 0;

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP: ");
  Serial.println(WiFi.localIP());
  
  // Start WebSockets
  webSocket.begin();
  
  // Initialize Radio
  if (!radio.begin()) {
    Serial.println("Radio hardware not responding!");
    while (1) {}
  }
  radio.openReadingPipe(0, address);
  radio.setPALevel(RF24_PA_MAX);
  radio.startListening();
}

void loop() {
  webSocket.loop();
  
  if (radio.available()) {
    radio.read(&payload, sizeof(SensorData));
    
    // Limit websocket broadcast to ~20Hz to prevent browser overload
    if (millis() - lastSend > 50) {
      lastSend = millis();
      
      // Format as JSON
      String json = "{";
      json += "\"ecg\":" + String(payload.ecg_value) + ",";
      json += "\"bpm\":" + String(payload.heart_rate) + ",";
      json += "\"gsr\":" + String(payload.gsr_value) + ",";
      json += "\"panic\":" + String(payload.panic_button ? "true" : "false") + ",";
      json += "\"leads_off\":" + String(payload.leads_off ? "true" : "false");
      json += "}";
      
      webSocket.broadcastTXT(json);
    }
  }
}
