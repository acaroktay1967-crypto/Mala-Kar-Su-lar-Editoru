/**
 * Mahkeme Kararı Şablonları - UI Etkileşimleri
 * 
 * Form yönetimi, önizleme ve karar oluşturma işlemleri
 * 
 * @author CryptoMala
 * @version 1.0.0
 */

// Global değişkenler
let currentTemplateType = null;
let currentTemplateData = null;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
  initializeTemplateCards();
  initializeModalEvents();
});

/**
 * Şablon kartlarına tıklama olayı ekle
 */
function initializeTemplateCards() {
  const cards = document.querySelectorAll('.template-card');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const templateType = card.getAttribute('data-type');
      openTemplateModal(templateType);
    });
  });
}

/**
 * Modal olaylarını başlat
 */
function initializeModalEvents() {
  const modal = document.getElementById('templateModal');
  const closeBtn = document.querySelector('.modal-close');
  const cancelBtn = document.getElementById('btnCancel');
  const previewBtn = document.getElementById('btnPreview');
  const generateBtn = document.getElementById('btnGenerate');
  const backToFormBtn = document.getElementById('btnBackToForm');
  const printBtn = document.getElementById('btnPrint');
  const saveBtn = document.getElementById('btnSave');
  
  // Modal kapatma
  closeBtn.addEventListener('click', () => {
    closeModal();
  });
  
  cancelBtn.addEventListener('click', () => {
    closeModal();
  });
  
  // Modal dışına tıklayınca kapat
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Önizleme
  previewBtn.addEventListener('click', () => {
    previewTemplate();
  });
  
  // Karar oluştur
  generateBtn.addEventListener('click', () => {
    generateDecision();
  });
  
  // Forma geri dön
  backToFormBtn.addEventListener('click', () => {
    showForm();
  });
  
  // Yazdır
  printBtn.addEventListener('click', () => {
    printDecision();
  });
  
  // Kaydet
  saveBtn.addEventListener('click', () => {
    saveDecision();
  });
}

/**
 * Şablon modalını aç
 */
function openTemplateModal(templateType) {
  currentTemplateType = templateType;
  
  const modal = document.getElementById('templateModal');
  const modalTitle = document.getElementById('modalTitle');
  const formFields = document.getElementById('formFields');
  
  // Başlık güncelle
  const titles = {
    'mahkumiyet': '🔴 Mahkumiyet Kararı',
    'beraat': '🟢 Beraat Kararı',
    'takipsizlik': '📋 Kovuşturmaya Yer Olmadığına Dair Karar',
    'hagb': '⏸️ HAGB Kararı',
    'tecil': '⏰ Hükmün Ertelenmesi Kararı',
    'secenek_yaptırım': '💰 Seçenek Yaptırım Kararı',
    'tutuklama_karari': '🔒 Tutuklama Kararı',
    'tahliye_karari': '🔓 Tahliye Kararı',
    'koruma_karari': '🛡️ Koruma Kararı',
    'arama_karari': '🔍 Arama Kararı',
    'el_koyma': '📦 El Koyma Kararı',
    'müsadere': '⚠️ Müsadere Kararı',
    'ara_karar': '📄 Ara Karar',
    'red': '❌ Red Kararı'
  };
  
  modalTitle.textContent = titles[templateType] || 'Karar Şablonu';
  
  // Form alanlarını oluştur
  formFields.innerHTML = generateFormFields(templateType);
  
  // Bugünün tarihini varsayılan olarak ayarla
  const dateInputs = formFields.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      input.value = new Date().toISOString().split('T')[0];
    }
  });
  
  // Modalı göster
  modal.style.display = 'block';
  showForm();
}

/**
 * Form alanlarını oluştur
 */
