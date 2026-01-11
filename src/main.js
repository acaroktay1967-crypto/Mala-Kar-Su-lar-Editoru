document.addEventListener('DOMContentLoaded', async () => {
    // Tab geçişleri
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Aktif butonu güncelle
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Aktif içeriği güncelle
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                    loadTabContent(tabId);
                }
            });
        });
    });
    
    // İstatistikleri yükle
    await loadStatistics();
    
    // Menü olaylarını dinle
    setupMenuListeners();
});

async function loadStatistics() {
    try {
        const [bilisimData, dolandiricilikData, krediKartiData] = await Promise.all([
            window.api.bilişim.getAll(),
            window.api.dolandırıcılık.getAll(),
            window.api.krediKartı.getAll()
        ]);
        
        document.getElementById('count-bilisim').textContent = bilisimData.length;
        document.getElementById('count-dolandiricilik').textContent = dolandiricilikData.length;
        document.getElementById('count-kredi-karti').textContent = krediKartiData.length;
        document.getElementById('count-total').textContent = 
            bilisimData.length + dolandiricilikData.length + krediKartiData.length;
        
    } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
    }
}

function setupMenuListeners() {
    window.api.onMenuEvent('menu:backup', async () => {
        const result = await window.api.backup.create();
        if (result.success) {
            showNotification('Yedekleme başarıyla oluşturuldu!', 'success');
        }
    });
    
    window.api.onMenuEvent('menu:report-all', async () => {
        const result = await window.api.report.generate({ type: 'all' });
        if (result.success) {
            showNotification('Rapor oluşturuldu!', 'success');
        }
    });
}

function showNotification(message, type = 'info') {
    // Bildirim gösterimi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadTabContent(tabId) {
    // TODO: Her sekme yüklendiğinde çalışacak kod buraya eklenecek
    // Şu an için sadece log yazılıyor
    console.log(`Yüklenen sekme: ${tabId}`);
}