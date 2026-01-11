/**
 * Renderer Process Script
 * Handles all UI interactions, DOM manipulations, and client-side logic
 * for the Electron-based TCK Mala Karşı İşlenen Suçlar Editörü application
 */

// ============================================================================
// Application State Management
// ============================================================================

const AppState = {
    currentTab: 'dashboard',
    searchQuery: '',
    filters: {
        crimeType: 'all',
        precedent: 'all',
        dateStart: null,
        dateEnd: null,
        courtType: 'all'
    },
    kararlar: [],
    recentActivities: []
};

// ============================================================================
// DOM Ready Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Renderer process initialized');
    
    // Initialize UI components
    initializeTabNavigation();
    initializeSearchHandlers();
    initializeFilterHandlers();
    initializeModalHandlers();
    initializeFormValidation();
    
    // Load initial data
    await loadStatistics();
    await loadRecentActivities();
    
    // Setup menu event listeners
    setupMenuListeners();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    console.log('Application ready');
});

// ============================================================================
// Tab Navigation System
// ============================================================================

function initializeTabNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Update active button
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update active content
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
            loadTabContent(tabId);
        } else {
            content.classList.remove('active');
        }
    });
    
    AppState.currentTab = tabId;
    console.log(`Switched to tab: ${tabId}`);
}

async function loadTabContent(tabId) {
    switch (tabId) {
        case 'dashboard':
            await loadStatistics();
            await loadRecentActivities();
            break;
        case 'bilisim':
            await loadBilisimSuclari();
            break;
        case 'dolandiricilik':
            await loadDolandiricilik();
            break;
        case 'kredi-karti':
            await loadKrediKartiSuclari();
            break;
        case 'mahkeme-kararlari':
            await loadMahkemeKararlari();
            break;
        default:
            console.log(`No specific loader for tab: ${tabId}`);
    }
}

// ============================================================================
// Statistics and Dashboard
// ============================================================================

async function loadStatistics() {
    try {
        const [bilisimData, dolandiricilikData, krediKartiData] = await Promise.all([
            window.api.bilişim.getAll(),
            window.api.dolandırıcılık.getAll(),
            window.api.krediKartı.getAll()
        ]);
        
        // Update statistics display with animation
        updateStatWithAnimation('count-bilisim', bilisimData.length);
        updateStatWithAnimation('count-dolandiricilik', dolandiricilikData.length);
        updateStatWithAnimation('count-kredi-karti', krediKartiData.length);
        updateStatWithAnimation('count-total', 
            bilisimData.length + dolandiricilikData.length + krediKartiData.length);
        
        console.log('Statistics loaded successfully');
    } catch (error) {
        console.error('Error loading statistics:', error);
        showNotification('İstatistikler yüklenirken hata oluştu', 'error');
    }
}

function updateStatWithAnimation(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const increment = Math.ceil((value - currentValue) / 20);
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= value) || (increment < 0 && current <= value)) {
            current = value;
            clearInterval(timer);
        }
        element.textContent = current;
    }, 30);
}

