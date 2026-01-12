const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class Database {
  constructor() {
    const userDataPath = process.env.APPDATA || 
      (process.platform === 'darwin' ? 
        process.env.HOME + '/Library/Application Support' : 
        process.env.HOME + "/.local/share");
    
    const appDataPath = path.join(userDataPath, 'TCKSuclarEditoru');
    
    if (!fs.existsSync(appDataPath)) {
      fs.mkdirSync(appDataPath, { recursive: true });
    }
    
    this.dbPath = path.join(appDataPath, 'suclar.db');
    this.backupPath = path.join(appDataPath, 'backups');
    
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
    
    this.db = null;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.createTables().then(() => resolve()).catch(reject);
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      // Bilişim Suçları Tablosu
      const bilişimTable = `
        CREATE TABLE IF NOT EXISTS bilişim_suclari (
          id TEXT PRIMARY KEY,
          suç_türü TEXT NOT NULL,
          tc_kimlik TEXT,
          ad_soyad TEXT NOT NULL,
          suç_tarihi TEXT,
          suç_yeri TEXT,
          zarar_miktari REAL,
          kullanılan_yöntem TEXT,
          dosya_no TEXT,
          savcılık TEXT,
          mahkeme TEXT,
          durum TEXT,
          ek_bilgiler TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Nitelikli Dolandırıcılık Tablosu
      const dolandırıcılıkTable = `
        CREATE TABLE IF NOT EXISTS nitelikli_dolandırıcılık (
          id TEXT PRIMARY KEY,
          suç_türü TEXT NOT NULL,
          mağdur_sayısı INTEGER,
          toplam_zarar REAL,
          organize_suç TEXT,
          meslek_kötüye_kullanımı TEXT,
          güven_sömürüsü TEXT,
          diğer_nitelikler TEXT,
          dosya_detayları TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Kredi Kartı Suçları Tablosu
      const krediKartıTable = `
        CREATE TABLE IF NOT EXISTS kredi_kartı_suclari (
          id TEXT PRIMARY KEY,
          kart_sahibi TEXT,
          kart_numarası TEXT,
          son_kullanma TEXT,
          guvenlik_kodu TEXT,
          sahtecilik_türü TEXT,
          işlem_tarihi TEXT,
          işlem_tutarı REAL,
          işlem_yeri TEXT,
          şüpheli_bilgiler TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Mahkeme Kararları Tablosu
      const mahkemeKararlariTable = `
        CREATE TABLE IF NOT EXISTS mahkeme_kararlari (
          id TEXT PRIMARY KEY,
          karar_no TEXT NOT NULL,
          karar_tarihi TEXT NOT NULL,
          mahkeme_adı TEXT NOT NULL,
          dosya_no TEXT,
          suç_türü TEXT NOT NULL,
          madde_no TEXT,
          özet TEXT,
          karar_metni TEXT,
          emsal_niteliği BOOLEAN DEFAULT 0,
          ilgili_kanun TEXT,
          dosya_yolu TEXT,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.serialize(() => {
        this.db.run(bilişimTable, (err) => {
          if (err) console.error('Error creating bilişim_suclari table:', err);
        });
        this.db.run(dolandırıcılıkTable, (err) => {
          if (err) console.error('Error creating nitelikli_dolandırıcılık table:', err);
        });
        this.db.run(krediKartıTable, (err) => {
          if (err) console.error('Error creating kredi_kartı_suclari table:', err);
        });
        this.db.run(mahkemeKararlariTable, (err) => {
          if (err) {
            console.error('Error creating mahkeme_kararlari table:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  // Bilişim Suçları İşlemleri
  async getAllBilişimSuclari() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM bilişim_suclari ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async saveBilişimSuçu(data) {
    return new Promise((resolve, reject) => {
      const id = data.id || uuidv4();
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO bilişim_suclari 
        (id, suç_türü, tc_kimlik, ad_soyad, suç_tarihi, suç_yeri, zarar_miktari, 
         kullanılan_yöntem, dosya_no, savcılık, mahkeme, durum, ek_bilgiler, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id, data.suç_türü, data.tc_kimlik, data.ad_soyad, data.suç_tarihi,
        data.suç_yeri, data.zarar_miktari, data.kullanılan_yöntem,
        data.dosya_no, data.savcılık, data.mahkeme, data.durum,
        data.ek_bilgiler, now
      ], function(err) {
        if (err) reject(err);
        else resolve({ id, success: true });
      });
      
      stmt.finalize();
    });
  }

  // Diğer tablolar için benzer metodlar...
  // (Nitelikli Dolandırıcılık ve Kredi Kartı Suçları için)

  // Yedekleme İşlemleri
  async createBackup() {
    const backupFile = path.join(this.backupPath, `backup_${Date.now()}.db`);
    
    return new Promise((resolve, reject) => {
      fs.copyFile(this.dbPath, backupFile, (err) => {
        if (err) reject(err);
        else resolve({ success: true, file: backupFile });
      });
    });
  }

  async generateReport(options) {
    // Rapor oluşturma kodları buraya
    return { success: true, message: "Rapor oluşturuldu" };
  }

  // Mahkeme Kararları İşlemleri
  async getAllMahkemeKararlari() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM mahkeme_kararlari ORDER BY karar_tarihi DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async saveMahkemeKarari(data) {
    return new Promise((resolve, reject) => {
      const id = data.id || uuidv4();
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO mahkeme_kararlari 
        (id, karar_no, karar_tarihi, mahkeme_adı, dosya_no, suç_türü, madde_no, 
         özet, karar_metni, emsal_niteliği, ilgili_kanun, dosya_yolu, tags, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id, data.karar_no, data.karar_tarihi, data.mahkeme_adı, data.dosya_no,
        data.suç_türü, data.madde_no, data.özet, data.karar_metni,
        data.emsal_niteliği ? 1 : 0, data.ilgili_kanun, data.dosya_yolu,
        data.tags, now
      ], function(err) {
        if (err) reject(err);
        else resolve({ id, success: true });
      });
      
      stmt.finalize();
    });
  }

  async searchMahkemeKararlari(keyword) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM mahkeme_kararlari 
        WHERE karar_no LIKE ? OR özet LIKE ? OR karar_metni LIKE ? OR mahkeme_adı LIKE ?
        ORDER BY karar_tarihi DESC
      `;
      const searchTerm = `%${keyword}%`;
      
      this.db.all(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async deleteMahkemeKarari(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM mahkeme_kararlari WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ success: true, changes: this.changes });
      });
    });
  }
}

module.exports = Database;