# Mala-Kar-Su-lar-Editoru

## TCK Mala Karşı İşlenen Suçlar Editörü

Türk Ceza Kanunu kapsamında mala karşı işlenen suçların yönetimi ve analizi için geliştirilmiş metin editörü uygulaması.

## Özellikler

### Metin Düzenleme Özellikleri

#### 1. Temel Düzenleme İşlevleri
- **Kopyala (Ctrl+C):** Seçili metni panoya kopyalar
- **Yapıştır (Ctrl+V):** Panodan metin yapıştırır
- **Kes (Ctrl+X):** Seçili metni keser ve panoya kopyalar
- **Geri Al (Ctrl+Z):** Son değişikliği geri alır
- **Yinele (Ctrl+Y):** Geri alınan değişikliği yeniden uygular
- **Tümünü Seç (Ctrl+A):** Tüm metni seçer

#### 2. Yazı Tipi Özellikleri
- **Yazı Tipi Ailesi:** Sistemdeki tüm yazı tiplerinden seçim yapabilme
- **Yazı Tipi Boyutu:** 8pt'den 72pt'ye kadar önceden tanımlanmış boyutlar
- **Kalın (Bold):** Metni kalın yapma
- **İtalik (Italic):** Metni italik yapma
- **Hızlı Büyütme/Küçültme:** A+ ve A- butonları ile yazı tipi boyutunu değiştirme

#### 3. Renk Özellikleri
- **Yazı Rengi Değiştirme:** Seçili metne veya yeni yazılacak metne renk uygulama
- **Renk Seçici:** Görsel renk seçici ile kolay renk seçimi
- **Çoklu Renk Desteği:** Aynı belgede farklı renkler kullanabilme
- **Renk Önizleme:** Araç çubuğunda seçili rengin gösterimi

#### 4. Unicode Desteği
- **Tam UTF-8 Desteği:** Türkçe karakterler dahil tüm Unicode karakterleri
- **Uluslararası Dil Desteği:** Çoklu dil ve özel karakterler
- **Encoding Göstergesi:** Durum çubuğunda UTF-8 göstergesi

#### 5. Dosya İşlemleri
- **Yeni Dosya (Ctrl+N):** Yeni bir belge oluşturma
- **Aç (Ctrl+O):** Mevcut dosyaları açma (txt, md, json, py)
- **Kaydet (Ctrl+S):** Dosyayı kaydetme
- **Farklı Kaydet:** Dosyayı farklı isimle kaydetme
- **Yazdır (Ctrl+P):** Belgeyi yazdırma

#### 6. Görünüm Özellikleri
- **Yakınlaştırma (Ctrl++):** Metni büyütme
- **Uzaklaştırma (Ctrl+-):** Metni küçültme
- **Normal Boyut (Ctrl+0):** Varsayılan boyuta döndürme

### Durum Çubuğu Bilgileri
- Dosya durumu (Hazır/İşleniyor)
- Unicode encoding bilgisi (UTF-8)
- Mevcut satır numarası
- Sütun numarası
- Seçili karakter sayısı

## Kullanım

### Kurulum

#### Gereksinimler
- Python 3.8 veya üzeri
- tkinter kütüphanesi (Python ile birlikte gelir)

#### Çalıştırma
```bash
python3 "text editör.pt"
```

### Temel Kullanım

#### Metin Renklendirme
1. Renklendirmek istediğiniz metni seçin
2. Araç çubuğundaki renkli kareye tıklayın veya **Biçim > Yazı Rengi** menüsünü seçin
3. Renk seçiciden istediğiniz rengi seçin
4. Renk seçili metne uygulanacaktır

Eğer metin seçili değilse, seçtiğiniz renk bundan sonra yazacağınız metin için geçerli olacaktır.

#### Yazı Tipi Değiştirme
1. Araç çubuğundaki "Yazı Tipi" açılır menüsünden bir yazı tipi seçin
   VEYA
2. **Biçim > Yazı Tipi** menüsünden detaylı yazı tipi seçici penceresini açın

#### Yazı Tipi Boyutu Değiştirme
1. Araç çubuğundaki "Punto" açılır menüsünden bir boyut seçin
   VEYA
2. A+ veya A- butonlarını kullanarak adım adım boyutu değiştirin

### Klavye Kısayolları

| Kısayol | İşlev |
|---------|-------|
| Ctrl+N | Yeni Dosya |
| Ctrl+O | Dosya Aç |
| Ctrl+S | Kaydet |
| Ctrl+Shift+S | Farklı Kaydet |
| Ctrl+P | Yazdır |
| Ctrl+Z | Geri Al |
| Ctrl+Y | Yinele |
| Ctrl+X | Kes |
| Ctrl+C | Kopyala |
| Ctrl+V | Yapıştır |
| Ctrl+A | Tümünü Seç |
| Ctrl++ | Yakınlaştır |
| Ctrl+- | Uzaklaştır |
| Ctrl+0 | Normal Boyut |

## Teknik Detaylar

### Mimari
- **Arayüz:** Tkinter (Python GUI framework)
- **Renk Yönetimi:** Tag tabanlı sistem ile çoklu renk desteği
- **Encoding:** UTF-8

### Dosya Formatları
- Metin dosyaları (.txt)
- Markdown (.md)
- JSON (.json)
- Python (.py)
- Tüm dosyalar (*.*)

## Lisans

MIT License

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen pull request gönderin veya issue açın.

## İletişim

Sorularınız için issue açabilirsiniz.