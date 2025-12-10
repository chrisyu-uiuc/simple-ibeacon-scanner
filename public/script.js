// script.js
const socket = io();

// DOM elements
const beaconUuidEl = document.getElementById('beacon-uuid');
const beaconMajorEl = document.getElementById('beacon-major');
const beaconMinorEl = document.getElementById('beacon-minor');
const beaconRssiEl = document.getElementById('beacon-rssi');
const beaconLastSeenEl = document.getElementById('beacon-lastseen');
const historyBodyEl = document.getElementById('history-body');

// Format timestamp
function formatTime(date) {
    return date.toLocaleTimeString();
}

// Update closest beacon display
socket.on('closestBeacon', (beacon) => {
    if (beacon === null) {
        // Clear the display when no closest beacon
        beaconUuidEl.textContent = 'No beacon detected';
        beaconMajorEl.textContent = '--';
        beaconMinorEl.textContent = '--';
        beaconRssiEl.textContent = '--';
        beaconLastSeenEl.textContent = '--';
        return;
    }

    beaconUuidEl.textContent = beacon.uuid;
    beaconMajorEl.textContent = beacon.major;
    beaconMinorEl.textContent = beacon.minor;
    beaconRssiEl.textContent = beacon.rssi;
    beaconLastSeenEl.textContent = formatTime(new Date(beacon.lastSeen));
});

// Update history display
socket.on('beaconHistory', (history) => {
    historyBodyEl.innerHTML = '';
    
    if (history.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="no-data">No beacons detected yet</td>';
        historyBodyEl.appendChild(row);
        return;
    }
    
    history.forEach((beacon, index) => {
        const row = document.createElement('tr');
        
        // Highlight the first (most recent) entry
        if (index === 0) {
            row.style.background = 'rgba(0, 201, 255, 0.1)';
        }
        
        row.innerHTML = `
            <td>${beacon.uuid}</td>
            <td>${beacon.major}</td>
            <td>${beacon.minor}</td>
            <td>${beacon.rssi}</td>
            <td>${formatTime(new Date(beacon.timestamp))}</td>
        `;
        historyBodyEl.appendChild(row);
    });
});

// Handle connection status
socket.on('connect', () => {
    document.querySelector('.status-text').textContent = 'Connected';
    document.querySelector('.indicator-dot').style.backgroundColor = '#00ff00';
    document.querySelector('.indicator-dot').style.boxShadow = '0 0 10px #00ff00';
});

socket.on('disconnect', () => {
    document.querySelector('.status-text').textContent = 'Disconnected';
    document.querySelector('.indicator-dot').style.backgroundColor = '#ff0000';
    document.querySelector('.indicator-dot').style.boxShadow = '0 0 10px #ff0000';
});