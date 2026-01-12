# Yargıtay Kararları Dosyadan Yükleme - Kullanım Kılavuzu

## Genel Bakış

Bu özellik, kullanıcıların yerel bilgisayarlarındaki JSON formatındaki Yargıtay kararlarını uygulamaya toplu olarak yüklemelerine olanak sağlar.

## Adım Adım Kullanım

### 1. JSON Dosyası Hazırlama

Kararlarınızı aşağıdaki JSON formatında hazırlayın:

```json
[
  {
    "karar_no": "Yargıtay 15. Ceza Dairesi 2023/1234 E., 2023/5678 K.",
    "karar_tarihi": "2023-05-15",
    "mahkeme_adı": "Yargıtay 15. Ceza Dairesi",
    "dosya_no": "2023/1234",
    "suç_türü": "Bilişim Suçları",
    "madde_no": "TCK 244/3",
    "özet": "Karar özeti burada...",
    "karar_metni": "Tam karar metni burada...",
    "emsal_niteliği": 1,
    "ilgili_kanun": "TCK 244, KVKK",
    "tags": "etiket1, etiket2, etiket3"
  }
]
```

### 2. Zorunlu Alanlar

Aşağıdaki alanlar **mutlaka** bulunmalıdır:
- ✅ `karar_no` - Karar numarası
- ✅ `karar_tarihi` - Karar tarihi (YYYY-MM-DD formatında)
- ✅ `mahkeme_adı` - Mahkeme adı
- ✅ `suç_türü` - Suç türü

### 3. İsteğe Bağlı Alanlar

- `dosya_no` - Dosya numarası
- `madde_no` - İlgili TCK maddesi
- `özet` - Kısa özet
- `karar_metni` - Tam karar metni
- `emsal_niteliği` - Emsal karar mı? (1: Evet, 0: Hayır)
- `ilgili_kanun` - İlgili kanunlar
- `tags` - Virgülle ayrılmış etiketler

### 4. Dosya Yükleme İşlemi

1. Uygulamayı açın
2. Sol menüden **"Mahkeme Kararları"** sekmesine gidin
3. Sağ üstteki **"Dosyadan Yükle"** butonuna tıklayın
4. JSON dosyanızı seçin
5. Sistem dosyayı otomatik olarak doğrular ve yükler
6. Sonuç mesajında kaç kararın başarıyla eklendiğini göreceksiniz

## Örnek Dosya

Proje klasöründe `ornek-yargitay-kararlar.json` dosyası örnek olarak sunulmuştur. Bu dosyayı referans alarak kendi dosyanızı oluşturabilirsiniz.

## Hata Durumları

### Dosya Formatı Hatası
```
"Dosya formatı hatalı. JSON dizisi bekleniyor."
```
**Çözüm**: Dosyanızın geçerli bir JSON dizisi olduğundan emin olun.

### Eksik Alan Hatası
```
"Karar 2: Gerekli alanlar eksik - karar_no, karar_tarihi"
```
**Çözüm**: Belirtilen zorunlu alanları ekleyin.

### Tarih Formatı Hatası
```
"Karar 3: Tarih formatı hatalı (YYYY-MM-DD formatında olmalı)"
```
**Çözüm**: Tarihi `2023-05-15` formatında girin.

## İpuçları

💡 **Toplu Yükleme**: Tek bir dosyada birden fazla karar yükleyebilirsiniz.

💡 **Yedekleme**: Önemli kararlarınızı yüklemeden önce JSON dosyasının yedeğini alın.

💡 **Test**: Büyük dosyaları yüklemeden önce küçük bir örnek dosya ile test edin.

💡 **Etiketler**: Etiketler sayesinde kararları daha kolay filtreleyip bulabilirsiniz.

## Teknik Detaylar

- **Desteklenen Format**: JSON (.json)
- **Maksimum Dosya Boyutu**: Node.js varsayılan bellek limiti
- **Karakter Kodlaması**: UTF-8
- **Tarih Formatı**: ISO 8601 (YYYY-MM-DD)

## Destek

Herhangi bir sorun yaşarsanız:
1. JSON dosyanızın geçerli olduğundan emin olun (JSON validator kullanın)
2. Zorunlu alanların eksik olmadığını kontrol edin
3. Tarih formatının doğru olduğunu onaylayın
