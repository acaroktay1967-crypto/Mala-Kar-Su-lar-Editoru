/**
 * Hukuki Görüş Notları Sistemi
 * 
 * AI Olay Analizi modülü ile entegre çalışan hukuki görüş notları yönetim sistemi.
 * Avukatların AI analizi sonuçlarına kendi görüşlerini eklemelerini sağlar.
 * 
 * @module LegalOpinionNotes
 * @requires database.js
 * @author CryptoMala Legal AI System
 * @version 1.0.0
 */

/**
 * Not Kategorileri
 */
const NoteCategory = {
  STRATEGY: 'strateji',          // Savunma/dava stratejisi
  RISK_ASSESSMENT: 'risk',       // Risk değerlendirmesi
  PRECEDENT: 'emsal',            // Emsal karar yorumu
  EVIDENCE: 'delil',             // Delil değerlendirmesi
  LEGAL_BASIS: 'hukuki_dayanak', // Yasal dayanak
  GENERAL: 'genel'               // Genel not
};

/**
 * Not Öncelik Seviyeleri
 */
const NotePriority = {
  LOW: 'düşük',
  MEDIUM: 'orta',
  HIGH: 'yüksek',
  CRITICAL: 'kritik'
};

/**
 * Hukuki Görüş Notları Yöneticisi
 */
class LegalOpinionManager {
  constructor() {
    this.notes = [];
  }

  /**
   * Yeni hukuki görüş notu oluştur
   * 
   * @param {Object} noteData - Not verileri
   * @param {string} noteData.caseId - Vaka ID (opsiyonel)
   * @param {string} noteData.aiAnalysisId - AI analiz ID (opsiyonel)
   * @param {string} noteData.title - Not başlığı
   * @param {string} noteData.content - Not içeriği
   * @param {string} noteData.category - Not kategorisi
   * @param {string} noteData.priority - Öncelik seviyesi
   * @param {string} noteData.author - Yazar adı
   * @param {Array} noteData.tags - Etiketler
   * @returns {Object} Oluşturulan not
   */
  createNote(noteData) {
    const note = {
      id: this.generateNoteId(),
      caseId: noteData.caseId || null,
      aiAnalysisId: noteData.aiAnalysisId || null,
      title: noteData.title,
      content: noteData.content,
      category: noteData.category || NoteCategory.GENERAL,
      priority: noteData.priority || NotePriority.MEDIUM,
      author: noteData.author,
      tags: noteData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: [],
      relatedNotes: [],
      metadata: {
        wordCount: this.countWords(noteData.content),
        readingTime: this.calculateReadingTime(noteData.content)
      }
    };

    return note;
  }

  /**
   * AI Analizi ile Karşılaştırma
   * 
   * @param {Object} humanOpinion - İnsan görüşü
   * @param {Object} aiAnalysis - AI analizi
   * @returns {Object} Karşılaştırma raporu
   */
  compareWithAI(humanOpinion, aiAnalysis) {
    const comparison = {
      timestamp: new Date().toISOString(),
      humanOpinion: {
        title: humanOpinion.title,
        summary: this.extractSummary(humanOpinion.content),
        keyPoints: this.extractKeyPoints(humanOpinion.content)
      },
      aiAnalysis: {
        crime: aiAnalysis.crime,
        sentenceRange: aiAnalysis.sentenceRange,
        recommendations: aiAnalysis.recommendations
      },
      differences: [],
      similarities: [],
      recommendations: []
    };

    // Benzerlik ve farklılık analizi
    comparison.similarities = this.findSimilarities(humanOpinion, aiAnalysis);
    comparison.differences = this.findDifferences(humanOpinion, aiAnalysis);
    
    // Öneriler
    if (comparison.differences.length > 0) {
      comparison.recommendations.push(
        'AI ve insan görüşleri arasında farklılıklar tespit edildi. Detaylı inceleme önerilir.'
      );
    }

    return comparison;
  }

