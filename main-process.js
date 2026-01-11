const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'TCK Mala Karşı İşlenen Suçlar Editörü v1.0'
  });

  mainWindow.loadFile('app.html');
  
  // Start with DevTools open (for development) / DevTools açık başlat (geliştirme için)
  mainWindow.webContents.openDevTools();
  
  // IPC Handler'ları
  setupIpcHandlers();
}

// IPC İşleyicileri - Mock implementations for testing
function setupIpcHandlers() {
  // Bilişim Suçları
  ipcMain.handle('bilişim:getAll', async () => {
    // Mock data for testing
    return [
      {
        id: '1',
        dosya_no: '2024/001',
        ad_soyad: 'Test Kişi 1',
        suc_turu: 'Sistem İhlali',
        zarar_miktari: 5000,
        durum: 'aktif'
      },
      {
        id: '2',
        dosya_no: '2024/002',
        ad_soyad: 'Test Kişi 2',
        suc_turu: 'Veri İhlali',
        zarar_miktari: 15000,
        durum: 'tamamlandi'
      }
    ];
  });
  
  ipcMain.handle('bilişim:save', async (event, data) => {
    console.log('Saving bilişim data:', data);
    return { success: true, id: Date.now().toString() };
  });
  
  ipcMain.handle('bilişim:delete', async (event, id) => {
    console.log('Deleting bilişim record:', id);
    return { success: true };
  });
  
  // Nitelikli Dolandırıcılık
  ipcMain.handle('dolandırıcılık:getAll', async () => {
    return [
      {
        id: '1',
        dosya_no: '2024/010',
        ad_soyad: 'Test Dolandırıcı 1',
        suc_turu: 'Sahte Belge',
        zarar_miktari: 25000,
        durum: 'aktif'
      }
    ];
  });
  
  ipcMain.handle('dolandırıcılık:save', async (event, data) => {
    console.log('Saving dolandırıcılık data:', data);
    return { success: true, id: Date.now().toString() };
  });
  
  // Kredi Kartı Suçları
  ipcMain.handle('kredi-kartı:getAll', async () => {
    return [
      {
        id: '1',
        dosya_no: '2024/020',
        ad_soyad: 'Test Kredi Kartı 1',
        suc_turu: 'Sahte Kart Kullanımı',
        zarar_miktari: 3000,
        durum: 'aktif'
      }
    ];
  });
  
  ipcMain.handle('kredi-kartı:save', async (event, data) => {
    console.log('Saving kredi kartı data:', data);
    return { success: true, id: Date.now().toString() };
  });
  
  // Yedekleme ve Geri Yükleme
  ipcMain.handle('backup:create', async () => {
    console.log('Creating backup...');
    return { success: true, message: 'Backup created successfully' };
  });
  
  ipcMain.handle('backup:restore', async (event, backupFile) => {
    console.log('Restoring backup:', backupFile);
    return { success: true, message: 'Backup restored successfully' };
  });
  
  // Rapor Alma
  ipcMain.handle('report:generate', async (event, options) => {
    console.log('Generating report:', options);
    return { success: true, message: 'Report generated successfully' };
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
