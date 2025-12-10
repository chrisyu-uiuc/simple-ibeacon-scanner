# Raspberry Pi Service Setup for iBeacon Scanner

This guide explains how to set up the iBeacon Scanner to run automatically on a Raspberry Pi using systemd.

## Prerequisites

1. Raspberry Pi running Raspberry Pi OS (or similar Debian-based Linux)
2. Node.js installed on the Raspberry Pi
3. The iBeacon Scanner application deployed to `/home/pi/beacon-scanner`

## Setup Instructions

1. Transfer the service file to your Raspberry Pi:
   ```bash
   scp beacon-scanner.service pi@your-pi-ip:/tmp/
   ```

2. SSH into your Raspberry Pi:
   ```bash
   ssh pi@your-pi-ip
   ```

3. Move the service file to the systemd directory:
   ```bash
   sudo mv /tmp/beacon-scanner.service /etc/systemd/system/
   ```

4. Reload systemd to recognize the new service:
   ```bash
   sudo systemctl daemon-reload
   ```

5. Enable the service to start at boot:
   ```bash
   sudo systemctl enable beacon-scanner.service
   ```

6. Start the service:
   ```bash
   sudo systemctl start beacon-scanner.service
   ```

7. Check the service status:
   ```bash
   sudo systemctl status beacon-scanner.service
   ```

## Managing the Service

- Stop the service:
  ```bash
  sudo systemctl stop beacon-scanner.service
  ```

- Restart the service:
  ```bash
  sudo systemctl restart beacon-scanner.service
  ```

- Disable the service from starting at boot:
  ```bash
  sudo systemctl disable beacon-scanner.service
  ```

## Viewing Logs

To view the application logs in real-time:
```bash
sudo journalctl -u beacon-scanner.service -f
```

To view the last 100 lines of logs:
```bash
sudo journalctl -u beacon-scanner.service -n 100
```

## Updating the Service

If you make changes to the service file:

1. Edit the service file:
   ```bash
   sudo nano /etc/systemd/system/beacon-scanner.service
   ```

2. Reload systemd:
   ```bash
   sudo systemctl daemon-reload
   ```

3. Restart the service:
   ```bash
   sudo systemctl restart beacon-scanner.service
   ```

## Troubleshooting

If the service isn't starting:

1. Check the service status for error messages:
   ```bash
   sudo systemctl status beacon-scanner.service
   ```

2. Check the journal logs for detailed error information:
   ```bash
   sudo journalctl -u beacon-scanner.service
   ```

3. Verify that the paths in the service file match your installation

4. Ensure the .env file exists and is properly configured

5. Check that Node.js is installed and accessible:
   ```bash
   which node
   node --version
   ```

6. Make sure the pi user has the necessary permissions to access Bluetooth:
   ```bash
   sudo usermod -a -G bluetooth pi
   ```
   
   Then reboot the Raspberry Pi for the group changes to take effect.