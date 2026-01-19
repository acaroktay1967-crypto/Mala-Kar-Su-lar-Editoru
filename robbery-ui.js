/**
 * Yağma Suçları UI İşlemleri
 * UI Operations for Robbery Crimes Module
 */

// Global değişkenler
let currentYagmaId = null;
let weaponCounter = 0;
let victimCounter = 0;
let suspectCounter = 0;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initializeYagmaModule();
});

// Modülü başlat
function initializeYagmaModule() {
    // Yeni kayıt butonu
    const btnNewYagma = document.getElementById('btn-new-yagma');
    if (btnNewYagma) {
        btnNewYagma.addEventListener('click', openYagmaModal);
    }

    // Form submit eventi
    const formYagma = document.getElementById('form-yagma');
    if (formYagma) {
        formYagma.addEventListener('submit', handleFormSubmit);
    }

    // Silah checkbox değişim eventi
    const checkSilah = document.getElementById('check-silah');
    if (checkSilah) {
        checkSilah.addEventListener('change', toggleSilahCard);
    }

    // Nitelikli haller değişim eventi (ceza hesaplama için)
    const qualificationCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    qualificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSentenceCalculation);
    });

    // Yağma suçlarını yükle
    loadRobberyList();

    // İstatistikleri yükle
    loadStatistics();
}

