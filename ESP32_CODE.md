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
// Filename: bronco_hacks_2026.ino
```#include <WiFi.h>
#include <HTTPClient.h>
// #include <ArduinoJson.h>

// --- Configuration ---
// const char* ssid = "YOUR_SSID";
// const char* password = "YOUR_PASSWORD";
// Use your computer's local IP address here
// const char* serverUrl = "http://192.168.X.X:3000/data/submit"; 
// const char* apiKey = "YOUR_API_KEY";

// --- ESP32-S3 Optimized Pin Definitions ---
// We use pins that are safe and easily accessible on most S3 dev kits
const int GREEN_BUTTON   = 4;   // Input for 'good'
const int RED_BUTTON     = 5;   // Input for 'bad'
const int YELLOW_SWITCH  = 6;   // Input for 'question'

const int GREEN_LED      = 15;  // Success indicator
const int RED_LED        = 16;  // Error indicator
const int YELLOW_LED     = 17;  // Active/Power indicator

// Debounce timing
unsigned long lastButtonPress = 0;
const unsigned long debounceDelay = 200;
const unsigned long ledOnTime = 2000;

// --- State tracking ---
unsigned long lastGreenPress = 0;
unsigned long lastRedPress = 0;

unsigned long greenLedStart = 0;
unsigned long redLedStart = 0;

bool greenLedActive = false;
bool redLedActive = false;

bool lastGreenState = HIGH;
bool lastRedState = HIGH;
bool lastYellowState = HIGH;

static bool question_flag = false;

void setup() {
    Serial.begin(115200);
    
    // GPIO setup for buttons and LEDs
    pinMode(GREEN_BUTTON, INPUT);
    pinMode(RED_BUTTON, INPUT);
    pinMode(YELLOW_SWITCH, INPUT);
    
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(YELLOW_LED, OUTPUT);

    // Default initialization for LED (HIGH = OFF)
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, HIGH);
    digitalWrite(YELLOW_LED, HIGH);
    
    // connectToWiFi();
}

void loop() {
    handleGreenButton();
    handleRedButton();
    handleYellowSwitch();

    updateLEDs();


    delay(10); 
}

// --- GREEN BUTTON ---
void handleGreenButton() {
    bool currentState = digitalRead(GREEN_BUTTON);

    if (currentState == LOW && lastGreenState == HIGH &&
        millis() - lastGreenPress > debounceDelay) {

        lastGreenPress = millis();
        greenLedStart = millis();
        greenLedActive = true;

        Serial.println("Green Pressed");
    }

    lastGreenState = currentState;
}

// --- RED BUTTON ---
void handleRedButton() {
    bool currentState = digitalRead(RED_BUTTON);

    if (currentState == LOW && lastRedState == HIGH &&
        millis() - lastRedPress > debounceDelay) {

        lastRedPress = millis();
        redLedStart = millis();
        redLedActive = true;

        Serial.println("Red Pressed");
    }

    lastRedState = currentState;
}

// --- YELLOW SWITCH (TOGGLE FLAG) ---
void handleYellowSwitch() {
    bool currentState = digitalRead(YELLOW_SWITCH);

    if (currentState == LOW && lastYellowState == HIGH) {
        question_flag = !question_flag;

        Serial.print("Question flag: ");
        Serial.println(question_flag ? "ON" : "OFF");
    }

    lastYellowState = currentState;
}

// --- LED CONTROL ---
void updateLEDs() {
    // GREEN LED
    if (greenLedActive && millis() - greenLedStart < ledOnTime) {
        digitalWrite(GREEN_LED, LOW);
    } else {
        digitalWrite(GREEN_LED, HIGH);
        greenLedActive = false;
    }

    // RED LED
    if (redLedActive && millis() - redLedStart < ledOnTime) {
        digitalWrite(RED_LED, LOW);
    } else {
        digitalWrite(RED_LED, HIGH);
        redLedActive = false;
    }

    // YELLOW LED (reflects flag)
    digitalWrite(YELLOW_LED, question_flag ? LOW : HIGH);
}

void submitData(const char* status) {
    // if (WiFi.status() != WL_CONNECTED) {
        // connectToWiFi();
    // }
    
    // HTTPClient http;
    // http.begin(serverUrl);
    
    // http.addHeader("X-API-Key", apiKey);
    // http.addHeader("Content-Type", "application/json");

    // StaticJsonDocument<200> doc;
    // doc["status"] = status;
    // doc["studentId"] = "S3_N16R8_Unit_01";
    
    // String payload;
    // serializeJson(doc, payload);
}```

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