contextBridge.exposeInMainWorld('api', {
  // ... diğer API'ler
  
  // Mahkeme Kararları API
  mahkemeKararlari: {
    getAll: () => ipcRenderer.invoke('mahkeme-kararlari:getAll'),
    getBySuçTürü: (suçTürü) => ipcRenderer.invoke('mahkeme-kararlari:getBySuçTürü', suçTürü),
    search: (keyword) => ipcRenderer.invoke('mahkeme-kararlari:search', keyword),
    save: (data) => ipcRenderer.invoke('mahkeme-kararlari:save', data),
    delete: (id) => ipcRenderer.invoke('mahkeme-kararlari:delete', id)
  }
});