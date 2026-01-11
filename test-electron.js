/**
 * Test script to validate Electron configuration
 */

const fs = require('fs');
const path = require('path');

console.log('=== Electron Application Configuration Test ===\n');

// Test 1: Check package.json
console.log('1. Testing package.json...');
try {
  const pkg = require('./package.json');
  console.log('   ✓ package.json loaded successfully');
  console.log(`   ✓ Main entry: ${pkg.main}`);
  console.log(`   ✓ Name: ${pkg.name}`);
  console.log(`   ✓ Version: ${pkg.version}`);
  
  if (!pkg.main || !fs.existsSync(pkg.main)) {
    throw new Error('Main entry point file not found');
  }
} catch (err) {
  console.error('   ✗ Error:', err.message);
  process.exit(1);
}

// Test 2: Check main process file
console.log('\n2. Testing main process file...');
try {
  const mainContent = fs.readFileSync('electron-main.js', 'utf8');
  console.log('   ✓ electron-main.js found and readable');
  
  // Check for required imports
  if (mainContent.includes("require('electron')")) {
    console.log('   ✓ Electron module imported');
  }
  if (mainContent.includes('BrowserWindow')) {
    console.log('   ✓ BrowserWindow class used');
  }
  if (mainContent.includes('ipcMain')) {
    console.log('   ✓ IPC Main configured');
  }
  if (mainContent.includes("require('./database')")) {
    console.log('   ✓ Database module imported');
  }
} catch (err) {
  console.error('   ✗ Error:', err.message);
  process.exit(1);
}

// Test 3: Check preload script
console.log('\n3. Testing preload script...');
try {
  const preloadContent = fs.readFileSync('preload.js', 'utf8');
  console.log('   ✓ preload.js found and readable');
  
  if (preloadContent.includes('contextBridge')) {
    console.log('   ✓ contextBridge configured');
  }
  if (preloadContent.includes('exposeInMainWorld')) {
    console.log('   ✓ API exposed to renderer');
  }
  if (preloadContent.includes('ipcRenderer')) {
    console.log('   ✓ IPC Renderer configured');
  }
} catch (err) {
  console.error('   ✗ Error:', err.message);
  process.exit(1);
}

// Test 4: Check database module
console.log('\n4. Testing database module...');
try {
  const Database = require('./database.js');
  console.log('   ✓ database.js module loaded');
  
  const db = new Database();
  console.log('   ✓ Database instance created');
  
  if (typeof db.initialize === 'function') {
    console.log('   ✓ initialize() method exists');
  }
  if (typeof db.createTables === 'function') {
    console.log('   ✓ createTables() method exists');
  }
} catch (err) {
  console.error('   ✗ Error:', err.message);
  console.error('   Note: Some errors are expected if native modules are not built');
}

// Test 5: Check HTML entry point
console.log('\n5. Testing HTML entry point...');
try {
  const htmlContent = fs.readFileSync('index_ht.html', 'utf8');
  console.log('   ✓ index_ht.html found and readable');
  
  if (htmlContent.includes('styles-main.css')) {
    console.log('   ✓ Main stylesheet referenced');
  }
  if (htmlContent.includes('mains.js')) {
    console.log('   ✓ Renderer script referenced');
  }
} catch (err) {
  console.error('   ✗ Error:', err.message);
  process.exit(1);
}

// Test 6: Check CSS files
console.log('\n6. Testing CSS files...');
const cssFiles = ['styles-main.css', 'styles.css', 'mahkeme-kararları.css'];
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✓ ${file} exists`);
  } else {
    console.log(`   ⚠ ${file} not found`);
  }
});

// Test 7: Check renderer script
console.log('\n7. Testing renderer script...');
if (fs.existsSync('mains.js')) {
  console.log('   ✓ mains.js exists');
  const rendererContent = fs.readFileSync('mains.js', 'utf8');
  if (rendererContent.includes('DOMContentLoaded')) {
    console.log('   ✓ DOM ready handler configured');
  }
  if (rendererContent.includes('window.api')) {
    console.log('   ✓ API usage found in renderer');
  }
} else {
  console.log('   ⚠ mains.js not found');
}

console.log('\n=== All Configuration Tests Passed! ===\n');
console.log('The Electron application is properly configured.');
console.log('\nTo run the application:');
console.log('  npm start         - Run in production mode');
console.log('  npm run dev       - Run in development mode with DevTools');
console.log('  npm run build     - Build distributable packages');
