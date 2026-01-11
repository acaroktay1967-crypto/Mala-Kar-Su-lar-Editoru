#!/usr/bin/env python3
"""
Test script for Case Management System
Tests basic functionality without external dependencies
"""

import os
import json
import tempfile
from case_manager import Case, CaseManager


def test_case_creation():
    """Test creating a case."""
    print("Test 1: Vaka Oluşturma (Case Creation)...")
    case = Case(
        case_id="TEST-0001",
        title="Test Vakası",
        description="Bu bir test vakasıdır",
        date_reported="2026-01-11",
        location="Test Lokasyonu",
        evidence=["Kanıt 1", "Kanıt 2"]
    )
    
    assert case.case_id == "TEST-0001"
    assert case.title == "Test Vakası"
    assert case.status == "Açık"
    assert len(case.evidence) == 2
    print("✓ Test geçti!")


def test_case_update():
    """Test updating a case."""
    print("\nTest 2: Vaka Güncelleme (Case Update)...")
    case = Case(
        case_id="TEST-0002",
        title="Güncellenecek Vaka",
        description="Güncelleme testi",
        date_reported="2026-01-11"
    )
    
    case.add_update("İlk güncelleme")
    assert len(case.updates) == 1
    
    case.change_status("Soruşturma")
    assert case.status == "Soruşturma"
    assert len(case.updates) == 2  # Status change adds an update
    print("✓ Test geçti!")


def test_case_manager():
    """Test case manager functionality."""
    print("\nTest 3: Vaka Yöneticisi (Case Manager)...")
    
    # Use temporary file for testing
    temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
    temp_file.close()
    
    try:
        manager = CaseManager(data_file=temp_file.name)
        
        # Test create
        case1 = manager.create_case(
            title="Vaka 1",
            description="İlk test vakası",
            date_reported="2026-01-11",
            location="Ankara"
        )
        assert case1.case_id == "CASE-0001"
        
        case2 = manager.create_case(
            title="Vaka 2",
            description="İkinci test vakası",
            date_reported="2026-01-11",
            location="İstanbul"
        )
        assert case2.case_id == "CASE-0002"
        
        # Test get
        retrieved_case = manager.get_case("CASE-0001")
        assert retrieved_case is not None
        assert retrieved_case.title == "Vaka 1"
        
        # Test list
        all_cases = manager.list_cases()
        assert len(all_cases) == 2
        
        # Test search
        results = manager.search_cases("İstanbul")
        assert len(results) == 1
        assert results[0].case_id == "CASE-0002"
        
        # Test update
        updated = manager.update_case("CASE-0001", location="İzmir")
        assert updated is not None
        assert updated.location == "İzmir"
        
        # Test persistence
        manager2 = CaseManager(data_file=temp_file.name)
        assert len(manager2.cases) == 2
        
        print("✓ Test geçti!")
        
    finally:
        # Cleanup
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)


def test_case_serialization():
    """Test case serialization and deserialization."""
    print("\nTest 4: Veri Serileştirme (Data Serialization)...")
    
    original_case = Case(
        case_id="TEST-0003",
        title="Serileştirme Testi",
        description="JSON dönüşüm testi",
        date_reported="2026-01-11",
        location="Test",
        evidence=["Kanıt A"]
    )
    original_case.add_update("Test güncelleme")
    
    # Convert to dict
    case_dict = original_case.to_dict()
    assert isinstance(case_dict, dict)
    assert case_dict['case_id'] == "TEST-0003"
    
    # Convert back to case
    restored_case = Case.from_dict(case_dict)
    assert restored_case.case_id == original_case.case_id
    assert restored_case.title == original_case.title
    assert len(restored_case.updates) == 1
    assert len(restored_case.evidence) == 1
    
    print("✓ Test geçti!")


def test_status_filtering():
    """Test filtering cases by status."""
    print("\nTest 5: Durum Filtreleme (Status Filtering)...")
    
    temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
    temp_file.close()
    
    try:
        manager = CaseManager(data_file=temp_file.name)
        
        case1 = manager.create_case("Açık Vaka", "Açık durum", "2026-01-11")
        case2 = manager.create_case("Soruşturma Vakası", "Soruşturma", "2026-01-11")
        case2.change_status("Soruşturma")
        manager.save_cases()
        
        case3 = manager.create_case("Kapalı Vaka", "Kapalı", "2026-01-11")
        case3.change_status("Kapalı")
        manager.save_cases()
        
        # Filter by status
        open_cases = manager.list_cases(status="Açık")
        assert len(open_cases) == 1
        
        investigation_cases = manager.list_cases(status="Soruşturma")
        assert len(investigation_cases) == 1
        
        closed_cases = manager.list_cases(status="Kapalı")
        assert len(closed_cases) == 1
        
        print("✓ Test geçti!")
        
    finally:
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)


def run_all_tests():
    """Run all tests."""
    print("=" * 60)
    print("Mala Karşı Suçlar Aydınlatma Sistemi - Test Paketi")
    print("Crimes Against Women Investigation System - Test Suite")
    print("=" * 60)
    
    try:
        test_case_creation()
        test_case_update()
        test_case_manager()
        test_case_serialization()
        test_status_filtering()
        
        print("\n" + "=" * 60)
        print("✓ TÜM TESTLER BAŞARILI!")
        print("✓ ALL TESTS PASSED!")
        print("=" * 60)
        return True
        
    except AssertionError as e:
        print(f"\n✗ Test başarısız: {e}")
        return False
    except Exception as e:
        print(f"\n✗ Hata: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
