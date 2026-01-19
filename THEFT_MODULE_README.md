# Hırsızlık Suçları Modülü (TCK 141-145)

## 📋 Genel Bakış

Bu modül Türk Ceza Kanunu'nun 141-145. maddelerinde düzenlenen **Hırsızlık Suçu** kayıtlarının yönetimini sağlar.

## ⚖️ Yasal Çerçeve

### TCK Madde 141 - Temel Hırsızlık
- **Ceza:** 1-3 yıl hapis
- **Tanım:** Başkasına ait taşınır bir malı, zilyedinin rızası olmadan kendisine veya başkasına mal etmek

### TCK Madde 142 - Nitelikli Haller

#### Nitelikli Hırsızlık (3-7 yıl hapis):
- **a)** Konut veya işyerinde
- **b)** Gece vakti
- **c)** Birden fazla kişiyle
- **ç)** Özel araç kullanılarak (anahtar, çilingir aleti vb.)
- **d)** Koruyucu düzeneklerin kırılması veya bozulması suretiyle

#### Daha da Ağırlaştırılmış (5-10 yıl hapis):
- **Madde 142/2-a:** Kamu kurumu veya kuruluşlarına ait binaların eklentilerinde
- **Madde 142/2-b:** İbadet yerlerinde

## 🎯 Özellikler

### ✅ Temel İşlevler
- Hırsızlık suçu kaydı oluşturma
- Kayıtları görüntüleme ve düzenleme
- Kayıtları silme
- Gelişmiş arama ve filtreleme

### 📊 Veri Yönetimi
- **Temel Bilgiler:** Dosya no, olay tarihi, yer
- **Nitelikli Haller:** TCK 142 madde bentlerinin tümü
- **Mağdur Listesi:** Çoklu mağdur desteği
- **Şüpheli Listesi:** Çoklu şüpheli desteği
- **Çalınan Mal:** Değer, açıklama, ele geçirilme durumu

### ⚖️ Otomatik Ceza Hesaplama
- Girilen bilgilere göre otomatik ceza hesaplama
- Nitelikli hallerin tespiti
- TCK madde gösterimi
- Minimum-maksimum ceza aralığı
- Teşebbüs durumunda otomatik indirim hesabı

## 🗄️ Veritabanı Yapısı

### Tablolar

#### 1. hirsizlik_suclari
Ana hırsızlık suçu bilgileri

#### 2. hirsizlik_magdurlari
Mağdur bilgileri (1:N ilişki)

#### 3. hirsizlik_suphelileri
Şüpheli bilgileri (1:N ilişki)

## 🚀 Kullanım

### Yeni Kayıt Oluşturma

1. **"Hırsızlık Suçları"** sekmesine gidin
2. **"Yeni Hırsızlık Kaydı"** butonuna tıklayın
3. Form alanlarını doldurun:
   - Dosya numarası (zorunlu)
   - Olay tarihi (zorunlu)
   - Nitelikli halleri işaretleyin
   - En az 1 mağdur ekleyin
   - En az 1 şüpheli ekleyin
   - Çalınan mal bilgilerini girin
4. Otomatik ceza hesaplamasını kontrol edin
5. **"Kaydet"** butonuna tıklayın

## 📁 Dosya Yapısı

```
├── database.js          # Veritabanı işlemleri (3 yeni tablo)
├── main.js             # Electron ana süreç (4 IPC handler)
├── preload.js          # API bridge
├── hirsizlik.html      # Ana HTML arayüzü
├── theft.js            # İş mantığı ve ceza hesaplama
├── theft-ui.js         # UI etkileşimleri
├── theft.css           # Stil dosyası (mavi tema)
└── test-theft.js       # Test scripti
```

## 🧪 Test

Modülü test etmek için:

```bash
node test-theft.js
```

Test scripti:
- Veritabanı bağlantısını test eder
- Örnek hırsızlık suçu kaydı oluşturur
- CRUD operasyonlarını doğrular
- Ceza hesaplama fonksiyonunu test eder
- Test verilerini temizler

## 🎨 Kullanıcı Arayüzü

### Renkler
- **Ana Renk:** Mavi (#3498db) - Hırsızlık için sakin ve profesyonel
- **Vurgu Rengi:** Koyu mavi (#2980b9)
- **Başarı Rengi:** Yeşil (#27ae60)

### İkonlar
- 🏠 Konut/İşyeri
- 🌙 Gece vakti
- 👥 Çoklu fail
- 🔑 Özel araç kullanımı
- 🔓 Güvenlik önlemi
- 🏛️ Kamu binası
- 🕌 İbadethane
- 👤 Mağdur/Şüpheli bilgileri
- 💰 Çalınan mal bilgileri
- ⚖️ Ceza hesaplama
- 📋 Dosya bilgileri

## 🔒 Güvenlik

- Tüm veriler yerel SQLite veritabanında saklanır
- TC Kimlik numaraları şifrelenebilir (opsiyonel)
- Yedekleme desteği mevcut
- Cascade delete ile veri bütünlüğü

## 📝 Notlar

- Tüm tarihler ISO 8601 formatında saklanır
- Para birimi varsayılan olarak TRY (Türk Lirası)
- Telefon numaraları uluslararası formatta saklanabilir
- Nitelikli haller enum değerleri boolean olarak saklanır

## 🔄 Gelecek Geliştirmeler

- [ ] PDF rapor oluşturma
- [ ] Excel'e aktarma
- [ ] Mahkeme kararı entegrasyonu
- [ ] Fotoğraf/belge ekleme
- [ ] İstatistiksel analizler
- [ ] Görselleştirmeler ve grafikler
- [ ] TCK 143 (Kaybolmuş mal hırsızlığı) desteği
- [ ] TCK 144 (Kullanma hırsızlığı) desteği
- [ ] TCK 145 (Serbest bırakılmanın ertelenmesi) desteği

## 📞 Destek

Herhangi bir sorun veya öneri için GitHub issues kullanın.

## 📄 Lisans

Bu modül ana proje lisansı altındadır.

---

**Geliştirici Notu:** Bu modül Türk Ceza Kanunu'nun 141-145. maddelerine tam uyumlu olarak geliştirilmiştir. Kullanım sırasında güncel yasal mevzuatı takip ediniz.

## 🤝 İlgili Modüller

- **Yağma Suçları (TCK 148-149)** - Cebir ve tehdit ile mal alma
- **Güveni Kötüye Kullanma (TCK 155)** - Emanet malın zimmetine geçirilmesi (gelecekte eklenecek)
- **Mala Zarar Verme (TCK 151)** - Başkasının malına zarar verme (gelecekte eklenecek)
