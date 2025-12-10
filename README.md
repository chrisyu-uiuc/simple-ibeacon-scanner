# Simple iBeacon Scanner

A real-time iBeacon scanner with a web-based user interface that detects and displays nearby iBeacons with live updates.

## Features

- Real-time detection of iBeacon devices using Bluetooth Low Energy (BLE)
- Web-based interface with live updates
- Visual radar scanning animation
- Displays closest beacon information (UUID, Major, Minor, RSSI)
- History panel showing recently detected beacons
- Automatic CSV logging of detected beacons
- Responsive design that works on both desktop and mobile devices

## Prerequisites

- Node.js (v12 or higher)
- Bluetooth adapter supporting BLE (built-in Bluetooth on most modern computers)
- macOS, Linux, or Windows with Bluetooth support

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chrisyu-uiuc/simple-ibeacon-scanner.git
   cd simple-ibeacon-scanner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment:
   Create a `.env` file in the project root with the following content:
   ```
   GATEWAY_NAME=MyBeaconGateway
   ```

## Usage

1. Start the application:
   ```bash
   npm start
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

3. The application will automatically start scanning for iBeacons and display them in real-time.

## File Structure

- `server.js` - Main server application with BLE scanning logic
- `public/index.html` - Web interface
- `public/styles.css` - Styling and animations
- `public/script.js` - Client-side JavaScript for real-time updates
- `.env` - Configuration file for gateway name
- `package.json` - Project dependencies and scripts

## How It Works

1. The server uses the `node-beacon-scanner` library to detect iBeacons via Bluetooth
2. Detected beacons are sent to the web interface in real-time using Socket.IO
3. The web interface displays the closest beacon and maintains a history of recently detected beacons
4. All detected beacons are logged to daily CSV files in folders named by date

## Data Logging

The application automatically creates daily folders (named by date) and saves beacon data to CSV files:
- Filename format: `{GATEWAY_NAME}_ibeacons.csv`
- Columns: GatewayName, Timestamp, UUID, Major, Minor, RSSI

## Troubleshooting

### Bluetooth Permissions (macOS)
On macOS, you may need to grant Bluetooth permissions to your terminal application:
1. Go to System Preferences > Security & Privacy > Privacy
2. Select Bluetooth from the left sidebar
3. Add your terminal application (Terminal, iTerm, etc.) to the list of allowed applications

### Common Issues
- If no beacons are detected, ensure Bluetooth is enabled on your device
- Make sure you have the necessary permissions to access Bluetooth
- Check that your iBeacons are properly configured and broadcasting

## Dependencies

- [node-beacon-scanner](https://github.com/chrisyu-uiuc/node-beacon-scanner) - iBeacon detection library
- [Express.js](https://expressjs.com/) - Web server framework
- [Socket.IO](https://socket.io/) - Real-time communication between server and client

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the contributors of `node-beacon-scanner` for the underlying beacon detection functionality