function generateFormFields(templateType) {
  let fields = '';
  
  // Ortak alanlar
  const commonFields = `
    <div class="form-section">
      <h3>📋 Temel Bilgiler</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="courtName">Mahkeme/Kurum Adı</label>
          <input type="text" id="courtName" name="courtName" placeholder="Örn: İstanbul 2. Ağır Ceza Mahkemesi" required>
        </div>
        <div class="form-group">
          <label for="fileNumber">Dosya Numarası</label>
          <input type="text" id="fileNumber" name="fileNumber" placeholder="Örn: 2024/123 E." required>
        </div>
        <div class="form-group">
          <label for="decisionNumber">Karar Numarası</label>
          <input type="text" id="decisionNumber" name="decisionNumber" placeholder="Örn: 2024/456 K." required>
        </div>
        <div class="form-group">
          <label for="decisionDate">Karar Tarihi</label>
          <input type="date" id="decisionDate" name="decisionDate" required>
        </div>
      </div>
    </div>
  `;
  
  fields += commonFields;
  
  // Şablona özgü alanlar
  switch (templateType) {
    case 'mahkumiyet':
      fields += `
        <div class="form-section">
          <h3>👤 Sanık Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="defendantName">Sanık Adı Soyadı</label>
              <input type="text" id="defendantName" name="defendantName" placeholder="Örn: Ahmet YILMAZ" required>
            </div>
            <div class="form-group">
              <label for="defendantTC">TC Kimlik No</label>
              <input type="text" id="defendantTC" name="defendantTC" placeholder="11 haneli TC no" maxlength="11">
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>⚖️ Suç Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="crimeType">Suç Türü</label>
              <input type="text" id="crimeType" name="crimeType" placeholder="Örn: Hırsızlık" required>
            </div>
            <div class="form-group">
              <label for="crimeArticle">İlgili Madde</label>
              <input type="text" id="crimeArticle" name="crimeArticle" placeholder="Örn: TCK 141" required>
            </div>
            <div class="form-group">
              <label for="crimeDate">Suç Tarihi</label>
              <input type="date" id="crimeDate" name="crimeDate">
            </div>
            <div class="form-group">
              <label for="crimeLocation">Suç Yeri</label>
              <input type="text" id="crimeLocation" name="crimeLocation" placeholder="Örn: İstanbul/Kadıköy">
            </div>
          </div>
          
          <div class="form-group">
            <label for="victimName">Mağdur Adı Soyadı</label>
            <input type="text" id="victimName" name="victimName" placeholder="Mağdur bilgileri">
          </div>
        </div>
        
        <div class="form-section">
          <h3>📝 Ceza Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="sentence">Ceza Süresi</label>
              <input type="text" id="sentence" name="sentence" placeholder="Örn: 2 Yıl 6 Ay Hapis" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="reason">Karar Gerekçesi</label>
            <select id="reason" name="reason">
              <option value="Sanığın suçu işlediği, toplanan delillerle sabit olmuştur.">Deliller sabit</option>
              <option value="Sanığın ikrar ve kabul içerikli savunması ile suçu işlediği anlaşılmıştır.">İkrar ve kabul</option>
              <option value="Tanık beyanları ve diğer delillerle sanığın suçu işlediği kesinlik kazanmıştır.">Tanık beyanları</option>
              <option value="Olay yeri inceleme tutanağı, bilirkişi raporu ve diğer deliller sanığın suçluluğunu ortaya koymaktadır.">Bilirkişi raporu</option>
            </select>
          </div>
        </div>
      `;
      break;
      
    case 'beraat':
      fields += `
        <div class="form-section">
          <h3>👤 Sanık Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="defendantName">Sanık Adı Soyadı</label>
              <input type="text" id="defendantName" name="defendantName" placeholder="Örn: Ahmet YILMAZ" required>
            </div>
            <div class="form-group">
              <label for="defendantTC">TC Kimlik No</label>
              <input type="text" id="defendantTC" name="defendantTC" placeholder="11 haneli TC no" maxlength="11">
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>⚖️ Suç Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="crimeType">Suç Türü</label>
              <input type="text" id="crimeType" name="crimeType" placeholder="Örn: Hırsızlık" required>
            </div>
            <div class="form-group">
              <label for="crimeArticle">İlgili Madde</label>
              <input type="text" id="crimeArticle" name="crimeArticle" placeholder="Örn: TCK 141" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="reason">Beraat Gerekçesi</label>
            <select id="reason" name="reason">
              <option value="Sanığın atılı suçu işlediğine dair yeterli ve kesin delil bulunamamıştır.">Yeterli delil yok</option>
              <option value="Sanığın eyleminin suç oluşturmadığı anlaşılmıştır.">Suç oluşmamış</option>
              <option value="Suçun unsurları oluşmamıştır.">Unsurlar oluşmamış</option>
              <option value="Şüpheden sanık yararlanır ilkesi gereği beraat kararı verilmiştir.">Şüpheden sanık yararlanır</option>
            </select>
          </div>
        </div>
      `;
      break;
      
    case 'hagb':
      fields += `
        <div class="form-section">
          <h3>👤 Sanık Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="defendantName">Sanık Adı Soyadı</label>
              <input type="text" id="defendantName" name="defendantName" required>
            </div>
            <div class="form-group">
              <label for="defendantTC">TC Kimlik No</label>
              <input type="text" id="defendantTC" name="defendantTC" maxlength="11">
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>⚖️ Suç ve Ceza Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="crimeType">Suç Türü</label>
              <input type="text" id="crimeType" name="crimeType" required>
            </div>
            <div class="form-group">
              <label for="crimeArticle">İlgili Madde</label>
              <input type="text" id="crimeArticle" name="crimeArticle" required>
            </div>
            <div class="form-group">
              <label for="sentence">Belirlenen Ceza</label>
              <input type="text" id="sentence" name="sentence" placeholder="Örn: 10 Ay Hapis" required>
            </div>
            <div class="form-group">
              <label for="supervisionPeriod">Denetim Süresi (Yıl)</label>
              <select id="supervisionPeriod" name="supervisionPeriod">
                <option value="3">3 Yıl (2 yıldan az ceza)</option>
                <option value="5" selected>5 Yıl (2 yıldan fazla ceza)</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="conditions">Yükümlülükler (Her satıra bir yükümlülük)</label>
            <textarea id="conditions" name="conditions" placeholder="Örn: Bir meslek veya sanat sahibi değilse, meslek edinmesi">Bir meslek veya sanat sahibi değilse, bir meslek veya sanat edinmesi</textarea>
          </div>
        </div>
      `;
      break;
      
    case 'tutuklama_karari':
      fields += `
        <div class="form-section">
          <h3>👤 Şüpheli Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="suspectName">Şüpheli Adı Soyadı</label>
              <input type="text" id="suspectName" name="suspectName" required>
            </div>
            <div class="form-group">
              <label for="suspectTC">TC Kimlik No</label>
              <input type="text" id="suspectTC" name="suspectTC" maxlength="11">
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>⚖️ Suç Bilgileri</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="crimeType">Suç Türü</label>
              <input type="text" id="crimeType" name="crimeType" required>
            </div>
            <div class="form-group">
              <label for="crimeArticle">İlgili Madde</label>
              <input type="text" id="crimeArticle" name="crimeArticle" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="detentionReasons">Tutuklama Nedenleri (Her satıra bir neden)</label>
            <textarea id="detentionReasons" name="detentionReasons" placeholder="Tutuklama nedenlerini yazın">Kaçma şüphesi
Delilleri karartma şüphesi</textarea>
          </div>
        </div>
      `;
      break;
      
    case 'koruma_karari':
      fields += `
        <div class="form-section">
          <h3>👥 Taraflar</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="protectedPerson">Korunan Kişi</label>
              <input type="text" id="protectedPerson" name="protectedPerson" required>
            </div>
            <div class="form-group">
              <label for="perpetrator">Şiddet Uygulayan</label>
              <input type="text" id="perpetrator" name="perpetrator" required>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>🛡️ Koruma Tedbirleri</h3>
          <div class="form-group">
            <label for="duration">Koruma Süresi</label>
            <select id="duration" name="duration">
              <option value="3 AY">3 Ay</option>
              <option value="6 AY" selected>6 Ay</option>
              <option value="1 YIL">1 Yıl</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="protectionMeasures">Koruma Tedbirleri (Her satıra bir tedbir)</label>
            <textarea id="protectionMeasures" name="protectionMeasures" required>Korunan kişiye yaklaşmama
Korunan kişinin işyerine veya okula yaklaşmama
Korunan kişiyle iletişim kurmama</textarea>
          </div>
        </div>
      `;
      break;
      
    case 'arama_karari':
      fields += `
        <div class="form-section">
          <h3>👤 Şüpheli Bilgileri</h3>
          <div class="form-group">
            <label for="suspectName">Şüpheli Adı Soyadı</label>
            <input type="text" id="suspectName" name="suspectName" required>
          </div>
        </div>
        
        <div class="form-section">
          <h3>📍 Arama Bilgileri</h3>
          <div class="form-group">
            <label for="searchLocation">Aranacak Yer (Tam Adres)</label>
            <input type="text" id="searchLocation" name="searchLocation" placeholder="Tam adres bilgisi" required>
          </div>
          
          <div class="form-group">
            <label for="crimeType">Suç Türü</label>
            <input type="text" id="crimeType" name="crimeType" required>
          </div>
          
          <div class="form-group">
            <label for="searchReason">Arama Gerekçesi</label>
            <textarea id="searchReason" name="searchReason" required>Suça konu eşyanın bu adreste bulunduğuna dair kuvvetli şüphe vardır</textarea>
          </div>
        </div>
      `;
      break;
      
    default:
      // Basit form diğer türler için
      fields += `
        <div class="form-section">
          <h3>📝 Detaylar</h3>
          <div class="form-group">
            <label for="details">Karar Detayları</label>
            <textarea id="details" name="details" placeholder="Karar detaylarını girin..." required></textarea>
          </div>
        </div>
      `;
  }
  
  return fields;
}

