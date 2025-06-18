# Chrome DevTools Protocol Debugging Guide

This guide explains how to use Chrome DevTools Protocol (CDP) to debug and interact with the Black Citadel Electron application during development.

## Overview

CDP is enabled automatically when running the app in development mode. It allows you to:
- Inspect and debug both main and renderer processes
- Monitor network traffic
- Profile performance
- Take heap snapshots
- Execute JavaScript remotely
- And much more

## Quick Start

1. **Start the application in development mode:**
   ```bash
   npm start
   ```

2. **Connect using Chrome/Chromium:**
   - Open Chrome/Chromium browser
   - Navigate to `chrome://inspect`
   - Click "Configure" and ensure `localhost:9223` is in the target list
   - You should see your Electron app listed under "Remote Target"
   - Click "inspect" to open DevTools

3. **Alternative: Use the provided CDP script:**
   ```bash
   node cdp-connect.js
   ```

## CDP Endpoints

When the app starts in development mode, it exposes:
- **Main process debugging**: `http://localhost:9223`
- **Renderer process**: Available through chrome://inspect

## Built-in CDP Utilities

The app includes development utilities accessible via IPC:

### From the renderer process console:
```javascript
// Get CDP connection info
await window.electronAPI.cdp.getInfo()

// Execute JavaScript in the main process
await window.electronAPI.cdp.evaluate('process.versions')

// Send raw CDP commands
await window.electronAPI.cdp.sendCommand('Runtime.evaluate', {
  expression: 'console.log("Hello from CDP!")'
})
```

## Common CDP Use Cases

### 1. Network Monitoring
```javascript
// Using chrome-remote-interface
const CDP = require('chrome-remote-interface');

async function monitorNetwork() {
  const client = await CDP({ port: 9223 });
  const { Network } = client;
  
  await Network.enable();
  
  Network.requestWillBeSent((params) => {
    console.log('Request:', params.request.url);
  });
  
  Network.responseReceived((params) => {
    console.log('Response:', params.response.status, params.response.url);
  });
}
```

### 2. Performance Profiling
```javascript
// Get performance metrics
const metrics = await client.Performance.getMetrics();
console.log('Performance metrics:', metrics);
```

### 3. Memory Analysis
```javascript
// Take heap snapshot
await client.HeapProfiler.enable();
const snapshot = await client.HeapProfiler.takeHeapSnapshot();
// Process snapshot chunks...
```

### 4. Remote JavaScript Execution
```javascript
// Execute code in the page context
const result = await client.Runtime.evaluate({
  expression: 'document.title'
});
console.log('Page title:', result.result.value);
```

## Debugging Tips

1. **Enable verbose logging**: The app automatically enables logging in development mode
2. **Check console output**: CDP connection URLs are logged when the app starts
3. **Use breakpoints**: Set breakpoints in Chrome DevTools for both main and renderer processes
4. **Monitor IPC calls**: Use the Network tab to see IPC communication

## Security Note

CDP debugging is **only enabled in development mode**. It's automatically disabled in production builds to prevent security vulnerabilities.

## Troubleshooting

### Can't connect to CDP
1. Ensure the app is running in development mode
2. Check that port 9223 is not blocked by firewall
3. Try restarting the app
4. Check console output for CDP URLs

### No targets shown in chrome://inspect
1. Click "Configure" and add `localhost:9223`
2. Ensure "Discover network targets" is checked
3. Try refreshing the page

### CDP commands fail
1. Make sure the required domain is enabled (e.g., `Network.enable()`)
2. Check that you're connected to the correct target
3. Verify the command syntax matches the CDP protocol version

## Additional Resources

- [Chrome DevTools Protocol Documentation](https://chromedevtools.github.io/devtools-protocol/)
- [Electron Debugging Guide](https://www.electronjs.org/docs/latest/tutorial/debugging)
- [chrome-remote-interface npm package](https://www.npmjs.com/package/chrome-remote-interface)