// Yağma suçlarını listele
async function loadRobberyList() {
    try {
        const crimes = await loadAllRobberyCrimes();
        const tbody = document.getElementById('yagma-table-body');
        
        if (!tbody) return;

        if (crimes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Henüz yağma suçu kaydı bulunmamaktadır.</td></tr>';
            return;
        }

        tbody.innerHTML = crimes.map(crime => `
            <tr>
                <td>${crime.dosya_no || '-'}</td>
                <td>${formatDate(crime.olay_tarihi)}</td>
                <td>
                    <span class="robbery-type-badge ${crime.agir_neticeli ? 'aggravated' : ''}">
                        ${getRobberyTypeText(crime)}
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
                    <button class="action-btn btn-view" onclick="viewRobberyCrime('${crime.id}')">
                        <i class="fas fa-eye"></i> Görüntüle
                    </button>
                    <button class="action-btn btn-edit" onclick="editRobberyCrime('${crime.id}')">
                        <i class="fas fa-edit"></i> Düzenle
                    </button>
                    <button class="action-btn btn-delete" onclick="confirmDeleteRobbery('${crime.id}')">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Yağma suçları yüklenirken hata:', error);
        showNotification('Hata', 'Yağma suçları yüklenemedi', 'error');
    }
}

// Yağma türü metnini al
function getRobberyTypeText(crime) {
    if (crime.agir_neticeli) return 'Ağır Neticeli (TCK 149/2)';
    if (crime.silah_var) return 'Silahla (TCK 149/1-a)';
    if (crime.coklu_fail) return 'Çoklu Fail (TCK 149/1-b)';
    if (crime.kimlik_gizleme) return 'Yüzü Kapalı (TCK 149/1-c)';
    if (crime.gece_vakti) return 'Gece Vakti (TCK 149/1-ç)';
    if (crime.magdur_zayifligi) return 'Mağdur Zayıflığı (TCK 149/1-d)';
    if (crime.kamu_binasi) return 'Kamu Binası (TCK 149/1-e)';
    if (crime.tasit_ici) return 'Taşıtta (TCK 149/1-f)';
    return 'Temel Yağma (TCK 148/1)';
}

// İstatistikleri yükle
async function loadStatistics() {
    try {
        const crimes = await loadAllRobberyCrimes();
        const countElement = document.getElementById('count-yagma');
        if (countElement) {
            countElement.textContent = crimes.length;
        }

        // Toplam sayıyı da güncelle
        const totalElement = document.getElementById('count-total');
        if (totalElement) {
            const currentTotal = parseInt(totalElement.textContent) || 0;
            totalElement.textContent = currentTotal + crimes.length;
        }
    } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
    }
}

// Modal aç
function openYagmaModal() {
    currentYagmaId = null;
    const modal = document.getElementById('modal-yagma-form');
    if (modal) {
        modal.classList.add('show');
        resetForm();
        // İlk mağdur ve şüpheli ekle
        addVictimRow();
        addSuspectRow();
    }
}

// Modal kapat
function closeYagmaModal() {
    const modal = document.getElementById('modal-yagma-form');
    if (modal) {
        modal.classList.remove('show');
        resetForm();
    }
}

// Formu sıfırla
function resetForm() {
    const form = document.getElementById('form-yagma');
    if (form) {
        form.reset();
    }
    
    // Liste alanlarını temizle
    document.getElementById('silah-list').innerHTML = '';
    document.getElementById('magdur-list').innerHTML = '';
    document.getElementById('supheli-list').innerHTML = '';
    
    // Sayaçları sıfırla
    weaponCounter = 0;
    victimCounter = 0;
    suspectCounter = 0;
    
    // Silah kartını gizle
    document.getElementById('silah-card').style.display = 'none';
    
    // Ceza hesaplamasını sıfırla
    document.getElementById('sentence-display').innerHTML = '<div class="sentence-result"><span class="sentence-text">Bilgileri girdikçe ceza hesaplanacaktır...</span></div>';
}

// Silah kartını göster/gizle
function toggleSilahCard() {
    const checkSilah = document.getElementById('check-silah');
    const silahCard = document.getElementById('silah-card');
    
    if (checkSilah.checked) {
        silahCard.style.display = 'block';
        if (weaponCounter === 0) {
            addWeaponRow();
        }
    } else {
        silahCard.style.display = 'none';
    }
    
    updateSentenceCalculation();
}

// Silah satırı ekle
function addWeaponRow() {
    weaponCounter++;
    const silahList = document.getElementById('silah-list');
    const weaponRow = document.createElement('div');
    weaponRow.className = 'weapon-row';
    weaponRow.id = `weapon-${weaponCounter}`;
    weaponRow.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Silah Türü</label>
                <select name="weapon_type_${weaponCounter}" required>
                    <option value="0">Ateşli Silah</option>
                    <option value="1">Kesici Alet</option>
                    <option value="2">Sopa/Sert Cisim</option>
                    <option value="3">Kimyasal Madde</option>
                    <option value="4">Diğer</option>
                </select>
            </div>
            <div class="form-group">
                <label>Marka</label>
                <input type="text" name="weapon_brand_${weaponCounter}" placeholder="Silah markası">
            </div>
            <div class="form-group">
                <label>Model</label>
                <input type="text" name="weapon_model_${weaponCounter}" placeholder="Silah modeli">
            </div>
            <div class="form-group">
                <label>Seri No</label>
                <input type="text" name="weapon_serial_${weaponCounter}" placeholder="Seri numarası">
            </div>
            <div class="form-group full-width">
                <label>Açıklama</label>
                <textarea name="weapon_desc_${weaponCounter}" rows="2" placeholder="Silah hakkında detaylı bilgi..."></textarea>
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeWeaponRow(${weaponCounter})">
            <i class="fas fa-trash"></i> Silahı Kaldır
        </button>
    `;
    silahList.appendChild(weaponRow);
}

// Silah satırını kaldır
function removeWeaponRow(id) {
    const row = document.getElementById(`weapon-${id}`);
    if (row) {
        row.remove();
    }
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
        if (row) {
            row.remove();
        }
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
        if (row) {
            row.remove();
        }
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
    const form = document.getElementById('form-yagma');
    const formData = new FormData(form);
    
    const data = {
        id: currentYagmaId,
        dosya_no: formData.get('dosya_no'),
        olay_tarihi: formData.get('olay_tarihi'),
        olay_yeri: formData.get('olay_yeri'),
        olay_yeri_detay: formData.get('olay_yeri_detay'),
        silah_var: document.getElementById('check-silah').checked ? 1 : 0,
        coklu_fail: document.getElementById('check-coklu-fail').checked ? 1 : 0,
        kimlik_gizleme: document.getElementById('check-kimlik-gizleme').checked ? 1 : 0,
        gece_vakti: document.getElementById('check-gece-vakti').checked ? 1 : 0,
        magdur_zayifligi: document.getElementById('check-magdur-zayifligi').checked ? 1 : 0,
        kamu_binasi: document.getElementById('check-kamu-binasi').checked ? 1 : 0,
        tasit_ici: document.getElementById('check-tasit-ici').checked ? 1 : 0,
        tesebbüs: document.getElementById('check-tesebbüs').checked ? 1 : 0,
        agir_neticeli: document.getElementById('check-agir-neticeli').checked ? 1 : 0,
        cal_mal_degeri: parseFloat(formData.get('cal_mal_degeri')) || 0,
        cal_mal_aciklama: formData.get('cal_mal_aciklama'),
        cal_mal_bulundu: parseInt(formData.get('cal_mal_bulundu')) || 0,
        created_by: 'Sistem Kullanıcısı',
        silahlar: [],
        mağdurlar: [],
        şüpheliler: []
    };
    
    // Silah bilgilerini topla
    for (let i = 1; i <= weaponCounter; i++) {
        const weaponRow = document.getElementById(`weapon-${i}`);
        if (weaponRow) {
            data.silahlar.push({
                silah_turu: parseInt(formData.get(`weapon_type_${i}`)) || 0,
                marka: formData.get(`weapon_brand_${i}`),
                model: formData.get(`weapon_model_${i}`),
                seri_no: formData.get(`weapon_serial_${i}`),
                aciklama: formData.get(`weapon_desc_${i}`),
                atesli_silah: parseInt(formData.get(`weapon_type_${i}`)) === 0 ? 1 : 0
            });
        }
    }
    
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
    const success = await saveRobberyCrime(formData);
    
    if (success) {
        closeYagmaModal();
        loadRobberyList();
        loadStatistics();
    }
}

// Yağma suçunu görüntüle
async function viewRobberyCrime(id) {
    const crime = await loadRobberyCrimeDetails(id);
    if (crime) {
        // Detay modal'ı göster (implement edilecek)
        alert('Detay görüntüleme özelliği yakında eklenecek');
    }
}

// Yağma suçunu düzenle
async function editRobberyCrime(id) {
    const crime = await loadRobberyCrimeDetails(id);
    if (crime) {
        currentYagmaId = id;
        // Form alanlarını doldur (implement edilecek)
        openYagmaModal();
        // Form verilerini yükle
        populateFormWithCrime(crime);
    }
}

// Formu suç verileriyle doldur
function populateFormWithCrime(crime) {
    // Temel bilgiler
    document.getElementById('dosya-no').value = crime.dosya_no || '';
    document.getElementById('olay-tarihi').value = crime.olay_tarihi || '';
    document.getElementById('olay-yeri').value = crime.olay_yeri || '';
    document.getElementById('olay-yeri-detay').value = crime.olay_yeri_detay || '';
    
    // Checkbox'lar
    document.getElementById('check-silah').checked = crime.silah_var === 1;
    document.getElementById('check-coklu-fail').checked = crime.coklu_fail === 1;
    document.getElementById('check-kimlik-gizleme').checked = crime.kimlik_gizleme === 1;
    document.getElementById('check-gece-vakti').checked = crime.gece_vakti === 1;
    document.getElementById('check-magdur-zayifligi').checked = crime.magdur_zayifligi === 1;
    document.getElementById('check-kamu-binasi').checked = crime.kamu_binasi === 1;
    document.getElementById('check-tasit-ici').checked = crime.tasit_ici === 1;
    document.getElementById('check-tesebbüs').checked = crime.tesebbüs === 1;
    document.getElementById('check-agir-neticeli').checked = crime.agir_neticeli === 1;
    
    // Mal bilgileri
    document.getElementById('cal-mal-degeri').value = crime.cal_mal_degeri || '';
    document.getElementById('cal-mal-aciklama').value = crime.cal_mal_aciklama || '';
    document.getElementById('cal-mal-bulundu').value = crime.cal_mal_bulundu || 0;
    
    // Silah kartını göster/gizle
    toggleSilahCard();
    
    // Silah bilgilerini yükle
    if (crime.silahlar && crime.silahlar.length > 0) {
        document.getElementById('silah-list').innerHTML = '';
        crime.silahlar.forEach(silah => {
            // Silah ekleme implement edilecek
        });
    }
    
    // Mağdur bilgilerini yükle
    if (crime.mağdurlar && crime.mağdurlar.length > 0) {
        document.getElementById('magdur-list').innerHTML = '';
        crime.mağdurlar.forEach(magdur => {
            // Mağdur ekleme implement edilecek
        });
    }
    
    // Şüpheli bilgilerini yükle
    if (crime.şüpheliler && crime.şüpheliler.length > 0) {
        document.getElementById('supheli-list').innerHTML = '';
        crime.şüpheliler.forEach(supheli => {
            // Şüpheli ekleme implement edilecek
        });
    }
    
    // Ceza hesaplamasını güncelle
    updateSentenceCalculation();
}

// Yağma suçunu silmeyi onayla
async function confirmDeleteRobbery(id) {
    const success = await deleteRobberyCrime(id);
    if (success) {
        loadRobberyList();
        loadStatistics();
    }
}