/**
 * Formu göster
 */
function showForm() {
  document.getElementById('templateForm').style.display = 'block';
  document.getElementById('previewContainer').style.display = 'none';
}

/**
 * Önizlemeyi göster
 */
function showPreview() {
  document.getElementById('templateForm').style.display = 'none';
  document.getElementById('previewContainer').style.display = 'block';
}

/**
 * Modalı kapat
 */
function closeModal() {
  const modal = document.getElementById('templateModal');
  modal.style.display = 'none';
  currentTemplateType = null;
  currentTemplateData = null;
}

/**
 * Form verilerini topla
 */
function collectFormData() {
  const form = document.getElementById('templateForm');
  const formData = new FormData(form);
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    // Çoklu satırlı alanları array'e çevir
    if (key === 'conditions' || key === 'detentionReasons' || key === 'protectionMeasures') {
      data[key] = value.split('\n').filter(line => line.trim() !== '');
    } else {
      data[key] = value;
    }
  }
  
  return data;
}

/**
 * Şablonu önizle
 */
function previewTemplate() {
  try {
    const formData = collectFormData();
    
    // Zorunlu alan kontrolü
    if (!formData.courtName || !formData.fileNumber || !formData.decisionNumber) {
      showToast('Lütfen tüm zorunlu alanları doldurun!', 'error');
      return;
    }
    
    // Şablonu oluştur
    const template = generateDecisionTemplate(currentTemplateType, formData);
    currentTemplateData = template;
    
    // Önizlemeyi göster
    displayPreview(template);
    showPreview();
    
  } catch (error) {
    console.error('Önizleme hatası:', error);
    showToast('Önizleme oluşturulurken bir hata oluştu!', 'error');
  }
}