  /**
   * Not şablonları
   */
  getTemplates() {
    return {
      strategy: {
        name: 'Savunma Stratejisi',
        template: `# SAVUNMA STRATEJİSİ

## 1. Durum Değerlendirmesi
[Mevcut durum analizi]

## 2. Önerilen Strateji
[Ana savunma stratejisi]

## 3. Alternatif Yaklaşımlar
[Diğer seçenekler]

## 4. Riskler
[Potansiyel riskler]

## 5. Aksiyon Planı
[Somut adımlar]`
      },
      
      riskAssessment: {
        name: 'Risk Değerlendirmesi',
        template: `# RİSK DEĞERLENDİRMESİ

## Mahkumiyet Riski
- **Olasılık:** [Yüksek/Orta/Düşük]
- **Sebep:** [Açıklama]

## Delil Durumu
- **Güçlü Yönler:** [Liste]
- **Zayıf Yönler:** [Liste]

## Öneriler
[Risk azaltma önerileri]`
      },
      
      precedentAnalysis: {
        name: 'Emsal Karar İncelemesi',
        template: `# EMSAL KARAR İNCELEMESİ

## Karar Bilgileri
- **Karar No:** [Yargıtay ... CD, ... E., ... K.]
- **Tarih:** [Tarih]

## Benzerlikler
[Mevcut vaka ile benzerlikler]

## Farklılıklar
[Önemli farklılıklar]

## Uygulama Önerisi
[Bu karara dayanarak yapılabilecekler]`
      },
      
      evidenceEvaluation: {
        name: 'Delil Değerlendirmesi',
        template: `# DELİL DEĞERLENDİRMESİ

## Mevcut Deliller
1. [Delil 1]
2. [Delil 2]

## Delil Gücü Analizi
- **Güçlü:** [Liste]
- **Zayıf:** [Liste]
- **Tartışmalı:** [Liste]

## Eksik Deliller
[Toplanması gereken deliller]

## Öneriler
[Delil stratejisi]`
      }
    };
  }

  /**
   * Not arama
   * 
   * @param {Object} criteria - Arama kriterleri
   * @returns {Array} Bulunan notlar
   */
  searchNotes(criteria) {
    let results = [...this.notes];

    if (criteria.keyword) {
      const keyword = criteria.keyword.toLowerCase();
      results = results.filter(note =>
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword) ||
        note.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    if (criteria.category) {
      results = results.filter(note => note.category === criteria.category);
    }

    if (criteria.priority) {
      results = results.filter(note => note.priority === criteria.priority);
    }

    if (criteria.author) {
      results = results.filter(note => note.author === criteria.author);
    }

    if (criteria.dateFrom) {
      results = results.filter(note => 
        new Date(note.createdAt) >= new Date(criteria.dateFrom)
      );
    }

    if (criteria.dateTo) {
      results = results.filter(note => 
        new Date(note.createdAt) <= new Date(criteria.dateTo)
      );
    }

    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter(note =>
        criteria.tags.some(tag => note.tags.includes(tag))
      );
    }

    // Sıralama
    const sortBy = criteria.sortBy || 'createdAt';
    const sortOrder = criteria.sortOrder || 'desc';
    
    results.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return results;
  }

