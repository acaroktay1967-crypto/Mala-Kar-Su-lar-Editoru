# Örnek Kullanım Senaryoları
# Example Usage Scenarios

## Senaryo 1: Yeni Bir Vaka Oluşturma
## Scenario 1: Creating a New Case

Bir vaka raporlandığında:

1. Programı başlatın:
   ```bash
   python3 case_manager.py
   ```

2. "1" seçenek ile yeni vaka oluşturun

3. Bilgileri girin:
   - Başlık: "Aile içi şiddet olayı - 2026/01/11"
   - Açıklama: "Mağdur yardım talebinde bulundu. Fiziksel şiddet belirtileri gözlemlendi."
   - Rapor Tarihi: "2026-01-11"
   - Konum: "Ankara, Çankaya"
   - Kanıtlar: "Fotoğraflar, Tıbbi rapor, Tanık ifadeleri"

4. Sistem otomatik olarak CASE-0001 gibi bir ID atar

## Senaryo 2: Vakanın İlerlemesini Takip Etme
## Scenario 2: Tracking Case Progress

Vaka ilerledikçe güncellemeler ekleyin:

1. "5" seçeneği ile vaka güncelleyin
2. CASE-0001 ID'sini girin
3. Güncelleme notu: "Soruşturma başlatıldı. Polis raporları alındı."

Durum değiştirin:
1. "6" seçeneği ile durumu güncelleyin
2. CASE-0001 ID'sini girin
3. Yeni durum: "Soruşturma"

## Senaryo 3: Vakaları Arama ve Filtreleme
## Scenario 3: Searching and Filtering Cases

Belirli bir konumdaki vakaları bulun:

1. "4" seçeneği ile arama yapın
2. Arama terimi: "Ankara"
3. İlgili tüm vakalar listelenir

Belirli durumdaki vakaları görmek için:
- Python API kullanarak:
  ```python
  from case_manager import CaseManager
  
  manager = CaseManager()
  open_cases = manager.list_cases(status="Açık")
  for case in open_cases:
      print(f"{case.case_id}: {case.title}")
  ```

## Senaryo 4: Vaka Detaylarını Görüntüleme
## Scenario 4: Viewing Case Details

Tam vaka detaylarını görmek için:

1. "2" seçeneği ile vaka görüntüleyin
2. CASE-0001 ID'sini girin
3. Tüm detaylar, kanıtlar ve güncelleme geçmişi gösterilir

Çıktı örneği:
```
============================================================
Vaka ID: CASE-0001
Başlık: Aile içi şiddet olayı - 2026/01/11
Durum: Soruşturma
Rapor Tarihi: 2026-01-11
Konum: Ankara, Çankaya

Açıklama:
  Mağdur yardım talebinde bulundu. Fiziksel şiddet belirtileri gözlemlendi.

Kanıtlar:
  1. Fotoğraflar
  2. Tıbbi rapor
  3. Tanık ifadeleri

Güncellemeler:
  [2026-01-11] Soruşturma başlatıldı. Polis raporları alındı.
  [2026-01-11] Durum değiştirildi: Açık -> Soruşturma

Oluşturulma: 2026-01-11
Son Güncelleme: 2026-01-11
============================================================
```

## Senaryo 5: Programatik Kullanım
## Scenario 5: Programmatic Usage

Python kodundan doğrudan kullanım:

```python
from case_manager import CaseManager, display_case

# Initialize manager
manager = CaseManager()

# Create a new case
case = manager.create_case(
    title="Taciz vakası",
    description="İşyerinde taciz şikayeti",
    date_reported="2026-01-11",
    location="İstanbul, Beşiktaş",
    evidence=["E-mail kayıtları", "Tanık ifadeleri"]
)

print(f"Yeni vaka oluşturuldu: {case.case_id}")

# Add updates
case.add_update("İlk görüşme tamamlandı")
case.add_update("Deliller toplandı")
manager.save_cases()

# Change status
case.change_status("Soruşturma")
manager.save_cases()

# Search cases
results = manager.search_cases("İstanbul")
print(f"{len(results)} vaka bulundu")

# Display case details
display_case(case)

# List all open cases
open_cases = manager.list_cases(status="Açık")
for c in open_cases:
    print(f"{c.case_id}: {c.title}")
```

## Güvenlik İpuçları
## Security Tips

1. **Veri Yedekleme**: cases.json dosyasını düzenli olarak yedekleyin
   ```bash
   cp cases.json cases_backup_$(date +%Y%m%d).json
   ```

2. **Erişim Kontrolü**: Dosya izinlerini kısıtlayın
   ```bash
   chmod 600 cases.json
   ```

3. **Şifreleme**: Hassas veriler için disk şifrelemesi kullanın

4. **Yasal Uyum**: KVKK/GDPR gerekliliklerine uygun veri işleme

## Raporlama
## Reporting

İstatistik çıkarmak için:

```python
from case_manager import CaseManager

manager = CaseManager()

# Total cases
total = len(manager.cases)
print(f"Toplam vaka sayısı: {total}")

# By status
for status in ["Açık", "Soruşturma", "Kapalı"]:
    count = len(manager.list_cases(status=status))
    print(f"{status}: {count}")

# Recent cases (last 10)
recent = manager.list_cases()[:10]
print("\nSon vakalar:")
for case in recent:
    print(f"- {case.case_id}: {case.title}")
```
