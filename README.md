# Mala-Kar-Su-lar-Editoru

TCK Mala Karşı İşlenen Suçlar Editörü - Mahkeme kararları ve suç kayıtları yönetim sistemi.

## Özellikler

- Bilişim Suçları kayıt ve yönetimi
- Nitelikli Dolandırıcılık kayıt ve yönetimi
- Kredi Kartı Suçları kayıt ve yönetimi
- **Mahkeme Kararları Yönetimi** (Yargıtay kararları dahil)
- Dosyadan toplu karar yükleme
- Gelişmiş arama ve filtreleme
- PDF rapor oluşturma

## Kurulum

```bash
npm install
npm start
```

## Yargıtay Kararlarını Dosyadan Yükleme

Uygulama, yerel dosyalardan Yargıtay kararlarını toplu olarak yükleme imkanı sunar.

### Dosya Formatı

Kararlar JSON formatında olmalıdır. Örnek dosya yapısı:

```json
[
  {
    "karar_no": "Yargıtay 15. Ceza Dairesi 2023/1234 E., 2023/5678 K.",
    "karar_tarihi": "2023-05-15",
    "mahkeme_adı": "Yargıtay 15. Ceza Dairesi",
    "dosya_no": "2023/1234",
    "suç_türü": "Bilişim Suçları",
    "madde_no": "TCK 244/3",
    "özet": "Kararın özet açıklaması",
    "karar_metni": "Kararın tam metni",
    "emsal_niteliği": 1,
    "ilgili_kanun": "TCK 244, KVKK",
    "tags": "etiket1, etiket2, etiket3"
  }
]
```

### Kullanım

1. Uygulamayı açın
2. "Mahkeme Kararları" sekmesine gidin
3. "Dosyadan Yükle" butonuna tıklayın
4. JSON formatındaki kararlar dosyanızı seçin
5. Dosya otomatik olarak sisteme aktarılacaktır

### Alan Açıklamaları

- **karar_no**: Karar numarası (zorunlu)
- **karar_tarihi**: Karar tarihi (YYYY-MM-DD formatında, zorunlu)
- **mahkeme_adı**: Mahkeme adı (zorunlu)
- **dosya_no**: Dosya numarası
- **suç_türü**: Suç türü (zorunlu)
- **madde_no**: İlgili TCK maddesi
- **özet**: Kısa özet
- **karar_metni**: Tam karar metni
- **emsal_niteliği**: Emsal karar mı? (1: Evet, 0: Hayır)
- **ilgili_kanun**: İlgili kanunlar
- **tags**: Virgülle ayrılmış etiketler

## Lisans

MIT
