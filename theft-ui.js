/**
 * Hırsızlık Suçları UI İşlemleri
 * UI Operations for Theft Crimes Module
 */

// Global değişkenler
let currentTheftId = null;
let victimCounter = 0;
let suspectCounter = 0;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initializeTheftModule();
});

// Modülü başlat
function initializeTheftModule() {
    const btnNewTheft = document.getElementById('btn-new-hirsizlik');
    if (btnNewTheft) {
        btnNewTheft.addEventListener('click', openTheftModal);
    }

    const formTheft = document.getElementById('form-hirsizlik');
    if (formTheft) {
        formTheft.addEventListener('submit', handleFormSubmit);
    }

    // Nitelikli haller değişim eventi (ceza hesaplama için)
    const qualificationCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    qualificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSentenceCalculation);
    });

    // Hırsızlık suçlarını yükle
    loadTheftList();
    loadStatistics();
}

// Hırsızlık suçlarını listele
async function loadTheftList() {
    try {
        const crimes = await loadAllTheftCrimes();
        const tbody = document.getElementById('hirsizlik-table-body');
        
        if (!tbody) return;

        if (crimes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Henüz hırsızlık suçu kaydı bulunmamaktadır.</td></tr>';
            return;
        }

        tbody.innerHTML = crimes.map(crime => `
            <tr>
                <td>${crime.dosya_no || '-'}</td>
                <td>${formatDate(crime.olay_tarihi)}</td>
                <td>
                    <span class="theft-type-badge">
                        ${getTheftTypeText(crime)}
                    </span>
                </td>
                <td>${crime.magdur_sayisi || 0}</td>
                <td>${formatCurrency(crime.cal_mal_degeri || 0)}</td>
                <td>
                    <span class="status-badge status-${crime.durum === 'Aktif' ? 'active' : 'closed'}">
                        ${crime.durum || 'Aktif'}
                    </span>
                </td>
                <td>
                    <button class="action-btn btn-view" onclick="viewTheftCrime('${crime.id}')">
                        <i class="fas fa-eye"></i> Görüntüle
                    </button>
                    <button class="action-btn btn-edit" onclick="editTheftCrime('${crime.id}')">
                        <i class="fas fa-edit"></i> Düzenle
                    </button>
                    <button class="action-btn btn-delete" onclick="confirmDeleteTheft('${crime.id}')">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Hırsızlık suçları yüklenirken hata:', error);
        showNotification('Hata', 'Hırsızlık suçları yüklenemedi', 'error');
    }
}

// Hırsızlık türü metnini al
function getTheftTypeText(crime) {
    if (crime.kamu_binasi || crime.ibadethane) return 'Ağırlaştırılmış (TCK 142/2)';
    if (crime.konut_isyeri || crime.gece_vakti || crime.birden_fazla_kisi || 
        crime.anahtar_kullanma || crime.guvenlik_onlemi_kirilma) return 'Nitelikli (TCK 142/1)';
    return 'Temel Hırsızlık (TCK 141)';
}

// İstatistikleri yükle
async function loadStatistics() {
    try {
        const crimes = await loadAllTheftCrimes();
        const countElement = document.getElementById('count-hirsizlik');
        if (countElement) {
            countElement.textContent = crimes.length;
        }
    } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
    }
}

// Modal aç
function openTheftModal() {
    currentTheftId = null;
    const modal = document.getElementById('modal-hirsizlik-form');
    if (modal) {
        modal.classList.add('show');
        resetForm();
        addVictimRow();
        addSuspectRow();
    }
}

// Modal kapat
function closeTheftModal() {
    const modal = document.getElementById('modal-hirsizlik-form');
    if (modal) {
        modal.classList.remove('show');
        resetForm();
    }
}

// Formu sıfırla
function resetForm() {
    const form = document.getElementById('form-hirsizlik');
    if (form) form.reset();
    
    document.getElementById('magdur-list').innerHTML = '';
    document.getElementById('supheli-list').innerHTML = '';
    victimCounter = 0;
    suspectCounter = 0;
    
    document.getElementById('sentence-display').innerHTML = '<div class="sentence-result"><span class="sentence-text">Bilgileri girdikçe ceza hesaplanacaktır...</span></div>';
}

// Mağdur satırı ekle
function addVictimRow() {
    victimCounter++;
    const magdurList = document.getElementById('magdur-list');
    const victimRow = document.createElement('div');
    victimRow.className = 'person-row';
    victimRow.id = `victim-${victimCounter}`;
    victimRow.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Ad Soyad *</label>
                <input type="text" name="victim_name_${victimCounter}" required placeholder="Mağdurun adı soyadı">
            </div>
            <div class="form-group">
                <label>TC Kimlik No</label>
                <input type="text" name="victim_tc_${victimCounter}" placeholder="TC Kimlik numarası" maxlength="11">
            </div>
            <div class="form-group">
                <label>Telefon</label>
                <input type="tel" name="victim_phone_${victimCounter}" placeholder="Telefon numarası">
            </div>
            <div class="form-group">
                <label>Yaş</label>
                <input type="number" name="victim_age_${victimCounter}" min="0" max="150" placeholder="Yaş">
            </div>
            <div class="form-group full-width">
                <label>Adres</label>
                <textarea name="victim_address_${victimCounter}" rows="2" placeholder="Mağdurun adresi..."></textarea>
            </div>
            <div class="form-group full-width">
                <label>Açıklama</label>
                <textarea name="victim_desc_${victimCounter}" rows="2" placeholder="Ek bilgiler..."></textarea>
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeVictimRow(${victimCounter})">
            <i class="fas fa-trash"></i> Mağduru Kaldır
        </button>
    `;
    magdurList.appendChild(victimRow);
}

// Mağdur satırını kaldır
function removeVictimRow(id) {
    const victimList = document.getElementById('magdur-list');
    if (victimList.children.length > 1) {
        const row = document.getElementById(`victim-${id}`);
        if (row) row.remove();
    } else {
        showNotification('Uyarı', 'En az bir mağdur bilgisi bulunmalıdır', 'info');
    }
}

// Şüpheli satırı ekle
function addSuspectRow() {
    suspectCounter++;
    const supheliList = document.getElementById('supheli-list');
    const suspectRow = document.createElement('div');
    suspectRow.className = 'person-row';
    suspectRow.id = `suspect-${suspectCounter}`;
    suspectRow.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Ad Soyad *</label>
                <input type="text" name="suspect_name_${suspectCounter}" required placeholder="Şüphelinin adı soyadı">
            </div>
            <div class="form-group">
                <label>TC Kimlik No</label>
                <input type="text" name="suspect_tc_${suspectCounter}" placeholder="TC Kimlik numarası" maxlength="11">
            </div>
            <div class="form-group">
                <label>Telefon</label>
                <input type="tel" name="suspect_phone_${suspectCounter}" placeholder="Telefon numarası">
            </div>
            <div class="form-group">
                <label>Yaş</label>
                <input type="number" name="suspect_age_${suspectCounter}" min="0" max="150" placeholder="Yaş">
            </div>
            <div class="form-group full-width">
                <label>Sabıka Durumu</label>
                <textarea name="suspect_record_${suspectCounter}" rows="2" placeholder="Sabıka kaydı bilgisi..."></textarea>
            </div>
            <div class="form-group full-width">
                <label>Adres</label>
                <textarea name="suspect_address_${suspectCounter}" rows="2" placeholder="Şüphelinin adresi..."></textarea>
            </div>
            <div class="form-group full-width">
                <label>Açıklama</label>
                <textarea name="suspect_desc_${suspectCounter}" rows="2" placeholder="Ek bilgiler..."></textarea>
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeSuspectRow(${suspectCounter})">
            <i class="fas fa-trash"></i> Şüpheliyi Kaldır
        </button>
    `;
    supheliList.appendChild(suspectRow);
}

// Şüpheli satırını kaldır
function removeSuspectRow(id) {
    const supheliList = document.getElementById('supheli-list');
    if (supheliList.children.length > 1) {
        const row = document.getElementById(`suspect-${id}`);
        if (row) row.remove();
    } else {
        showNotification('Uyarı', 'En az bir şüpheli bilgisi bulunmalıdır', 'info');
    }
}

// Ceza hesaplamasını güncelle
function updateSentenceCalculation() {
    const formData = collectFormData();
    const sentence = calculateSentence(formData);
    
    const sentenceDisplay = document.getElementById('sentence-display');
    
    let html = `
        <div class="sentence-result">
            <span class="sentence-text">${sentence.sentence}</span>
            <div class="sentence-details">
                <strong>Madde:</strong> ${sentence.article}<br>
                ${sentence.details}
            </div>
        </div>
    `;
    
    if (sentence.qualifications && sentence.qualifications.length > 0) {
        html += `
            <div class="sentence-qualifications">
                <h5>🔴 Nitelikli Haller:</h5>
                <ul>
                    ${sentence.qualifications.map(q => `<li>${q}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    sentenceDisplay.innerHTML = html;
}

// Form verilerini topla
function collectFormData() {
    const form = document.getElementById('form-hirsizlik');
    const formData = new FormData(form);
    
    const data = {
        id: currentTheftId,
        dosya_no: formData.get('dosya_no'),
        olay_tarihi: formData.get('olay_tarihi'),
        olay_yeri: formData.get('olay_yeri'),
        olay_yeri_detay: formData.get('olay_yeri_detay'),
        konut_isyeri: document.getElementById('check-konut-isyeri').checked ? 1 : 0,
        gece_vakti: document.getElementById('check-gece-vakti').checked ? 1 : 0,
        birden_fazla_kisi: document.getElementById('check-birden-fazla-kisi').checked ? 1 : 0,
        anahtar_kullanma: document.getElementById('check-anahtar-kullanma').checked ? 1 : 0,
        guvenlik_onlemi_kirilma: document.getElementById('check-guvenlik-onlemi').checked ? 1 : 0,
        kamu_binasi: document.getElementById('check-kamu-binasi').checked ? 1 : 0,
        ibadethane: document.getElementById('check-ibadethane').checked ? 1 : 0,
        tesebbüs: document.getElementById('check-tesebbüs').checked ? 1 : 0,
        cal_mal_degeri: parseFloat(formData.get('cal_mal_degeri')) || 0,
        cal_mal_aciklama: formData.get('cal_mal_aciklama'),
        cal_mal_bulundu: parseInt(formData.get('cal_mal_bulundu')) || 0,
        created_by: 'Sistem Kullanıcısı',
        mağdurlar: [],
        şüpheliler: []
    };
    
    // Mağdur bilgilerini topla
    for (let i = 1; i <= victimCounter; i++) {
        const victimRow = document.getElementById(`victim-${i}`);
        if (victimRow) {
            data.mağdurlar.push({
                ad_soyad: formData.get(`victim_name_${i}`),
                tc_kimlik: formData.get(`victim_tc_${i}`),
                telefon: formData.get(`victim_phone_${i}`),
                yaş: parseInt(formData.get(`victim_age_${i}`)) || null,
                adres: formData.get(`victim_address_${i}`),
                aciklama: formData.get(`victim_desc_${i}`)
            });
        }
    }
    
    // Şüpheli bilgilerini topla
    for (let i = 1; i <= suspectCounter; i++) {
        const suspectRow = document.getElementById(`suspect-${i}`);
        if (suspectRow) {
            data.şüpheliler.push({
                ad_soyad: formData.get(`suspect_name_${i}`),
                tc_kimlik: formData.get(`suspect_tc_${i}`),
                telefon: formData.get(`suspect_phone_${i}`),
                yaş: parseInt(formData.get(`suspect_age_${i}`)) || null,
                sabika_durumu: formData.get(`suspect_record_${i}`),
                adres: formData.get(`suspect_address_${i}`),
                aciklama: formData.get(`suspect_desc_${i}`)
            });
        }
    }
    
    return data;
}

// Form submit işlemi
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    const success = await saveTheftCrime(formData);
    
    if (success) {
        closeTheftModal();
        loadTheftList();
        loadStatistics();
    }
}

// Hırsızlık suçunu görüntüle
async function viewTheftCrime(id) {
    const crime = await loadTheftCrimeDetails(id);
    if (crime) {
        alert('Detay görüntüleme özelliği yakında eklenecek');
    }
}

// Hırsızlık suçunu düzenle
async function editTheftCrime(id) {
    const crime = await loadTheftCrimeDetails(id);
    if (crime) {
        currentTheftId = id;
        openTheftModal();
        populateFormWithCrime(crime);
    }
}

// Formu suç verileriyle doldur
function populateFormWithCrime(crime) {
    document.getElementById('dosya-no').value = crime.dosya_no || '';
    document.getElementById('olay-tarihi').value = crime.olay_tarihi || '';
    document.getElementById('olay-yeri').value = crime.olay_yeri || '';
    document.getElementById('olay-yeri-detay').value = crime.olay_yeri_detay || '';
    
    document.getElementById('check-konut-isyeri').checked = crime.konut_isyeri === 1;
    document.getElementById('check-gece-vakti').checked = crime.gece_vakti === 1;
    document.getElementById('check-birden-fazla-kisi').checked = crime.birden_fazla_kisi === 1;
    document.getElementById('check-anahtar-kullanma').checked = crime.anahtar_kullanma === 1;
    document.getElementById('check-guvenlik-onlemi').checked = crime.guvenlik_onlemi_kirilma === 1;
    document.getElementById('check-kamu-binasi').checked = crime.kamu_binasi === 1;
    document.getElementById('check-ibadethane').checked = crime.ibadethane === 1;
    document.getElementById('check-tesebbüs').checked = crime.tesebbüs === 1;
    
    document.getElementById('cal-mal-degeri').value = crime.cal_mal_degeri || '';
    document.getElementById('cal-mal-aciklama').value = crime.cal_mal_aciklama || '';
    document.getElementById('cal-mal-bulundu').value = crime.cal_mal_bulundu || 0;
    
    updateSentenceCalculation();
}

// Hırsızlık suçunu silmeyi onayla
async function confirmDeleteTheft(id) {
    const success = await deleteTheftCrime(id);
    if (success) {
        loadTheftList();
        loadStatistics();
    }
}
