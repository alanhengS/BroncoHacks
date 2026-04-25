# ESP32 Classroom Engagement Hardware Implementation

This guide provides example code for configuring an ESP32 microcontroller to submit classroom engagement data to the BroncoHacks backend server.

## Hardware Setup

### Components Required
- ESP32 Development Board
- Green Button (GPIO pin for positive feedback)
- Red Button (GPIO pin for negative feedback)
- Yellow Toggle Switch (GPIO pin for questions)
- 3x LEDs with resistors (status indicators)
- USB cable for programming

### Pin Configuration
```
Green Button: GPIO 13
Red Button: GPIO 12
Yellow Toggle: GPIO 14
Green LED (success): GPIO 27
Red LED (error): GPIO 26
Yellow LED (active): GPIO 25
```

## Arduino IDE Setup

1. Install ESP32 board package in Arduino IDE
2. Install libraries:
   - `ArduinoJson` - for JSON handling
   - `WiFi` (built-in)
   - `HTTPClient` (built-in)

## Example Code

### Basic Sketch (Arduino C++)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Configuration
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* serverUrl = "http://YOUR_SERVER_IP:3000/data/submit";
const char* apiKey = "YOUR_API_KEY";

// Pin Definitions
const int GREEN_BUTTON = 13;
const int RED_BUTTON = 12;
const int YELLOW_SWITCH = 14;
const int GREEN_LED = 27;
const int RED_LED = 26;
const int YELLOW_LED = 25;

// Debounce timing
unsigned long lastButtonPress = 0;
const unsigned long debounceDelay = 200;

void setup() {
    Serial.begin(115200);
    
    // Setup GPIO
    pinMode(GREEN_BUTTON, INPUT_PULLUP);
    pinMode(RED_BUTTON, INPUT_PULLUP);
    pinMode(YELLOW_SWITCH, INPUT_PULLUP);
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(YELLOW_LED, OUTPUT);
    
    // Initialize WiFi
    connectToWiFi();
}

void loop() {
    // Check buttons
    if (checkButtonPress(GREEN_BUTTON)) {
        submitData("good");
    }
    else if (checkButtonPress(RED_BUTTON)) {
        submitData("bad");
    }
    else if (checkButtonPress(YELLOW_SWITCH)) {
        submitData("question");
    }
    
    delay(50); // Small delay to prevent overwhelming the device
}

bool checkButtonPress(int pin) {
    if (digitalRead(pin) == LOW) {
        if (millis() - lastButtonPress > debounceDelay) {
            lastButtonPress = millis();
            return true;
        }
    }
    return false;
}

void submitData(const char* status) {
    if (WiFi.status() != WL_CONNECTED) {
        connectToWiFi();
    }
    
    HTTPClient http;
    http.begin(serverUrl);
    
    // Set headers
    http.addHeader("X-API-Key", apiKey);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["status"] = status;
    doc["studentId"] = "ESP32_Device";
    
    String payload;
    serializeJson(doc, payload);
    
    // Send POST request
    int httpCode = http.POST(payload);
    
    // Handle response
    if (httpCode == 200) {
        digitalWrite(GREEN_LED, HIGH);
        delay(100);
        digitalWrite(GREEN_LED, LOW);
        Serial.println("Data sent successfully!");
    } else {
        digitalWrite(RED_LED, HIGH);
        delay(100);
        digitalWrite(RED_LED, LOW);
        Serial.print("Error: ");
        Serial.println(httpCode);
    }
    
    http.end();
}

void connectToWiFi() {
    Serial.print("Connecting to WiFi: ");
    Serial.println(ssid);
    
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi connected!");
        Serial.print("IP address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nFailed to connect to WiFi");
    }
}
```

### Alternative: MicroPython Implementation

```python
import network
import urequests
import json
from machine import Pin, Timer
import time

# Configuration
SSID = "YOUR_SSID"
PASSWORD = "YOUR_PASSWORD"
SERVER_URL = "http://YOUR_SERVER_IP:3000/data/submit"
API_KEY = "YOUR_API_KEY"

# Pin Setup
green_button = Pin(13, Pin.IN)
red_button = Pin(12, Pin.IN)
yellow_switch = Pin(14, Pin.IN)
green_led = Pin(27, Pin.OUT)
red_led = Pin(26, Pin.OUT)
yellow_led = Pin(25, Pin.OUT)

# Connect to WiFi
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)
    
    print("Connecting to WiFi...")
    for i in range(20):
        if wlan.isconnected():
            print("Connected!")
            print("IP:", wlan.ifconfig()[0])
            return wlan
        time.sleep(0.5)
    
    print("Failed to connect")
    return None

# Submit data to server
def submit_data(status):
    try:
        headers = {
            "X-API-Key": API_KEY,
            "Content-Type": "application/json"
        }
        payload = json.dumps({
            "status": status,
            "studentId": "ESP32_Device"
        })
        
        response = urequests.post(SERVER_URL, data=payload, headers=headers)
        
        if response.status_code == 200:
            green_led.on()
            time.sleep(0.1)
            green_led.off()
            print("Data sent successfully!")
        else:
            red_led.on()
            time.sleep(0.1)
            red_led.off()
            print(f"Error: {response.status_code}")
        
        response.close()
    except Exception as e:
        print(f"Error: {e}")
        red_led.on()
        time.sleep(0.1)
        red_led.off()

# Main loop
def main():
    wlan = connect_wifi()
    
    last_press = 0
    debounce_delay = 200
    
    while True:
        current_time = time.ticks_ms()
        
        if green_button.value() == 0 and (current_time - last_press) > debounce_delay:
            submit_data("good")
            last_press = current_time
        elif red_button.value() == 0 and (current_time - last_press) > debounce_delay:
            submit_data("bad")
            last_press = current_time
        elif yellow_switch.value() == 0 and (current_time - last_press) > debounce_delay:
            submit_data("question")
            last_press = current_time
        
        time.sleep(0.05)

if __name__ == "__main__":
    main()
```

## Testing Your Setup

1. Update the configuration variables with your server IP, WiFi credentials, and API key
2. Upload the code to your ESP32
3. Open Serial Monitor to see debug output
4. Press buttons to submit data
5. Check the web dashboard to see real-time updates

## Troubleshooting

- **WiFi Connection Issues**: Verify SSID and password are correct. Check if ESP32 is within range.
- **API Key Errors**: Ensure the API key matches exactly as shown in the Device Management page.
- **No Response**: Check that the server is running and accessible from the ESP32's network.
- **LED Not Lighting**: Verify pin numbers match your circuit and resistor values are appropriate.

## Next Steps

- Add credential storage in EEPROM
- Implement status LED patterns for different states
- Add battery low indicator
- Implement Over-The-Air (OTA) updates