/**
 * Mahkeme Kararı Şablonları - İş Mantığı
 * 
 * Farklı mahkeme kararı türleri için şablonlar ve otomatik doldurma fonksiyonları
 * 
 * @author CryptoMala
 * @version 1.0.0
 */

// Şablon türleri
const TemplateTypes = {
  CONVICTION: 'mahkumiyet', // Mahkumiyet kararı
  ACQUITTAL: 'beraat', // Beraat kararı
  NON_PROSECUTION: 'takipsizlik', // Kovuşturmaya yer olmadığına dair karar
  DEFERMENT: 'hagb', // Hükmün açıklanmasının geri bırakılması
  SUSPENSION: 'tecil', // Hükmün ertelenmesi
  CONVERSION: 'secenek_yaptırım', // Seçenek yaptırıma çevirme
  INTERIM: 'ara_karar', // Ara karar
  REJECTION: 'red', // Red kararı
  PROTECTION_ORDER: 'koruma_karari', // Koruma kararı
  SEARCH_WARRANT: 'arama_karari', // Arama kararı
  DETENTION: 'tutuklama_karari', // Tutuklama kararı
  RELEASE: 'tahliye_karari', // Tahliye kararı
  SEIZURE: 'el_koyma', // El koyma kararı
  CONFISCATION: 'müsadere' // Müsadere kararı
};

// Mahkeme türleri
const CourtTypes = {
  PEACE: 'sulh_ceza', // Sulh Ceza Hakimliği
  MAGISTRATE: 'asliye_ceza', // Asliye Ceza Mahkemesi
  SERIOUS: 'agir_ceza', // Ağır Ceza Mahkemesi
  REGIONAL: 'bölge_adliye', // Bölge Adliye Mahkemesi
  SUPREME: 'yargıtay', // Yargıtay
  JUVENILE: 'cocuk_mahkemesi', // Çocuk Mahkemesi
  PROSECUTOR: 'cumhuriyet_savcilik' // Cumhuriyet Savcılığı
};

// Karar gerekçeleri şablonları
const StandardReasons = {
  // Mahkumiyet gerekçeleri
  CONVICTION_PROVEN: 'Sanığın suçu işlediği, toplanan delillerle sabit olmuştur.',
  CONVICTION_CONFESSION: 'Sanığın ikrar ve kabul içerikli savunması ile suçu işlediği anlaşılmıştır.',
  CONVICTION_WITNESS: 'Tanık beyanları ve diğer delillerle sanığın suçu işlediği kesinlik kazanmıştır.',
  CONVICTION_EVIDENCE: 'Olay yeri inceleme tutanağı, bilirkişi raporu ve diğer deliller sanığın suçluluğunu ortaya koymaktadır.',
  
  // Beraat gerekçeleri
  ACQUITTAL_NO_EVIDENCE: 'Sanığın atılı suçu işlediğine dair yeterli ve kesin delil bulunamamıştır.',
  ACQUITTAL_NO_CRIME: 'Sanığın eyleminin suç oluşturmadığı anlaşılmıştır.',
  ACQUITTAL_ELEMENTS: 'Suçun unsurları oluşmamıştır.',
  ACQUITTAL_DOUBT: 'Şüpheden sanık yararlanır ilkesi gereği beraat kararı verilmiştir.',
  
  // Takipsizlik gerekçeleri
  NO_PROSECUTION_EVIDENCE: 'Mevcut deliller suç şüphesini uyandırmakta yetersiz kalmaktadır.',
  NO_PROSECUTION_COMPLAINT: 'Şikayetten vazgeçilmesi nedeniyle kovuşturma şartı ortadan kalkmıştır.',
  NO_PROSECUTION_TIME: 'Dava zamanaşımı süresi dolmuştur.',
  NO_PROSECUTION_LAW: 'Eylemin hukuka uygun olduğu anlaşılmıştır.'
};

/**
 * Mahkeme kararı şablonu oluşturur
 * @param {string} templateType - Şablon türü
 * @param {Object} data - Karar verileri
 * @returns {Object} Doldurulmuş şablon
 */
