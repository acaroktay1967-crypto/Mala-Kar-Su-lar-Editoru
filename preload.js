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
  
  // Yağma Suçları
  yağma: {
    getAll: () => ipcRenderer.invoke('yağma:getAll'),
    getById: (id) => ipcRenderer.invoke('yağma:getById', id),
    save: (data) => ipcRenderer.invoke('yağma:save', data),
    delete: (id) => ipcRenderer.invoke('yağma:delete', id)
  },
  
  // Hırsızlık Suçları
  hırsızlık: {
    getAll: () => ipcRenderer.invoke('hırsızlık:getAll'),
    getById: (id) => ipcRenderer.invoke('hırsızlık:getById', id),
    save: (data) => ipcRenderer.invoke('hırsızlık:save', data),
    delete: (id) => ipcRenderer.invoke('hırsızlık:delete', id)
  },
  
  // Delil Yönetimi
  delil: {
    getAll: (sucModul, sucId) => ipcRenderer.invoke('delil:getAll', sucModul, sucId),
    getById: (id) => ipcRenderer.invoke('delil:getById', id),
    save: (data) => ipcRenderer.invoke('delil:save', data),
    delete: (id) => ipcRenderer.invoke('delil:delete', id),
    count: (sucModul, sucId) => ipcRenderer.invoke('delil:count', sucModul, sucId)
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
  
  // Menü olayları
  onMenuEvent: (channel, callback) => {
    const validChannels = ['menu:backup', 'menu:restore', 'menu:report-all', 'menu:report-bilisim'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
});