  /**
   * AI analizi ile ilişkilendir
   * 
   * @param {string} noteId - Not ID
   * @param {string} aiAnalysisId - AI analiz ID
   */
  linkToAIAnalysis(noteId, aiAnalysisId) {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.aiAnalysisId = aiAnalysisId;
      note.updatedAt = new Date().toISOString();
    }
  }

  /**
   * İstatistikler
   * 
   * @returns {Object} İstatistik verileri
   */
  getStatistics() {
    const stats = {
      totalNotes: this.notes.length,
      byCategory: {},
      byPriority: {},
      byAuthor: {},
      recentNotes: [],
      mostUsedTags: []
    };

    // Kategoriye göre
    Object.values(NoteCategory).forEach(cat => {
      stats.byCategory[cat] = this.notes.filter(n => n.category === cat).length;
    });

    // Önceliğe göre
    Object.values(NotePriority).forEach(pri => {
      stats.byPriority[pri] = this.notes.filter(n => n.priority === pri).length;
    });

    // Yazara göre
    const authors = [...new Set(this.notes.map(n => n.author))];
    authors.forEach(author => {
      stats.byAuthor[author] = this.notes.filter(n => n.author === author).length;
    });

    // Son 10 not
    stats.recentNotes = this.notes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(n => ({
        id: n.id,
        title: n.title,
        category: n.category,
        createdAt: n.createdAt
      }));

    // En çok kullanılan etiketler
    const tagCount = {};
    this.notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    stats.mostUsedTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    return stats;
  }

  // Helper metodlar
  generateNoteId() {
    return `NOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  countWords(text) {
    return text.trim().split(/\s+/).length;
  }

  calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = this.countWords(text);
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} dakika`;
  }

  extractSummary(text, maxLength = 200) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  extractKeyPoints(text) {
    // Basit key point çıkarma (markdown başlıklar veya numaralı listeler)
    const lines = text.split('\n');
    const keyPoints = [];
    
    lines.forEach(line => {
      if (line.match(/^#+\s/) || line.match(/^\d+\.\s/) || line.match(/^[-*]\s/)) {
        keyPoints.push(line.replace(/^[#\d\-*.\s]+/, '').trim());
      }
    });
    
    return keyPoints.slice(0, 5); // En fazla 5 key point
  }

  findSimilarities(humanOpinion, aiAnalysis) {
    const similarities = [];
    
    // Basit keyword matching
    const humanKeywords = this.extractKeywords(humanOpinion.content);
    const aiKeywords = aiAnalysis.keywords || [];
    
    const commonKeywords = humanKeywords.filter(k => 
      aiKeywords.some(ak => ak.toLowerCase() === k.toLowerCase())
    );
    
    if (commonKeywords.length > 0) {
      similarities.push({
        type: 'keywords',
        description: `Ortak anahtar kelimeler: ${commonKeywords.join(', ')}`
      });
    }
    
    return similarities;
  }

  findDifferences(humanOpinion, aiAnalysis) {
    const differences = [];
    
    // Kategori farklılıkları
    if (humanOpinion.category !== aiAnalysis.category) {
      differences.push({
        type: 'category',
        human: humanOpinion.category,
        ai: aiAnalysis.category,
        description: 'Farklı kategori değerlendirmesi'
      });
    }
    
    return differences;
  }

  extractKeywords(text) {
    // Basit keyword extraction (Türkçe stopwords hariç)
    const stopwords = ['ve', 'veya', 'ile', 'için', 'bir', 'bu', 'şu', 'o'];
    const words = text.toLowerCase()
      .replace(/[^\wğüşıöçİĞÜŞÖÇ\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopwords.includes(w));
    
    // Frekans analizi
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Notu güncelle
   */
  updateNote(noteId, updates) {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      Object.assign(note, updates);
      note.updatedAt = new Date().toISOString();
      
      if (updates.content) {
        note.metadata.wordCount = this.countWords(updates.content);
        note.metadata.readingTime = this.calculateReadingTime(updates.content);
      }
      
      return note;
    }
    return null;
  }

  /**
   * Notu sil
   */
  deleteNote(noteId) {
    const index = this.notes.findIndex(n => n.id === noteId);
    if (index !== -1) {
      this.notes.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Export notlar
   */
  exportNotes(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.notes, null, 2);
    } else if (format === 'markdown') {
      let markdown = '# Hukuki Görüş Notları\n\n';
      
      this.notes.forEach(note => {
        markdown += `## ${note.title}\n\n`;
        markdown += `- **Kategori:** ${note.category}\n`;
        markdown += `- **Öncelik:** ${note.priority}\n`;
        markdown += `- **Yazar:** ${note.author}\n`;
        markdown += `- **Tarih:** ${new Date(note.createdAt).toLocaleDateString('tr-TR')}\n`;
        markdown += `- **Etiketler:** ${note.tags.join(', ')}\n\n`;
        markdown += `${note.content}\n\n`;
        markdown += '---\n\n';
      });
      
      return markdown;
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LegalOpinionManager,
    NoteCategory,
    NotePriority
  };
}