function generateDecisionTemplate(templateType, data = {}) {
  const templates = {
    [TemplateTypes.CONVICTION]: generateConvictionTemplate(data),
    [TemplateTypes.ACQUITTAL]: generateAcquittalTemplate(data),
    [TemplateTypes.NON_PROSECUTION]: generateNonProsecutionTemplate(data),
    [TemplateTypes.DEFERMENT]: generateDefermentTemplate(data),
    [TemplateTypes.SUSPENSION]: generateSuspensionTemplate(data),
    [TemplateTypes.CONVERSION]: generateConversionTemplate(data),
    [TemplateTypes.INTERIM]: generateInterimTemplate(data),
    [TemplateTypes.REJECTION]: generateRejectionTemplate(data),
    [TemplateTypes.PROTECTION_ORDER]: generateProtectionOrderTemplate(data),
    [TemplateTypes.SEARCH_WARRANT]: generateSearchWarrantTemplate(data),
    [TemplateTypes.DETENTION]: generateDetentionTemplate(data),
    [TemplateTypes.RELEASE]: generateReleaseTemplate(data),
    [TemplateTypes.SEIZURE]: generateSeizureTemplate(data),
    [TemplateTypes.CONFISCATION]: generateConfiscationTemplate(data)
  };
  
  return templates[templateType] || { error: 'Geçersiz şablon türü' };
}

/**
 * Mahkumiyet kararı şablonu
 */
function generateConvictionTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    defendantName = '[SANIK ADI SOYADI]',
    defendantTC = '[TC KİMLİK NO]',
    crimeType = '[SUÇ TÜRÜ]',
    crimeArticle = '[MADDE]',
    sentence = '[CEZA SÜRESİ]',
    reason = StandardReasons.CONVICTION_PROVEN,
    victimName = '[MAĞDUR ADI]',
    crimeDate = '[SUÇ TARİHİ]',
    crimeLocation = '[SUÇ YERİ]'
  } = data;
  
  return {
    title: 'MAHKUMİYET KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    parties: {
      defendant: {
        name: defendantName,
        tcNo: defendantTC,
        status: 'Sanık'
      },
      victim: {
        name: victimName,
        status: 'Mağdur/Suç Mağduru'
      }
    },
    case: {
      crime: crimeType,
      article: crimeArticle,
      date: crimeDate,
      location: crimeLocation
    },
    decision: {
      type: 'Mahkumiyet',
      sentence: sentence,
      article: crimeArticle
    },
    reasoning: {
      facts: `${defendantName}, ${crimeDate} tarihinde ${crimeLocation} adresinde, ${crimeType} suçunu işlemiştir.`,
      evidence: 'Dosya kapsamında toplanan deliller değerlendirilmiş, sanığın suçu işlediği sabit görülmüştür.',
      conclusion: reason,
      legalBasis: `${crimeArticle} maddesi uyarınca ${sentence} cezası ile cezalandırılmasına`
    },
    verdict: `${sentence} HAPİS CEZASI İLE CEZALANDIRILMASINA`,
    footer: {
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      appealInfo: 'Bu karara karşı tebliğ tarihinden itibaren 15 gün içinde Bölge Adliye Mahkemesine istinaf yoluna başvurulabilir.'
    }
  };
}

/**
 * Beraat kararı şablonu
 */
function generateAcquittalTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    defendantName = '[SANIK ADI SOYADI]',
    defendantTC = '[TC KİMLİK NO]',
    crimeType = '[SUÇ TÜRÜ]',
    crimeArticle = '[MADDE]',
    reason = StandardReasons.ACQUITTAL_NO_EVIDENCE
  } = data;
  
  return {
    title: 'BERAAT KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    parties: {
      defendant: {
        name: defendantName,
        tcNo: defendantTC,
        status: 'Sanık'
      }
    },
    case: {
      crime: crimeType,
      article: crimeArticle
    },
    decision: {
      type: 'Beraat',
      article: 'CMK 223/2-e'
    },
    reasoning: {
      facts: `Sanık ${defendantName} hakkında ${crimeType} suçundan açılan kamu davasının yapılan yargılaması sonucunda;`,
      evidence: 'Dosya kapsamında toplanan deliller değerlendirilmiş,',
      conclusion: reason,
      legalBasis: 'CMK 223/2-e maddesi uyarınca sanığın beraatine'
    },
    verdict: 'BERAAT ETMESİNE',
    footer: {
      additionalDecisions: [
        'Sanık hakkında uygulanan güvenlik tedbirinin kaldırılmasına',
        'Varsa hak yoksunluklarının giderilmesine'
      ],
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      appealInfo: 'Bu karara karşı tebliğ tarihinden itibaren 15 gün içinde Bölge Adliye Mahkemesine istinaf yoluna başvurulabilir.'
    }
  };
}

