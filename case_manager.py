#!/usr/bin/env python3
"""
Mala Karşı Suçlar Aydınlatma Sistemi (Crimes Against Women Investigation System)
A case management system for documenting and tracking crimes against women.
"""

import json
import os
from datetime import datetime
from typing import List, Dict, Optional


class Case:
    """Represents a case of crime against women."""
    
    def __init__(self, case_id: str, title: str, description: str, 
                 date_reported: str, status: str = "Açık", 
                 location: str = "", evidence: List[str] = None):
        self.case_id = case_id
        self.title = title
        self.description = description
        self.date_reported = date_reported
        self.status = status  # Açık (Open), Soruşturma (Investigation), Kapalı (Closed)
        self.location = location
        self.evidence = evidence or []
        self.updates: List[Dict] = []
        self.created_at = datetime.now().isoformat()
        self.updated_at = datetime.now().isoformat()
    
    def to_dict(self) -> Dict:
        """Convert case to dictionary."""
        return {
            'case_id': self.case_id,
            'title': self.title,
            'description': self.description,
            'date_reported': self.date_reported,
            'status': self.status,
            'location': self.location,
            'evidence': self.evidence,
            'updates': self.updates,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Case':
        """Create case from dictionary."""
        case = cls(
            case_id=data['case_id'],
            title=data['title'],
            description=data['description'],
            date_reported=data['date_reported'],
            status=data.get('status', 'Açık'),
            location=data.get('location', ''),
            evidence=data.get('evidence', [])
        )
        case.updates = data.get('updates', [])
        case.created_at = data.get('created_at', datetime.now().isoformat())
        case.updated_at = data.get('updated_at', datetime.now().isoformat())
        return case
    
    def add_update(self, update_text: str):
        """Add an update to the case."""
        self.updates.append({
            'timestamp': datetime.now().isoformat(),
            'text': update_text
        })
        self.updated_at = datetime.now().isoformat()
    
    def change_status(self, new_status: str):
        """Change case status."""
        old_status = self.status
        self.status = new_status
        self.add_update(f"Durum değiştirildi: {old_status} -> {new_status}")


class CaseManager:
    """Manages all cases in the system."""
    
    def __init__(self, data_file: str = "cases.json"):
        self.data_file = data_file
        self.cases: Dict[str, Case] = {}
        self.load_cases()
    
    def load_cases(self):
        """Load cases from file."""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for case_data in data:
                        case = Case.from_dict(case_data)
                        self.cases[case.case_id] = case
            except (json.JSONDecodeError, IOError) as e:
                print(f"Veri yükleme hatası: {e}")
    
    def save_cases(self):
        """Save cases to file."""
        try:
            with open(self.data_file, 'w', encoding='utf-8') as f:
                data = [case.to_dict() for case in self.cases.values()]
                json.dump(data, f, ensure_ascii=False, indent=2)
        except IOError as e:
            print(f"Veri kaydetme hatası: {e}")
    
    def create_case(self, title: str, description: str, date_reported: str,
                   location: str = "", evidence: List[str] = None) -> Case:
        """Create a new case."""
        case_id = f"CASE-{len(self.cases) + 1:04d}"
        case = Case(case_id, title, description, date_reported, 
                   location=location, evidence=evidence)
        self.cases[case_id] = case
        self.save_cases()
        return case
    
    def get_case(self, case_id: str) -> Optional[Case]:
        """Get a case by ID."""
        return self.cases.get(case_id)
    
    def update_case(self, case_id: str, **kwargs):
        """Update case fields."""
        case = self.get_case(case_id)
        if case:
            for key, value in kwargs.items():
                if hasattr(case, key):
                    setattr(case, key, value)
            case.updated_at = datetime.now().isoformat()
            self.save_cases()
            return case
        return None
    
    def delete_case(self, case_id: str) -> bool:
        """Delete a case."""
        if case_id in self.cases:
            del self.cases[case_id]
            self.save_cases()
            return True
        return False
    
    def list_cases(self, status: Optional[str] = None) -> List[Case]:
        """List all cases, optionally filtered by status."""
        cases = list(self.cases.values())
        if status:
            cases = [c for c in cases if c.status == status]
        return sorted(cases, key=lambda x: x.created_at, reverse=True)
    
    def search_cases(self, query: str) -> List[Case]:
        """Search cases by title or description."""
        query_lower = query.lower()
        results = []
        for case in self.cases.values():
            if (query_lower in case.title.lower() or 
                query_lower in case.description.lower() or
                query_lower in case.location.lower()):
                results.append(case)
        return results


def display_case(case: Case):
    """Display case details."""
    print(f"\n{'='*60}")
    print(f"Vaka ID: {case.case_id}")
    print(f"Başlık: {case.title}")
    print(f"Durum: {case.status}")
    print(f"Rapor Tarihi: {case.date_reported}")
    print(f"Konum: {case.location}")
    print(f"\nAçıklama:")
    print(f"  {case.description}")
    
    if case.evidence:
        print(f"\nKanıtlar:")
        for i, evidence in enumerate(case.evidence, 1):
            print(f"  {i}. {evidence}")
    
    if case.updates:
        print(f"\nGüncellemeler:")
        for update in case.updates:
            timestamp = update['timestamp'].split('T')[0]
            print(f"  [{timestamp}] {update['text']}")
    
    print(f"\nOluşturulma: {case.created_at.split('T')[0]}")
    print(f"Son Güncelleme: {case.updated_at.split('T')[0]}")
    print(f"{'='*60}\n")


def main():
    """Main function for CLI interface."""
    manager = CaseManager()
    
    print("=" * 60)
    print("Mala Karşı Suçlar Aydınlatma Sistemi")
    print("Crimes Against Women Investigation System")
    print("=" * 60)
    
    while True:
        print("\nMenü:")
        print("1. Yeni vaka oluştur (Create new case)")
        print("2. Vaka görüntüle (View case)")
        print("3. Tüm vakaları listele (List all cases)")
        print("4. Vaka ara (Search cases)")
        print("5. Vaka güncelle (Update case)")
        print("6. Vaka durumunu değiştir (Change case status)")
        print("7. Çıkış (Exit)")
        
        choice = input("\nSeçiminiz (Your choice): ").strip()
        
        if choice == "1":
            print("\n--- Yeni Vaka Oluştur ---")
            title = input("Başlık (Title): ")
            description = input("Açıklama (Description): ")
            date_reported = input("Rapor Tarihi (Date, YYYY-MM-DD): ")
            location = input("Konum (Location): ")
            evidence_input = input("Kanıtlar (Evidence, virgülle ayırın): ")
            evidence = [e.strip() for e in evidence_input.split(",")] if evidence_input else []
            
            case = manager.create_case(title, description, date_reported, location, evidence)
            print(f"\n✓ Vaka oluşturuldu: {case.case_id}")
        
        elif choice == "2":
            case_id = input("\nVaka ID: ")
            case = manager.get_case(case_id)
            if case:
                display_case(case)
            else:
                print("Vaka bulunamadı.")
        
        elif choice == "3":
            print("\n--- Tüm Vakalar ---")
            cases = manager.list_cases()
            if cases:
                for case in cases:
                    print(f"{case.case_id} | {case.status:15s} | {case.title}")
            else:
                print("Henüz vaka yok.")
        
        elif choice == "4":
            query = input("\nArama terimi (Search term): ")
            results = manager.search_cases(query)
            if results:
                print(f"\n{len(results)} sonuç bulundu:")
                for case in results:
                    print(f"{case.case_id} | {case.title}")
            else:
                print("Sonuç bulunamadı.")
        
        elif choice == "5":
            case_id = input("\nVaka ID: ")
            case = manager.get_case(case_id)
            if case:
                update_text = input("Güncelleme notu (Update note): ")
                case.add_update(update_text)
                manager.save_cases()
                print("✓ Vaka güncellendi.")
            else:
                print("Vaka bulunamadı.")
        
        elif choice == "6":
            case_id = input("\nVaka ID: ")
            case = manager.get_case(case_id)
            if case:
                print("\nDurum seçenekleri: Açık, Soruşturma, Kapalı")
                new_status = input("Yeni durum (New status): ")
                case.change_status(new_status)
                manager.save_cases()
                print("✓ Durum değiştirildi.")
            else:
                print("Vaka bulunamadı.")
        
        elif choice == "7":
            print("\nSistemden çıkılıyor...")
            break
        
        else:
            print("Geçersiz seçim.")


if __name__ == "__main__":
    main()
