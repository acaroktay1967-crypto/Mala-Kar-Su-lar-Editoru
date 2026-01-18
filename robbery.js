/**
 * Yağma Suçları Modülü (TCK 148-149)
 * Robbery Crimes Module - Turkish Criminal Code Articles 148-149
 */

// Yağma türleri enum
const RobberyTypes = {
  BASIC: 1,           // TCK 148/1 - Temel Yağma (10-15 yıl)
  ARMED: 2,           // TCK 149/1-a - Silahla (13-20 yıl)
  GROUP: 3,           // TCK 149/1-b - Birden Fazla Kişiyle (13-20 yıl)
  MASKED: 4,          // TCK 149/1-c - Yüzü Kapalı (13-20 yıl)
  NIGHTTIME: 5,       // TCK 149/1-ç - Gece Vakti (13-20 yıl)
  VULNERABLE: 6,      // TCK 149/1-d - Mağdur Zayıflığı (13-20 yıl)
  PUBLIC_BUILDING: 7, // TCK 149/1-e - Kamu Binası (13-20 yıl)
  VEHICLE: 8,         // TCK 149/1-f - Taşıt İçinde (13-20 yıl)
  AGGRAVATED: 9       // TCK 149/2 - Ağır Neticeli (Ağırlaştırılmış Müebbet)
};

// Silah türleri
const WeaponTypes = {
  FIREARM: 0,     // Ateşli Silah
  KNIFE: 1,       // Kesici Alet
  BLUNT: 2,       // Sopa/Sert Cisim
  CHEMICAL: 3,    // Kimyasal Madde
  OTHER: 4        // Diğer
};

// Yağma türü açıklamaları
const robberyTypeDescriptions = {
  1: 'TCK 148/1 - Temel Yağma (10-15 yıl)',
  2: 'TCK 149/1-a - Silahla Yağma (13-20 yıl)',
  3: 'TCK 149/1-b - Birden Fazla Kişiyle Yağma (13-20 yıl)',
  4: 'TCK 149/1-c - Yüzü Kapalı veya Kimliği Belirsiz (13-20 yıl)',
  5: 'TCK 149/1-ç - Gece Vakti İşlenen (13-20 yıl)',
  6: 'TCK 149/1-d - Beden veya Ruh Sağlığı Zayıflığından Yararlanma (13-20 yıl)',
  7: 'TCK 149/1-e - Kamu Binası veya Eklentilerinde (13-20 yıl)',
  8: 'TCK 149/1-f - Taşıt İçinde (13-20 yıl)',
  9: 'TCK 149/2 - Ağır Neticeli Yağma (Ağırlaştırılmış Müebbet)'
};

// Silah türü açıklamaları
const weaponTypeDescriptions = {
  0: 'Ateşli Silah',
  1: 'Kesici Alet',
  2: 'Sopa/Sert Cisim',
  3: 'Kimyasal Madde',
  4: 'Diğer'
};

// Ceza hesaplama fonksiyonu
function calculateSentence(crime) {
  if (crime.agir_neticeli) {
    return {
      sentence: 'Ağırlaştırılmış Müebbet Hapis',
      article: 'TCK 149/2',
      years: null,
      details: 'Yağma sonucu kasten yaralama veya ölüm meydana gelmiştir.'
    };
  }

  const qualifications = [];
  
  if (crime.silah_var) qualifications.push('Silahla işlenen');
  if (crime.coklu_fail) qualifications.push('Birden fazla kişiyle işlenen');
  if (crime.kimlik_gizleme) qualifications.push('Yüzü kapalı veya kimliği belirsiz');
  if (crime.gece_vakti) qualifications.push('Gece vakti işlenen');
  if (crime.magdur_zayifligi) qualifications.push('Mağdurun zayıflığından yararlanılarak işlenen');
  if (crime.kamu_binasi) qualifications.push('Kamu binası veya eklentilerinde işlenen');
  if (crime.tasit_ici) qualifications.push('Taşıt içinde işlenen');

  if (qualifications.length > 0) {
    return {
      sentence: '13-20 Yıl Hapis',
      article: 'TCK 149/1',
      years: { min: 13, max: 20 },
      qualifications: qualifications,
      details: `Nitelikli haller: ${qualifications.join(', ')}`
    };
  }

  if (crime.tesebbüs) {
    return {
      sentence: '7.5-11.25 Yıl Hapis',
      article: 'TCK 148/1 + TCK 35',
      years: { min: 7.5, max: 11.25 },
      details: 'Temel yağma suçuna teşebbüs (1/4 - 3/4 oranında indirim)'
    };
  }

  return {
    sentence: '10-15 Yıl Hapis',
    article: 'TCK 148/1',
    years: { min: 10, max: 15 },
    details: 'Temel yağma suçu'
  };
}

