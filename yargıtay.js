// Yargıtay kararları için özel PDF raporu oluşturma
async generateYargitayReport(options) {
  try {
    const kararlar = await window.api.mahkemeKararlari.getAll();
    const yargitayKararlari = kararlar.filter(k => k.mahkeme_adı.includes('Yargıtay'));
    
    if (yargitayKararlari.length === 0) {
      return { success: false, message: 'Rapor oluşturulacak Yargıtay kararı bulunamadı.' };
    }
    
    // PDF oluştur
    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    
    const doc = new PDFDocument();
    const filePath = `yargitay_kararlari_rapor_${Date.now()}.pdf`;
    
    doc.pipe(fs.createWriteStream(filePath));
    
    // Başlık
    doc.fontSize(20)
       .text('YARGITAY KARARLARI RAPORU', { align: 'center' })
       .moveDown();
    
    doc.fontSize(12)
       .text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`)
       .text(`Toplam Karar Sayısı: ${yargitayKararlari.length}`)
       .moveDown();
    
    // Her karar için bölüm
    yargitayKararlari.forEach((karar, index) => {
      doc.addPage()
         .fontSize(16)
         .text(`${index + 1}. ${karar.karar_no}`, { underline: true })
         .moveDown();
      
      doc.fontSize(12)
         .text(`Karar Tarihi: ${this.formatDate(karar.karar_tarihi)}`)
         .text(`Mahkeme: ${karar.mahkeme_adı}`)
         .text(`Suç Türü: ${karar.suç_türü}`)
         .text(`Madde No: ${karar.madde_no || '-'}`)
         .moveDown();
      
      doc.fontSize(12)
         .text('ÖZET:', { underline: true })
         .moveDown(0.5)
         .text(karar.özet, { width: 500 })
         .moveDown();
      
      doc.fontSize(12)
         .text('KARAR METNİ:', { underline: true })
         .moveDown(0.5)
         .text(karar.karar_metni.substring(0, 1000) + '...', { width: 500 })
         .moveDown();
      
      doc.fontSize(10)
         .text(`Etiketler: ${karar.tags || '-'}`)
         .text(`Emsal Niteliği: ${karar.emsal_niteliği ? 'Evet' : 'Hayır'}`);
      
      // Sayfa sonu çizgisi
      doc.moveTo(50, doc.y + 20)
         .lineTo(550, doc.y + 20)
         .stroke();
    });
    
    doc.end();
    
    return { 
      success: true, 
      message: 'Yargıtay kararları raporu oluşturuldu.', 
      filePath 
    };
    
  } catch (error) {
    console.error('Yargıtay raporu oluşturulurken hata:', error);
    return { success: false, message: 'Rapor oluşturulurken hata oluştu.' };
  }
}