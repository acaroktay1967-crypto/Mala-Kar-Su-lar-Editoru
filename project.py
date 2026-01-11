#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Proje Klasörü ve Dosyaları Oluşturucu
"""

import os
import json
from pathlib import Path

def create_structure():
    """Proje klasör yapısını oluşturur"""
    base = Path("Nitelikli_Dolandırıcılık_Electron")
    base.mkdir(exist_ok=True)
    
    # Ana dizin dosyaları
    files = [
        "main.py",
        "create_project.py",
        "requirements.txt",
        "config.json",
        "package.json",
        "README.md"
    ]
    
    for file in files:
        (base / file).touch()
    
    # Alt klasörler
    folders = [
        "electron_app/icons",
        "tkinter_app/widgets",
        "backend",
        "data",
        "documents/indictments",
        "documents/interrogation_records",
        "documents/witness_statements",
        "documents/evidence",
        "documents/court_decisions",
        "documents/expert_reports",
        "output/analysis_reports",
        "output/decision_drafts",
        "output/calculations",
        "logs",
        "tests/test_data",
        "utils",
        "templates",
        "config"
    ]
    
    for folder in folders:
        (base / folder).mkdir(parents=True, exist_ok=True)
    
    return base

def create_config_files(base):
    """Konfigürasyon dosyalarını oluşturur"""
    
    # config.json
    config = {
        "application": {
            "name": "Nitelikli Dolandırıcılık Editörü",
            "version": "1.0.0",
            "author": "Türk Yargı Sistemi"
        },
        "interface": {
            "default": "electron",
            "language": "tr",
            "theme": "light",
            "font_size": 14
        }
    }
    
    with open(base / "config.json", 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=4, ensure_ascii=False)
    
    # requirements.txt
    requirements = """# Python bağımlılıkları
python>=3.8
tkinter>=8.6
PyPDF2>=3.0.0
python-docx>=0.8.11
Pillow>=10.0.0
pandas>=2.0.0
numpy>=1.24.0
openpyxl>=3.1.0
nltk>=3.8.0
pdfkit>=1.0.0
"""
    
    with open(base / "requirements.txt", 'w', encoding='utf-8') as f:
        f.write(requirements)
    
    # README.md
    readme = """# Nitelikli Dolandırıcılık Editörü

TCK 158 Nitelikli Dolandırıcılık Suçları Analiz Programı

## Özellikler
- TCK 158 bent analizi
- Dosyadan otomatik veri çıkarma
- Ceza hesaplama
- Karar taslağı oluşturma
- Metin editörü (Unicode, yazı tipi, punto, yazdırma)
- Electron ve Tkinter arayüzleri

## Kurulum
```bash
pip install -r requirements.txt
cd electron_app
npm install