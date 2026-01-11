# Mala Karşı Suçlar Aydınlatma Sistemi

## Crimes Against Women Investigation System

Bu sistem, kadınlara karşı işlenen suçların belgelenmesi, takip edilmesi ve aydınlatılması için geliştirilmiş bir vaka yönetim sistemidir.

This is a case management system developed for documenting, tracking, and investigating crimes against women.

## Özellikler (Features)

- **Vaka Yönetimi**: Yeni vaka oluşturma, görüntüleme, güncelleme
- **Durum Takibi**: Vakaların durumunu takip etme (Açık, Soruşturma, Kapalı)
- **Kanıt Yönetimi**: Kanıtları belgeleme ve saklama
- **Arama ve Filtreleme**: Vakaları başlık, açıklama veya konuma göre arama
- **Güncelleme Geçmişi**: Her vakaya not ekleme ve güncelleme geçmişini görüntüleme
- **Veri Güvenliği**: Tüm veriler yerel olarak JSON formatında güvenli şekilde saklanır

## Kurulum (Installation)

### Gereksinimler
- Python 3.6 veya üzeri

### Kullanım
1. Repoyu klonlayın:
```bash
git clone https://github.com/acaroktay1967-crypto/Mala-Kar-Su-lar-Editoru.git
cd Mala-Kar-Su-lar-Editoru
```

2. Programı çalıştırın:
```bash
python3 case_manager.py
```

## Kullanım Kılavuzu (Usage Guide)

### Ana Menü

Program başlatıldığında aşağıdaki menü görüntülenir:

```
1. Yeni vaka oluştur (Create new case)
2. Vaka görüntüle (View case)
3. Tüm vakaları listele (List all cases)
4. Vaka ara (Search cases)
5. Vaka güncelle (Update case)
6. Vaka durumunu değiştir (Change case status)
7. Çıkış (Exit)
```

### Yeni Vaka Oluşturma

1. Menüden "1" seçin
2. Aşağıdaki bilgileri girin:
   - Başlık: Vakanın kısa özeti
   - Açıklama: Detaylı açıklama
   - Rapor Tarihi: YYYY-MM-DD formatında
   - Konum: Olayın gerçekleştiği yer
   - Kanıtlar: Virgülle ayrılmış kanıt listesi

### Vaka Görüntüleme

1. Menüden "2" seçin
2. Vaka ID'sini girin (örn: CASE-0001)
3. Vaka detayları ekranda görüntülenir

### Vaka Arama

1. Menüden "4" seçin
2. Arama terimini girin
3. Eşleşen vakalar listelenir

### Vaka Güncelleme

1. Menüden "5" seçin
2. Vaka ID'sini girin
3. Güncelleme notunu girin
4. Not, vaka geçmişine eklenir

### Durum Değiştirme

1. Menüden "6" seçin
2. Vaka ID'sini girin
3. Yeni durumu seçin:
   - **Açık**: Yeni açılmış vakalar
   - **Soruşturma**: Aktif olarak araştırılan vakalar
   - **Kapalı**: Tamamlanmış vakalar

## Veri Depolama

Tüm vakalar `cases.json` dosyasında saklanır. Bu dosya:
- UTF-8 kodlaması ile yazılır
- JSON formatındadır
- Her vaka için tam detayları içerir
- Otomatik olarak her işlemden sonra güncellenir

## Güvenlik ve Gizlilik

⚠️ **ÖNEMLİ UYARI**: Bu sistem hassas veriler içerir.

- Veri dosyasını (`cases.json`) güvenli bir konumda saklayın
- Dosya erişim izinlerini kısıtlayın
- Düzenli yedekleme yapın
- Yasal gerekliliklere uygun şekilde kullanın
- Kişisel verilerin korunması yasalarına uyun (KVKK/GDPR)

## Katkıda Bulunma (Contributing)

Bu proje, kadınlara karşı şiddeti önleme ve mağdurların haklarını koruma amacıyla geliştirilmiştir. Katkılarınızı bekliyoruz.

## Lisans (License)

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## Destek ve İletişim

Kadına yönelik şiddetle mücadele eden kuruluşlar:
- Türkiye: ALO 183 Kadın Acil Yardım Hattı
- International: UN Women, Women's Aid

## Yasal Uyarı

Bu yazılım, yasal süreçlerde kullanılmak üzere tasarlanmıştır. Kullanıcılar, yerel yasalara ve düzenlemelere uymakla yükümlüdür.