# Yağma Suçları Modülü (TCK 148-149)

## 📋 Genel Bakış

Bu modül Türk Ceza Kanunu'nun 148. ve 149. maddelerinde düzenlenen **Yağma Suçu** kayıtlarının yönetimini sağlar.

## ⚖️ Yasal Çerçeve

### TCK Madde 148 - Temel Yağma
- **Ceza:** 10-15 yıl hapis
- **Tanım:** Hukuka aykırı bir yarar sağlamak amacıyla cebir veya tehdit kullanarak mal üzerinde tasarruf hakkını kendine veya başkasına geçirmek

### TCK Madde 149 - Nitelikli Haller

#### Nitelikli Yağma (13-20 yıl hapis):
- **a)** Silahla işlenen
- **b)** Birden fazla kişiyle işlenen
- **c)** Yüzü kapalı veya kimliği belirsiz olarak işlenen
- **ç)** Gece vakti işlenen
- **d)** Mağdurun beden veya ruh sağlığı bakımından kendisini savunamayacak durumda olmasından yararlanarak işlenen
- **e)** Kamu kurum ve kuruluşlarının veya müesseselerinin belirli bir hizmete tahsis edilmiş araç ve gereçlerinin bulunduğu yerlere girilmek suretiyle işlenen
- **f)** Taşıt içinde işlenen

#### Ağır Neticeli Yağma (Ağırlaştırılmış Müebbet):
- **Madde 149/2:** Yağma sonucu kasten yaralama veya ölüm gerçekleşirse

## 🎯 Özellikler

### ✅ Temel İşlevler
- Yağma suçu kaydı oluşturma
- Kayıtları görüntüleme ve düzenleme
- Kayıtları silme
- Gelişmiş arama ve filtreleme

### 📊 Veri Yönetimi
- **Temel Bilgiler:** Dosya no, olay tarihi, yer
- **Nitelikli Haller:** Tüm TCK 149 madde bentleri
- **Silah Bilgileri:** Türü, marka, model, seri no
- **Mağdur Listesi:** Çoklu mağdur desteği
- **Şüpheli Listesi:** Çoklu şüpheli desteği
- **Çalınan Mal:** Değer, açıklama, ele geçirilme durumu

### ⚖️ Otomatik Ceza Hesaplama
- Girilen bilgilere göre otomatik ceza hesaplama
- Nitelikli hallerin tespiti
- TCK madde gösterimi
- Minimum-maksimum ceza aralığı

## 🗄️ Veritabanı Yapısı

### Tablolar

#### 1. yagma_suclari
Ana yağma suçu bilgileri

#### 2. yagma_silah_bilgileri
Kullanılan silahların detayları

#### 3. yagma_magdurlari
Mağdur bilgileri

#### 4. yagma_suphelileri
Şüpheli bilgileri

## 🚀 Kullanım

### Yeni Kayıt Oluşturma

1. **"Yağma Suçları"** sekmesine gidin
2. **"Yeni Yağma Kaydı"** butonuna tıklayın
3. Form alanlarını doldurun:
   - Dosya numarası (zorunlu)
   - Olay tarihi (zorunlu)
   - Nitelikli halleri işaretleyin
   - Silah varsa bilgilerini girin
   - En az 1 mağdur ekleyin
   - En az 1 şüpheli ekleyin
   - Çalınan mal bilgilerini girin
4. Otomatik ceza hesaplamasını kontrol edin
5. **"Kaydet"** butonuna tıklayın

### Kayıt Görüntüleme

- Liste sayfasında **"Görüntüle"** butonuna tıklayın
- Tüm detaylar görüntülenir

### Kayıt Düzenleme

- Liste sayfasında **"Düzenle"** butonuna tıklayın
- Gerekli değişiklikleri yapın
- **"Kaydet"** butonuna tıklayın

### Kayıt Silme

- Liste sayfasında **"Sil"** butonuna tıklayın
- Onay verin

## 📁 Dosya Yapısı

```
├── database.js          # Veritabanı işlemleri
├── main.js             # Electron ana süreç
├── preload.js          # API bridge
├── yagma.html          # Ana HTML arayüzü
├── robbery.js          # İş mantığı ve ceza hesaplama
├── robbery-ui.js       # UI etkileşimleri
├── robbery.css         # Stil dosyası
└── test-robbery.js     # Test scripti
```

## 🧪 Test

Modülü test etmek için:

```bash
node test-robbery.js
```

Test scripti:
- Veritabanı bağlantısını test eder
- Örnek yağma suçu kaydı oluşturur
- CRUD operasyonlarını doğrular
- Ceza hesaplama fonksiyonunu test eder
- Test verilerini temizler

## 🎨 Kullanıcı Arayüzü

### Renkler
- **Ana Renk:** Kırmızı (#e74c3c) - Yağma suçunun ciddiyetini simgeler
- **Vurgu Rengi:** Koyu kırmızı (#c0392b)
- **Başarı Rengi:** Yeşil (#27ae60)

### İkonlar
- 🔫 Silah bilgileri
- 👤 Mağdur/Şüpheli bilgileri
- 💰 Çalınan mal bilgileri
- ⚖️ Ceza hesaplama
- 📋 Dosya bilgileri

## 🔒 Güvenlik

- Tüm veriler yerel SQLite veritabanında saklanır
- TC Kimlik numaraları şifrelenebilir (opsiyonel)
- Yedekleme desteği mevcut

## 📝 Notlar

- Tüm tarihler ISO 8601 formatında saklanır
- Para birimi varsayılan olarak TRY (Türk Lirası)
- Telefon numaraları uluslararası formatta saklanabilir
- Suç türü enum değerleri veritabanında integer olarak saklanır

## 🔄 Gelecek Geliştirmeler

- [ ] PDF rapor oluşturma
- [ ] Excel'e aktarma
- [ ] Mahkeme kararı entegrasyonu
- [ ] Fotoğraf/belge ekleme
- [ ] İstatistiksel analizler
- [ ] Görselleştirmeler ve grafikler

## 📞 Destek

Herhangi bir sorun veya öneri için GitHub issues kullanın.

## 📄 Lisans

Bu modül ana proje lisansı altındadır.

---

**Geliştirici Notu:** Bu modül Türk Ceza Kanunu'nun 148. ve 149. maddelerine tam uyumlu olarak geliştirilmiştir. Kullanım sırasında güncel yasal mevzuatı takip ediniz.
