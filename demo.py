#!/usr/bin/env python3
"""
Demo script to show the system in action
Creates sample cases and demonstrates functionality
"""

from case_manager import CaseManager, display_case


def create_demo_data():
    """Create demonstration cases."""
    print("=" * 60)
    print("Mala Karşı Suçlar Aydınlatma Sistemi - Demo")
    print("Creating demonstration cases...")
    print("=" * 60)
    
    manager = CaseManager(data_file="demo_cases.json")
    
    # Case 1: Domestic violence
    case1 = manager.create_case(
        title="Aile içi şiddet vakası",
        description="Mağdur, eşi tarafından tekrarlayan fiziksel şiddete maruz kaldığını bildirdi. Acil koruma talebi var.",
        date_reported="2026-01-10",
        location="Ankara, Çankaya",
        evidence=["Tıbbi rapor", "Fotoğraflar", "Tanık ifadeleri (komşu)"]
    )
    case1.add_update("İlk görüşme yapıldı, koruma kararı alındı")
    case1.change_status("Soruşturma")
    manager.save_cases()
    
    # Case 2: Workplace harassment
    case2 = manager.create_case(
        title="İşyerinde taciz",
        description="Çalışan, amiri tarafından sözlü tacize uğradığını ve iş ortamında rahatsız edildiğini bildirdi.",
        date_reported="2026-01-09",
        location="İstanbul, Beşiktaş",
        evidence=["E-mail kayıtları", "Ses kayıtları", "İK şikayeti"]
    )
    case2.add_update("Şirket ile görüşme başlatıldı")
    manager.save_cases()
    
    # Case 3: Online harassment
    case3 = manager.create_case(
        title="Siber zorbalık ve tehdit",
        description="Mağdur, sosyal medya üzerinden tehdit mesajları ve özel bilgilerinin paylaşılması ile karşı karşıya.",
        date_reported="2026-01-08",
        location="İzmir, Konak",
        evidence=["Ekran görüntüleri", "IP kayıtları", "Platform raporları"]
    )
    case3.add_update("Siber suçlar birimi bilgilendirildi")
    case3.change_status("Soruşturma")
    manager.save_cases()
    
    # Case 4: Completed case
    case4 = manager.create_case(
        title="Takip ve rahatsız etme",
        description="Mağdur, eski arkadaşı tarafından sürekli takip edildiğini bildirdi.",
        date_reported="2025-12-15",
        location="Antalya, Muratpaşa",
        evidence=["Güvenlik kamerası görüntüleri", "SMS kayıtları"]
    )
    case4.add_update("Takipçi tespit edildi")
    case4.add_update("Uzaklaştırma kararı alındı")
    case4.add_update("Mağdur güvenli ortamda")
    case4.change_status("Soruşturma")
    case4.change_status("Kapalı")
    manager.save_cases()
    
    print(f"\n✓ {len(manager.cases)} örnek vaka oluşturuldu\n")
    
    return manager


def show_statistics(manager):
    """Show case statistics."""
    print("\n" + "=" * 60)
    print("İSTATİSTİKLER (STATISTICS)")
    print("=" * 60)
    
    total = len(manager.cases)
    print(f"Toplam Vaka Sayısı: {total}")
    print()
    
    for status in ["Açık", "Soruşturma", "Kapalı"]:
        cases = manager.list_cases(status=status)
        print(f"  {status:15s}: {len(cases):2d} vaka")
    
    print()


def show_all_cases(manager):
    """Display all cases."""
    print("\n" + "=" * 60)
    print("TÜM VAKALAR (ALL CASES)")
    print("=" * 60)
    
    for case in manager.list_cases():
        display_case(case)


def demo_search(manager):
    """Demonstrate search functionality."""
    print("\n" + "=" * 60)
    print("ARAMA DEMONSTRASYonu (SEARCH DEMONSTRATION)")
    print("=" * 60)
    
    print("\n1. 'İstanbul' araması:")
    results = manager.search_cases("İstanbul")
    for case in results:
        print(f"   - {case.case_id}: {case.title}")
    
    print("\n2. 'taciz' araması:")
    results = manager.search_cases("taciz")
    for case in results:
        print(f"   - {case.case_id}: {case.title}")
    
    print("\n3. 'Soruşturma' durumundaki vakalar:")
    cases = manager.list_cases(status="Soruşturma")
    for case in cases:
        print(f"   - {case.case_id}: {case.title}")


if __name__ == "__main__":
    # Create demo data
    manager = create_demo_data()
    
    # Show statistics
    show_statistics(manager)
    
    # Show search demonstration
    demo_search(manager)
    
    # Show all cases
    show_all_cases(manager)
    
    print("\n" + "=" * 60)
    print("Demo tamamlandı!")
    print("Demo data saved to: demo_cases.json")
    print("\nTo run the interactive system:")
    print("  python3 case_manager.py")
    print("=" * 60)
