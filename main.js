const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('./src/database/db');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.ico'),
    title: 'TCK Mala Karşı İşlenen Suçlar Editörü v1.0'
  });

  mainWindow.loadFile('index.html');
  
  // DevTools açık başlat (geliştirme için)
  mainWindow.webContents.openDevTools();
  
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
  
  // Mahkeme Kararları
  ipcMain.handle('mahkeme-kararlari:getAll', async () => {
    return await db.getAllMahkemeKararlari();
  });

  ipcMain.handle('mahkeme-kararlari:getBySuçTürü', async (event, suçTürü) => {
    return await db.getMahkemeKararlariBySuçTürü(suçTürü);
  });

  ipcMain.handle('mahkeme-kararlari:search', async (event, keyword) => {
    return await db.searchMahkemeKararlari(keyword);
  });

  ipcMain.handle('mahkeme-kararlari:save', async (event, data) => {
    return await db.saveMahkemeKarari(data);
  });

  ipcMain.handle('mahkeme-kararlari:delete', async (event, id) => {
    return await db.deleteMahkemeKarari(id);
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
