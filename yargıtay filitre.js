// MahkemeKararlariManager sınıfını güncelleyelim
class MahkemeKararlariManager {
  constructor() {
    this.currentFilter = {
      suçTürü: 'all',
      mahkemeTuru: 'all',
      emsal: 'all',
      tarihBaslangic: '',
      tarihBitis: ''
    };
    
    this.initializeEventListeners();
    this.loadKararlar();
    this.loadYargitayStats();
  }
  
  initializeEventListeners() {
    // ... mevcut event listener'lar
    
    // Yargıtay filtresi
    document.getElementById('filter-mahkeme-turu')?.addEventListener('change', (e) => {
      this.currentFilter.mahkemeTuru = e.target.value;
      this.applyFilters();
    });
    
    // Tüm Yargıtay kararları butonu
    document.getElementById('btn-yargitay-tumu')?.addEventListener('click', () => {
      this.showAllYargitayKararlari();
    });
  }
  
  async showAllYargitayKararlari() {
    try {
      const allKararlar = await window.api.mahkemeKararlari.getAll();
      const yargitayKararlari = allKararlar.filter(k => 
        k.mahkeme_adı.includes('Yargıtay')
      );
      
      this.renderKararListesi(yargitayKararlari);
      this.updateFilterUI('Yargıtay');
    } catch (error) {
      console.error('Yargıtay kararları yüklenirken hata:', error);
    }
  }
  
  updateFilterUI(mahkemeTuru) {
    // Filtre dropdown'larını güncelle
    if (document.getElementById('filter-mahkeme-turu')) {
      document.getElementById('filter-mahkeme-turu').value = mahkemeTuru;
    }
  }
  
  async applyFilters() {
    try {
      let kararlar = await window.api.mahkemeKararlari.getAll();
      
      // Suç türü filtresi
      if (this.currentFilter.suçTürü !== 'all') {
        kararlar = kararlar.filter(k => k.suç_türü === this.currentFilter.suçTürü);
      }
      
      // Mahkeme türü filtresi (Yargıtay, Ağır Ceza, Asliye)
      if (this.currentFilter.mahkemeTuru === 'Yargıtay') {
        kararlar = kararlar.filter(k => k.mahkeme_adı.includes('Yargıtay'));
      } else if (this.currentFilter.mahkemeTuru === 'Ağır Ceza') {
        kararlar = kararlar.filter(k => k.mahkeme_adı.includes('Ağır Ceza'));
      } else if (this.currentFilter.mahkemeTuru === 'Asliye') {
        kararlar = kararlar.filter(k => k.mahkeme_adı.includes('Asliye'));
      }
      
      // Emsal karar filtresi
      if (this.currentFilter.emsal === '1') {
        kararlar = kararlar.filter(k => k.emsal_niteliği === 1);
      }
      
      // Tarih filtresi
      if (this.currentFilter.tarihBaslangic) {
        const baslangic = new Date(this.currentFilter.tarihBaslangic);
        kararlar = kararlar.filter(k => new Date(k.karar_tarihi) >= baslangic);
      }
      
      if (this.currentFilter.tarihBitis) {
        const bitis = new Date(this.currentFilter.tarihBitis);
        kararlar = kararlar.filter(k => new Date(k.karar_tarihi) <= bitis);
      }
      
      this.renderKararListesi(kararlar);
    } catch (error) {
      console.error('Filtreleme sırasında hata:', error);
    }
  }
  
