# Yağma Suçları Modülü - Kurulum ve Entegrasyon Rehberi

## 🎯 Kurulum Tamamlandı!

Yağma Suçları Modülü (TCK 148-149) başarıyla eklenmiştir ve kullanıma hazırdır.

## 📦 Eklenen Bileşenler

### 1. Veritabanı Katmanı
- ✅ `database.js` - 4 yeni tablo + CRUD operasyonları
  - `yagma_suclari` - Ana kayıtlar
  - `yagma_silah_bilgileri` - Silah detayları
  - `yagma_magdurlari` - Mağdur bilgileri
  - `yagma_suphelileri` - Şüpheli bilgileri

### 2. Backend Katmanı
- ✅ `main.js` - Electron ana süreç (IPC handlers)
- ✅ `preload.js` - API bridge (güvenli iletişim)

### 3. Frontend Katmanı
- ✅ `yagma.html` - Ana modül arayüzü (standalone)
- ✅ `robbery.js` - İş mantığı ve ceza hesaplama
- ✅ `robbery-ui.js` - UI etkileşimleri ve event handlers
- ✅ `robbery.css` - Modül stilleri

### 4. Dokümantasyon
- ✅ `ROBBERY_MODULE_README.md` - Kullanım kılavuzu
- ✅ `robbery-demo.html` - İnteraktif demo sayfası

## 🚀 Kullanıma Başlama

### Seçenek 1: Standalone Kullanım
Yağma modülünü bağımsız olarak kullanmak için:

```bash
npm install
npm start
```

Uygulama başladığında `yagma.html` sayfasını açın.

### Seçenek 2: Ana Uygulamaya Entegrasyon

Ana uygulama HTML dosyasına (`index_ht.html`) entegre etmek için:

1. **Navigation butonunu ekleyin:**
```html
<button class="nav-btn" data-tab="yagma">
    <i class="fas fa-hand-holding-dollar"></i> Yağma Suçları
</button>
```

2. **Tab içeriğini ekleyin:**
`yagma.html` içeriğini bir `<section>` olarak ekleyin.

3. **Script dosyalarını dahil edin:**
```html
<script src="robbery.js"></script>
<script src="robbery-ui.js"></script>
```

4. **CSS dosyasını dahil edin:**
```html
<link rel="stylesheet" href="robbery.css">
```

## 🧪 Test

Modülü test etmek için:

```bash
node test-robbery.js
```

Beklenen çıktı:
```
🎉 TÜM TESTLER BAŞARIYLA TAMAMLANDI!
✨ Yağma Suçları Modülü çalışmaya hazır!
```

## 📊 Demo

Demo sayfasını görmek için:

```bash
# HTTP sunucusu başlat
python3 -m http.server 8080

# Tarayıcıda aç
http://localhost:8080/robbery-demo.html
```

## ✅ Özellikler

### Temel İşlevler
- [x] Yağma suçu kaydı oluşturma
- [x] Kayıtları görüntüleme ve düzenleme
- [x] Kayıtları silme
- [x] Gelişmiş arama ve filtreleme

### Veri Yönetimi
- [x] Dosya numarası, olay tarihi, yer bilgileri
- [x] 9 farklı nitelikli hal desteği (TCK 149)
- [x] Çoklu silah bilgileri
- [x] Çoklu mağdur yönetimi
- [x] Çoklu şüpheli yönetimi
- [x] Çalınan mal bilgileri

### Otomatik Hesaplamalar
- [x] Ceza hesaplama algoritması
- [x] Nitelikli hal tespiti
- [x] TCK madde referansları
- [x] Min-Max ceza aralığı

## ⚖️ Yasal Çerçeve

Modül aşağıdaki ceza aralıklarını destekler:

| Suç Türü | Ceza | Madde |
|----------|------|-------|
| Temel Yağma | 10-15 yıl hapis | TCK 148/1 |
| Nitelikli Yağma | 13-20 yıl hapis | TCK 149/1 |
| Ağır Neticeli | Ağırlaştırılmış Müebbet | TCK 149/2 |
| Teşebbüs | 1/4 - 3/4 indirimli | TCK 35 |

### Nitelikli Haller (TCK 149/1)
1. Silahla işlenen
2. Birden fazla kişiyle işlenen
3. Yüzü kapalı veya kimliği belirsiz
4. Gece vakti işlenen
5. Mağdurun zayıflığından yararlanma
6. Kamu binası veya eklentilerinde
7. Taşıt içinde işlenen
8. Ağır neticeli (kasten yaralama veya ölüm)

## 🔧 Teknik Detaylar

### Veritabanı
- **Teknoloji:** SQLite3
- **ORM:** Native SQL
- **Lokasyon:** `~/.local/share/TCKSuclarEditoru/suclar.db`

### Frontend
- **Framework:** Vanilla JavaScript
- **UI:** HTML5 + CSS3
- **Icons:** Font Awesome 6.4.0

### Backend
- **Runtime:** Electron
- **IPC:** contextBridge + ipcRenderer
- **Güvenlik:** Context Isolation enabled

## 📝 API Kullanımı

### Yağma Suçu Kaydetme
```javascript
const data = {
    dosya_no: '2024/1234',
    olay_tarihi: new Date().toISOString(),
    silah_var: 1,
    coklu_fail: 1,
    // ... diğer alanlar
    mağdurlar: [{ ad_soyad: 'Ahmet Yılmaz', ... }],
    şüpheliler: [{ ad_soyad: 'Mehmet Kaya', ... }]
};

const result = await window.api.yağma.save(data);
```

### Tüm Kayıtları Listeleme
```javascript
const crimes = await window.api.yağma.getAll();
```

### Detay Getirme
```javascript
const crime = await window.api.yağma.getById(id);
```

### Silme
```javascript
await window.api.yağma.delete(id);
```

## 🐛 Sorun Giderme

### Veritabanı Bağlantı Hatası
```bash
# Veritabanı dosyasını sil ve yeniden oluştur
rm ~/.local/share/TCKSuclarEditoru/suclar.db
```

### Modül Dependencies Hatası
```bash
# Node modüllerini yeniden yükle
rm -rf node_modules
npm install
```

### Test Başarısız
```bash
# Veritabanını temizle ve test et
rm ~/.local/share/TCKSuclarEditoru/suclar.db
node test-robbery.js
```

## 📞 Destek

- **Dokümantasyon:** `ROBBERY_MODULE_README.md`
- **Demo:** `robbery-demo.html`
- **Test:** `test-robbery.js`
- **Issues:** GitHub Issues

## 🔄 Gelecek Geliştirmeler

Planlanan özellikler:
- [ ] PDF rapor oluşturma
- [ ] Excel'e aktarma
- [ ] Mahkeme kararı entegrasyonu
- [ ] Fotoğraf/belge ekleme
- [ ] İstatistiksel analizler
- [ ] Görselleştirme grafikleri

## 📄 Lisans

Bu modül ana proje lisansı altındadır.

---

**✨ Modül kullanıma hazır! İyi çalışmalar!**
