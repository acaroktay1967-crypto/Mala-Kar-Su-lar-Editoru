const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Bilişim Suçları
  bilişim: {
    getAll: () => ipcRenderer.invoke('bilişim:getAll'),
    save: (data) => ipcRenderer.invoke('bilişim:save', data),
    delete: (id) => ipcRenderer.invoke('bilişim:delete', id)
  },
  
  // Nitelikli Dolandırıcılık
  dolandırıcılık: {
    getAll: () => ipcRenderer.invoke('dolandırıcılık:getAll'),
    save: (data) => ipcRenderer.invoke('dolandırıcılık:save', data)
  },
  
  // Kredi Kartı Suçları
  krediKartı: {
    getAll: () => ipcRenderer.invoke('kredi-kartı:getAll'),
    save: (data) => ipcRenderer.invoke('kredi-kartı:save', data)
  },
  
  // Yedekleme
  backup: {
    create: () => ipcRenderer.invoke('backup:create'),
    restore: (file) => ipcRenderer.invoke('backup:restore', file)
  },
  
  // Raporlar
  report: {
    generate: (options) => ipcRenderer.invoke('report:generate', options)
  },

  // Mahkeme Kararları
  mahkemeKararlari: {
    getAll: () => ipcRenderer.invoke('mahkeme-kararlari:getAll'),
    save: (data) => ipcRenderer.invoke('mahkeme-kararlari:save', data),
    search: (keyword) => ipcRenderer.invoke('mahkeme-kararlari:search', keyword),
    delete: (id) => ipcRenderer.invoke('mahkeme-kararlari:delete', id),
    importFromFile: (filePath) => ipcRenderer.invoke('mahkeme-kararlari:import', filePath)
  },

  // Dosya seçici
  dialog: {
    showOpenDialog: (options) => ipcRenderer.invoke('dialog:showOpenDialog', options)
  },
  
  // Menü olayları
  onMenuEvent: (channel, callback) => {
    const validChannels = ['menu:backup', 'menu:restore', 'menu:report-all', 'menu:report-bilisim'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
});