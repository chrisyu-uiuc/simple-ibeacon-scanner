require('dotenv').config();
const fs = require('fs');
const path = require('path');
const BeaconScanner = require('node-beacon-scanner');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const scanner = new BeaconScanner();

const log = (message) => {
  const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
  console.log(`[${timestamp}] ${message}`);
};

let scanInterval = null;
const gatewayName = process.env.GATEWAY_NAME;

if (!gatewayName) {
  throw new Error('GATEWAY_NAME is not set in .env file');
}

// Store beacon history
let beaconHistory = [];
const MAX_HISTORY = 50; // Keep only the last 50 beacons

const createFolderIfNotExist = () => {
  const today = new Date().toISOString().split('T')[0];
  const folderPath = path.join(__dirname, today);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    log(`Created folder: ${folderPath}`);
  }
  return folderPath;
};

const writeCSV = (data) => {
  const folderPath = createFolderIfNotExist();
  const filePath = path.join(folderPath, `${gatewayName}_ibeacons.csv`);
  const csvData = `${gatewayName},${data.timestamp},${data.uuid},${data.major},${data.minor},${data.rssi}\n`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'GatewayName,Timestamp,UUID,Major,Minor,RSSI\n');
  }
  fs.appendFileSync(filePath, csvData);
};

// Track the closest beacon
let closestBeacon = null;

scanner.onadvertisement = (ad) => {
  if (ad.beaconType === 'iBeacon') {
    log(`Discovered iBeacon: ${ad.address || 'Unknown'}`);
    log(`  UUID: ${ad.iBeacon.uuid}`);
    log(`  Major: ${ad.iBeacon.major}`);
    log(`  Minor: ${ad.iBeacon.minor}`);
    log(`  RSSI: ${ad.rssi}`);

    const data = {
      timestamp: new Date().toISOString().replace('T', ' ').replace('Z', ''),
      uuid: ad.iBeacon.uuid,
      major: ad.iBeacon.major,
      minor: ad.iBeacon.minor,
      rssi: ad.rssi
    };

    // Update closest beacon if this one is stronger
    if (!closestBeacon || ad.rssi > closestBeacon.rssi) {
      closestBeacon = {
        uuid: ad.iBeacon.uuid,
        major: ad.iBeacon.major,
        minor: ad.iBeacon.minor,
        rssi: ad.rssi,
        lastSeen: new Date()
      };
      // Emit closest beacon to clients
      io.emit('closestBeacon', closestBeacon);
    }

    // Create a unique identifier for deduplication
    const uniqueId = `${ad.iBeacon.uuid}-${ad.iBeacon.major}-${ad.iBeacon.minor}`;

    // Check if this beacon is already in history
    const existingIndex = beaconHistory.findIndex(item =>
      item.uuid === ad.iBeacon.uuid &&
      item.major === ad.iBeacon.major &&
      item.minor === ad.iBeacon.minor
    );

    const beaconEntry = {
      uuid: ad.iBeacon.uuid,
      major: ad.iBeacon.major,
      minor: ad.iBeacon.minor,
      rssi: ad.rssi,
      timestamp: new Date()
    };

    if (existingIndex !== -1) {
      // Update existing entry
      beaconHistory[existingIndex] = beaconEntry;
    } else {
      // Add new entry
      beaconHistory.unshift(beaconEntry);
    }

    // Limit history size
    if (beaconHistory.length > MAX_HISTORY) {
      beaconHistory = beaconHistory.slice(0, MAX_HISTORY);
    }

    // Emit history update to clients
    io.emit('beaconHistory', beaconHistory);

    writeCSV(data);
  }
};

const startScanning = () => {
  createFolderIfNotExist();
  log('Starting scan...');
  scanner.startScan().then(() => {
    log('Scan started');
    scanInterval = setTimeout(() => {
      stopScanning();
      startScanning();
    }, 1000); // Restart scan every 1 second
  }).catch((error) => {
    log(`Error starting scan: ${error}`);
  });
};

const stopScanning = () => {
  log('Stopping scan...');
  scanner.stopScan();
  log('Scan stopped');
  clearTimeout(scanInterval);
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connections
io.on('connection', (socket) => {
  log('A user connected');
  
  // Send current closest beacon and history to new clients
  if (closestBeacon) {
    socket.emit('closestBeacon', closestBeacon);
  }
  socket.emit('beaconHistory', beaconHistory);
  
  socket.on('disconnect', () => {
    log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
  log('Starting BLE scanner...');
  startScanning();
});