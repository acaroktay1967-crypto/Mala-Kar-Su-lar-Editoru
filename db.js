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
        this.db.run(bilişimTable);
        this.db.run(dolandırıcılıkTable);
        this.db.run(krediKartıTable);
        this.db.run(mahkemeKararlariTable);
        this.db.run(kararGerekceleriTable);
        this.db.run(karar_iliskileriTable);
        
        // Sohbet arşivinden alınan örnek kararları ekle
        this.insertSampleKararlar().then(() => resolve()).catch(reject);
      });
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

    // YARGITAY KARARLARI - Bilişim Suçları
    const yargitayBilisimKararlari = [
      {
        id: uuidv4(),
        karar_no: 'Yargıtay 12. Ceza Dairesi 2019/12345 E., 2020/6789 K.',
        karar_tarihi: '2020-03-15',
        mahkeme_adı: 'Yargıtay 12. Ceza Dairesi',
        dosya_no: '2019/12345',
        suç_türü: 'Bilişim Suçları',
        madde_no: 'TCK 244',
        özet: 'Sosyal medya hesaplarının ele geçirilmesi ve kişisel verilerin kaydedilmesi suçu',
        karar_metni: `YARGITAY KARARI ÖZETİ:
      
      Sanığın mağdura ait sosyal medya hesaplarını ele geçirerek, bu hesaplardaki özel yazışmaları ve fotoğrafları kaydettiği,
      bu verileri şantaj amacıyla kullanmak üzere sakladığı iddiasıyla açılan davada;
      
      - Sanığın TCK'nın 244. maddesinde düzenlenen "Verileri hukuka aykırı olarak verme veya ele geçirme" suçunu işlediği,
      - Kişisel verilerin korunması hakkının ihlal edildiği,
      - Sosyal medya hesaplarının ele geçirilmesinin özel hayatın gizliliğini ihlal niteliğinde olduğu,
      - Yerel mahkemenin verdiği 3 yıl hapis cezasının yerinde olduğu,
      - Cezanın ertelenmesi için somut delil bulunmadığı,
      
      gerekçesiyle YARGITAY tarafından yerel mahkeme kararı ONANMIŞTIR.`,
        emsal_niteliği: 1,
        ilgili_kanun: 'TCK 244, Kişisel Verilerin Korunması Kanunu md. 7',
        tags: 'yargıtay, sosyal medya, kişisel veri, TCK 244, özel hayat'
      },
      {
        id: uuidv4(),
        karar_no: 'Yargıtay 3. Ceza Dairesi 2020/23456 E., 2021/3456 K.',
        karar_tarihi: '2021-06-20',
        mahkeme_adı: 'Yargıtay 3. Ceza Dairesi',
        dosya_no: '2020/23456',
        suç_türü: 'Bilişim Suçları',
        madde_no: 'TCK 245',
        özet: 'Banka kartı bilgilerinin kötüye kullanılması ve sistemde sahtecilik',
        karar_metni: `YARGITAY KARARI:
      
      Sanığın, banka müşterilerinin kart bilgilerini ele geçirerek, bu bilgilerle internet üzerinden alışveriş yaptığı,
      toplam 150.000 TL tutarında haksız kazanç elde ettiği iddiasıyla açılan davada;
      
      - Sanığın TCK 245. madde kapsamında "Bilişim sistemlerinin banka veya kredi kartlarının kötüye kullanılması" suçunu işlediği,
      - Oluşan maddi zararın tazmin edilmediği,
      - Sanığın daha önce benzer suçlardan sabıkasının bulunduğu,
      - Yerel mahkemenin verdiği 5 yıl hapis ve 150.000 TL adli para cezasının TCK 62/2 maddesi uyarınca artırılması gerektiği,
      
      gerekçesiyle YARGITAY tarafından yerel mahkeme kararı BOZULMUŞ, davanın yeniden görülmesine karar verilmiştir.`,
        emsal_niteliği: 1,
        ilgili_kanun: 'TCK 245, Banka Kartları ve Kredi Kartları Kanunu',
        tags: 'yargıtay, banka kartı, sahtecilik, TCK 245, internet dolandırıcılığı'
      },
      {
        id: uuidv4(),
        karar_no: 'Yargıtay Ceza Genel Kurulu 2018/1234 E., 2019/567 K.',
        karar_tarihi: '2019-11-30',
        mahkeme_adı: 'Yargıtay Ceza Genel Kurulu',
        dosya_no: '2018/1234',
        suç_türü: 'Bilişim Suçları',
        madde_no: 'TCK 243/244',
        özet: 'Kripto para borsası hacklenmesi ve nitelikli dolandırıcılık',
        karar_metni: `YARGITAY CEZA GENEL KURULU KARARI:
      
      Sanıkların organize bir şekilde kripto para borsasının sistemlerini hackleyerek 2 milyon dolar değerinde kripto para transfer ettikleri iddiasıyla açılan davada;
      
      - Bilişim sistemine izinsiz erişim (TCK 243),
      - Verileri hukuka aykırı olarak ele geçirme (TCK 244),
      - Nitelikli dolandırıcılık (TCK 158) suçlarının birlikte işlendiği,
      - Organize suç örgütü kurma (TCK 220) suçunun oluşmadığı,
      - Suçun yurt dışında işlenmiş olmasının cezayı etkilemeyeceği,
      - Elektronik delillerin usulüne uygun şekilde toplandığı,
      
      gerekçesiyle YARGITAY tarafından sanıklara verilen 10 yıl hapis cezası ONANMIŞTIR.`,
        emsal_niteliği: 1,
        ilgili_kanun: 'TCK 243, 244, 158, 220',
        tags: 'yargıtay, kripto para, hack, organize suç, emsal'
      }
    ];

    // YARGITAY KARARLARI - Nitelikli Dolandırıcılık
    const yargitayDolandiricilikKararlari = [
      {
        id: uuidv4(),
        karar_no: 'Yargıtay 2. Ceza Dairesi 2017/8901 E., 2018/2345 K.',
        karar_tarihi: '2018-04-12',
        mahkeme_adı: 'Yargıtay 2. Ceza Dairesi',
        dosya_no: '2017/8901',
        suç_türü: 'Nitelikli Dolandırıcılık',
        madde_no: 'TCK 158/1-f',
        özet: 'Sahte tapu ve ipotek belgeleriyle banka kredisi alınması',
        karar_metni: `YARGITAY KARARI:
      
      Sanıkların sahte tapu ve ipotek belgeleri düzenleyerek, bu belgelerle bankadan 1.5 milyon TL kredi aldıkları iddiasıyla açılan davada;
      
      - TCK 158/1-f maddesindeki "sahte belge düzenleyerek dolandırıcılık" nitelikli halinin oluştuğu,
      - Sanıkların kamu görevlisi olmasının (noter çalışanı) cezayı ağırlaştırıcı neden olduğu,
      - Zararın tümünün tazmin edilmediği,
      - Yerel mahkemenin verdiği 12 yıl hapis cezasının yetersiz olduğu,
      
      gerekçesiyle YARGITAY tarafından karar BOZULMUŞ, cezanın artırılması için dava yeniden görülmek üzere gönderilmiştir.`,
        emsal_niteliği: 1,
        ilgili_kanun: 'TCK 158, 204, 206',
        tags: 'yargıtay, sahte tapu, banka kredisi, noter, kamu görevlisi'
      },
      {
        id: uuidv4(),
        karar_no: 'Yargıtay 4. Ceza Dairesi 2021/4567 E., 2022/789 K.',
        karar_tarihi: '2022-02-28',
        mahkeme_adı: 'Yargıtay 4. Ceza Dairesi',
        dosya_no: '2021/4567',
        suç_türü: 'Nitelikli Dolandırıcılık',
        madde_no: 'TCK 158/1-c',
        özet: 'Yatırım dolandırıcılığı ve organize suç örgütü',
        karar_metni: `YARGITAY KARARI:
      
      Sanıkların kurdukları yatırım şirketi aracılığıyla 500'den fazla kişiyi toplam 15 milyon TL dolandırdıkları iddiasıyla açılan davada;
      
      - TCK 158/1-c maddesindeki "ticari sıfatın kötüye kullanılması" nitelikli halinin oluştuğu,
      - Mağdur sayısının fazla olmasının cezayı artırıcı etken olduğu,
      - Organize suç örgütü kurma (TCK 220) suçunun da oluştuğu,
      - Sanıkların yurt dışına kaçma riskinin bulunduğu,
      - Tutukluluk halinin devamına karar verilmiştir.
      
      YARGITAY, yerel mahkemenin verdiği 15 yıl hapis cezasını ve 10 milyon TL adli para cezasını ONMIŞTIR.`,
        emsal_niteliği: 1,
        ilgili_kanun: 'TCK 158, 220, Sermaye Piyasası Kanunu',
        tags: 'yargıtay, yatırım dolandırıcılığı, organize suç, ticari sıfat'
      }
    ];

    // YARGITAY KARARLARI - Kredi Kartı Suçları
    const yargitayKrediKartiKararlari = [
      {
        id: uuidv4(),
        karar_no: 'Yargıtay 9. Ceza Dairesi 2020/3456 E., 2021/890 K.',
        karar_tarihi: '2021-09-15',
        mahkeme_adı: 'Yargıtay 9. Ceza Dairesi',
        dosya_no: '2020/3456',
        suç_türü: 'Kredi Kartı Suçları',
        madde_no: 'TCK 245',
        özet: 'Kredi kartı kopyalama cihazı (skimmer) kullanımı',
        karar_metni: `YARGITAY KARARI:
      
      Sanıkların ATM'lere yerleştirdikleri kredi kartı kopyalama cihazları (skimmer) ile 200'den fazla kişinin kart bilgilerini ele geçirdikleri,
      bu bilgilerle sahte kart üreterek kullandıkları iddiasıyla açılan davada;
      
      - TCK 245. madde kapsamında "kredi kartlarının kötüye kullanılması" suçunun işlendiği,
      - Suçun organize bir şekilde işlendiği,
      - Tekerrür halinin bulunduğu (sanıkların daha önce benzer suçlardan sabıkası),
      - Elektronik delillerin (kamera kayıtları, skimmer cihazları) usulüne uygun toplandığı,
      
      gerekçesiyle YARGITAY, yerel mahkemenin verdiği 7 yıl hapis cezasını ONANMIŞTIR.`,
        emsal_niteliği: 1,
        ilgili_kanun: 'TCK 245, Bankacılık Kanunu',
        tags: 'yargıtay, skimmer, ATM, kart kopyalama, organize'
      },
      {
        id: uuidv4(),
        karar_no: 'Yargıtay Ceza Genel Kurulu 2019/6789 E., 2020/1234 K.',
        karar_tarihi: '2020-07-10',
        mahkeme_adı: 'Yargıtay Ceza Genel Kurulu',
        dosya_no: '2019/6789',
        suç_türü: 'Kredi Kartı Suçları',
        madde_no: 'TCK 245, 158',
        özet: 'İnternet bankacılığı üzerinden kredi kartı dolandırıcılığı',
        karar_metni: `YARGITAY CEZA GENEL KURULU KARARI:
      
      Sanığın, bankanın internet şubesindeki güvenlik açığından yararlanarak, müşterilerin kredi kartı bilgilerine eriştiği,
      bu bilgilerle lüks alışverişler yaptığı iddiasıyla açılan davada;
      
      PRENSİP KARARI:
      
      - İnternet bankacılığı sistemlerine izinsiz erişim TCK 243 kapsamında değerlendirilmelidir,
      - Elde edilen kart bilgilerinin kullanılması TCK 245 kapsamındadır,
      - Yapılan harcamalar dolandırıcılık (TCK 157/158) suçunu oluşturur,
      - Bu suçlar zincirleme suç olarak değerlendirilmelidir,
      - Bankanın güvenlik açığının bulunması sanığın cezasını azaltmaz.
      
      YARGITAY, davanın bu prensipler çerçevesinde yeniden görülmesine karar vermiştir.`,
        emsal_niteliği: 1,
        ilgili_kanun: 'TCK 243, 245, 158',
        tags: 'yargıtay, internet bankacılığı, güvenlik açığı, prensip kararı, emsal'
      }
    ];

    // Tüm kararları birleştir
    const allKararlar = [
      ...bilişimKararlari,
      ...dolandiricilikKararlari,
      ...krediKartiKararlari,
      ...yargitayBilisimKararlari,
      ...yargitayDolandiricilikKararlari,
      ...yargitayKrediKartiKararlari
    ];
    
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

  async deleteBilişimSuçu(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM bilişim_suclari WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ success: true, changes: this.changes });
      });
    });
  }

  // Nitelikli Dolandırıcılık İşlemleri
  async getAllDolandırıcılık() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM nitelikli_dolandırıcılık ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async saveDolandırıcılık(data) {
    return new Promise((resolve, reject) => {
      const id = data.id || uuidv4();
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO nitelikli_dolandırıcılık 
        (id, suç_türü, mağdur_sayısı, toplam_zarar, organize_suç, 
         meslek_kötüye_kullanımı, güven_sömürüsü, diğer_nitelikler, dosya_detayları, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id, data.suç_türü, data.mağdur_sayısı, data.toplam_zarar, data.organize_suç,
        data.meslek_kötüye_kullanımı, data.güven_sömürüsü, data.diğer_nitelikler,
        data.dosya_detayları, now
      ], function(err) {
        if (err) reject(err);
        else resolve({ id, success: true });
      });
      
      stmt.finalize();
    });
  }

  // Kredi Kartı Suçları İşlemleri
  async getAllKrediKartıSuclari() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM kredi_kartı_suclari ORDER BY created_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async saveKrediKartıSuçu(data) {
    return new Promise((resolve, reject) => {
      const id = data.id || uuidv4();
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO kredi_kartı_suclari 
        (id, kart_sahibi, kart_numarası, son_kullanma, guvenlik_kodu, sahtecilik_türü,
         işlem_tarihi, işlem_tutarı, işlem_yeri, şüpheli_bilgiler, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id, data.kart_sahibi, data.kart_numarası, data.son_kullanma, data.guvenlik_kodu,
        data.sahtecilik_türü, data.işlem_tarihi, data.işlem_tutarı, data.işlem_yeri,
        data.şüpheli_bilgiler, now
      ], function(err) {
        if (err) reject(err);
        else resolve({ id, success: true });
      });
      
      stmt.finalize();
    });
  }

  // Mahkeme Kararları İşlemleri
  async saveMahkemeKarari(data) {
    return new Promise((resolve, reject) => {
      const id = data.id || uuidv4();
      const now = new Date().toISOString();
      
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO mahkeme_kararlari 
        (id, suç_türü, dosya_no, mahkeme, karar_tarihi, karar_no, emsal, 
         karar_özeti, karar_metni, taraflar, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id, data.suç_türü, data.dosya_no, data.mahkeme, data.karar_tarihi,
        data.karar_no, data.emsal, data.karar_özeti, data.karar_metni,
        data.taraflar, now
      ], function(err) {
        if (err) reject(err);
        else resolve({ id, success: true });
      });
      
      stmt.finalize();
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

  async restoreBackup(backupFile) {
    return new Promise((resolve, reject) => {
      fs.copyFile(backupFile, this.dbPath, (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  }

  async generateReport(options) {
    // Rapor oluşturma kodları buraya
    return { success: true, message: "Rapor oluşturuldu" };
  }
}

module.exports = Database;