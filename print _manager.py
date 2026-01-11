#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Yazdırma Yöneticisi - HTML/PDF dönüşüm ve yazdırma
"""

import os
import tempfile
import subprocess
import platform
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

class PrintManager:
    """Yazdırma işlemlerini yönetir"""
    
    def __init__(self):
        self.system = platform.system()
        self.printers = self._get_available_printers()
    
    def _get_available_printers(self):
        """Mevcut yazıcıları listeler"""
        printers = []
        
        try:
            if self.system == 'Windows':
                import win32print
                printers = [printer[2] for printer in win32print.EnumPrinters(2)]
            elif self.system == 'Darwin':  # macOS
                result = subprocess.run(['lpstat', '-p'], capture_output=True, text=True)
                printers = [line.split()[1] for line in result.stdout.split('\n') if line.startswith('printer')]
            elif self.system == 'Linux':
                result = subprocess.run(['lpstat', '-p'], capture_output=True, text=True)
                printers = [line.split()[1] for line in result.stdout.split('\n') if line.startswith('printer')]
        except:
            printers = ['Varsayılan Yazıcı']
        
        return printers
    
    def html_to_pdf(self, html_content: str, output_path: Optional[str] = None) -> str:
        """HTML içeriğini PDF'e dönüştürür"""
        try:
            if not output_path:
                output_path = tempfile.mktemp(suffix='.pdf')
            
            # HTML başlık ve stil ekle
            full_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Nitelikli Dolandırıcılık Kararı</title>
                <style>
                    @page {{
                        size: A4;
                        margin: 2cm;
                        @top-left {{
                            content: "Nitelikli Dolandırıcılık Editörü";
                            font-size: 10pt;
                        }}
                        @top-right {{
                            content: counter(page) " / " counter(pages);
                            font-size: 10pt;
                        }}
                    }}
                    
                    body {{
                        font-family: 'Times New Roman', serif;
                        font-size: 12pt;
                        line-height: 1.6;
                    }}
                    
                    h1, h2, h3 {{
                        font-family: 'Arial', sans-serif;
                        color: #2c3e50;
                    }}
                    
                    .header {{
                        text-align: center;
                        border-bottom: 2px solid #3498db;
                        padding-bottom: 10px;
                        margin-bottom: 30px;
                    }}
                    
                    .footer {{
                        text-align: center;
                        font-size: 10pt;
                        color: #7f8c8d;
                        margin-top: 50px;
                    }}
                    
                    .signature {{
                        margin-top: 50px;
                        text-align: right;
                    }}
                    
                    table {{
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }}
                    
                    th, td {{
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }}
                    
                    th {{
                        background-color: #f2f2f2;
                    }}
                </style>
            </head>
            <body>
                {html_content}
            </body>
            </html>
            """
            
            # wkhtmltopdf kullanarak HTML'den PDF'e dönüştür
            import pdfkit
            
            options = {
                'page-size': 'A4',
                'margin-top': '2cm',
                'margin-right': '2cm',
                'margin-bottom': '2cm',
                'margin-left': '2cm',
                'encoding': "UTF-8",
                'no-outline': None,
                'enable-local-file-access': None
            }
            
            pdfkit.from_string(full_html, output_path, options=options)
            return output_path
            
        except Exception as e:
            raise Exception(f"PDF dönüşüm hatası: {e}")
    
    def print_document(self, content: str, document_type: str = "karar") -> bool:
        """Belgeyi yazdırır"""
        try:
            # İçeriği HTML'e dönüştür
            html_content = self._format_for_printing(content, document_type)
            
            # Geçici HTML dosyası oluştur
            with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as f:
                f.write(html_content)
                temp_html = f.name
            
            # Yazdırma komutu
            if self.system == 'Windows':
                os.startfile(temp_html, 'print')
                return True
            elif self.system == 'Darwin':  # macOS
                subprocess.run(['lp', temp_html])
                return True
            elif self.system == 'Linux':
                subprocess.run(['lp', temp_html])
                return True
            else:
                # PDF'e dönüştür ve aç
                pdf_path = self.html_to_pdf(html_content)
                os.startfile(pdf_path)
                return True
                
        except Exception as e:
            print(f"Yazdırma hatası: {e}")
            return False
    
    def _format_for_printing(self, content: str, doc_type: str) -> str:
        """Yazdırma için içeriği biçimlendirir"""
        
        header = ""
        if doc_type == "karar":
            header = """
            <div class="header">
                <h1>TÜRKİYE CUMHURİYETİ</h1>
                <h2>... MAHKEMESİ</h2>
                <h3>KARAR</h3>
                <p>Esas No: ... | Karar No: ...</p>
            </div>
            """
        elif doc_type == "iddianame":
            header = """
            <div class="header">
                <h1>CUMHURİYET BAŞSAVCILIĞI</h1>
                <h2>İDDİANAME</h2>
                <p>Esas No: ... | Tarih: ...</p>
            </div>
            """
        
        footer = f"""
        <div class="footer">
            <p>Nitelikli Dolandırıcılık Editörü v1.0 ile oluşturulmuştur</p>
            <p>Oluşturulma Tarihi: {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
        </div>
        """
        
        return f"""
        {header}
        <div class="content">
        {content}
        </div>
        <div class="signature">
            <p>İmza:</p>
            <p>___________________</p>
            <p>Ad Soyad / Unvan</p>
        </div>
        {footer}
        """
    
    def save_as_html(self, content: str, file_path: str) -> bool:
        """HTML olarak kaydeder"""
        try:
            html_content = self._format_for_printing(content, "document")
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            return True
        except Exception as e:
            print(f"HTML kaydetme hatası: {e}")
            return False
    
    def save_as_pdf(self, content: str, file_path: str) -> bool:
        """PDF olarak kaydeder"""
        try:
            html_content = self._format_for_printing(content, "document")
            pdf_path = self.html_to_pdf(html_content, file_path)
            return True
        except Exception as e:
            print(f"PDF kaydetme hatası: {e}")
            return False

# Kullanım örneği
if __name__ == "__main__":
    print_mgr = PrintManager()
    
    test_content = """
    <h2>Test Belgesi</h2>
    <p>Bu bir test belgesidir.</p>
    <table>
        <tr><th>Başlık 1</th><th>Başlık 2</th></tr>
        <tr><td>Değer 1</td><td>Değer 2</td></tr>
    </table>
    """
    
    # Yazdır
    # print_mgr.print_document(test_content, "test")
    
    # PDF olarak kaydet
    print_mgr.save_as_pdf(test_content, "test_belgesi.pdf")
    print("PDF oluşturuldu: test_belgesi.pdf")