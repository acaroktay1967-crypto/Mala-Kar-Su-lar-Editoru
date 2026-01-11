const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('./database');

let mainWindow;
let db;

function createWindow() {
  const windowOptions = {
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'TCK Mala Karşı İşlenen Suçlar Editörü v1.0'
  };

  // Add icon if it exists
  const iconPath = path.join(__dirname, 'assets/icon.ico');
  if (fs.existsSync(iconPath)) {
    windowOptions.icon = iconPath;
  }

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadFile('index_ht.html');
  
  // Open DevTools in development mode
  if (process.argv.includes('--debug')) {
    mainWindow.webContents.openDevTools();
  }
  
  // Veritabanını başlat
  db = new Database();
  db.initialize();
  
  // IPC Handler'ları
  setupIpcHandlers();
}

// IPC İşleyicileri
function setupIpcHandlers() {
  // Bilişim Suçları
  ipcMain.handle('bilişim:getAll', async () => {
    return await db.getAllBilişimSuclari();
  });
  
  ipcMain.handle('bilişim:save', async (event, data) => {
    return await db.saveBilişimSuçu(data);
  });
  
  ipcMain.handle('bilişim:delete', async (event, id) => {
    return await db.deleteBilişimSuçu(id);
  });
  
  // Nitelikli Dolandırıcılık
  ipcMain.handle('dolandırıcılık:getAll', async () => {
    return await db.getAllDolandırıcılık();
  });
  
  ipcMain.handle('dolandırıcılık:save', async (event, data) => {
    return await db.saveDolandırıcılık(data);
  });
  
  // Kredi Kartı Suçları
  ipcMain.handle('kredi-kartı:getAll', async () => {
    return await db.getAllKrediKartıSuclari();
  });
  
  ipcMain.handle('kredi-kartı:save', async (event, data) => {
    return await db.saveKrediKartıSuçu(data);
  });
  
  // Yedekleme ve Geri Yükleme
  ipcMain.handle('backup:create', async (event) => {
    return await db.createBackup();
  });
  
  ipcMain.handle('backup:restore', async (event, backupFile) => {
    return await db.restoreBackup(backupFile);
  });
  
  // Rapor Alma
  ipcMain.handle('report:generate', async (event, options) => {
    return await db.generateReport(options);
  });
}

app.whenReady().then(() => {
  createWindow();
  createMenu();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Özel Menü
function createMenu() {
  const template = [
    {
      label: 'Dosya',
      submenu: [
        {
          label: 'Yedek Al',
          click: () => mainWindow.webContents.send('menu:backup')
        },
        {
          label: 'Geri Yükle',
          click: () => mainWindow.webContents.send('menu:restore')
        },
        { type: 'separator' },
        {
          label: 'Çıkış',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Görünüm',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Raporlar',
      submenu: [
        {
          label: 'Tüm Suçlar Raporu',
          click: () => mainWindow.webContents.send('menu:report-all')
        },
        {
          label: 'Bilişim Suçları Raporu',
          click: () => mainWindow.webContents.send('menu:report-bilisim')
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}