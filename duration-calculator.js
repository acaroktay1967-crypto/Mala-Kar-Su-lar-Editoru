/**
 * Süre Hesaplayıcı Modülü
 * Duration Calculator Module - Legal Deadlines and Statute of Limitations
 */

// Zamanaşımı süreleri (TCK Madde 66-68)
const StatuteOfLimitations = {
  // TCK 66 - Dava zamanaşımı
  LIFE_IMPRISONMENT: { years: 30, description: 'Ağırlaştırılmış müebbet hapis gerektiren suçlar' },
  OVER_15_YEARS: { years: 25, description: '15 yıldan fazla hapis gerektiren suçlar' },
  FROM_5_TO_15_YEARS: { years: 15, description: '5 yıldan fazla 15 yıldan az hapis gerektiren suçlar' },
  FROM_1_TO_5_YEARS: { years: 10, description: '1 yıldan fazla 5 yıldan az hapis gerektiren suçlar' },
  LESS_THAN_1_YEAR: { years: 8, description: '1 yıldan az hapis gerektiren suçlar' },
  
  // Özel durumlar
  SEXUAL_CRIMES_MINORS: { years: null, description: 'Çocuğa karşı cinsel suçlarda mağdur 18 yaşını doldurana kadar zamanaşımı işlemez' },
  CONSTITUTIONAL_CRIMES: { years: null, description: 'Anayasayı ihlal suçlarında zamanaşımı uygulanmaz' }
};

// Hükmün açıklanmasının geri bırakılması süreleri (TCK 231)
const DefermentPeriods = {
  LESS_THAN_2_YEARS: { years: 3, description: '2 yıldan az hapis cezası' },
  FROM_2_TO_5_YEARS: { years: 5, description: '2 yıldan fazla hapis cezası' }
};

// CMK İtiraz ve Kanun Yolu Süreleri
const AppealPeriods = {
  OBJECTION_TO_DECISION: { days: 7, description: 'Hakimin kararına itiraz' },
  OBJECTION_TO_PROSECUTOR: { days: 15, description: 'Kovuşturmaya yer olmadığı kararına itiraz' },
  APPEAL_TO_REGIONAL_COURT: { days: 15, description: 'Bölge Adliye Mahkemesine istinaf' },
  APPEAL_TO_SUPREME_COURT: { days: 15, description: 'Yargıtay\'a temyiz' },
  CORRECTION_REQUEST: { days: 15, description: 'Karar düzeltme' },
  OBJECTION_TO_ENFORCEMENT: { days: 30, description: 'İnfaz hakimine itiraz' }
};

// CMK Tutuklamaya İtiraz Süreleri
const DetentionPeriods = {
  OBJECTION_TO_DETENTION: { days: 7, description: 'Tutuklama kararına itiraz' },
  REVIEW_DETENTION: { days: 30, description: 'Tutuklama incelemesi' },
  MAX_DETENTION_INVESTIGATION: { years: 1, description: 'Soruşturma aşamasında azami tutukluluk süresi' },
  MAX_DETENTION_TRIAL: { years: 2, description: 'Kovuşturma aşamasında azami tutukluluk süresi (3 yıla kadar uzatılabilir)' }
};

// Tebligat Süreleri
const NotificationPeriods = {
  DOMESTIC_NOTIFICATION: { days: 7, description: 'Yurtiçi tebligattan sonra' },
  FOREIGN_NOTIFICATION: { days: 15, description: 'Yurtdışı tebligattan sonra' },
  PUBLIC_NOTIFICATION: { days: 15, description: 'İlan yoluyla tebligattan sonra' }
};

// Süre hesaplama fonksiyonu
function calculateDeadline(startDate, duration) {
  const start = new Date(startDate);
  const result = new Date(start);
  
  if (duration.years) {
    result.setFullYear(result.getFullYear() + duration.years);
  }
  if (duration.months) {
    result.setMonth(result.getMonth() + duration.months);
  }
  if (duration.days) {
    result.setDate(result.getDate() + duration.days);
  }
  
  return {
    startDate: start,
    endDate: result,
    daysRemaining: Math.ceil((result - new Date()) / (1000 * 60 * 60 * 24)),
    isExpired: result < new Date(),
    formattedStart: start.toLocaleDateString('tr-TR'),
    formattedEnd: result.toLocaleDateString('tr-TR')
  };
}

