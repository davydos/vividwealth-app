#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();
const { spawn } = require('child_process');

// Function to run expo cli and extract token
function getExpoToken() {
  try {
    // First, try to read session data
    const sessionPath = path.join(homedir, '.expo', 'state.json');
    if (fs.existsSync(sessionPath)) {
      console.log('Reading Expo session data...');
      const sessionData = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
      if (sessionData && sessionData.auth && sessionData.auth.accessToken) {
        console.log('Found access token in session data:');
        console.log('======== EXPO TOKEN ========');
        console.log(sessionData.auth.accessToken);
        console.log('============================');
        return;
      }
    }
    
    console.log('No token found in session data. Using profile instead.');
    
    // Try to read from JSON
    const configPath = path.join(homedir, '.expo', 'sessions.json');
    if (fs.existsSync(configPath)) {
      console.log('Reading Expo config data...');
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (configData && configData.sessions && configData.sessions.length > 0) {
        const session = configData.sessions.find(s => s.accessToken);
        if (session) {
          console.log('Found access token in config:');
          console.log('======== EXPO TOKEN ========');
          console.log(session.accessToken);
          console.log('============================');
          return;
        }
      }
    }
    
    console.log('No token found in session data or config.');
    console.log('Please visit https://expo.dev/accounts/[username]/settings/access-tokens to create a token');
    console.log('Current username:', process.env.USER || 'unknown');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
getExpoToken(); 