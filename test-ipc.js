/**
 * IPC Communication Test
 * Tests the IPC handlers defined in electron-main.js
 */

const fs = require('fs');

console.log('=== IPC Communication Test ===\n');

// Load and parse electron-main.js
const mainContent = fs.readFileSync('electron-main.js', 'utf8');

console.log('Testing IPC Handlers Configuration...\n');

// Test for IPC handlers
const expectedHandlers = [
  'bilişim:getAll',
  'bilişim:save',
  'bilişim:delete',
  'dolandırıcılık:getAll',
  'dolandırıcılık:save',
  'kredi-kartı:getAll',
  'kredi-kartı:save',
  'backup:create',
  'backup:restore',
  'report:generate'
];

let allFound = true;
expectedHandlers.forEach(handler => {
  if (mainContent.includes(`'${handler}'`) || mainContent.includes(`"${handler}"`)) {
    console.log(`✓ ${handler}`);
  } else {
    console.log(`✗ ${handler} - NOT FOUND`);
    allFound = false;
  }
});

// Test preload.js API exposure
console.log('\n\nTesting Preload API Exposure...\n');
const preloadContent = fs.readFileSync('preload.js', 'utf8');

const expectedAPIs = [
  'bilişim',
  'dolandırıcılık',
  'krediKartı',
  'backup',
  'report'
];

expectedAPIs.forEach(api => {
  if (preloadContent.includes(`${api}:`)) {
    console.log(`✓ ${api} API exposed`);
  } else {
    console.log(`✗ ${api} API - NOT FOUND`);
    allFound = false;
  }
});

// Test menu configuration
console.log('\n\nTesting Menu Configuration...\n');

const menuItems = [
  'Dosya',
  'Görünüm',
  'Raporlar',
  'Yedek Al',
  'Geri Yükle'
];

menuItems.forEach(item => {
  if (mainContent.includes(`'${item}'`) || mainContent.includes(`"${item}"`)) {
    console.log(`✓ ${item} menu item`);
  } else {
    console.log(`✗ ${item} - NOT FOUND`);
    allFound = false;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (allFound) {
  console.log('✓ All IPC handlers and APIs are properly configured!');
  console.log('='.repeat(50) + '\n');
  process.exit(0);
} else {
  console.log('✗ Some handlers or APIs are missing!');
  console.log('='.repeat(50) + '\n');
  process.exit(1);
}
