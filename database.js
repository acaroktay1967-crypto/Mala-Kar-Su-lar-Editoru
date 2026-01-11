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

      this.db.serialize(() => {
        this.db.run(bilişimTable);
        this.db.run(dolandırıcılıkTable);
        this.db.run(krediKartıTable);
        resolve();
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
}

module.exports = Database;