// Veritabanı şemasına yeni tablolar ekleyelim
async createTables() {
  // ... mevcut tablolar
  
  // Örnek Mahkeme Kararları Tablosu
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

  // Karar Gerekçeleri Tablosu
  const kararGerekceleriTable = `
    CREATE TABLE IF NOT EXISTS karar_gerekceleri (
      id TEXT PRIMARY KEY,
      karar_id TEXT NOT NULL,
      gerekce_no INTEGER,
      gerekce_metni TEXT,
      yasal_dayanak TEXT,
      FOREIGN KEY (karar_id) REFERENCES mahkeme_kararlari(id) ON DELETE CASCADE
    )
  `;

  // Karar-Karar İlişkisi Tablosu
  const karar_iliskileriTable = `
    CREATE TABLE IF NOT EXISTS karar_iliskileri (
      id TEXT PRIMARY KEY,
      ana_karar_id TEXT,
      ilgili_karar_id TEXT,
      iliski_turu TEXT,
      FOREIGN KEY (ana_karar_id) REFERENCES mahkeme_kararlari(id),
      FOREIGN KEY (ilgili_karar_id) REFERENCES mahkeme_kararlari(id)
    )
  `;

  this.db.serialize(() => {
    this.db.run(mahkemeKararlariTable);
    this.db.run(kararGerekceleriTable);
    this.db.run(karar_iliskileriTable);
    
    // Sohbet arşivinden alınan örnek kararları ekle
    this.insertSampleKararlar();
  });
}

// Örnek mahkeme kararlarını ekleyen fonksiyon
async insertSampleKararlar() {
  // Bilişim Suçları ile ilgili örnek kararlar
  const bilişimKararlari = [
    {
      id: uuidv4(),
      karar_no: '2019/1234',
      karar_tarihi: '2019-05-15',
      mahkeme_adı: 'İstanbul 1. Ağır Ceza Mahkemesi',
      dosya_no: '2019/456 E.',
      suç_türü: 'Bilişim Suçları',
      madde_no: 'TCK 244',
      özet: 'Banka sistemlerine izinsiz erişim ve veri çalma suçu',
      karar_metni: 'Sanığın banka bilgisayar sistemlerine izinsiz erişerek müşteri verilerini çaldığı tespit edilmiştir. TCK 244. madde uyarınca 5 yıl hapis cezasına karar verilmiştir.',
      emsal_niteliği: 1,
      ilgili_kanun: 'TCK, Bankacılık Kanunu',
      tags: 'banka, veri çalma, sistem güvenliği'
    },
    {
      id: uuidv4(),
      karar_no: '2020/5678',
      karar_tarihi: '2020-08-22',
      mahkeme_adı: 'Ankara 2. Ağır Ceza Mahkemesi',
      dosya_no: '2020/789 E.',
      suç_türü: 'Bilişim Suçları',
      madde_no: 'TCK 245',
      özet: 'Sosyal medya hesaplarının ele geçirilmesi',
      karar_metni: 'Sanığın başkalarına ait sosyal medya hesaplarını ele geçirerek kötü amaçlı kullanması TCK 245. madde kapsamında değerlendirilmiş ve 3 yıl hapis cezası verilmiştir.',
      emsal_niteliği: 1,
      ilgili_kanun: 'TCK, Kişisel Verilerin Korunması Kanunu',
      tags: 'sosyal medya, hesap ele geçirme, kişisel veri'
    }
  ];

  // Nitelikli Dolandırıcılık ile ilgili örnek kararlar
  const dolandiricilikKararlari = [
    {
      id: uuidv4(),
      karar_no: '2018/9012',
      karar_tarihi: '2018-11-30',
      mahkeme_adı: 'İzmir 3. Ağır Ceza Mahkemesi',
      dosya_no: '2018/345 E.',
      suç_türü: 'Nitelikli Dolandırıcılık',
      madde_no: 'TCK 158',
      özet: 'Organize dolandırıcılık çetesi',
      karar_metni: 'Sanıkların organize bir şekilde yaşlı bireyleri dolandırdıkları tespit edilmiştir. TCK 158/1-f maddesi uyarınca ağırlaştırılmış müebbet hapis cezasına hükmedilmiştir.',
      emsal_niteliği: 1,
      ilgili_kanun: 'TCK, Organize Suçlar Kanunu',
      tags: 'organize suç, yaşlı dolandırıcılığı, çete'
    }
  ];

  // Kredi Kartı Suçları ile ilgili örnek kararlar
  const krediKartiKararlari = [
    {
      id: uuidv4(),
      karar_no: '2021/3456',
      karar_tarihi: '2021-02-14',
      mahkeme_adı: 'İstanbul 4. Asliye Ceza Mahkemesi',
      dosya_no: '2021/123 E.',
      suç_türü: 'Kredi Kartı Suçları',
      madde_no: 'TCK 245',
      özet: 'Sahte kredi kartı üretimi ve kullanımı',
      karar_metni: 'Sanığın sahte kredi kartı üreterak bunları kullanması ve başkalarına satması suçu işlediği tespit edilmiştir. TCK 245. madde uyarınca 7 yıl hapis cezasına karar verilmiştir.',
      emsal_niteliği: 1,
      ilgili_kanun: 'TCK, Banka Kartları ve Kredi Kartları Kanunu',
      tags: 'sahte kart, kart üretimi, bankacılık'
    }
  ];

  // Tüm kararları veritabanına ekle
  const allKararlar = [...bilişimKararlari, ...dolandiricilikKararlari, ...krediKartiKararlari];
  
  for (const karar of allKararlar) {
    await this.insertMahkemeKarari(karar);
  }
}

// Mahkeme kararı ekleme fonksiyonu
async insertMahkemeKarari(karar) {
  return new Promise((resolve, reject) => {
    const stmt = this.db.prepare(`
      INSERT INTO mahkeme_kararlari 
      (id, karar_no, karar_tarihi, mahkeme_adı, dosya_no, suç_türü, madde_no, 
       özet, karar_metni, emsal_niteliği, ilgili_kanun, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      karar.id, karar.karar_no, karar.karar_tarihi, karar.mahkeme_adı,
      karar.dosya_no, karar.suç_türü, karar.madde_no, karar.özet,
      karar.karar_metni, karar.emsal_niteliği ? 1 : 0,
      karar.ilgili_kanun, karar.tags
    ], function(err) {
      if (err) reject(err);
      else resolve({ id: karar.id, success: true });
    });
    
    stmt.finalize();
  });
}

// Mahkeme kararlarını getiren fonksiyonlar
async getAllMahkemeKararlari() {
  return new Promise((resolve, reject) => {
    this.db.all("SELECT * FROM mahkeme_kararlari ORDER BY karar_tarihi DESC", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async getMahkemeKararlariBySuçTürü(suçTürü) {
  return new Promise((resolve, reject) => {
    this.db.all(
      "SELECT * FROM mahkeme_kararlari WHERE suç_türü = ? ORDER BY karar_tarihi DESC",
      [suçTürü],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

async searchMahkemeKararlari(keyword) {
  return new Promise((resolve, reject) => {
    this.db.all(
      `SELECT * FROM mahkeme_kararlari 
       WHERE karar_no LIKE ? OR özet LIKE ? OR karar_metni LIKE ? OR tags LIKE ?
       ORDER BY karar_tarihi DESC`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}