# BroncoHacks Classroom Engagement System

A real-time classroom engagement platform that bridges physical hardware feedback (ESP32) with a web-based monitoring dashboard for educators and administrators.

## Project Overview

This system enables educators to collect real-time student sentiment data through physical buttons on ESP32 devices, and provides a comprehensive web dashboard for monitoring classroom engagement.

### Key Features

- **Real-Time Sentiment Tracking**: Monitor student feedback (I understand / I'm lost / Question) in real-time
- **Web-Based Dashboard**: Beautiful, responsive dashboard showing classroom pulse and historical analytics
- **Device Management**: Register and manage multiple ESP32 devices across different classrooms
- **User Authentication**: Secure login and registration with JWT tokens
- **Historical Analytics**: Track engagement trends over time
- **WebSocket Communication**: Ultra-low latency real-time updates
- **RESTful API**: Simple HTTP endpoints for ESP32 hardware integration

## System Architecture

### Hardware Layer (ESP32)
- Green Button: "I understand" feedback (positive)
- Red Button: "I'm lost" feedback (negative)
- Yellow Toggle: "Question/Hand raise" state
- Status LEDs: Confirmation of message delivery

### Backend (Next.js API Routes)
- User authentication and device management
- REST API endpoints for ESP32 data submission
- WebSocket server for real-time updates
- In-memory data storage (easily extensible to database)
- Historical analytics computation

### Frontend (React/Next.js)
- Real-time sentiment visualization
- Interactive charts and statistics
- Device management interface
- Activity log display
- Responsive design for mobile and desktop

## Installation & Setup

### Prerequisites
- Node.js v14 or higher
- npm package manager
- Modern web browser
- ESP32 development board (optional, for hardware)

### Quick Start

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd BroncoHacks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open browser to `http://localhost:3000` (or 3001 if 3000 is in use)
   - Register a new account
   - Go to Devices page to register an ESP32 device
   - Copy the API key and use it in your ESP32 code

## File Structure

```
BroncoHacks/
├── pages/                  # Next.js pages and API routes
│   ├── index.js           # Home page
│   ├── login.js           # Login page
│   ├── register.js        # Registration page
│   ├── dashboard.js       # Main dashboard
│   ├── devices.js         # Device management
│   ├── _app.js            # Global app component
│   └── api/               # API routes
│       ├── register.js    # User registration
│       ├── login.js       # User authentication
│       ├── devices.js     # Device management
│       ├── dashboard.js   # Dashboard data
│       ├── data.js        # ESP32 data submission
│       └── socket.js      # Socket.IO initialization
├── components/            # React components
│   └── Layout.js          # Layout component
├── lib/                   # Utility functions
│   ├── data.js            # Data management and auth
│   └── socket.js          # Socket.IO server setup
├── style.css              # Global styles
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
├── ESP32_CODE_EXAMPLE.md  # ESP32 implementation guide
└── README.md              # This file
```

## API Endpoints

### User Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - Authenticate and receive JWT token

### Device Management
- `GET /api/devices` - List all registered devices (requires JWT)
- `POST /api/devices` - Register new ESP32 device (requires JWT)

### Data Submission
- `POST /api/data` - Submit sensor data from ESP32 (requires API Key)

### Dashboard Data
- `GET /api/dashboard` - Get current classroom sentiment and statistics (requires JWT)

### WebSocket
- `/api/socket` - Socket.IO endpoint for real-time updates

## ESP32 Integration

See [ESP32_CODE_EXAMPLE.md](ESP32_CODE_EXAMPLE.md) for complete hardware implementation details.

### Quick Example (cURL)
```bash
curl -X POST http://localhost:3000/data/submit \
  -H "X-API-Key: YOUR-API-KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"good","studentId":"student-123"}'
```

Status values: `"good"` | `"bad"` | `"question"`

## Usage

### For Educators
1. Create an account and login
2. Register your ESP32 device(s) in the Devices page
3. View real-time student sentiment on the Dashboard
4. Monitor engagement trends and historical data

### For Hardware Integration
1. Get your device's API key from the Devices page
2. Upload ESP32 code with your API key and server address
3. Press buttons to submit sentiment data
4. Watch updates appear on the dashboard in real-time

## Real-Time Updates

The system uses Socket.IO for real-time WebSocket communication:
- Server broadcasts sentiment updates to all connected clients
- Dashboard auto-refreshes every 5 seconds
- Live activity log shows latest submissions

## Data Storage

Currently uses in-memory storage. For production, consider:
- **MongoDB**: Document database for flexibility
- **PostgreSQL**: Relational database for structured data
- **InfluxDB**: Time-series database for analytics

## Security Considerations

- JWT tokens for user authentication (expiration time configurable)
- API keys for device authentication
- CORS enabled for cross-origin requests
- Password hashing with bcryptjs

**Production Recommendations:**
- Store JWT secret in environment variables
- Implement token expiration and refresh
- Use HTTPS for all communications
- Store API keys securely (environment variables)
- Implement rate limiting
- Add request validation and sanitization

## Troubleshooting

### Server won't start
- Check if port 3000 is in use: `netstat -tuln | grep 3000`
- Try a different port: `PORT=3001 npm start`

### Cannot connect to dashboard
- Ensure server is running
- Check browser console for errors
- Verify JWT token is stored in localStorage

### ESP32 cannot send data
- Verify API key is correct (copy from Devices page)
- Check WiFi connection on ESP32
- Ensure server is accessible from ESP32's network
- Check firewall settings

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real-time notifications for low understanding
- Teacher analytics and reporting
- Multi-classroom support
- Mobile app integration
- Accessibility improvements
- Role-based access control (admin/educator/student)
- Export data to CSV/PDF

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

MIT License - Feel free to use this project as a template for your own applications.

## Support

For issues, questions, or contributions, please create an issue in the repository or contact the development team.