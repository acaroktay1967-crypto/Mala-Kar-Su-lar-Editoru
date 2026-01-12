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

  // Mahkeme Kararları
  ipcMain.handle('mahkeme-kararlari:getAll', async () => {
    return await db.getAllMahkemeKararlari();
  });

  ipcMain.handle('mahkeme-kararlari:save', async (event, data) => {
    return await db.saveMahkemeKarari(data);
  });

  ipcMain.handle('mahkeme-kararlari:search', async (event, keyword) => {
    return await db.searchMahkemeKararlari(keyword);
  });

  ipcMain.handle('mahkeme-kararlari:delete', async (event, id) => {
    return await db.deleteMahkemeKarari(id);
  });

  ipcMain.handle('mahkeme-kararlari:import', async (event, filePath) => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const kararlar = JSON.parse(fileContent);
      
      if (!Array.isArray(kararlar)) {
        return { success: false, message: 'Dosya formatı hatalı. JSON dizisi bekleniyor.' };
      }

      let successCount = 0;
      let errorCount = 0;

      for (const karar of kararlar) {
        try {
          await db.saveMahkemeKarari(karar);
          successCount++;
        } catch (error) {
          console.error('Karar kaydedilemedi:', error);
          errorCount++;
        }
      }

      return {
        success: true,
        message: `${successCount} karar başarıyla eklendi${errorCount > 0 ? `, ${errorCount} karar eklenemedi` : ''}.`,
        imported: successCount,
        failed: errorCount
      };
    } catch (error) {
      console.error('Dosya okuma hatası:', error);
      return { success: false, message: 'Dosya okunamadı veya parse edilemedi: ' + error.message };
    }
  });

  // Dosya seçici dialog
  ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
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