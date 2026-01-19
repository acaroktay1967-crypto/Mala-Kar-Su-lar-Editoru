/**
 * Süre Hesaplayıcı UI İşlemleri
 * Duration Calculator UI Operations
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeCalculator();
});

function initializeCalculator() {
    // Tab değiştirme
    const tabButtons = document.querySelectorAll('.calc-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const panelId = btn.dataset.panel;
            switchPanel(panelId);
            
            // Aktif tab'ı güncelle
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Form submit event'leri
    document.getElementById('form-statute')?.addEventListener('submit', handleStatuteSubmit);
    document.getElementById('form-appeal')?.addEventListener('submit', handleAppealSubmit);
    document.getElementById('form-detention')?.addEventListener('submit', handleDetentionSubmit);
    document.getElementById('form-deferment')?.addEventListener('submit', handleDefermentSubmit);
    document.getElementById('form-notification')?.addEventListener('submit', handleNotificationSubmit);
}

function switchPanel(panelId) {
    // Tüm panelleri gizle
    document.querySelectorAll('.calc-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Seçili paneli göster
    document.getElementById(`panel-${panelId}`)?.classList.add('active');
}

// Zamanaşımı hesaplama
function handleStatuteSubmit(e) {
    e.preventDefault();
    
    const crimeDate = document.getElementById('crime-date').value;
    const sentenceYears = document.getElementById('sentence-years').value;
    const isSexualCrimeMinor = document.getElementById('sexual-crime-minor').checked;
    const isConstitutionalCrime = document.getElementById('constitutional-crime').checked;
    
    let years = sentenceYears;
    if (sentenceYears === 'aggravated_life' || sentenceYears === 'life') {
        years = sentenceYears;
    } else {
        years = parseFloat(sentenceYears);
    }
    
    const result = calculateStatuteOfLimitations(crimeDate, years, isSexualCrimeMinor, isConstitutionalCrime);
    displayStatuteResult(result);
}

function displayStatuteResult(result) {
    const resultDiv = document.getElementById('result-statute');
    
    if (!result.applicable) {
        resultDiv.innerHTML = `
            <div class="result-header">
                <div class="result-icon">ℹ️</div>
                <div class="result-title">Zamanaşımı Uygulanmaz</div>
            </div>
            <div class="result-details">
                <p>${result.reason}</p>
            </div>
        `;
        resultDiv.classList.add('show');
        return;
    }
    
    if (result.suspended) {
        resultDiv.innerHTML = `
            <div class="result-header">
                <div class="result-icon">⏸️</div>
                <div class="result-title">Zamanaşımı Askıda</div>
            </div>
            <div class="result-details">
                <p>${result.reason}</p>
            </div>
        `;
        resultDiv.classList.add('show');
        return;
    }
    
    const status = checkDeadlineStatus(result.endDate);
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-icon">${status.icon}</div>
            <div>
                <div class="result-title">Zamanaşımı Hesaplaması</div>
                <span class="urgency-badge urgency-${status.urgency}">${status.message}</span>
            </div>
        </div>
        <div class="result-details">
            <div class="result-row">
                <span class="result-label">Zamanaşımı Süresi:</span>
                <span class="result-value">${result.limitationPeriod} yıl</span>
            </div>
            <div class="result-row">
                <span class="result-label">Açıklama:</span>
                <span class="result-value">${result.description}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Başlangıç Tarihi:</span>
                <span class="result-value">${formatDate(result.startDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Bitiş Tarihi:</span>
                <span class="result-value">${formatDate(result.endDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Durum:</span>
                <span class="result-value">${result.isExpired ? '❌ Zamanaşımı doldu' : `✅ ${result.daysRemaining} gün kaldı`}</span>
            </div>
        </div>
        ${result.isExpired ? '<div class="info-box" style="background: #ffebee; border-color: #f44336;"><h4 style="color: #c62828;">⚠️ Önemli</h4><p>Zamanaşımı süresi dolmuştur. Dava açılamaz.</p></div>' : ''}
    `;
    
    resultDiv.classList.add('show');
}

// İtiraz süresi hesaplama
function handleAppealSubmit(e) {
    e.preventDefault();
    
    const decisionDate = document.getElementById('decision-date').value;
    const appealType = document.getElementById('appeal-type').value;
    
    const result = calculateAppealDeadline(decisionDate, appealType);
    displayAppealResult(result);
}

function displayAppealResult(result) {
    const resultDiv = document.getElementById('result-appeal');
    const status = checkDeadlineStatus(result.endDate);
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-icon">${status.icon}</div>
            <div>
                <div class="result-title">${result.appealType}</div>
                <span class="urgency-badge urgency-${result.urgency}">${status.message}</span>
            </div>
        </div>
        <div class="result-details">
            <div class="result-row">
                <span class="result-label">İtiraz Süresi:</span>
                <span class="result-value">${result.period}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Karar/Tebliğ Tarihi:</span>
                <span class="result-value">${formatDate(result.startDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Son Başvuru Tarihi:</span>
                <span class="result-value">${formatDate(result.endDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Kalan Süre:</span>
                <span class="result-value">${result.isExpired ? '❌ Süre doldu' : `✅ ${result.daysRemaining} gün`}</span>
            </div>
        </div>
        ${result.urgency === 'critical' && !result.isExpired ? '<div class="info-box" style="background: #fff3cd; border-color: #ffc107;"><h4 style="color: #ff6f00;">⚡ Acil</h4><p>Süre dolmak üzere! En kısa sürede başvuru yapılmalıdır.</p></div>' : ''}
        ${result.isExpired ? '<div class="info-box" style="background: #ffebee; border-color: #f44336;"><h4 style="color: #c62828;">⚠️ Süre Doldu</h4><p>İtiraz süresi geçmiştir. Başvuru yapılamaz.</p></div>' : ''}
    `;
    
    resultDiv.classList.add('show');
}

// Tutuklama süresi hesaplama
function handleDetentionSubmit(e) {
    e.preventDefault();
    
    const detentionDate = document.getElementById('detention-date').value;
    const stage = document.getElementById('detention-stage').value;
    
    const result = calculateDetentionDeadline(detentionDate, stage);
    displayDetentionResult(result);
}

function displayDetentionResult(result) {
    const resultDiv = document.getElementById('result-detention');
    const status = checkDeadlineStatus(result.endDate);
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-icon">${status.icon}</div>
            <div>
                <div class="result-title">Azami Tutukluluk Süresi</div>
                <span class="urgency-badge urgency-${status.urgency}">${status.message}</span>
            </div>
        </div>
        <div class="result-details">
            <div class="result-row">
                <span class="result-label">Aşama:</span>
                <span class="result-value">${result.stage}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Azami Süre:</span>
                <span class="result-value">${result.period}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Açıklama:</span>
                <span class="result-value">${result.description}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Tutuklama Tarihi:</span>
                <span class="result-value">${formatDate(result.startDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Azami Süre Bitimi:</span>
                <span class="result-value">${formatDate(result.endDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Kalan Süre:</span>
                <span class="result-value">${result.isExpired ? '❌ Azami süre doldu' : `✅ ${result.daysRemaining} gün`}</span>
            </div>
        </div>
        <div class="info-box">
            <h4>📌 Hatırlatma</h4>
            <p>Her 30 günde bir tutuklama incelemesi yapılmalıdır. Azami süre sonunda şüpheli/sanık tahliye edilmelidir.</p>
        </div>
    `;
    
    resultDiv.classList.add('show');
}

// HAGB süresi hesaplama
function handleDefermentSubmit(e) {
    e.preventDefault();
    
    const judgmentDate = document.getElementById('judgment-date').value;
    const sentenceLength = parseInt(document.getElementById('sentence-length').value);
    
    const result = calculateDefermentPeriod(judgmentDate, sentenceLength);
    displayDefermentResult(result);
}

function displayDefermentResult(result) {
    const resultDiv = document.getElementById('result-deferment');
    const status = checkDeadlineStatus(result.endDate);
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-icon">${status.icon}</div>
            <div>
                <div class="result-title">HAGB Denetim Süresi</div>
                <span class="urgency-badge urgency-${status.urgency}">${status.message}</span>
            </div>
        </div>
        <div class="result-details">
            <div class="result-row">
                <span class="result-label">Denetim Süresi:</span>
                <span class="result-value">${result.defermentPeriod}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Açıklama:</span>
                <span class="result-value">${result.description}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Karar Tarihi:</span>
                <span class="result-value">${formatDate(result.startDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Denetim Süresi Bitimi:</span>
                <span class="result-value">${formatDate(result.endDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Kalan Süre:</span>
                <span class="result-value">${result.isExpired ? '✅ Denetim süresi tamamlandı' : `📅 ${result.daysRemaining} gün`}</span>
            </div>
        </div>
        <div class="info-box">
            <h4>📌 Önemli</h4>
            <p>Denetim süresi içinde yeni bir kasıtlı suç işlenmemesi ve denetim yükümlülüklerine uyulması halinde hüküm ortadan kalkar.</p>
        </div>
    `;
    
    resultDiv.classList.add('show');
}

// Tebligat süresi hesaplama
function handleNotificationSubmit(e) {
    e.preventDefault();
    
    const notificationDate = document.getElementById('notification-date').value;
    const notificationType = document.getElementById('notification-type').value;
    const additionalDays = parseInt(document.getElementById('additional-days').value) || 0;
    
    const result = calculateNotificationDeadline(notificationDate, notificationType, additionalDays);
    displayNotificationResult(result);
}

function displayNotificationResult(result) {
    const resultDiv = document.getElementById('result-notification');
    const status = checkDeadlineStatus(result.endDate);
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-icon">${status.icon}</div>
            <div>
                <div class="result-title">${result.notificationType}</div>
                <span class="urgency-badge urgency-${status.urgency}">${status.message}</span>
            </div>
        </div>
        <div class="result-details">
            <div class="result-row">
                <span class="result-label">Tebligat Süresi:</span>
                <span class="result-value">${result.basePeriod}</span>
            </div>
            ${result.additionalDays > 0 ? `
            <div class="result-row">
                <span class="result-label">Ek Süre:</span>
                <span class="result-value">${result.additionalDays} gün</span>
            </div>
            ` : ''}
            <div class="result-row">
                <span class="result-label">Toplam Süre:</span>
                <span class="result-value">${result.totalPeriod}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Tebligat Tarihi:</span>
                <span class="result-value">${formatDate(result.startDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Son Başvuru Tarihi:</span>
                <span class="result-value">${formatDate(result.endDate)}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Kalan Süre:</span>
                <span class="result-value">${result.isExpired ? '❌ Süre doldu' : `✅ ${result.daysRemaining} gün`}</span>
            </div>
        </div>
        ${status.urgency === 'critical' && !result.isExpired ? '<div class="info-box" style="background: #fff3cd; border-color: #ffc107;"><h4 style="color: #ff6f00;">⚡ Acil</h4><p>Süre dolmak üzere! En kısa sürede işlem yapılmalıdır.</p></div>' : ''}
    `;
    
    resultDiv.classList.add('show');
}