/**
 * Önizlemeyi görüntüle
 */
function displayPreview(template) {
  const previewContent = document.getElementById('previewContent');
  
  let html = `
    <h1>${template.title}</h1>
    
    <div class="preview-meta">
      <p><strong>Mahkeme/Kurum:</strong> ${template.header.court || template.header.office || ''}</p>
      <p><strong>Esas No:</strong> ${template.header.fileNumber}</p>
      <p><strong>Karar No:</strong> ${template.header.decisionNumber}</p>
      <p><strong>Karar Tarihi:</strong> ${template.header.decisionDate}</p>
    </div>
  `;
  
  // Taraflar
  if (template.parties) {
    html += `<h2>TARAFLAR</h2>`;
    if (template.parties.defendant) {
      html += `<p><strong>Sanık:</strong> ${template.parties.defendant.name}<br>`;
      html += `<strong>TC Kimlik No:</strong> ${template.parties.defendant.tcNo || '-'}</p>`;
    }
    if (template.parties.victim) {
      html += `<p><strong>Mağdur:</strong> ${template.parties.victim.name}</p>`;
    }
  }
  
  if (template.suspect) {
    html += `<h2>ŞÜPHELİ</h2>`;
    html += `<p><strong>Ad Soyad:</strong> ${template.suspect.name}<br>`;
    html += `<strong>TC Kimlik No:</strong> ${template.suspect.tcNo || '-'}</p>`;
  }
  
  // Dava konusu
  if (template.case) {
    html += `<h2>DAVA KONUSU</h2>`;
    html += `<p><strong>Suç:</strong> ${template.case.crime}<br>`;
    if (template.case.article) html += `<strong>Madde:</strong> ${template.case.article}<br>`;
    if (template.case.date) html += `<strong>Suç Tarihi:</strong> ${template.case.date}<br>`;
    if (template.case.location) html += `<strong>Suç Yeri:</strong> ${template.case.location}`;
    html += `</p>`;
  }
  
  // Gerekçe
  if (template.reasoning) {
    html += `<h2>KARAR GEREKÇESİ</h2>`;
    if (template.reasoning.facts) html += `<p>${template.reasoning.facts}</p>`;
    if (template.reasoning.investigation) html += `<p>${template.reasoning.investigation}</p>`;
    if (template.reasoning.evidence) html += `<p>${template.reasoning.evidence}</p>`;
    if (template.reasoning.conclusion) html += `<p>${template.reasoning.conclusion}</p>`;
    if (template.reasoning.legalBasis) html += `<p><strong>${template.reasoning.legalBasis}</strong></p>`;
  }
  
  // Hüküm
  html += `<div class="preview-verdict">${template.verdict}</div>`;
  
  // Footer
  if (template.footer) {
    html += `<div class="preview-footer">`;
    if (template.footer.judgeSignature) html += `<p><strong>Hakim:</strong> ${template.footer.judgeSignature}</p>`;
    if (template.footer.clerkSignature) html += `<p><strong>Yazıcı:</strong> ${template.footer.clerkSignature}</p>`;
    if (template.footer.appealInfo) html += `<p><em>${template.footer.appealInfo}</em></p>`;
    if (template.footer.objectionInfo) html += `<p><em>${template.footer.objectionInfo}</em></p>`;
    html += `</div>`;
  }
  
  previewContent.innerHTML = html;
}