/**
 * Kovuşturmaya yer olmadığına dair karar şablonu
 */
function generateNonProsecutionTemplate(data) {
  const {
    prosecutorOffice = '[CUMHURİYET SAVCILIK ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    suspectName = '[ŞÜPHELİ ADI SOYADI]',
    suspectTC = '[TC KİMLİK NO]',
    crimeType = '[SUÇ TÜRÜ]',
    crimeArticle = '[MADDE]',
    reason = StandardReasons.NO_PROSECUTION_EVIDENCE
  } = data;
  
  return {
    title: 'KOVUŞTURMAYA YER OLMADIĞINA DAİR KARAR',
    header: {
      office: prosecutorOffice,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    suspect: {
      name: suspectName,
      tcNo: suspectTC,
      status: 'Şüpheli'
    },
    case: {
      crime: crimeType,
      article: crimeArticle
    },
    decision: {
      type: 'Kovuşturmaya Yer Olmadığına Dair',
      legalBasis: 'CMK 172/1'
    },
    reasoning: {
      investigation: 'Yapılan soruşturma sonucunda;',
      evidence: 'Dosya kapsamında toplanan deliller değerlendirilmiş,',
      conclusion: reason,
      legalDecision: 'CMK 172/1 maddesi uyarınca kovuşturmaya yer olmadığına karar verilmesi gerektiği mütalaa edilmiştir.'
    },
    verdict: 'KOVUŞTURMAYA YER OLMADIĞINA',
    footer: {
      prosecutor: '[CUMHURİYET SAVCI ADI VE İMZASI]',
      objectionInfo: 'Bu karara karşı tebliğ tarihinden itibaren 15 gün içinde yetkili Sulh Ceza Hakimliğine itiraz edilebilir.'
    }
  };
}

/**
 * HAGB (Hükmün Açıklanmasının Geri Bırakılması) kararı şablonu
 */
function generateDefermentTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    defendantName = '[SANIK ADI SOYADI]',
    defendantTC = '[TC KİMLİK NO]',
    crimeType = '[SUÇ TÜRÜ]',
    crimeArticle = '[MADDE]',
    sentence = '[CEZA SÜRESİ]',
    supervisionPeriod = '5', // Denetim süresi (yıl)
    conditions = ['Bir meslek veya sanat sahibi değilse, bir meslek veya sanat edinmesi']
  } = data;
  
  return {
    title: 'HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASI KARARI (HAGB)',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    parties: {
      defendant: {
        name: defendantName,
        tcNo: defendantTC,
        status: 'Sanık'
      }
    },
    case: {
      crime: crimeType,
      article: crimeArticle,
      sentenceDetermined: sentence
    },
    decision: {
      type: 'Hükmün Açıklanmasının Geri Bırakılması',
      legalBasis: 'CMK 231',
      supervisionPeriod: supervisionPeriod + ' YIL',
      conditions: conditions
    },
    reasoning: {
      findings: `Sanık ${defendantName} hakkında ${crimeType} suçundan yapılan yargılama sonucunda suçun sabit olduğu,`,
      eligibility: `TCK ${crimeArticle} maddesi uyarınca ${sentence} hapis cezası ile cezalandırılması gerektiği,`,
      considerations: [
        'Sanığın daha önce kasıtlı bir suçtan mahkum olmadığı',
        'Yargılama sürecinde gösterdiği pişmanlık',
        'Kısa süreli hapis cezasına mahkum olduğu',
        'Sanığın bir daha suç işlemeyeceği konusunda kanaate varıldığı'
      ],
      conclusion: `CMK 231. maddesi şartları oluştuğundan, hükmün açıklanmasının ${supervisionPeriod} yıl süre ile geri bırakılmasına karar verilmiştir.`
    },
    supervisionConditions: {
      period: supervisionPeriod + ' yıl',
      conditions: conditions,
      warning: 'Denetim süresi içinde kasıtlı bir suç işlememesi ve yüklenen yükümlülükleri yerine getirmesi halinde, dava düşecektir.'
    },
    verdict: `HÜKMÜN AÇIKLANMASININ ${supervisionPeriod} YIL SÜRE İLE GERİ BIRAKILMASINA`,
    footer: {
      additionalDecisions: [
        'Denetim süresinin başlangıç tarihinin kararın kesinleşme tarihi olarak belirlenmesine',
        'Denetim süresince belirlenen yükümlülüklere uyulmasına'
      ],
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      appealInfo: 'Bu karara karşı tebliğ tarihinden itibaren 7 gün içinde itiraz edilebilir.'
    }
  };
}

