/**
 * Delil Yönetimi Modülü
 * Evidence Management Module - File Upload and Management System
 */

// Delil türleri
const EvidenceTypes = {
  PHOTO: 'photo',           // Fotoğraf
  DOCUMENT: 'document',     // Belge
  AUDIO: 'audio',           // Ses kaydı
  VIDEO: 'video',           // Video
  OTHER: 'other'            // Diğer
};

// Kategori listesi
const EvidenceCategories = {
  CRIME_SCENE: 'Olay Yeri',
  SUSPECT: 'Şüpheli İlgili',
  VICTIM: 'Mağdur İlgili',
  WITNESS: 'Tanık İfadesi',
  COURT_DECISION: 'Mahkeme Kararı',
  POLICE_REPORT: 'Polis Raporu',
  EXPERT_REPORT: 'Bilirkişi Raporu',
  OTHER: 'Diğer'
};

// MIME type kontrolü
const AllowedMimeTypes = {
  photo: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
  document: [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
  video: ['video/mp4', 'video/mpeg', 'video/avi', 'video/quicktime', 'video/webm', 'video/x-msvideo']
};

// Maksimum dosya boyutları (bytes)
const MaxFileSizes = {
  photo: 10 * 1024 * 1024,      // 10 MB
  document: 20 * 1024 * 1024,   // 20 MB
  audio: 50 * 1024 * 1024,      // 50 MB
  video: 200 * 1024 * 1024      // 200 MB
};

// Delil türünü belirle
function getEvidenceType(mimeType) {
  if (AllowedMimeTypes.photo.includes(mimeType)) return EvidenceTypes.PHOTO;
  if (AllowedMimeTypes.document.includes(mimeType)) return EvidenceTypes.DOCUMENT;
  if (AllowedMimeTypes.audio.includes(mimeType)) return EvidenceTypes.AUDIO;
  if (AllowedMimeTypes.video.includes(mimeType)) return EvidenceTypes.VIDEO;
  return EvidenceTypes.OTHER;
}

// Dosya validasyonu
function validateFile(file, evidenceType) {
  const errors = [];
  
  if (!file || !file.name) {
    errors.push('Dosya seçilmedi');
    return { isValid: false, errors };
  }
  
  // MIME type kontrolü
  const allowedTypes = AllowedMimeTypes[evidenceType] || [];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Geçersiz dosya tipi. İzin verilenler: ${allowedTypes.join(', ')}`);
  }
  
  // Boyut kontrolü
  const maxSize = MaxFileSizes[evidenceType] || MaxFileSizes.document;
  if (file.size > maxSize) {
    errors.push(`Dosya boyutu çok büyük. Maksimum: ${formatFileSize(maxSize)}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Delil kaydetme
async function saveEvidence(sucModul, sucId, fileData, metadata = {}) {
  try {
    const evidenceData = {
      suc_modul: sucModul,
      suc_id: sucId,
      delil_turu: fileData.evidenceType,
      dosya_adi: fileData.fileName,
      dosya_yolu: fileData.filePath,
      dosya_boyutu: fileData.fileSize,
      mime_type: fileData.mimeType,
      kategori: metadata.category || 'Genel',
      aciklama: metadata.description || '',
      yuklenen_kisi: metadata.uploadedBy || 'Sistem',
      metadata: JSON.stringify(metadata)
    };
    
    const result = await window.api.delil.save(evidenceData);
    
    if (result.success) {
      showNotification('Başarılı', 'Delil başarıyla kaydedildi', 'success');
      return result;
    } else {
      showNotification('Hata', 'Delil kaydedilemedi', 'error');
      return null;
    }
  } catch (error) {
    console.error('Delil kaydetme hatası:', error);
    showNotification('Hata', 'Beklenmeyen bir hata oluştu: ' + error.message, 'error');
    return null;
  }
}

// Tüm delilleri yükle
async function loadAllEvidence(sucModul, sucId) {
  try {
    const evidences = await window.api.delil.getAll(sucModul, sucId);
    return evidences;
  } catch (error) {
    console.error('Delil yükleme hatası:', error);
    showNotification('Hata', 'Deliller yüklenirken bir hata oluştu', 'error');
    return [];
  }
}

// Delil detaylarını yükle
async function loadEvidenceDetails(id) {
  try {
    const evidence = await window.api.delil.getById(id);
    return evidence;
  } catch (error) {
    console.error('Delil detay yükleme hatası:', error);
    showNotification('Hata', 'Delil detayları yüklenirken bir hata oluştu', 'error');
    return null;
  }
}

// Delil silme
async function deleteEvidence(id) {
  if (!confirm('Bu delili silmek istediğinizden emin misiniz? Dosya kalıcı olarak silinecektir.')) {
    return false;
  }
  
  try {
    const result = await window.api.delil.delete(id);
    if (result.success) {
      showNotification('Başarılı', 'Delil silindi', 'success');
      return true;
    } else {
      showNotification('Hata', 'Delil silinemedi', 'error');
      return false;
    }
  } catch (error) {
    console.error('Delil silme hatası:', error);
    showNotification('Hata', 'Beklenmeyen bir hata oluştu', 'error');
    return false;
  }
}

// Delil sayısı
async function countEvidence(sucModul, sucId) {
  try {
    const count = await window.api.delil.count(sucModul, sucId);
    return count;
  } catch (error) {
    console.error('Delil sayma hatası:', error);
    return 0;
  }
}

// Dosya boyutu formatlama
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Dosya ikonu belirleme
function getFileIcon(evidenceType) {
  const icons = {
    photo: '📸',
    document: '📄',
    audio: '🎵',
    video: '🎬',
    other: '📎'
  };
  return icons[evidenceType] || icons.other;
}

// Tarih formatlama
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Delil türü açıklaması
function getEvidenceTypeDescription(type) {
  const descriptions = {
    photo: 'Fotoğraf',
    document: 'Belge',
    audio: 'Ses Kaydı',
    video: 'Video',
    other: 'Diğer'
  };
  return descriptions[type] || 'Bilinmiyor';
}

// Bildirim gösterme
function showNotification(title, message, type = 'info') {
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

// File input helper
function createFileInput(acceptTypes, multiple = false) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = acceptTypes;
  input.multiple = multiple;
  input.style.display = 'none';
  return input;
}

// Dosya önizleme oluşturma
function createPreview(file, evidenceType) {
  if (evidenceType === EvidenceTypes.PHOTO) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '200px';
      img.style.maxHeight = '200px';
      return img;
    };
    reader.readAsDataURL(file);
  }
  
  return null;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EvidenceTypes,
    EvidenceCategories,
    AllowedMimeTypes,
    MaxFileSizes,
    getEvidenceType,
    validateFile,
    saveEvidence,
    loadAllEvidence,
    loadEvidenceDetails,
    deleteEvidence,
    countEvidence,
    formatFileSize,
    getFileIcon,
    formatDate,
    getEvidenceTypeDescription,
    showNotification,
    createFileInput,
    createPreview
  };
}
