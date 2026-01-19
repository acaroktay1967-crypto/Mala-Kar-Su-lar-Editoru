/**
 * Delil Yönetimi UI İşlemleri
 * Evidence Management UI Operations
 */

let selectedFiles = [];
let currentModule = '';
let currentCaseId = '';

document.addEventListener('DOMContentLoaded', () => {
    initializeEvidenceManager();
});

function initializeEvidenceManager() {
    setupFileInput();
    setupDropZone();
    setupFilters();
    setupUploadForm();
    loadEvidence();
}

// Dosya input kurulumu
function setupFileInput() {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// Drag & Drop kurulumu
function setupDropZone() {
    const dropZone = document.getElementById('dropZone');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragging');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragging');
        }, false);
    });
    
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    }, false);
}

// Dosyaları işle
function handleFiles(files) {
    selectedFiles = Array.from(files);
    
    if (selectedFiles.length > 0) {
        showUploadModal();
    }
}

// Türe göre yükleme
function uploadByType(type) {
    const acceptTypes = {
        photo: 'image/*',
        document: '.pdf,.doc,.docx,.xls,.xlsx,.txt',
        audio: 'audio/*',
        video: 'video/*'
    };
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptTypes[type];
    input.multiple = true;
    
    input.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    input.click();
}

// Yükleme modalını göster
function showUploadModal() {
    document.getElementById('uploadModal').classList.add('show');
}

// Yükleme modalını kapat
function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('show');
    selectedFiles = [];
    document.getElementById('uploadForm').reset();
}

// Yükleme formu kurulumu
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleUpload();
    });
}

// Dosyaları yükle
async function handleUpload() {
    const module = document.getElementById('upload-module').value;
    const caseId = document.getElementById('upload-case-id').value;
    const category = document.getElementById('upload-category').value;
    const description = document.getElementById('upload-description').value;
    
    if (!module || !caseId) {
        alert('Lütfen modül ve dosya numarası seçiniz');
        return;
    }
    
    // Her dosya için
    for (const file of selectedFiles) {
        const evidenceType = getEvidenceType(file.type);
        const validation = validateFile(file, evidenceType);
        
        if (!validation.isValid) {
            alert(`${file.name}: ${validation.errors.join(', ')}`);
            continue;
        }
        
        // Dosyayı kaydet (gerçek uygulamada dosya sunucuya yüklenecek)
        // Şimdilik metadata olarak kaydediyoruz
        const fileData = {
            evidenceType: evidenceType,
            fileName: file.name,
            filePath: `/deliller/${module}/${caseId}/${file.name}`, // Simüle edilmiş yol
            fileSize: file.size,
            mimeType: file.type
        };
        
        const metadata = {
            category: category,
            description: description,
            uploadedBy: 'Sistem Kullanıcısı',
            originalFile: file.name
        };
        
        await saveEvidence(module, caseId, fileData, metadata);
    }
    
    closeUploadModal();
    loadEvidence();
}

// Delilleri yükle
async function loadEvidence() {
    const evidenceGrid = document.getElementById('evidenceGrid');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('evidence-count');
    
    try {
        // Tüm modüllerden delilleri al (demo için)
        const allEvidences = [];
        
        // Gerçek uygulamada API'den çekilecek
        // const evidences = await loadAllEvidence(currentModule, currentCaseId);
        
        if (allEvidences.length === 0) {
            evidenceGrid.innerHTML = '';
            emptyState.style.display = 'block';
            countEl.textContent = '0 Delil';
            return;
        }
        
        emptyState.style.display = 'none';
        countEl.textContent = `${allEvidences.length} Delil`;
        
        evidenceGrid.innerHTML = allEvidences.map(evidence => createEvidenceCard(evidence)).join('');
        
    } catch (error) {
        console.error('Delil yükleme hatası:', error);
    }
}