/**
 * Kararı oluştur ve kopyala
 */
function generateDecision() {
  if (!currentTemplateData) {
    showToast('Lütfen önce önizlemeyi görüntüleyin!', 'error');
    return;
  }
  
  try {
    const decisionText = formatDecisionDocument(currentTemplateData);
    
    // Panoya kopyala
    navigator.clipboard.writeText(decisionText).then(() => {
      showToast('Karar metni panoya kopyalandı!', 'success');
    }).catch(() => {
      showToast('Kopyalama başarısız! Manuel olarak kopyalayın.', 'info');
    });
    
  } catch (error) {
    console.error('Karar oluşturma hatası:', error);
    showToast('Karar oluşturulurken bir hata oluştu!', 'error');
  }
}

/**
 * Kararı yazdır
 */
function printDecision() {
  window.print();
}

/**
 * Kararı kaydet
 */
function saveDecision() {
  if (!currentTemplateData) {
    showToast('Lütfen önce önizlemeyi görüntüleyin!', 'error');
    return;
  }
  
  try {
    const decisionText = formatDecisionDocument(currentTemplateData);
    const filename = `karar_${currentTemplateData.header.fileNumber.replace(/\//g, '_')}.txt`;
    
    // Blob oluştur
    const blob = new Blob([decisionText], { type: 'text/plain;charset=utf-8' });
    
    // Download linki oluştur
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    showToast('Karar dosyası indirildi!', 'success');
    
  } catch (error) {
    console.error('Kayıt hatası:', error);
    showToast('Karar kaydedilirken bir hata oluştu!', 'error');
  }
}

/**
 * Toast bildirimi göster
 */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}