/**
 * Hükmün ertelenmesi kararı şablonu
 */
function generateSuspensionTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    defendantName = '[SANIK ADI SOYADI]',
    crimeType = '[SUÇ TÜRÜ]',
    sentence = '[CEZA SÜRESİ]',
    suspensionPeriod = '5' // Erteleme süresi (yıl)
  } = data;
  
  return {
    title: 'HÜKMÜN ERTELENMESİ KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    decision: {
      type: 'Hükmün Ertelenmesi',
      legalBasis: 'TCK 51',
      sentence: sentence,
      suspensionPeriod: suspensionPeriod + ' YIL'
    },
    reasoning: {
      sentence: `Sanık ${defendantName} hakkında ${crimeType} suçundan ${sentence} hapis cezasına hükmedilmiştir.`,
      eligibility: 'TCK 51. maddesi erteleme şartları değerlendirilmiş,',
      conditions: [
        'Sanığın daha önce kasıtlı bir suçtan mahkum olmadığı',
        '2 yıl veya daha az süreli hapis cezasına mahkum olduğu',
        'Bir daha suç işlemeyeceği konusunda kuvvetli kanaate varıldığı'
      ],
      conclusion: `TCK 51. maddesi uyarınca hükmün ertelenmesine karar verilmiştir.`
    },
    verdict: `HÜKMÜN ${suspensionPeriod} YIL SÜRE İLE ERTELENMESİNE`,
    footer: {
      warning: `Erteleme süresi olan ${suspensionPeriod} yıl içinde kasıtlı bir suç işlememesi halinde, ceza düşecektir.`,
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      appealInfo: 'Bu karara karşı tebliğ tarihinden itibaren 15 gün içinde Bölge Adliye Mahkemesine istinaf yoluna başvurulabilir.'
    }
  };
}

/**
 * Tutuklama kararı şablonu
 */
function generateDetentionTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    suspectName = '[ŞÜPHELİ ADI SOYADI]',
    suspectTC = '[TC KİMLİK NO]',
    crimeType = '[SUÇ TÜRÜ]',
    crimeArticle = '[MADDE]',
    detentionReasons = ['Kaçma şüphesi', 'Delilleri karartma şüphesi']
  } = data;
  
  return {
    title: 'TUTUKLAMA KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    suspect: {
      name: suspectName,
      tcNo: suspectTC,
      status: 'Şüpheli'
    },
    case: {
      crime: crimeType,
      article: crimeArticle
    },
    decision: {
      type: 'Tutuklama',
      legalBasis: 'CMK 100, 101, 102'
    },
    reasoning: {
      investigation: `Şüpheli ${suspectName} hakkında ${crimeType} suçundan yürütülen soruşturma kapsamında;`,
      strongSuspicion: 'Şüphelinin suçu işlediğine dair kuvvetli şüphe bulunmaktadır.',
      detentionReasons: detentionReasons,
      proportionality: 'Tutuklama tedbirinin ölçülü olduğu ve başka bir güvenlik tedbirinin yetersiz kalacağı değerlendirilmiştir.',
      conclusion: 'CMK 100 ve devamı maddeleri uyarınca şüphelinin tutuklanmasına karar verilmiştir.'
    },
    verdict: 'TUTUKLANMASINA',
    footer: {
      duration: 'Tutuklama süresi: Soruşturma aşamasında azami 1 yıl',
      reviewDate: '[İNCELEME TARİHİ] tarihinde yeniden değerlendirilecektir',
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      objectionInfo: 'Bu karara karşı tebliğ tarihinden itibaren 7 gün içinde itiraz edilebilir.'
    }
  };
}