// Form validasyonu
function validateRobberyForm(data) {
  const errors = [];

  if (!data.dosya_no || data.dosya_no.trim() === '') {
    errors.push('Dosya numarası boş bırakılamaz');
  }

  if (!data.olay_tarihi) {
    errors.push('Olay tarihi seçilmelidir');
  }

  if (!data.yagma_turu) {
    errors.push('Yağma türü seçilmelidir');
  }

  if (!data.mağdurlar || data.mağdurlar.length === 0) {
    errors.push('En az bir mağdur bilgisi girilmelidir');
  }

  if (!data.şüpheliler || data.şüpheliler.length === 0) {
    errors.push('En az bir şüpheli bilgisi girilmelidir');
  }

  if (data.silah_var && (!data.silahlar || data.silahlar.length === 0)) {
    errors.push('Silah kullanımı işaretliyse silah bilgileri girilmelidir');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Yağma suçu kaydetme
async function saveRobberyCrime(formData) {
  try {
    // Form validasyonu
    const validation = validateRobberyForm(formData);
    if (!validation.isValid) {
      showNotification('Hata', validation.errors.join('\n'), 'error');
      return false;
    }

    // Kaydetme işlemi
    const result = await window.api.yağma.save(formData);
    
    if (result.success) {
      showNotification('Başarılı', 'Yağma suçu kaydı başarıyla kaydedildi', 'success');
      return true;
    } else {
      showNotification('Hata', 'Kayıt sırasında bir hata oluştu', 'error');
      return false;
    }
  } catch (error) {
    console.error('Yağma suçu kaydetme hatası:', error);
    showNotification('Hata', 'Beklenmeyen bir hata oluştu: ' + error.message, 'error');
    return false;
  }
}

// Tüm yağma suçlarını yükle
async function loadAllRobberyCrimes() {
  try {
    const crimes = await window.api.yağma.getAll();
    return crimes;
  } catch (error) {
    console.error('Yağma suçları yükleme hatası:', error);
    showNotification('Hata', 'Yağma suçları yüklenirken bir hata oluştu', 'error');
    return [];
  }
}

// Yağma suçu detaylarını yükle
async function loadRobberyCrimeDetails(id) {
  try {
    const crime = await window.api.yağma.getById(id);
    return crime;
  } catch (error) {
    console.error('Yağma suçu detay yükleme hatası:', error);
    showNotification('Hata', 'Yağma suçu detayları yüklenirken bir hata oluştu', 'error');
    return null;
  }
}

// Yağma suçu silme
async function deleteRobberyCrime(id) {
  if (!confirm('Bu yağma suçu kaydını silmek istediğinizden emin misiniz?')) {
    return false;
  }

  try {
    const result = await window.api.yağma.delete(id);
    if (result.success) {
      showNotification('Başarılı', 'Yağma suçu kaydı silindi', 'success');
      return true;
    } else {
      showNotification('Hata', 'Silme işlemi başarısız', 'error');
      return false;
    }
  } catch (error) {
    console.error('Yağma suçu silme hatası:', error);
    showNotification('Hata', 'Beklenmeyen bir hata oluştu', 'error');
    return false;
  }
}

// Bildirim gösterme fonksiyonu
function showNotification(title, message, type = 'info') {
  // Toast notification göster
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <strong>${title}</strong>
    <p>${message}</p>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Formatlar
function formatCurrency(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR');
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RobberyTypes,
    WeaponTypes,
    robberyTypeDescriptions,
    weaponTypeDescriptions,
    calculateSentence,
    validateRobberyForm,
    saveRobberyCrime,
    loadAllRobberyCrimes,
    loadRobberyCrimeDetails,
    deleteRobberyCrime,
    showNotification,
    formatCurrency,
    formatDate
  };
}
