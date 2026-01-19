/**
 * Emsal Karar Arşivi - İş Mantığı
 * Yargıtay kararları ve emsal karar yönetimi
 */

// Mahkeme Türleri
const CourtTypes = {
  YARGITAY_CEZA_DAIRESI: 'Yargıtay Ceza Dairesi',
  YARGITAY_GENEL_KURUL: 'Yargıtay Ceza Genel Kurulu',
  BOLGE_ADLIYE: 'Bölge Adliye Mahkemesi',
  AGIR_CEZA: 'Ağır Ceza Mahkemesi',
  ASLIYE_CEZA: 'Asliye Ceza Mahkemesi',
  SULH_CEZA: 'Sulh Ceza Mahkemesi'
};

// Suç Türleri
const CrimeTypes = {
  YAGMA: 'Yağma Suçları',
  HIRSIZLIK: 'Hırsızlık Suçları',
  DOLANDIRICILIK: 'Dolandırıcılık',
  GUVEN_KOTUYE_KULLANMA: 'Güveni Kötüye Kullanma',
  MALA_ZARAR_VERME: 'Mala Zarar Verme',
  KASTEN_YARALAMA: 'Kasten Yaralama',
  KASTEN_OLDURME: 'Kasten Öldürme',
  UYUSTURUCU: 'Uyuşturucu Suçları',
  BILISIM: 'Bilişim Suçları',
  ZIMMET: 'Zimmet',
  IRTIKAP: 'İrtikap',
  RÜŞVET: 'Rüşvet',
  CINSEL_SUÇLAR: 'Cinsel Dokunulmazlığa Karşı Suçlar',
  TEHDIT: 'Tehdit',
  HAKARET: 'Hakaret',
  OTHER: 'Diğer'
};

// Karar Kategorileri
const DecisionCategories = {
  EMSAL: 'Emsal Karar',
  ILKE: 'İlke Kararı',
  PRENSIP: 'Prensip Kararı',
  GENEL_KURUL: 'Genel Kurul Kararı',
  BIRLESME: 'Birleşme Kararı',
  NORMAL: 'Normal Karar'
};

/**
 * Emsal karar nesnesi oluşturur
 */
function createPrecedentCase(data) {
  return {
    id: data.id || null,
    kararNo: data.kararNo || '',
    kararTarihi: data.kararTarihi || new Date().toISOString().split('T')[0],
    mahkemeAdi: data.mahkemeAdi || '',
    daireNo: data.daireNo || null,
    esasNo: data.esasNo || '',
    kararNumarasi: data.kararNumarasi || '',
    sucTuru: data.sucTuru || '',
    maddeNo: data.maddeNo || '',
    ilgiliKanun: data.ilgiliKanun || 'TCK',
    ozet: data.ozet || '',
    kararMetni: data.kararMetni || '',
    gerekce: data.gerekce || '',
    emsalNiteligindeki: data.emsalNiteligindeki || false,
    yargitayKarari: data.yargitayKarari || false,
    genelKurulKarari: data.genelKurulKarari || false,
    ilkeKarari: data.ilkeKarari || false,
    tags: data.tags || '',
    kategori: data.kategori || DecisionCategories.NORMAL,
    anahtarKelimeler: data.anahtarKelimeler || '',
    ekleyenKisi: data.ekleyenKisi || 'Sistem',
    eklenmeTarihi: data.eklenmeTarihi || new Date().toISOString()
  };
}

/**
 * Emsal karar validasyonu
 */
