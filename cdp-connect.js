#!/usr/bin/env node

/**
 * Chrome DevTools Protocol Connection Helper
 * 
 * This script helps you connect to your Electron app using CDP
 * Run this after starting your Electron app with `npm start`
 */

const CDP = require('chrome-remote-interface');

async function connectToCDP() {
  console.log('Attempting to connect to Chrome DevTools Protocol...');
  console.log('Make sure your Electron app is running with `npm start`\n');

  try {
    // List all available targets
    const targets = await CDP.List({ port: 9223 });
    
    console.log('Available debugging targets:');
    targets.forEach((target, index) => {
      console.log(`${index + 1}. ${target.title || 'Untitled'}`);
      console.log(`   Type: ${target.type}`);
      console.log(`   URL: ${target.url || 'N/A'}`);
      console.log(`   WebSocket: ${target.webSocketDebuggerUrl}`);
      console.log('');
    });

    // Connect to the first page target
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      console.log('No page targets found. Make sure the app window is open.');
      return;
    }

    console.log(`Connecting to: ${pageTarget.title}...`);
    
    const client = await CDP({ target: pageTarget });
    const { Network, Page, Runtime } = client;

    // Enable necessary domains
    await Network.enable();
    await Page.enable();
    await Runtime.enable();

    console.log('Connected! CDP client is ready.\n');

    // Example: Log network requests
    Network.requestWillBeSent((params) => {
      console.log(`Network request: ${params.request.method} ${params.request.url}`);
    });

    // Example: Evaluate JavaScript in the page
    const result = await Runtime.evaluate({
      expression: 'window.location.href'
    });
    console.log('Current page URL:', result.result.value);

    // Keep the connection alive
    console.log('\nCDP connection established. Press Ctrl+C to disconnect.');
    
  } catch (error) {
    console.error('Failed to connect:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure your Electron app is running');
    console.log('2. Check that port 9223 is not blocked');
    console.log('3. Try opening chrome://inspect in Chrome/Chromium');
  }
}

// Install chrome-remote-interface if not present
const { exec } = require('child_process');
const fs = require('fs');

if (!fs.existsSync('./node_modules/chrome-remote-interface')) {
  console.log('Installing chrome-remote-interface...');
  exec('npm install chrome-remote-interface', (error) => {
    if (error) {
      console.error('Failed to install chrome-remote-interface:', error);
      console.log('Please run: npm install chrome-remote-interface');
      process.exit(1);
    }
    connectToCDP();
  });
} else {
  connectToCDP();
}