// Delil kartı oluştur
function createEvidenceCard(evidence) {
    const icon = getFileIcon(evidence.delil_turu);
    const typeDesc = getEvidenceTypeDescription(evidence.delil_turu);
    
    return `
        <div class="evidence-card">
            <span class="evidence-badge badge-${evidence.delil_turu}">${typeDesc}</span>
            <div class="evidence-preview">
                ${evidence.delil_turu === 'photo' 
                    ? `<img src="${evidence.dosya_yolu}" alt="${evidence.dosya_adi}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                       <i class="fas fa-image" style="display:none;"></i>`
                    : `<i class="fas fa-${getIconClass(evidence.delil_turu)}"></i>`
                }
            </div>
            <div class="evidence-info">
                <div class="evidence-title" title="${evidence.dosya_adi}">${icon} ${evidence.dosya_adi}</div>
                <div class="evidence-meta">
                    <i class="fas fa-folder"></i> ${evidence.kategori || 'Genel'}
                </div>
                <div class="evidence-meta">
                    <i class="fas fa-hdd"></i> ${formatFileSize(evidence.dosya_boyutu)}
                </div>
                <div class="evidence-meta">
                    <i class="fas fa-clock"></i> ${formatDate(evidence.yuklenme_tarihi)}
                </div>
            </div>
            <div class="evidence-actions">
                <button class="evidence-btn btn-view" onclick="viewEvidence('${evidence.id}')">
                    <i class="fas fa-eye"></i> Görüntüle
                </button>
                <button class="evidence-btn btn-delete" onclick="confirmDeleteEvidence('${evidence.id}')">
                    <i class="fas fa-trash"></i> Sil
                </button>
            </div>
        </div>
    `;
}

// Icon class belirleme
function getIconClass(type) {
    const classes = {
        document: 'file-pdf',
        audio: 'file-audio',
        video: 'file-video',
        other: 'file'
    };
    return classes[type] || 'file';
}

// Delil görüntüle
async function viewEvidence(id) {
    const evidence = await loadEvidenceDetails(id);
    
    if (!evidence) return;
    
    const modal = document.getElementById('evidenceModal');
    const details = document.getElementById('evidenceDetails');
    
    let metadata = {};
    try {
        metadata = JSON.parse(evidence.metadata || '{}');
    } catch (e) {
        metadata = {};
    }
    
    details.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 4rem;">${getFileIcon(evidence.delil_turu)}</div>
            <h3 style="margin-top: 1rem;">${evidence.dosya_adi}</h3>
        </div>
        
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <strong>Delil Türü:</strong> ${getEvidenceTypeDescription(evidence.delil_turu)}<br>
            <strong>Dosya Boyutu:</strong> ${formatFileSize(evidence.dosya_boyutu)}<br>
            <strong>MIME Type:</strong> ${evidence.mime_type}<br>
            <strong>Kategori:</strong> ${evidence.kategori}<br>
            <strong>Yüklenme Tarihi:</strong> ${formatDate(evidence.yuklenme_tarihi)}<br>
            <strong>Yükleyen:</strong> ${evidence.yuklenen_kisi}
        </div>
        
        ${evidence.aciklama ? `
            <div style="margin-bottom: 1rem;">
                <strong>Açıklama:</strong>
                <p style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
                    ${evidence.aciklama}
                </p>
            </div>
        ` : ''}
        
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button onclick="closeModal()" class="btn-secondary" style="flex: 1;">Kapat</button>
            <button onclick="confirmDeleteEvidence('${evidence.id}')" class="btn-delete" style="flex: 1;">
                <i class="fas fa-trash"></i> Sil
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

// Modal kapat
function closeModal() {
    document.getElementById('evidenceModal').classList.remove('show');
}

// Delil silme onayı
async function confirmDeleteEvidence(id) {
    const success = await deleteEvidence(id);
    if (success) {
        closeModal();
        loadEvidence();
    }
}

// Filtreleri kur
function setupFilters() {
    const filterModule = document.getElementById('filterModule');
    const filterType = document.getElementById('filterType');
    const filterCategory = document.getElementById('filterCategory');
    
    [filterModule, filterType, filterCategory].forEach(filter => {
        filter.addEventListener('change', () => {
            loadEvidence();
        });
    });
}

// Demo için örnek veriler oluştur
function loadDemoData() {
    const demoEvidences = [
        {
            id: '1',
            suc_modul: 'yagma',
            suc_id: '2024-YAG-001',
            delil_turu: 'photo',
            dosya_adi: 'olay_yeri_1.jpg',
            dosya_yolu: '/deliller/yagma/2024-YAG-001/olay_yeri_1.jpg',
            dosya_boyutu: 2457600,
            mime_type: 'image/jpeg',
            kategori: 'Olay Yeri',
            aciklama: 'Olay yerinden çekilen fotoğraf',
            yuklenme_tarihi: new Date().toISOString(),
            yuklenen_kisi: 'Ahmet Yılmaz'
        },
        {
            id: '2',
            suc_modul: 'yagma',
            suc_id: '2024-YAG-001',
            delil_turu: 'document',
            dosya_adi: 'mahkeme_karari.pdf',
            dosya_yolu: '/deliller/yagma/2024-YAG-001/mahkeme_karari.pdf',
            dosya_boyutu: 1024000,
            mime_type: 'application/pdf',
            kategori: 'Mahkeme Kararı',
            aciklama: 'İlk duruşma kararı',
            yuklenme_tarihi: new Date().toISOString(),
            yuklenen_kisi: 'Sistem'
        }
    ];
    
    // Demo verileri göster
    const evidenceGrid = document.getElementById('evidenceGrid');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('evidence-count');
    
    emptyState.style.display = 'none';
    countEl.textContent = `${demoEvidences.length} Delil`;
    evidenceGrid.innerHTML = demoEvidences.map(evidence => createEvidenceCard(evidence)).join('');
}

// Sayfa yüklendiğinde demo verileri göster
setTimeout(() => {
    loadDemoData();
}, 500);