function validatePrecedentCase(data) {
  const errors = [];
  
  if (!data.kararNo || data.kararNo.trim() === '') {
    errors.push('Karar numarası zorunludur');
  }
  
  if (!data.kararTarihi) {
    errors.push('Karar tarihi zorunludur');
  }
  
  if (!data.mahkemeAdi || data.mahkemeAdi.trim() === '') {
    errors.push('Mahkeme adı zorunludur');
  }
  
  if (!data.sucTuru || data.sucTuru.trim() === '') {
    errors.push('Suç türü zorunludur');
  }
  
  if (!data.ozet || data.ozet.trim().length < 20) {
    errors.push('Özet en az 20 karakter olmalıdır');
  }
  
  if (!data.kararMetni || data.kararMetni.trim().length < 50) {
    errors.push('Karar metni en az 50 karakter olmalıdır');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Karar numarası formatlar (Yargıtay formatı)
 * Örnek: 2023/8745 E., 2024/1234 K.
 */
function formatKararNo(esasYil, esasNo, kararYil, kararNo) {
  return `${esasYil}/${esasNo} E., ${kararYil}/${kararNo} K.`;
}

/**
 * Mahkeme adı formatlar
 */
function formatMahkemeAdi(courtType, daireNo = null) {
  if (courtType === CourtTypes.YARGITAY_CEZA_DAIRESI && daireNo) {
    return `Yargıtay ${daireNo}. Ceza Dairesi`;
  }
  return courtType;
}

/**
 * Arama yapar
 */
function searchPrecedents(cases, criteria) {
  let results = [...cases];
  
  // Anahtar kelime araması
  if (criteria.keyword && criteria.keyword.trim() !== '') {
    const keyword = criteria.keyword.toLowerCase().trim();
    results = results.filter(c => 
      c.kararNo.toLowerCase().includes(keyword) ||
      c.ozet.toLowerCase().includes(keyword) ||
      c.kararMetni.toLowerCase().includes(keyword) ||
      c.anahtarKelimeler.toLowerCase().includes(keyword) ||
      c.gerekce.toLowerCase().includes(keyword)
    );
  }
  
  // Karar numarası ile arama
  if (criteria.kararNo && criteria.kararNo.trim() !== '') {
    const kararNo = criteria.kararNo.trim();
    results = results.filter(c => c.kararNo.includes(kararNo));
  }
  
  // Suç türü filtresi
  if (criteria.crimeType && criteria.crimeType !== 'all') {
    results = results.filter(c => c.sucTuru === criteria.crimeType);
  }
  
  // Mahkeme türü filtresi
  if (criteria.courtType && criteria.courtType !== 'all') {
    results = results.filter(c => c.mahkemeAdi.includes(criteria.courtType));
  }
  
  // Madde numarası filtresi
  if (criteria.articleNumber && criteria.articleNumber.trim() !== '') {
    const article = criteria.articleNumber.trim();
    results = results.filter(c => c.maddeNo.includes(article));
  }
  
  // Tarih aralığı
  if (criteria.dateStart) {
    results = results.filter(c => new Date(c.kararTarihi) >= new Date(criteria.dateStart));
  }
  
  if (criteria.dateEnd) {
    results = results.filter(c => new Date(c.kararTarihi) <= new Date(criteria.dateEnd));
  }
  
  // Sadece Yargıtay kararları
  if (criteria.onlyYargitay) {
    results = results.filter(c => c.yargitayKarari === true);
  }
  
  // Sadece emsal kararlar
  if (criteria.onlyPrecedent) {
    results = results.filter(c => c.emsalNiteligindeki === true);
  }
  
  // Sadece genel kurul kararları
  if (criteria.onlyGenelKurul) {
    results = results.filter(c => c.genelKurulKarari === true);
  }
  
  // Sadece ilke kararları
  if (criteria.onlyPrinciple) {
    results = results.filter(c => c.ilkeKarari === true);
  }
  
  // Sıralama
  if (criteria.sortBy) {
    results.sort((a, b) => {
      if (criteria.sortBy === 'date_desc') {
        return new Date(b.kararTarihi) - new Date(a.kararTarihi);
      } else if (criteria.sortBy === 'date_asc') {
        return new Date(a.kararTarihi) - new Date(b.kararTarihi);
      } else if (criteria.sortBy === 'relevance') {
        // Emsal > İlke > Normal
        const scoreA = (a.ilkeKarari ? 100 : 0) + (a.emsalNiteligindeki ? 50 : 0) + (a.yargitayKarari ? 25 : 0);
        const scoreB = (b.ilkeKarari ? 100 : 0) + (b.emsalNiteligindeki ? 50 : 0) + (b.yargitayKarari ? 25 : 0);
        return scoreB - scoreA;
      }
      return 0;
    });
  }
  
  return results;
}

/**
 * İstatistikler hesaplar
 */
function calculateStatistics(cases) {
  const stats = {
    total: cases.length,
    yargitay: cases.filter(c => c.yargitayKarari === true).length,
    genelKurul: cases.filter(c => c.genelKurulKarari === true).length,
    emsal: cases.filter(c => c.emsalNiteligindeki === true).length,
    ilke: cases.filter(c => c.ilkeKarari === true).length,
    byCrimeType: {},
    byYear: {},
    byDaire: {}
  };
  
  // Suç türüne göre
  cases.forEach(c => {
    if (!stats.byCrimeType[c.sucTuru]) {
      stats.byCrimeType[c.sucTuru] = 0;
    }
    stats.byCrimeType[c.sucTuru]++;
  });
  
  // Yıla göre
  cases.forEach(c => {
    const year = new Date(c.kararTarihi).getFullYear();
    if (!stats.byYear[year]) {
      stats.byYear[year] = 0;
    }
    stats.byYear[year]++;
  });
  
  // Daire numarasına göre (sadece Yargıtay kararları)
  cases.filter(c => c.yargitayKarari && c.daireNo).forEach(c => {
    const daire = `${c.daireNo}. Ceza Dairesi`;
    if (!stats.byDaire[daire]) {
      stats.byDaire[daire] = 0;
    }
    stats.byDaire[daire]++;
  });
  
  return stats;
}

/**
 * Benzer kararlar bulur
 */
function findSimilarCases(targetCase, allCases, limit = 5) {
  const similarities = allCases
    .filter(c => c.id !== targetCase.id)
    .map(c => {
      let score = 0;
      
      // Aynı suç türü: +50
      if (c.sucTuru === targetCase.sucTuru) score += 50;
      
      // Aynı madde: +30
      if (c.maddeNo === targetCase.maddeNo) score += 30;
      
      // Aynı mahkeme türü: +20
      if (c.mahkemeAdi.includes(targetCase.mahkemeAdi)) score += 20;
      
      // Ortak anahtar kelimeler
      const targetKeywords = targetCase.anahtarKelimeler.toLowerCase().split(',');
      const caseKeywords = c.anahtarKelimeler.toLowerCase().split(',');
      const commonKeywords = targetKeywords.filter(k => caseKeywords.includes(k));
      score += commonKeywords.length * 10;
      
      // Yargıtay kararı önceliği
      if (c.yargitayKarari) score += 15;
      if (c.emsalNiteligindeki) score += 10;
      if (c.ilkeKarari) score += 25;
      
      return { case: c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return similarities.map(s => s.case);
}

/**
 * Karar metnini vurgular
 */
function highlightKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return text;
  
  let highlightedText = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
}

/**
 * Karar kategorisini belirler
 */
function determineCategory(caseData) {
  if (caseData.ilkeKarari) return DecisionCategories.ILKE;
  if (caseData.genelKurulKarari) return DecisionCategories.GENEL_KURUL;
  if (caseData.emsalNiteligindeki) return DecisionCategories.EMSAL;
  return DecisionCategories.NORMAL;
}

/**
 * Export fonksiyonları
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CourtTypes,
    CrimeTypes,
    DecisionCategories,
    createPrecedentCase,
    validatePrecedentCase,
    formatKararNo,
    formatMahkemeAdi,
    searchPrecedents,
    calculateStatistics,
    findSimilarCases,
    highlightKeywords,
    determineCategory
  };
}