/**
 * Tahliye kararı şablonu
 */
function generateReleaseTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    detaineeName = '[TUTUKLU ADI SOYADI]',
    detaineeTC = '[TC KİMLİK NO]',
    crimeType = '[SUÇ TÜRÜ]',
    releaseReason = 'Tutuklama nedenlerinin ortadan kalktığı'
  } = data;
  
  return {
    title: 'TAHLİYE KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    detainee: {
      name: detaineeName,
      tcNo: detaineeTC,
      status: 'Tutuklu'
    },
    case: {
      crime: crimeType
    },
    decision: {
      type: 'Tahliye',
      legalBasis: 'CMK 109'
    },
    reasoning: {
      detention: `${detaineeName} hakkında ${crimeType} suçundan açılan kamu davasında tutuklu bulunmaktadır.`,
      evaluation: 'Tutuklama nedenleri ve koşulları yeniden değerlendirilmiştir.',
      reason: releaseReason,
      conclusion: 'CMK 109. maddesi uyarınca tahliyesine karar verilmiştir.'
    },
    verdict: 'TAHLİYESİNE',
    footer: {
      conditions: [
        'Adli kontrol şartlarına uyması',
        'Yurtdışına çıkmaması',
        'Mahkeme çağrılarına uyması'
      ],
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      objectionInfo: 'Bu karara karşı tebliğ tarihinden itibaren 7 gün içinde itiraz edilebilir.'
    }
  };
}

/**
 * Ara karar şablonu (genel)
 */
function generateInterimTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    subject = '[KARAR KONUSU]',
    decision = '[KARAR METNİ]'
  } = data;
  
  return {
    title: 'ARA KARAR',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    subject: subject,
    decision: decision,
    verdict: decision.toUpperCase(),
    footer: {
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]'
    }
  };
}

/**
 * Red kararı şablonu
 */
function generateRejectionTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    applicant = '[BAŞVURAN]',
    requestType = '[TALEP TÜRÜ]',
    rejectionReason = '[RED GEREKÇESİ]'
  } = data;
  
  return {
    title: 'RED KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    request: {
      applicant: applicant,
      type: requestType
    },
    decision: {
      type: 'Red',
      reason: rejectionReason
    },
    reasoning: {
      request: `${applicant} tarafından yapılan ${requestType} talebi incelenmiştir.`,
      evaluation: 'Dosya kapsamı, deliller ve yasal düzenlemeler değerlendirilmiştir.',
      conclusion: rejectionReason,
      legalDecision: 'Talebin reddine karar verilmiştir.'
    },
    verdict: 'TALEBİN REDDİNE',
    footer: {
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      objectionInfo: 'Bu karara karşı tebliğ tarihinden itibaren 7 gün içinde itiraz edilebilir.'
    }
  };
}

/**
 * Koruma kararı şablonu
 */
function generateProtectionOrderTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    protectedPerson = '[KORUNAN KİŞİ]',
    perpetrator = '[ŞİDDET UYGULAYAN]',
    protectionMeasures = ['Korunan kişiye yaklaşmama', 'Korunan kişinin işyerine veya okula yaklaşmama'],
    duration = '6 AY'
  } = data;
  
  return {
    title: 'KORUMA KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    parties: {
      protected: protectedPerson,
      perpetrator: perpetrator
    },
    decision: {
      type: 'Koruma Kararı',
      legalBasis: '6284 Sayılı Kanun',
      duration: duration,
      measures: protectionMeasures
    },
    reasoning: {
      application: `${protectedPerson} tarafından yapılan başvuru ve sunulan deliller değerlendirilmiştir.`,
      danger: 'Başvurucunun fiziksel, psikolojik veya ekonomik şiddete maruz kalma tehlikesi bulunmaktadır.',
      necessity: '6284 sayılı Ailenin Korunması ve Kadına Karşı Şiddetin Önlenmesine Dair Kanun kapsamında koruma tedbirleri alınması gerekmektedir.',
      conclusion: 'Koruma kararı verilmesine karar verilmiştir.'
    },
    protectionMeasures: {
      measures: protectionMeasures,
      duration: duration,
      warning: 'Bu karara uymamanın yaptırımları CMK ve ilgili kanunlar uyarınca uygulanacaktır.'
    },
    verdict: `${duration} SÜRELİ KORUMA KARARININ VERİLMESİNE`,
    footer: {
      enforcement: 'Kararın derhal uygulanmasına',
      monitoring: 'Kolluk kuvvetlerince uygulamanın izlenmesine',
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      objectionInfo: 'Bu karara karşı tebliğ tarihinden itibaren 7 gün içinde itiraz edilebilir.'
    }
  };
}

/**
 * Arama kararı şablonu
 */
function generateSearchWarrantTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    suspectName = '[ŞÜPHELİ ADI SOYADI]',
    searchLocation = '[ARAMA YERİ ADRESİ]',
    crimeType = '[SUÇ TÜRÜ]',
    searchReason = '[ARAMA GEREKÇESİ]'
  } = data;
  
  return {
    title: 'ARAMA KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    suspect: {
      name: suspectName,
      searchLocation: searchLocation
    },
    case: {
      crime: crimeType
    },
    decision: {
      type: 'Arama',
      legalBasis: 'CMK 116, 117, 119',
      location: searchLocation
    },
    reasoning: {
      investigation: `${suspectName} hakkında ${crimeType} suçundan yürütülen soruşturma kapsamında;`,
      suspicion: 'Suçla ilgili delillerin arama yapılacak yerde bulunduğuna dair kuvvetli şüphe oluşmuştur.',
      necessity: searchReason,
      conclusion: `CMK 116 ve devamı maddeleri uyarınca ${searchLocation} adresinde arama yapılmasına karar verilmiştir.`
    },
    verdict: `${searchLocation.toUpperCase()} ADRESİNDE ARAMA YAPILMASINA`,
    footer: {
      conditions: [
        'Arama işleminin gece 21:00 ile 06:00 saatleri arasında yapılmaması (acil haller hariç)',
        'Arama tutanağının düzenlenmesi',
        'Bulunan delillerin muhafaza altına alınması'
      ],
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      validity: 'Karar 30 gün süreyle geçerlidir'
    }
  };
}

/**
 * El koyma kararı şablonu
 */
function generateSeizureTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    items = ['[EŞya LİSTESİ]'],
    crimeType = '[SUÇ TÜRÜ]',
    seizureReason = 'Delil niteliğinde olması'
  } = data;
  
  return {
    title: 'EL KOYMA KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    case: {
      crime: crimeType
    },
    decision: {
      type: 'El Koyma',
      legalBasis: 'CMK 123',
      items: items,
      reason: seizureReason
    },
    reasoning: {
      investigation: `${crimeType} suçundan yürütülen soruşturma/kovuşturma kapsamında;`,
      necessity: `Aşağıda belirtilen eşyaların ${seizureReason} nedeniyle el konulması gerekmektedir:`,
      items: items,
      conclusion: 'CMK 123. maddesi uyarınca el konulmasına karar verilmiştir.'
    },
    seizedItems: items,
    verdict: 'BELİRTİLEN EŞYALARA EL KONULMASINA',
    footer: {
      storage: 'El konulan eşyaların emanet deposunda muhafaza edilmesine',
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      objectionInfo: 'Bu karara karşı tebliğ tarihinden itibaren 7 gün içinde itiraz edilebilir.'
    }
  };
}

/**
 * Müsadere kararı şablonu
 */
function generateConfiscationTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    items = ['[MÜSADERE EDİLECEK EŞYA]'],
    confiscationReason = 'Suçun işlenmesinde kullanıldığı'
  } = data;
  
  return {
    title: 'MÜSADERE KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    decision: {
      type: 'Müsadere',
      legalBasis: 'TCK 54',
      items: items,
      reason: confiscationReason
    },
    reasoning: {
      items: `Aşağıda belirtilen eşyaların ${confiscationReason} anlaşılmıştır:`,
      itemList: items,
      legal: 'TCK 54. maddesi uyarınca müsaderesine',
      conclusion: 'Müsadere kararı verilmesine karar verilmiştir.'
    },
    confiscatedItems: items,
    verdict: 'BELİRTİLEN EŞYALARIN MÜSADERESİNE',
    footer: {
      disposal: 'Müsadere edilen eşyaların ilgili mevzuat uyarınca tasfiye edilmesine',
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      appealInfo: 'Bu karara karşı tebliğ tarihinden itibaren 15 gün içinde Bölge Adliye Mahkemesine istinaf yoluna başvurulabilir.'
    }
  };
}

/**
 * Seçenek yaptırıma çevirme kararı şablonu
 */
function generateConversionTemplate(data) {
  const {
    courtName = '[MAHKEME ADI]',
    fileNumber = '[DOSYA NO]',
    decisionNumber = '[KARAR NO]',
    decisionDate = new Date().toLocaleDateString('tr-TR'),
    defendantName = '[HÜKÜMLÜ ADI SOYADI]',
    originalSentence = '[CEZA SÜRESİ]',
    alternativeSanction = 'Adli Para Cezası',
    amount = '[TUTAR]'
  } = data;
  
  return {
    title: 'SEÇENEKLİ YAPTIRIM KARARI',
    header: {
      court: courtName,
      fileNumber: fileNumber,
      decisionNumber: decisionNumber,
      decisionDate: decisionDate
    },
    defendant: {
      name: defendantName
    },
    decision: {
      type: 'Seçenek Yaptırıma Çevirme',
      legalBasis: 'TCK 50',
      originalSentence: originalSentence,
      alternativeSanction: alternativeSanction,
      amount: amount
    },
    reasoning: {
      sentence: `${defendantName} hakkında verilen ${originalSentence} hapis cezasının seçenek yaptırıma çevrilmesi talep edilmiştir.`,
      eligibility: 'TCK 50. maddesi koşulları değerlendirilmiş,',
      conditions: [
        '1 yıl veya daha az süreli hapis cezasına mahkum olduğu',
        'Seçenek yaptırım uygulamasına uygun olduğu'
      ],
      conclusion: `TCK 50. maddesi uyarınca ${alternativeSanction} olarak çevrilmesine karar verilmiştir.`
    },
    alternativeSanctionDetails: {
      type: alternativeSanction,
      amount: amount,
      paymentTerms: 'Bir defada veya taksitler halinde ödenebilir'
    },
    verdict: `${alternativeSanction.toUpperCase()} OLARAK ÇEVRİLMESİNE`,
    footer: {
      paymentInfo: 'Adli para cezasının ödenme şekli ve süresi belirlenmiştir',
      judgeSignature: '[HAKİM ADI VE İMZASI]',
      clerkSignature: '[YAZICI ADI VE İMZASI]',
      appealInfo: 'Bu karara karşı tebliğ tarihinden itibaren 7 gün içinde itiraz edilebilir.'
    }
  };
}

/**
 * Şablonu Word/PDF formatında oluştur
 * @param {Object} template - Doldurulmuş şablon
 * @returns {string} Formatlanmış karar metni
 */
