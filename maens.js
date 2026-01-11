// Mahkeme Kararları IPC Handler'ları
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