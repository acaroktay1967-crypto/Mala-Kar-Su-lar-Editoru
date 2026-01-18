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

      // Yağma Suçları Tablosu (TCK 148-149)
      const yağmaTable = `
        CREATE TABLE IF NOT EXISTS yagma_suclari (
          id TEXT PRIMARY KEY,
          dosya_no TEXT,
          olay_tarihi TEXT,
          yagma_turu INTEGER,
          tesebbüs INTEGER DEFAULT 0,
          silah_var INTEGER DEFAULT 0,
          coklu_fail INTEGER DEFAULT 0,
          kimlik_gizleme INTEGER DEFAULT 0,
          gece_vakti INTEGER DEFAULT 0,
          magdur_zayifligi INTEGER DEFAULT 0,
          kamu_binasi INTEGER DEFAULT 0,
          tasit_ici INTEGER DEFAULT 0,
          agir_neticeli INTEGER DEFAULT 0,
          cal_mal_degeri REAL,
          cal_mal_aciklama TEXT,
          cal_mal_bulundu INTEGER DEFAULT 0,
          olay_yeri TEXT,
          olay_yeri_detay TEXT,
          durum TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by TEXT
        )
      `;

      // Yağma Suçu Silah Bilgileri
      const yağmaSilahTable = `
        CREATE TABLE IF NOT EXISTS yagma_silah_bilgileri (
          id TEXT PRIMARY KEY,
          yagma_id TEXT NOT NULL,
          silah_turu INTEGER,
          aciklama TEXT,
          atesli_silah INTEGER DEFAULT 0,
          seri_no TEXT,
          marka TEXT,
          model TEXT,
          FOREIGN KEY (yagma_id) REFERENCES yagma_suclari(id) ON DELETE CASCADE
        )
      `;

      // Yağma Suçu Mağdurlar
      const yağmaMağdurTable = `
        CREATE TABLE IF NOT EXISTS yagma_magdurlari (
          id TEXT PRIMARY KEY,
          yagma_id TEXT NOT NULL,
          ad_soyad TEXT NOT NULL,
          tc_kimlik TEXT,
          telefon TEXT,
          adres TEXT,
          yaş INTEGER,
          aciklama TEXT,
          FOREIGN KEY (yagma_id) REFERENCES yagma_suclari(id) ON DELETE CASCADE
        )
      `;

      // Yağma Suçu Şüpheliler
      const yağmaŞüpheliTable = `
        CREATE TABLE IF NOT EXISTS yagma_suphelileri (
          id TEXT PRIMARY KEY,
          yagma_id TEXT NOT NULL,
          ad_soyad TEXT NOT NULL,
          tc_kimlik TEXT,
          telefon TEXT,
          adres TEXT,
          yaş INTEGER,
          sabika_durumu TEXT,
          aciklama TEXT,
          FOREIGN KEY (yagma_id) REFERENCES yagma_suclari(id) ON DELETE CASCADE
        )
      `;

      // Hırsızlık Suçları Tablosu (TCK 141-145)
      const hırsızlıkTable = `
        CREATE TABLE IF NOT EXISTS hirsizlik_suclari (
          id TEXT PRIMARY KEY,
          dosya_no TEXT,
          olay_tarihi TEXT,
          hirsizlik_turu INTEGER,
          tesebbüs INTEGER DEFAULT 0,
          konut_isyeri INTEGER DEFAULT 0,
          gece_vakti INTEGER DEFAULT 0,
          birden_fazla_kisi INTEGER DEFAULT 0,
          anahtar_kullanma INTEGER DEFAULT 0,
          guvenlik_onlemi_kirilma INTEGER DEFAULT 0,
          kamu_binasi INTEGER DEFAULT 0,
          ibadethane INTEGER DEFAULT 0,
          cal_mal_degeri REAL,
          cal_mal_aciklama TEXT,
          cal_mal_bulundu INTEGER DEFAULT 0,
          olay_yeri TEXT,
          olay_yeri_detay TEXT,
          durum TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by TEXT
        )
      `;

      // Hırsızlık Mağdurları
      const hırsızlıkMağdurTable = `
        CREATE TABLE IF NOT EXISTS hirsizlik_magdurlari (
          id TEXT PRIMARY KEY,
          hirsizlik_id TEXT NOT NULL,
          ad_soyad TEXT NOT NULL,
          tc_kimlik TEXT,
          telefon TEXT,
          adres TEXT,
          yaş INTEGER,
          aciklama TEXT,
          FOREIGN KEY (hirsizlik_id) REFERENCES hirsizlik_suclari(id) ON DELETE CASCADE
        )
      `;

      // Hırsızlık Şüphelileri
      const hırsızlıkŞüpheliTable = `
        CREATE TABLE IF NOT EXISTS hirsizlik_suphelileri (
          id TEXT PRIMARY KEY,
          hirsizlik_id TEXT NOT NULL,
          ad_soyad TEXT NOT NULL,
          tc_kimlik TEXT,
          telefon TEXT,
          adres TEXT,
          yaş INTEGER,
          sabika_durumu TEXT,
          aciklama TEXT,
          FOREIGN KEY (hirsizlik_id) REFERENCES hirsizlik_suclari(id) ON DELETE CASCADE
        )
      `;

      this.db.serialize(() => {
        this.db.run(bilişimTable, (err) => {
          if (err) console.error('Bilişim tablosu hatası:', err);
        });
        this.db.run(dolandırıcılıkTable, (err) => {
          if (err) console.error('Dolandırıcılık tablosu hatası:', err);
        });
        this.db.run(krediKartıTable, (err) => {
          if (err) console.error('Kredi kartı tablosu hatası:', err);
        });
        this.db.run(yağmaTable, (err) => {
          if (err) console.error('Yağma tablosu hatası:', err);
          else console.log('✓ Yağma tablosu oluşturuldu');
        });
        this.db.run(yağmaSilahTable, (err) => {
          if (err) console.error('Yağma silah tablosu hatası:', err);
          else console.log('✓ Yağma silah tablosu oluşturuldu');
        });
        this.db.run(yağmaMağdurTable, (err) => {
          if (err) console.error('Yağma mağdur tablosu hatası:', err);
          else console.log('✓ Yağma mağdur tablosu oluşturuldu');
        });
        this.db.run(yağmaŞüpheliTable, (err) => {
          if (err) console.error('Yağma şüpheli tablosu hatası:', err);
          else console.log('✓ Yağma şüpheli tablosu oluşturuldu');
        });
        this.db.run(hırsızlıkTable, (err) => {
          if (err) console.error('Hırsızlık tablosu hatası:', err);
          else console.log('✓ Hırsızlık tablosu oluşturuldu');
        });
        this.db.run(hırsızlıkMağdurTable, (err) => {
          if (err) console.error('Hırsızlık mağdur tablosu hatası:', err);
          else console.log('✓ Hırsızlık mağdur tablosu oluşturuldu');
        });
        this.db.run(hırsızlıkŞüpheliTable, (err) => {
          if (err) console.error('Hırsızlık şüpheli tablosu hatası:', err);
          else console.log('✓ Hırsızlık şüpheli tablosu oluşturuldu');
          resolve();
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

  // Yağma Suçları İşlemleri
  async getAllYağmaSuçları() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM yagma_suclari ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getYağmaSuçuById(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM yagma_suclari WHERE id = ?", [id], async (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }

        // İlişkili verileri de yükle
        try {
          const silahlar = await this.getYağmaSilahları(id);
          const mağdurlar = await this.getYağmaMağdurları(id);
          const şüpheliler = await this.getYağmaŞüphelileri(id);
          
          resolve({
            ...row,
            silahlar,
            mağdurlar,
            şüpheliler
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async saveYağmaSuçu(data) {
    return new Promise((resolve, reject) => {
      const id = data.id || uuidv4();
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO yagma_suclari 
        (id, dosya_no, olay_tarihi, yagma_turu, tesebbüs, silah_var, coklu_fail, 
         kimlik_gizleme, gece_vakti, magdur_zayifligi, kamu_binasi, tasit_ici, 
         agir_neticeli, cal_mal_degeri, cal_mal_aciklama, cal_mal_bulundu, 
         olay_yeri, olay_yeri_detay, durum, updated_at, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id, data.dosya_no, data.olay_tarihi, data.yagma_turu, data.tesebbüs || 0,
        data.silah_var || 0, data.coklu_fail || 0, data.kimlik_gizleme || 0,
        data.gece_vakti || 0, data.magdur_zayifligi || 0, data.kamu_binasi || 0,
        data.tasit_ici || 0, data.agir_neticeli || 0, data.cal_mal_degeri || 0,
        data.cal_mal_aciklama, data.cal_mal_bulundu || 0,
        data.olay_yeri, data.olay_yeri_detay, data.durum || 'Aktif',
        now, data.created_by
      ], async (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // İlişkili verileri kaydet
        try {
          if (data.silahlar && data.silahlar.length > 0) {
            await this.saveYağmaSilahları(id, data.silahlar);
          }
          if (data.mağdurlar && data.mağdurlar.length > 0) {
            await this.saveYağmaMağdurları(id, data.mağdurlar);
          }
          if (data.şüpheliler && data.şüpheliler.length > 0) {
            await this.saveYağmaŞüphelileri(id, data.şüpheliler);
          }
          resolve({ id, success: true });
        } catch (error) {
          reject(error);
        }
      });
      
      stmt.finalize();
    });
  }

  async deleteYağmaSuçu(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM yagma_suclari WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ success: true, deleted: this.changes });
      });
    });
  }

  // Yağma Silah Bilgileri İşlemleri
  async getYağmaSilahları(yagmaId) {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM yagma_silah_bilgileri WHERE yagma_id = ?", [yagmaId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async saveYağmaSilahları(yagmaId, silahlar) {
    // Önce mevcut silahları sil
    await new Promise((resolve, reject) => {
      this.db.run("DELETE FROM yagma_silah_bilgileri WHERE yagma_id = ?", [yagmaId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Yeni silahları ekle
    const promises = silahlar.map(silah => {
      return new Promise((resolve, reject) => {
        const silahId = silah.id || uuidv4();
        const stmt = this.db.prepare(`
          INSERT INTO yagma_silah_bilgileri 
          (id, yagma_id, silah_turu, aciklama, atesli_silah, seri_no, marka, model)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
          silahId, yagmaId, silah.silah_turu, silah.aciklama,
          silah.atesli_silah || 0, silah.seri_no, silah.marka, silah.model
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
        
        stmt.finalize();
      });
    });

    return Promise.all(promises);
  }

  // Yağma Mağdurları İşlemleri
  async getYağmaMağdurları(yagmaId) {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM yagma_magdurlari WHERE yagma_id = ?", [yagmaId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async saveYağmaMağdurları(yagmaId, mağdurlar) {
    // Önce mevcut mağdurları sil
    await new Promise((resolve, reject) => {
      this.db.run("DELETE FROM yagma_magdurlari WHERE yagma_id = ?", [yagmaId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Yeni mağdurları ekle
    const promises = mağdurlar.map(mağdur => {
      return new Promise((resolve, reject) => {
        const mağdurId = mağdur.id || uuidv4();
        const stmt = this.db.prepare(`
          INSERT INTO yagma_magdurlari 
          (id, yagma_id, ad_soyad, tc_kimlik, telefon, adres, yaş, aciklama)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
          mağdurId, yagmaId, mağdur.ad_soyad, mağdur.tc_kimlik,
          mağdur.telefon, mağdur.adres, mağdur.yaş, mağdur.aciklama
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
        
        stmt.finalize();
      });
    });

    return Promise.all(promises);
  }

  // Yağma Şüphelileri İşlemleri
  async getYağmaŞüphelileri(yagmaId) {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM yagma_suphelileri WHERE yagma_id = ?", [yagmaId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async saveYağmaŞüphelileri(yagmaId, şüpheliler) {
    // Önce mevcut şüphelileri sil
    await new Promise((resolve, reject) => {
      this.db.run("DELETE FROM yagma_suphelileri WHERE yagma_id = ?", [yagmaId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Yeni şüphelileri ekle
    const promises = şüpheliler.map(şüpheli => {
      return new Promise((resolve, reject) => {
        const şüpheliId = şüpheli.id || uuidv4();
        const stmt = this.db.prepare(`
          INSERT INTO yagma_suphelileri 
          (id, yagma_id, ad_soyad, tc_kimlik, telefon, adres, yaş, sabika_durumu, aciklama)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
          şüpheliId, yagmaId, şüpheli.ad_soyad, şüpheli.tc_kimlik,
          şüpheli.telefon, şüpheli.adres, şüpheli.yaş, şüpheli.sabika_durumu, şüpheli.aciklama
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
        
        stmt.finalize();
      });
    });

    return Promise.all(promises);
  }

  // Hırsızlık Suçları İşlemleri (TCK 141-145)
  async getAllHırsızlıkSuçları() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM hirsizlik_suclari ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getHırsızlıkSuçuById(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM hirsizlik_suclari WHERE id = ?", [id], async (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }

        // İlişkili verileri de yükle
        try {
          const mağdurlar = await this.getHırsızlıkMağdurları(id);
          const şüpheliler = await this.getHırsızlıkŞüphelileri(id);
          
          resolve({
            ...row,
            mağdurlar,
            şüpheliler
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async saveHırsızlıkSuçu(data) {
    return new Promise((resolve, reject) => {
      const id = data.id || uuidv4();
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO hirsizlik_suclari 
        (id, dosya_no, olay_tarihi, hirsizlik_turu, tesebbüs, konut_isyeri, 
         gece_vakti, birden_fazla_kisi, anahtar_kullanma, guvenlik_onlemi_kirilma,
         kamu_binasi, ibadethane, cal_mal_degeri, cal_mal_aciklama, 
         cal_mal_bulundu, olay_yeri, olay_yeri_detay, durum, updated_at, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id, data.dosya_no, data.olay_tarihi, data.hirsizlik_turu, data.tesebbüs || 0,
        data.konut_isyeri || 0, data.gece_vakti || 0, data.birden_fazla_kisi || 0,
        data.anahtar_kullanma || 0, data.guvenlik_onlemi_kirilma || 0,
        data.kamu_binasi || 0, data.ibadethane || 0, data.cal_mal_degeri || 0,
        data.cal_mal_aciklama, data.cal_mal_bulundu || 0,
        data.olay_yeri, data.olay_yeri_detay, data.durum || 'Aktif',
        now, data.created_by
      ], async (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // İlişkili verileri kaydet
        try {
          if (data.mağdurlar && data.mağdurlar.length > 0) {
            await this.saveHırsızlıkMağdurları(id, data.mağdurlar);
          }
          if (data.şüpheliler && data.şüpheliler.length > 0) {
            await this.saveHırsızlıkŞüphelileri(id, data.şüpheliler);
          }
          resolve({ id, success: true });
        } catch (error) {
          reject(error);
        }
      });
      
      stmt.finalize();
    });
  }

  async deleteHırsızlıkSuçu(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM hirsizlik_suclari WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ success: true, deleted: this.changes });
      });
    });
  }

  // Hırsızlık Mağdurları İşlemleri
  async getHırsızlıkMağdurları(hirsizlikId) {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM hirsizlik_magdurlari WHERE hirsizlik_id = ?", [hirsizlikId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async saveHırsızlıkMağdurları(hirsizlikId, mağdurlar) {
    // Önce mevcut mağdurları sil
    await new Promise((resolve, reject) => {
      this.db.run("DELETE FROM hirsizlik_magdurlari WHERE hirsizlik_id = ?", [hirsizlikId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Yeni mağdurları ekle
    const promises = mağdurlar.map(mağdur => {
      return new Promise((resolve, reject) => {
        const mağdurId = mağdur.id || uuidv4();
        const stmt = this.db.prepare(`
          INSERT INTO hirsizlik_magdurlari 
          (id, hirsizlik_id, ad_soyad, tc_kimlik, telefon, adres, yaş, aciklama)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
          mağdurId, hirsizlikId, mağdur.ad_soyad, mağdur.tc_kimlik,
          mağdur.telefon, mağdur.adres, mağdur.yaş, mağdur.aciklama
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
        
        stmt.finalize();
      });
    });

    return Promise.all(promises);
  }

  // Hırsızlık Şüphelileri İşlemleri
  async getHırsızlıkŞüphelileri(hirsizlikId) {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM hirsizlik_suphelileri WHERE hirsizlik_id = ?", [hirsizlikId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async saveHırsızlıkŞüphelileri(hirsizlikId, şüpheliler) {
    // Önce mevcut şüphelileri sil
    await new Promise((resolve, reject) => {
      this.db.run("DELETE FROM hirsizlik_suphelileri WHERE hirsizlik_id = ?", [hirsizlikId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Yeni şüphelileri ekle
    const promises = şüpheliler.map(şüpheli => {
      return new Promise((resolve, reject) => {
        const şüpheliId = şüpheli.id || uuidv4();
        const stmt = this.db.prepare(`
          INSERT INTO hirsizlik_suphelileri 
          (id, hirsizlik_id, ad_soyad, tc_kimlik, telefon, adres, yaş, sabika_durumu, aciklama)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
          şüpheliId, hirsizlikId, şüpheli.ad_soyad, şüpheli.tc_kimlik,
          şüpheli.telefon, şüpheli.adres, şüpheli.yaş, şüpheli.sabika_durumu, şüpheli.aciklama
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
        
        stmt.finalize();
      });
    });

    return Promise.all(promises);
  }

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