function formatDecisionDocument(template) {
  let document = '';
  
  // Başlık
  document += `\n${'='.repeat(80)}\n`;
  document += `${template.title.padStart(40 + template.title.length / 2)}\n`;
  document += `${'='.repeat(80)}\n\n`;
  
  // Header bilgileri
  if (template.header) {
    document += `Mahkeme/Kurum: ${template.header.court || template.header.office || template.header.prosecutorOffice || ''}\n`;
    document += `Esas No: ${template.header.fileNumber}\n`;
    document += `Karar No: ${template.header.decisionNumber}\n`;
    document += `Karar Tarihi: ${template.header.decisionDate}\n`;
    document += `\n${'-'.repeat(80)}\n\n`;
  }
  
  // Taraflar
  if (template.parties) {
    document += 'TARAFLAR:\n';
    if (template.parties.defendant) {
      document += `Sanık: ${template.parties.defendant.name}\n`;
      document += `TC Kimlik No: ${template.parties.defendant.tcNo}\n`;
    }
    if (template.parties.victim) {
      document += `Mağdur: ${template.parties.victim.name}\n`;
    }
    document += '\n';
  }
  
  if (template.suspect) {
    document += 'ŞÜPHELİ:\n';
    document += `Ad Soyad: ${template.suspect.name}\n`;
    document += `TC Kimlik No: ${template.suspect.tcNo}\n\n`;
  }
  
  // Dava konusu
  if (template.case) {
    document += 'DAVA KONUSU:\n';
    document += `Suç: ${template.case.crime}\n`;
    if (template.case.article) document += `Madde: ${template.case.article}\n`;
    if (template.case.date) document += `Suç Tarihi: ${template.case.date}\n`;
    if (template.case.location) document += `Suç Yeri: ${template.case.location}\n`;
    document += '\n';
  }
  
  // Gerekçe
  if (template.reasoning) {
    document += 'KARAR GEREKÇESİ:\n';
    document += `\n${'-'.repeat(80)}\n\n`;
    
    if (template.reasoning.facts) document += `${template.reasoning.facts}\n\n`;
    if (template.reasoning.investigation) document += `${template.reasoning.investigation}\n\n`;
    if (template.reasoning.evidence) document += `${template.reasoning.evidence}\n\n`;
    if (template.reasoning.strongSuspicion) document += `${template.reasoning.strongSuspicion}\n\n`;
    
    if (template.reasoning.detentionReasons) {
      document += 'Tutuklama Nedenleri:\n';
      template.reasoning.detentionReasons.forEach((reason, idx) => {
        document += `${idx + 1}. ${reason}\n`;
      });
      document += '\n';
    }
    
    if (template.reasoning.conditions) {
      document += 'Değerlendirilen Hususlar:\n';
      template.reasoning.conditions.forEach((condition, idx) => {
        document += `${idx + 1}. ${condition}\n`;
      });
      document += '\n';
    }
    
    if (template.reasoning.conclusion) document += `${template.reasoning.conclusion}\n\n`;
    if (template.reasoning.legalBasis) document += `${template.reasoning.legalBasis}\n\n`;
    if (template.reasoning.legalDecision) document += `${template.reasoning.legalDecision}\n\n`;
  }
  
  // Hüküm
  document += `\n${'='.repeat(80)}\n`;
  document += 'HÜKÜM:\n';
  document += `${'='.repeat(80)}\n\n`;
  document += `${template.verdict}\n\n`;
  
  // Ek kararlar
  if (template.footer && template.footer.additionalDecisions) {
    document += 'EK KARARLAR:\n';
    template.footer.additionalDecisions.forEach((decision, idx) => {
      document += `${idx + 1}. ${decision}\n`;
    });
    document += '\n';
  }
  
  // Alt bilgiler
  if (template.footer) {
    document += `\n${'-'.repeat(80)}\n\n`;
    if (template.footer.judgeSignature) document += `Hakim: ${template.footer.judgeSignature}\n`;
    if (template.footer.clerkSignature) document += `Yazıcı: ${template.footer.clerkSignature}\n`;
    if (template.footer.prosecutor) document += `Cumhuriyet Savcısı: ${template.footer.prosecutor}\n`;
    if (template.footer.appealInfo) document += `\nKanun Yolu: ${template.footer.appealInfo}\n`;
    if (template.footer.objectionInfo) document += `\nİtiraz: ${template.footer.objectionInfo}\n`;
  }
  
  document += `\n${'='.repeat(80)}\n`;
  
  return document;
}

// Export
module.exports = {
  TemplateTypes,
  CourtTypes,
  StandardReasons,
  generateDecisionTemplate,
  formatDecisionDocument
};