// Zamanaşımı hesaplama
function calculateStatuteOfLimitations(crimeDate, sentenceYears, isSexualCrimeMinor = false, isConstitutionalCrime = false) {
  if (isConstitutionalCrime) {
    return {
      applicable: false,
      reason: 'Anayasayı ihlal suçlarında zamanaşımı uygulanmaz'
    };
  }
  
  if (isSexualCrimeMinor) {
    return {
      applicable: true,
      suspended: true,
      reason: 'Çocuğa karşı cinsel suçlarda mağdur 18 yaşını doldurana kadar zamanaşımı işlemez'
    };
  }
  
  let limitationYears;
  let description;
  
  if (sentenceYears === 'life' || sentenceYears === 'aggravated_life') {
    limitationYears = 30;
    description = StatuteOfLimitations.LIFE_IMPRISONMENT.description;
  } else if (sentenceYears > 15) {
    limitationYears = 25;
    description = StatuteOfLimitations.OVER_15_YEARS.description;
  } else if (sentenceYears > 5 && sentenceYears <= 15) {
    limitationYears = 15;
    description = StatuteOfLimitations.FROM_5_TO_15_YEARS.description;
  } else if (sentenceYears > 1 && sentenceYears <= 5) {
    limitationYears = 10;
    description = StatuteOfLimitations.FROM_1_TO_5_YEARS.description;
  } else {
    limitationYears = 8;
    description = StatuteOfLimitations.LESS_THAN_1_YEAR.description;
  }
  
  const deadline = calculateDeadline(crimeDate, { years: limitationYears });
  
  return {
    applicable: true,
    limitationPeriod: limitationYears,
    description: description,
    ...deadline
  };
}

// İtiraz süresi hesaplama
function calculateAppealDeadline(decisionDate, appealType) {
  const periods = AppealPeriods[appealType];
  if (!periods) {
    throw new Error('Geçersiz itiraz türü');
  }
  
  const deadline = calculateDeadline(decisionDate, { days: periods.days });
  
  return {
    appealType: periods.description,
    period: `${periods.days} gün`,
    ...deadline,
    urgency: deadline.daysRemaining <= 3 ? 'critical' : 
             deadline.daysRemaining <= 7 ? 'warning' : 'normal'
  };
}

// Tutuklama süresi hesaplama
function calculateDetentionDeadline(detentionDate, stage = 'investigation') {
  const period = stage === 'investigation' 
    ? DetentionPeriods.MAX_DETENTION_INVESTIGATION 
    : DetentionPeriods.MAX_DETENTION_TRIAL;
  
  const deadline = calculateDeadline(detentionDate, { years: period.years });
  
  return {
    stage: stage === 'investigation' ? 'Soruşturma' : 'Kovuşturma',
    period: `${period.years} yıl`,
    description: period.description,
    ...deadline
  };
}

// Hükmün açıklanmasının geri bırakılması süresi
function calculateDefermentPeriod(judgmentDate, sentenceYears) {
  const period = sentenceYears < 2 
    ? DefermentPeriods.LESS_THAN_2_YEARS 
    : DefermentPeriods.FROM_2_TO_5_YEARS;
  
  const deadline = calculateDeadline(judgmentDate, { years: period.years });
  
  return {
    defermentPeriod: `${period.years} yıl`,
    description: period.description,
    ...deadline
  };
}

// Tebligat sonrası süre hesaplama
function calculateNotificationDeadline(notificationDate, notificationType, additionalDays = 0) {
  const periods = NotificationPeriods[notificationType];
  if (!periods) {
    throw new Error('Geçersiz tebligat türü');
  }
  
  const totalDays = periods.days + additionalDays;
  const deadline = calculateDeadline(notificationDate, { days: totalDays });
  
  return {
    notificationType: periods.description,
    basePeriod: `${periods.days} gün`,
    additionalDays: additionalDays,
    totalPeriod: `${totalDays} gün`,
    ...deadline
  };
}

// İş günü hesaplama (Cumartesi/Pazar hariç)
function calculateBusinessDays(startDate, days) {
  let current = new Date(startDate);
  let remainingDays = days;
  
  while (remainingDays > 0) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    // Cumartesi (6) ve Pazar (0) hariç
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remainingDays--;
    }
  }
  
  return current;
}

// Süre kontrolü
function checkDeadlineStatus(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  
  if (daysRemaining < 0) {
    return {
      status: 'expired',
      message: `Süre ${Math.abs(daysRemaining)} gün önce doldu`,
      urgency: 'critical',
      icon: '❌'
    };
  } else if (daysRemaining === 0) {
    return {
      status: 'today',
      message: 'Süre bugün doluyor',
      urgency: 'critical',
      icon: '⚠️'
    };
  } else if (daysRemaining <= 3) {
    return {
      status: 'critical',
      message: `${daysRemaining} gün kaldı`,
      urgency: 'critical',
      icon: '🔴'
    };
  } else if (daysRemaining <= 7) {
    return {
      status: 'warning',
      message: `${daysRemaining} gün kaldı`,
      urgency: 'warning',
      icon: '🟡'
    };
  } else if (daysRemaining <= 15) {
    return {
      status: 'normal',
      message: `${daysRemaining} gün kaldı`,
      urgency: 'normal',
      icon: '🟢'
    };
  } else {
    return {
      status: 'safe',
      message: `${daysRemaining} gün kaldı`,
      urgency: 'safe',
      icon: '✅'
    };
  }
}

// Formatlar
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
}

function formatShortDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    StatuteOfLimitations,
    DefermentPeriods,
    AppealPeriods,
    DetentionPeriods,
    NotificationPeriods,
    calculateDeadline,
    calculateStatuteOfLimitations,
    calculateAppealDeadline,
    calculateDetentionDeadline,
    calculateDefermentPeriod,
    calculateNotificationDeadline,
    calculateBusinessDays,
    checkDeadlineStatus,
    formatDate,
    formatShortDate
  };
}