  async loadYargitayStats() {
    try {
      const kararlar = await window.api.mahkemeKararlari.getAll();
      
      // Yargıtay kararı istatistikleri
      const yargitayKararlari = kararlar.filter(k => k.mahkeme_adı.includes('Yargıtay'));
      const yargitayEmsalKararlar = yargitayKararlari.filter(k => k.emsal_niteliği === 1);
      
      // İstatistikleri göster
      this.showStats({
        totalYargitay: yargitayKararlari.length,
        emsalYargitay: yargitayEmsalKararlar.length,
        bySuçTürü: this.groupBySuçTürü(yargitayKararlari)
      });
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  }
  
  groupBySuçTürü(kararlar) {
    const groups = {};
    kararlar.forEach(karar => {
      if (!groups[karar.suç_türü]) {
        groups[karar.suç_türü] = 0;
      }
      groups[karar.suç_türü]++;
    });
    return groups;
  }
  
  showStats(stats) {
    const statsHTML = `
      <div class="stats-container">
        <div class="stat-item yargitay">
          <span class="stat-number">${stats.totalYargitay}</span>
          <span>Toplam Yargıtay Kararı</span>
        </div>
        <div class="stat-item yargitay">
          <span class="stat-number">${stats.emsalYargitay}</span>
          <span>Emsal Yargıtay Kararı</span>
        </div>
        ${Object.entries(stats.bySuçTürü).map(([suçTürü, count]) => `
          <div class="stat-item">
            <span class="stat-number">${count}</span>
            <span>${suçTürü}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    // İstatistikleri karar listesinden önce göster
    const container = document.getElementById('karar-listesi');
    container.insertAdjacentHTML('beforebegin', statsHTML);
  }
  
  renderKararListesi(kararlar) {
    const container = document.getElementById('karar-listesi');
    
    if (kararlar.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-balance-scale"></i>
          <h3>Karar Bulunamadı</h3>
          <p>Filtre kriterlerinize uygun karar bulunamadı.</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    
    kararlar.forEach(karar => {
      const isYargitay = karar.mahkeme_adı.includes('Yargıtay');
      const isGenelKurul = karar.mahkeme_adı.includes('Genel Kurul');
      const isEmsal = karar.emsal_niteliği === 1;
      
      html += `
        <div class="karar-karti ${isEmsal ? 'emsal' : ''} ${isYargitay ? 'yargitay' : ''}" data-id="${karar.id}">
          <div class="karar-karti-header">
            <h3>${karar.karar_no}</h3>
            <div>
              ${isEmsal ? '<span class="emsal-badge">Emsal Karar</span>' : ''}
              ${isYargitay ? `<span class="${isGenelKurul ? 'yargitay-genel-kurul-badge' : 'yargitay-badge'}">${isGenelKurul ? 'Yargıtay Genel Kurul' : 'Yargıtay'}</span>` : ''}
            </div>
          </div>
          
          <div class="karar-meta">
            <div class="karar-meta-item">
              <i class="far fa-calendar"></i>
              <span>${this.formatDate(karar.karar_tarihi)}</span>
            </div>
            <div class="karar-meta-item">
              <i class="fas fa-gavel"></i>
              <span>${karar.mahkeme_adı}</span>
            </div>
            <div class="karar-meta-item">
              <i class="fas fa-scale-balanced"></i>
              <span>${karar.suç_türü}</span>
            </div>
            <div class="karar-meta-item">
              <i class="fas fa-file-alt"></i>
              <span>${karar.madde_no || '-'}</span>
            </div>
          </div>
          
          <div class="karar-özet" id="özet-${karar.id}">
            ${this.truncateText(karar.özet, 150)}
          </div>
          
          ${karar.özet.length > 150 ? `<span class="read-more" data-id="${karar.id}">Devamını oku</span>` : ''}
          
          ${karar.tags ? `
            <div class="karar-tags">
              ${karar.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
            </div>
          ` : ''}
          
          ${isYargitay ? `
            <div class="yargitay-note" style="margin-top: 1rem; padding: 0.5rem; font-size: 0.9em;">
              <i class="fas fa-star"></i> <strong>Yargıtay Kararı</strong> - Emsal değeri: ${isEmsal ? 'Yüksek' : 'Orta'}
            </div>
          ` : ''}
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // Kartlara tıklama olayları ekle
    this.attachCardEventListeners(kararlar);
  }
  
  async showKararDetay(kararId) {
    try {
      const kararlar = await window.api.mahkemeKararlari.getAll();
      const karar = kararlar.find(k => k.id === kararId);
      
      if (!karar) return;
      
      const isYargitay = karar.mahkeme_adı.includes('Yargıtay');
      
      // Modal içeriğini doldur
      document.getElementById('modal-karar-baslik').textContent = `Karar: ${karar.karar_no}`;
      document.getElementById('detay-karar-no').textContent = karar.karar_no;
      document.getElementById('detay-karar-tarihi').textContent = this.formatDate(karar.karar_tarihi);
      document.getElementById('detay-mahkeme').textContent = karar.mahkeme_adı;
      document.getElementById('detay-dosya-no').textContent = karar.dosya_no || '-';
      document.getElementById('detay-suç-türü').textContent = karar.suç_türü;
      document.getElementById('detay-madde-no').textContent = karar.madde_no || '-';
      document.getElementById('detay-ilgili-kanun').textContent = karar.ilgili_kanun || '-';
      
      // Özet ve karar metni
      document.getElementById('detay-özet').innerHTML = this.formatKararMetni(karar.özet);
      document.getElementById('detay-karar-metni').innerHTML = this.formatKararMetni(karar.karar_metni);
      
      // Yargıtay kararı ise özel not ekle
      if (isYargitay) {
        const kararMetniElement = document.getElementById('detay-karar-metni');
        kararMetniElement.insertAdjacentHTML('beforebegin', `
          <div class="important-decision">
            <h5><i class="fas fa-gavel"></i> YARGITAY KARARI ÖNEMİ</h5>
            <p>Bu karar, Türk Yargıtay'ı tarafından verilmiş olup, benzer davalarda emsal teşkil etme potansiyeli taşımaktadır. 
            Kararın gerekçesi, ilgili hukuki konularda önemli yorumlar içermektedir.</p>
            ${karar.emsal_niteliği ? '<p><strong>✓ EMSAL KARAR:</strong> Bu karar emsal niteliğindedir.</p>' : ''}
          </div>
        `);
      }
      
      // Etiketler
      const tagsContainer = document.getElementById('detay-tags');
      if (karar.tags) {
        tagsContainer.innerHTML = karar.tags.split(',').map(tag => 
          `<span class="tag">${tag.trim()}</span>`
        ).join('');
      } else {
        tagsContainer.innerHTML = '<span>-</span>';
      }
      
      // Modalı göster
      const modal = document.getElementById('modal-karar-detay');
      modal.style.display = 'block';
      
      // Modal kapatma işleyicisi
      this.attachModalEventListeners(modal, karar);
      
    } catch (error) {
      console.error('Karar detayı yüklenirken hata:', error);
      this.showError('Karar detayı yüklenirken bir hata oluştu.');
    }
  }
  
  formatKararMetni(metin) {
    // Metni formatla, başlıkları vurgula
    return metin
      .replace(/YARGITAY KARARI:/g, '<strong>YARGITAY KARARI:</strong>')
      .replace(/PRENSİP KARARI:/g, '<strong class="text-warning">PRENSİP KARARI:</strong>')
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
  }
}