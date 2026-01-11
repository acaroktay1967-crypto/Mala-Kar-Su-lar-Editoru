// Örnek Yargıtay kararlarını ekleyen fonksiyonu güncelleyelim
async insertSampleKararlar() {
  // ... mevcut kararlar
  
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