async function loadRecentActivities() {
    const container = document.getElementById('recent-activities');
    if (!container) return;
    
    // Mock recent activities - in real app, this would come from the database
    const activities = [
        { type: 'Bilişim Suçları', action: 'Yeni kayıt eklendi', time: '5 dakika önce' },
        { type: 'Dolandırıcılık', action: 'Kayıt güncellendi', time: '1 saat önce' },
        { type: 'Kredi Kartı', action: 'Kayıt silindi', time: '3 saat önce' }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-history"></i>
            </div>
            <div class="activity-content">
                <strong>${activity.type}</strong> - ${activity.action}
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// Data Loading Functions
// ============================================================================

async function loadBilisimSuclari() {
    try {
        const data = await window.api.bilişim.getAll();
        const tableBody = document.querySelector('#bilisim-table tbody');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = data.map(item => `
            <tr data-id="${item.id}">
                <td>${escapeHtml(item.dosya_no || '')}</td>
                <td>${escapeHtml(item.ad_soyad || '')}</td>
                <td>${escapeHtml(item.suc_turu || '')}</td>
                <td>${formatCurrency(item.zarar_miktari)}</td>
                <td><span class="status-badge status-${item.durum}">${item.durum}</span></td>
                <td>
                    <button class="btn-icon btn-edit" onclick="editRecord('bilisim', '${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteRecord('bilisim', '${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        console.log(`Loaded ${data.length} bilişim suçları records`);
    } catch (error) {
        console.error('Error loading bilişim suçları:', error);
        showNotification('Veriler yüklenirken hata oluştu', 'error');
    }
}

async function loadDolandiricilik() {
    try {
        const data = await window.api.dolandırıcılık.getAll();
        console.log(`Loaded ${data.length} dolandırıcılık records`);
        // Implementation similar to loadBilisimSuclari
    } catch (error) {
        console.error('Error loading dolandırıcılık:', error);
        showNotification('Veriler yüklenirken hata oluştu', 'error');
    }
}

async function loadKrediKartiSuclari() {
    try {
        const data = await window.api.krediKartı.getAll();
        console.log(`Loaded ${data.length} kredi kartı suçları records`);
        // Implementation similar to loadBilisimSuclari
    } catch (error) {
        console.error('Error loading kredi kartı suçları:', error);
        showNotification('Veriler yüklenirken hata oluştu', 'error');
    }
}

// ============================================================================
// Search Functionality
// ============================================================================

function initializeSearchHandlers() {
    const searchInput = document.getElementById('karar-search');
    if (searchInput) {
        // Debounced search
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300);
        });
    }
    
    // Global search if exists
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        let searchTimeout;
        globalSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performGlobalSearch(e.target.value);
            }, 300);
        });
    }
}

function performSearch(query) {
    AppState.searchQuery = query.toLowerCase();
    console.log(`Searching for: ${query}`);
    
    if (AppState.currentTab === 'mahkeme-kararlari') {
        filterAndDisplayKararlar();
    }
}

function performGlobalSearch(query) {
    console.log(`Global search for: ${query}`);
    // Implementation for global search across all tabs
}

// ============================================================================
// Filter System
// ============================================================================

function initializeFilterHandlers() {
    const filterButton = document.getElementById('btn-filter');
    if (filterButton) {
        filterButton.addEventListener('click', applyFilters);
    }
    
    // Filter dropdowns
    const filterInputs = document.querySelectorAll('.filter-group select, .filter-group input');
    filterInputs.forEach(input => {
        input.addEventListener('change', updateFilterState);
    });
}

function updateFilterState(e) {
    const id = e.target.id;
    const value = e.target.value;
    
    switch (id) {
        case 'filter-suç-türü':
            AppState.filters.crimeType = value;
            break;
        case 'filter-emsal':
            AppState.filters.precedent = value;
            break;
        case 'filter-mahkeme-turu':
            AppState.filters.courtType = value;
            break;
        case 'filter-tarih-baslangic':
            AppState.filters.dateStart = value;
            break;
        case 'filter-tarih-bitis':
            AppState.filters.dateEnd = value;
            break;
    }
}

function applyFilters() {
    console.log('Applying filters:', AppState.filters);
    
    if (AppState.currentTab === 'mahkeme-kararlari') {
        filterAndDisplayKararlar();
    }
    
    showNotification('Filtreler uygulandı', 'success');
}

// ============================================================================
// Mahkeme Kararları (Court Decisions)
// ============================================================================

async function loadMahkemeKararlari() {
    // Mock data - in real app, this would come from database
    AppState.kararlar = [
        {
            id: '1',
            karar_no: 'Yargıtay 12. Ceza Dairesi 2022/12345',
            karar_tarihi: '2022-06-20',
            mahkeme_adı: 'Yargıtay 12. Ceza Dairesi',
            dosya_no: '2022/12345',
            suç_türü: 'Bilişim Suçları',
            madde_no: 'TCK 244/1',
            özet: 'Bitcoin madenciliği için başkasının bilgisayar sistemini izinsiz kullanma',
            karar_metni: 'Sanığın başkasına ait bilgisayar sistemine izinsiz erişerek kripto para madenciliği yapması...',
            emsal_niteliği: 1,
            ilgili_kanun: 'TCK, Elektrik Piyasası Kanunu',
            tags: ['bitcoin', 'kripto para', 'madencilik']
        },
        {
            id: '2',
            karar_no: '2023/7890',
            karar_tarihi: '2023-01-15',
            mahkeme_adı: 'İstanbul 5. Ağır Ceza Mahkemesi',
            dosya_no: '2023/456 E.',
            suç_türü: 'Nitelikli Dolandırıcılık',
            madde_no: 'TCK 158/1-e',
            özet: 'Sahte fatura düzenleyerek KDV iadesi almak',
            karar_metni: 'Sanıkların gerçekte olmayan işlemleri gösteren sahte faturalar düzenleyerek...',
            emsal_niteliği: 1,
            ilgili_kanun: 'TCK, Vergi Usul Kanunu',
            tags: ['sahte fatura', 'KDV iadesi', 'vergi']
        },
        {
            id: '3',
            karar_no: '2021/9999',
            karar_tarihi: '2021-09-10',
            mahkeme_adı: 'Ankara 3. Asliye Ceza Mahkemesi',
            dosya_no: '2021/888 E.',
            suç_türü: 'Kredi Kartı Suçları',
            madde_no: 'TCK 245/2',
            özet: 'Kayıp kredi kartını bulan şahsın kartı kullanması',
            karar_metni: 'Sanığın yolda bulduğu kayıp kredi kartını sahibine iade etmek yerine...',
            emsal_niteliği: 0,
            ilgili_kanun: 'TCK',
            tags: ['kayıp kart', 'buluntu', 'kötü niyet']
        }
    ];
    
    filterAndDisplayKararlar();
}

function filterAndDisplayKararlar() {
    let filtered = [...AppState.kararlar];
    
    // Apply search filter
    if (AppState.searchQuery) {
        filtered = filtered.filter(karar => 
            karar.karar_no.toLowerCase().includes(AppState.searchQuery) ||
            karar.özet.toLowerCase().includes(AppState.searchQuery) ||
            karar.suç_türü.toLowerCase().includes(AppState.searchQuery)
        );
    }
    
    // Apply crime type filter
    if (AppState.filters.crimeType !== 'all') {
        filtered = filtered.filter(karar => karar.suç_türü === AppState.filters.crimeType);
    }
    
    // Apply precedent filter
    if (AppState.filters.precedent !== 'all') {
        filtered = filtered.filter(karar => karar.emsal_niteliği === 1);
    }
    
    // Apply date filters
    if (AppState.filters.dateStart) {
        filtered = filtered.filter(karar => karar.karar_tarihi >= AppState.filters.dateStart);
    }
    if (AppState.filters.dateEnd) {
        filtered = filtered.filter(karar => karar.karar_tarihi <= AppState.filters.dateEnd);
    }
    
    displayKararlar(filtered);
}

function displayKararlar(kararlar) {
    const container = document.getElementById('karar-listesi');
    if (!container) return;
    
    if (kararlar.length === 0) {
        container.innerHTML = '<p class="no-results">Sonuç bulunamadı</p>';
        return;
    }
    
    container.innerHTML = kararlar.map(karar => `
        <div class="karar-karti ${karar.emsal_niteliği ? 'emsal' : ''}" data-id="${karar.id}">
            <div class="karar-karti-header">
                <h3>${escapeHtml(karar.karar_no)}</h3>
                ${karar.emsal_niteliği ? '<span class="emsal-badge">Emsal</span>' : ''}
            </div>
            
            <div class="karar-meta">
                <div class="karar-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(karar.karar_tarihi)}</span>
                </div>
                <div class="karar-meta-item">
                    <i class="fas fa-balance-scale"></i>
                    <span>${escapeHtml(karar.mahkeme_adı)}</span>
                </div>
                <div class="karar-meta-item">
                    <i class="fas fa-gavel"></i>
                    <span>${escapeHtml(karar.suç_türü)}</span>
                </div>
            </div>
            
            <div class="karar-özet">
                ${escapeHtml(karar.özet)}
            </div>
            
            <div class="karar-tags">
                ${karar.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
            
            <button class="btn-secondary btn-view-karar" onclick="viewKararDetay('${karar.id}')">
                <i class="fas fa-eye"></i> Detayları Gör
            </button>
        </div>
    `).join('');
}

function viewKararDetay(kararId) {
    const karar = AppState.kararlar.find(k => k.id === kararId);
    if (!karar) return;
    
    // Populate modal with karar details
    document.getElementById('modal-karar-baslik').textContent = karar.karar_no;
    document.getElementById('detay-karar-no').textContent = karar.karar_no;
    document.getElementById('detay-karar-tarihi').textContent = formatDate(karar.karar_tarihi);
    document.getElementById('detay-mahkeme').textContent = karar.mahkeme_adı;
    document.getElementById('detay-dosya-no').textContent = karar.dosya_no;
    document.getElementById('detay-suç-türü').textContent = karar.suç_türü;
    document.getElementById('detay-madde-no').textContent = karar.madde_no;
    document.getElementById('detay-ilgili-kanun').textContent = karar.ilgili_kanun;
    document.getElementById('detay-özet').textContent = karar.özet;
    document.getElementById('detay-karar-metni').textContent = karar.karar_metni;
    
    const tagsContainer = document.getElementById('detay-tags');
    tagsContainer.innerHTML = karar.tags.map(tag => 
        `<span class="tag">${escapeHtml(tag)}</span>`
    ).join('');
    
    // Show modal
    openModal('modal-karar-detay');
}

// ============================================================================
// Modal Management
// ============================================================================

function initializeModalHandlers() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });
    
    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) closeModal(openModal.id);
        }
    });
    
    // Setup specific modal buttons
    const btnPrintKarar = document.getElementById('btn-print-karar');
    if (btnPrintKarar) {
        btnPrintKarar.addEventListener('click', printKarar);
    }
    
    const btnExportKarar = document.getElementById('btn-export-karar');
    if (btnExportKarar) {
        btnExportKarar.addEventListener('click', exportKarar);
    }
    
    const btnUseAsTemplate = document.getElementById('btn-use-as-template');
    if (btnUseAsTemplate) {
        btnUseAsTemplate.addEventListener('click', useAsTemplate);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================================================
// Form Validation
// ============================================================================

function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (validateForm(form)) {
        submitForm(form);
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Bu alan zorunludur';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Geçerli bir e-posta adresi giriniz';
        }
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        if (isNaN(value)) {
            isValid = false;
            errorMessage = 'Geçerli bir sayı giriniz';
        }
    }
    
    // Display error or clear it
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

async function submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Submitting form:', data);
    
    try {
        // Determine which API to call based on form ID
        const formId = form.id;
        let result;
        
        if (formId === 'form-bilisim') {
            result = await window.api.bilişim.save(data);
        } else if (formId === 'form-dolandiricilik') {
            result = await window.api.dolandırıcılık.save(data);
        } else if (formId === 'form-kredi-karti') {
            result = await window.api.krediKartı.save(data);
        }
        
        if (result && result.success) {
            showNotification('Kayıt başarıyla kaydedildi', 'success');
            form.reset();
            closeModal(form.closest('.modal').id);
            await loadTabContent(AppState.currentTab);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Kayıt sırasında hata oluştu', 'error');
    }
}

// ============================================================================
// Notification System
// ============================================================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================================================
// Menu Event Handlers
// ============================================================================

function setupMenuListeners() {
    window.api.onMenuEvent('menu:backup', async () => {
        try {
            const result = await window.api.backup.create();
            if (result.success) {
                showNotification('Yedekleme başarıyla oluşturuldu!', 'success');
            }
        } catch (error) {
            console.error('Backup error:', error);
            showNotification('Yedekleme hatası', 'error');
        }
    });
    
    window.api.onMenuEvent('menu:restore', async () => {
        // Implementation for restore
        console.log('Restore initiated');
    });
    
    window.api.onMenuEvent('menu:report-all', async () => {
        try {
            const result = await window.api.report.generate({ type: 'all' });
            if (result.success) {
                showNotification('Rapor oluşturuldu!', 'success');
            }
        } catch (error) {
            console.error('Report error:', error);
            showNotification('Rapor oluşturma hatası', 'error');
        }
    });
    
    window.api.onMenuEvent('menu:report-bilisim', async () => {
        try {
            const result = await window.api.report.generate({ type: 'bilisim' });
            if (result.success) {
                showNotification('Bilişim suçları raporu oluşturuldu!', 'success');
            }
        } catch (error) {
            console.error('Report error:', error);
            showNotification('Rapor oluşturma hatası', 'error');
        }
    });
}

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S - Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const activeForm = document.querySelector('.modal.active form');
            if (activeForm) {
                activeForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Ctrl/Cmd + F - Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('karar-search') || 
                              document.getElementById('global-search');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Tab navigation with Alt + number
        if (e.altKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const tabs = ['dashboard', 'bilisim', 'dolandiricilik', 'kredi-karti', 'reports', 'backup'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabs[tabIndex]) {
                switchTab(tabs[tabIndex]);
            }
        }
    });
}

// ============================================================================
// Action Handlers (called from onclick attributes)
// ============================================================================

function editRecord(type, id) {
    console.log(`Editing ${type} record:`, id);
    // Implementation for editing records
    showNotification('Düzenleme özelliği hazırlanıyor', 'info');
}

function deleteRecord(type, id) {
    if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        console.log(`Deleting ${type} record:`, id);
        // Implementation for deleting records
        showNotification('Kayıt silindi', 'success');
    }
}

function printKarar() {
    window.print();
}

function exportKarar() {
    showNotification('Dışa aktarma özelliği hazırlanıyor', 'info');
}

function useAsTemplate() {
    showNotification('Şablon olarak kullanma özelliği hazırlanıyor', 'info');
}

// ============================================================================
// Utility Functions
// ============================================================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatCurrency(amount) {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat('tr-TR', { 
        style: 'currency', 
        currency: 'TRY' 
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// Export functions for global use (if needed)
// ============================================================================

// Make certain functions globally accessible for onclick handlers
window.viewKararDetay = viewKararDetay;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.printKarar = printKarar;
window.exportKarar = exportKarar;
window.useAsTemplate = useAsTemplate;

console.log('Renderer.js loaded successfully');
