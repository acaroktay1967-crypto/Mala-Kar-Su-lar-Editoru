// Ek örnek kararlar - Bu kısmı sohbet arşivinizden aldığınız kararlarla doldurabilirsiniz
const additionalKararlar = [
  {
    id: uuidv4(),
    karar_no: 'Yargıtay 12. Ceza Dairesi 2022/12345',
    karar_tarihi: '2022-06-20',
    mahkeme_adı: 'Yargıtay 12. Ceza Dairesi',
    dosya_no: '2022/12345',
    suç_türü: 'Bilişim Suçları',
    madde_no: 'TCK 244/1',
    özet: 'Bitcoin madenciliği için başkasının bilgisayar sistemini izinsiz kullanma',
    karar_metni: 'Sanığın başkasına ait bilgisayar sistemine izinsiz erişerek kripto para madenciliği yapması TCK 244/1 maddesi kapsamında değerlendirilmiş ve 2 yıl hapis cezasına hükmedilmiştir. Kararda, elektrik tüketiminin de zarar olarak kabul edildiği belirtilmiştir.',
    emsal_niteliği: 1,
    ilgili_kanun: 'TCK, Elektrik Piyasası Kanunu',
    tags: 'bitcoin, kripto para, madencilik, elektrik tüketimi'
  },
  {
    id: uuidv4(),
    karar_no: '2023/7890',
    karar_tarihi: '2023-01-15',
    mahkeme_adı: 'İstanbul 5. Ağır Ceza Mahkemesi',
    dosya_no: '2023/456 E.',
    suç_türü: 'Nitelikli Dolandırıcılık',
    madde_no: 'TCK 158/1-e',
    özet: 'Sahte fatura düzenleyerek KDV iadesi almak',
    karar_metni: 'Sanıkların gerçekte olmayan işlemleri gösteren sahte faturalar düzenleyerek KDV iadesi aldıkları tespit edilmiştir. TCK 158/1-e maddesi uyarınca nitelikli dolandırıcılık suçundan 8 yıl hapis cezasına hükmedilmiştir.',
    emsal_niteliği: 1,
    ilgili_kanun: 'TCK, Vergi Usul Kanunu',
    tags: 'sahte fatura, KDV iadesi, vergi dolandırıcılığı'
  },
  {
    id: uuidv4(),
    karar_no: '2021/9999',
    karar_tarihi: '2021-09-10',
    mahkeme_adı: 'Ankara 3. Asliye Ceza Mahkemesi',
    dosya_no: '2021/888 E.',
    suç_türü: 'Kredi Kartı Suçları',
    madde_no: 'TCK 245/2',
    özet: 'Kayıp kredi kartını bulan şahsın kartı kullanması',
    karar_metni: 'Sanığın yolda bulduğu kayıp kredi kartını sahibine iade etmek yerine alışverişlerde kullanması TCK 245/2 maddesi kapsamında değerlendirilmiş ve 1 yıl hapis cezasına hükmedilmiştir. Cezanın ertelenmesine karar verilmiştir.',
    emsal_niteliği: 0,
    ilgili_kanun: 'TCK',
    tags: 'kayıp kart, buluntu kart, kötü niyetli kullanım'
  }
];