/**
 * Hırsızlık Suçları Modülü (TCK 141-145)
 * Theft Crimes Module - Turkish Criminal Code Articles 141-145
 */

// Hırsızlık türleri enum
const TheftTypes = {
  BASIC: 1,              // TCK 141 - Temel Hırsızlık (1-3 yıl)
  QUALIFIED: 2,          // TCK 142 - Nitelikli Hırsızlık (3-7 yıl)
  AGGRAVATED: 3          // TCK 142 - Daha da ağırlaştırılmış (5-10 yıl)
};

// Hırsızlık türü açıklamaları
const theftTypeDescriptions = {
  1: 'TCK 141 - Temel Hırsızlık (1-3 yıl)',
  2: 'TCK 142 - Nitelikli Hırsızlık (3-7 yıl)',
  3: 'TCK 142 - Daha da Ağırlaştırılmış (5-10 yıl)'
};

// Ceza hesaplama fonksiyonu
function calculateSentence(crime) {
  const qualifications = [];
  let sentenceType = 'basic';
  
  // Nitelikli haller (TCK 142/1)
  if (crime.konut_isyeri) qualifications.push('Konut veya işyerinde');
  if (crime.gece_vakti) qualifications.push('Gece vakti');
  if (crime.birden_fazla_kisi) qualifications.push('Birden fazla kişiyle');
  if (crime.anahtar_kullanma) qualifications.push('Özel araç kullanılarak (anahtar vb.)');
  if (crime.guvenlik_onlemi_kirilma) qualifications.push('Güvenlik önlemi kırılarak');
  
  // Daha da ağırlaştırılmış haller (TCK 142/2)
  const aggravatedQualifications = [];
  if (crime.kamu_binasi) {
    aggravatedQualifications.push('Kamu kurumu veya kuruluşlarına ait binaların eklentilerinde');
    sentenceType = 'aggravated';
  }
  if (crime.ibadethane) {
    aggravatedQualifications.push('İbadet yerlerinde');
    sentenceType = 'aggravated';
  }
  
  // Teşebbüs durumu
  if (crime.tesebbüs) {
    if (sentenceType === 'aggravated') {
      return {
        sentence: '3.75-7.5 Yıl Hapis',
        article: 'TCK 142/2 + TCK 35',
        years: { min: 3.75, max: 7.5 },
        qualifications: [...qualifications, ...aggravatedQualifications],
        details: 'Daha da ağırlaştırılmış hırsızlık suçuna teşebbüs (1/4 - 3/4 oranında indirim)'
      };
    } else if (qualifications.length > 0) {
      return {
        sentence: '2.25-5.25 Yıl Hapis',
        article: 'TCK 142/1 + TCK 35',
        years: { min: 2.25, max: 5.25 },
        qualifications: qualifications,
        details: 'Nitelikli hırsızlık suçuna teşebbüs (1/4 - 3/4 oranında indirim)'
      };
    } else {
      return {
        sentence: '9 Ay - 2 Yıl 3 Ay Hapis',
        article: 'TCK 141 + TCK 35',
        years: { min: 0.75, max: 2.25 },
        details: 'Temel hırsızlık suçuna teşebbüs (1/4 - 3/4 oranında indirim)'
      };
    }
  }

  // Daha da ağırlaştırılmış hal
  if (sentenceType === 'aggravated') {
    return {
      sentence: '5-10 Yıl Hapis',
      article: 'TCK 142/2',
      years: { min: 5, max: 10 },
      qualifications: [...qualifications, ...aggravatedQualifications],
      details: 'Daha da ağırlaştırılmış hırsızlık (kamu binası veya ibadethane)'
    };
  }

  // Nitelikli hal
  if (qualifications.length > 0) {
    return {
      sentence: '3-7 Yıl Hapis',
      article: 'TCK 142/1',
      years: { min: 3, max: 7 },
      qualifications: qualifications,
      details: `Nitelikli hırsızlık - ${qualifications.length} nitelikli hal tespit edildi`
    };
  }

  // Temel hırsızlık
  return {
    sentence: '1-3 Yıl Hapis',
    article: 'TCK 141',
    years: { min: 1, max: 3 },
    details: 'Temel hırsızlık suçu'
  };
}

// Form validasyonu
function validateTheftForm(data) {
  const errors = [];

  if (!data.dosya_no || data.dosya_no.trim() === '') {
    errors.push('Dosya numarası boş bırakılamaz');
  }

  if (!data.olay_tarihi) {
    errors.push('Olay tarihi seçilmelidir');
  }

  if (!data.mağdurlar || data.mağdurlar.length === 0) {
    errors.push('En az bir mağdur bilgisi girilmelidir');
  }

  if (!data.şüpheliler || data.şüpheliler.length === 0) {
    errors.push('En az bir şüpheli bilgisi girilmelidir');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Hırsızlık suçu kaydetme
async function saveTheftCrime(formData) {
  try {
    // Form validasyonu
    const validation = validateTheftForm(formData);
    if (!validation.isValid) {
      showNotification('Hata', validation.errors.join('\n'), 'error');
      return false;
    }

    // Kaydetme işlemi
    const result = await window.api.hırsızlık.save(formData);
    
    if (result.success) {
      showNotification('Başarılı', 'Hırsızlık suçu kaydı başarıyla kaydedildi', 'success');
      return true;
    } else {
      showNotification('Hata', 'Kayıt sırasında bir hata oluştu', 'error');
      return false;
    }
  } catch (error) {
    console.error('Hırsızlık suçu kaydetme hatası:', error);
    showNotification('Hata', 'Beklenmeyen bir hata oluştu: ' + error.message, 'error');
    return false;
  }
}

// Tüm hırsızlık suçlarını yükle
async function loadAllTheftCrimes() {
  try {
    const crimes = await window.api.hırsızlık.getAll();
    return crimes;
  } catch (error) {
    console.error('Hırsızlık suçları yükleme hatası:', error);
    showNotification('Hata', 'Hırsızlık suçları yüklenirken bir hata oluştu', 'error');
    return [];
  }
}

// Hırsızlık suçu detaylarını yükle
async function loadTheftCrimeDetails(id) {
  try {
    const crime = await window.api.hırsızlık.getById(id);
    return crime;
  } catch (error) {
    console.error('Hırsızlık suçu detay yükleme hatası:', error);
    showNotification('Hata', 'Hırsızlık suçu detayları yüklenirken bir hata oluştu', 'error');
    return null;
  }
}

// Hırsızlık suçu silme
async function deleteTheftCrime(id) {
  if (!confirm('Bu hırsızlık suçu kaydını silmek istediğinizden emin misiniz?')) {
    return false;
  }

  try {
    const result = await window.api.hırsızlık.delete(id);
    if (result.success) {
      showNotification('Başarılı', 'Hırsızlık suçu kaydı silindi', 'success');
      return true;
    } else {
      showNotification('Hata', 'Silme işlemi başarısız', 'error');
      return false;
    }
  } catch (error) {
    console.error('Hırsızlık suçu silme hatası:', error);
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
    TheftTypes,
    theftTypeDescriptions,
    calculateSentence,
    validateTheftForm,
    saveTheftCrime,
    loadAllTheftCrimes,
    loadTheftCrimeDetails,
    deleteTheftCrime,
    showNotification,
    formatCurrency,
    formatDate
  };
}
