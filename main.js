const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('./database');

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

  mainWindow.loadFile('index_ht.html');
  
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
  
  // Yağma Suçları (TCK 148-149)
  ipcMain.handle('yağma:getAll', async () => {
    return await db.getAllYağmaSuçları();
  });
  
  ipcMain.handle('yağma:getById', async (event, id) => {
    return await db.getYağmaSuçuById(id);
  });
  
  ipcMain.handle('yağma:save', async (event, data) => {
    return await db.saveYağmaSuçu(data);
  });
  
  ipcMain.handle('yağma:delete', async (event, id) => {
    return await db.deleteYağmaSuçu(id);
  });
  
  // Hırsızlık Suçları (TCK 141-145)
  ipcMain.handle('hırsızlık:getAll', async () => {
    return await db.getAllHırsızlıkSuçları();
  });
  
  ipcMain.handle('hırsızlık:getById', async (event, id) => {
    return await db.getHırsızlıkSuçuById(id);
  });
  
  ipcMain.handle('hırsızlık:save', async (event, data) => {
    return await db.saveHırsızlıkSuçu(data);
  });
  
  ipcMain.handle('hırsızlık:delete', async (event, id) => {
    return await db.deleteHırsızlıkSuçu(id);
  });
  
  // Delil Yönetimi
  ipcMain.handle('delil:getAll', async (event, sucModul, sucId) => {
    return await db.getAllDeliller(sucModul, sucId);
  });
  
  ipcMain.handle('delil:getById', async (event, id) => {
    return await db.getDelilById(id);
  });
  
  ipcMain.handle('delil:save', async (event, data) => {
    return await db.saveDelil(data);
  });
  
  ipcMain.handle('delil:delete', async (event, id) => {
    return await db.deleteDelil(id);
  });
  
  ipcMain.handle('delil:count', async (event, sucModul, sucId) => {
    return await db.countDeliller(sucModul, sucId);
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
        },
        {
          label: 'Yağma Suçları Raporu',
          click: () => mainWindow.webContents.send('menu:report-yagma')
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
