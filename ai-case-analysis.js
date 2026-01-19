/**
 * AI-Powered Case Analysis System
 * OpenAI GPT-4 Integration for Legal Case Analysis
 */

// Configuration
const AI_CONFIG = {
  model: 'gpt-4',
  maxTokens: 2000,
  temperature: 0.7,
  apiEndpoint: 'https://api.openai.com/v1/chat/completions'
};

// Analysis Types
const AnalysisTypes = {
  QUICK: 'quick',           // 30 seconds - basic analysis
  DETAILED: 'detailed',      // 2-3 minutes - comprehensive
  PRECEDENT: 'precedent'     // Find similar cases
};

/**
 * AI Case Analysis Class
 */
class AICaseAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.isConfigured = !!apiKey;
  }

  /**
   * Analyze a criminal case using AI
   */
  async analyzeCase(caseData, analysisType = AnalysisTypes.DETAILED) {
    if (!this.isConfigured) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const prompt = this.buildPrompt(caseData, analysisType);
      const response = await this.callOpenAI(prompt);
      const analysis = this.parseAnalysis(response, caseData);
      
      return {
        success: true,
        analysis: analysis,
        timestamp: new Date().toISOString(),
        model: AI_CONFIG.model
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Build AI prompt based on case data
   */
  buildPrompt(caseData, analysisType) {
    const systemPrompt = `Sen Türk Ceza Hukuku konusunda uzman bir yapay zeka asistanısın. 
Türk Ceza Kanunu (TCK), Ceza Muhakemesi Kanunu (CMK) ve Yargıtay içtihatlarına hakimsin.
Verilen olay bilgilerine göre detaylı hukuki analiz yapacaksın.`;

    let userPrompt = '';

    if (analysisType === AnalysisTypes.QUICK) {
      userPrompt = this.buildQuickAnalysisPrompt(caseData);
    } else if (analysisType === AnalysisTypes.DETAILED) {
      userPrompt = this.buildDetailedAnalysisPrompt(caseData);
    } else if (analysisType === AnalysisTypes.PRECEDENT) {
      userPrompt = this.buildPrecedentAnalysisPrompt(caseData);
    }

    return {
      system: systemPrompt,
      user: userPrompt
    };
  }

  /**
   * Quick analysis prompt (30 seconds)
   */
  buildQuickAnalysisPrompt(caseData) {
    return `
HIZLI OLAY ANALİZİ

Olay Bilgileri:
- Olay Türü: ${caseData.caseType || 'Belirtilmemiş'}
- Olay Açıklaması: ${caseData.description || 'Belirtilmemiş'}
- Tarih: ${caseData.date || 'Belirtilmemiş'}
- Yer: ${caseData.location || 'Belirtilmemiş'}

Lütfen aşağıdakileri kısa ve öz şekilde analiz et:
1. Hangi suç işlenmiş olabilir? (TCK madde numarası ile)
2. Olası ceza aralığı nedir?
3. Nitelikli haller var mı?
4. Ana savunma noktaları neler olabilir?

Cevabını markdown formatında ve Türkçe olarak ver.`;
  }

  /**
   * Detailed analysis prompt (2-3 minutes)
   */
  buildDetailedAnalysisPrompt(caseData) {
    return `
DETAYLI OLAY ANALİZİ

Olay Bilgileri:
- Olay Türü: ${caseData.caseType || 'Belirtilmemiş'}
- Olay Açıklaması: ${caseData.description || 'Belirtilmemiş'}
- Tarih: ${caseData.date || 'Belirtilmemiş'}
- Yer: ${caseData.location || 'Belirtilmemiş'}
${caseData.suspects ? `- Şüpheliler: ${caseData.suspects}` : ''}
${caseData.victims ? `- Mağdurlar: ${caseData.victims}` : ''}
${caseData.evidence ? `- Deliller: ${caseData.evidence}` : ''}
${caseData.value ? `- Mal Değeri: ${caseData.value} TL` : ''}
${caseData.additionalInfo ? `- Ek Bilgiler: ${caseData.additionalInfo}` : ''}

Lütfen aşağıdakileri detaylı olarak analiz et:

## 1. SUÇ NİTELEMESİ
- İşlenmiş olabilecek suç/suçlar (TCK madde numaraları ile)
- Suçun unsurları (maddi unsur, manevi unsur, hukuka aykırılık)
- Hangi unsurlar mevcut, hangiler şüpheli?

## 2. NİTELİKLİ HALLER
- Varsa nitelikli halleri belirt (TCK madde ile)
- Her nitelikli halin etkisi nedir?

## 3. CEZA TAHMİNİ
- Temel ceza aralığı
- Nitelikli hallerle ceza aralığı
- Olası indirim sebepleri (teşebbüs, takdiri indirim, vb.)
- Muhtemel kesin ceza aralığı

## 4. SAVUNMA STRATEJİSİ
- Olası savunma yolları
- Delil yetersizliği argümanları
- Alternatif yorumlar
- Prosedürel itirazlar

## 5. DELİL DEĞERLENDİRMESİ
${caseData.evidence ? '- Mevcut delillerin gücü ve güvenilirliği' : '- Delil toplama önerileri'}
- Ek delil ihtiyacı var mı?
- Delillerin hukuki değeri nedir?

## 6. RİSK DEĞERLENDİRMESİ
- Mahkumiyet olasılığı (%)
- Tutuklama riski
- Genel risk seviyesi (düşük/orta/yüksek)

## 7. EMSAL KARAR ÖNERİSİ
- Bu olaya benzer Yargıtay kararları (varsa karar numarası ile)
- Bu kararlardaki temel ilkeler

Cevabını markdown formatında, profesyonel ve Türkçe olarak ver.`;
  }

  /**
   * Precedent analysis prompt
   */
  buildPrecedentAnalysisPrompt(caseData) {
    return `
EMSAL KARAR ARAŞTIRMASI

Olay: ${caseData.description}
Suç Türü: ${caseData.caseType || 'Belirtilmemiş'}
Madde: ${caseData.articleNumber || 'Belirtilmemiş'}

Bu olaya benzer Yargıtay kararlarını ve emsal niteliğindeki kararları bul.

Her karar için belirt:
1. Karar numarası (varsa)
2. Karar özeti
3. Temel ilke/gerekçe
4. Bu olaya uygulanabilirliği

Cevabını markdown formatında ve Türkçe olarak ver.`;
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(prompt) {
    const messages = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user }
    ];

    const response = await fetch(AI_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API Error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Parse AI analysis response
   */
  parseAnalysis(aiResponse, caseData) {
    return {
      rawAnalysis: aiResponse,
      caseData: caseData,
      sections: this.extractSections(aiResponse),
      summary: this.extractSummary(aiResponse),
      recommendations: this.extractRecommendations(aiResponse),
      riskLevel: this.extractRiskLevel(aiResponse),
      sentenceEstimate: this.extractSentenceEstimate(aiResponse)
    };
  }

  /**
   * Extract sections from markdown
   */
  extractSections(markdown) {
    const sections = {};
    const regex = /##\s+(\d+\.)?\s*([A-ZÇĞİÖŞÜ\s]+)\n([\s\S]*?)(?=##|$)/g;
    let match;

    while ((match = regex.exec(markdown)) !== null) {
      const title = match[2].trim();
      const content = match[3].trim();
      sections[title] = content;
    }

    return sections;
  }

  /**
   * Extract summary
   */
  extractSummary(markdown) {
    const lines = markdown.split('\n');
    const summaryLines = [];
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (lines[i].trim()) {
        summaryLines.push(lines[i]);
      }
    }
    
    return summaryLines.join('\n');
  }

  /**
   * Extract recommendations
   */
  extractRecommendations(markdown) {
    const recommendations = [];
    const regex = /[-*]\s+(.+)/g;
    let match;

    while ((match = regex.exec(markdown)) !== null) {
      recommendations.push(match[1].trim());
    }

    return recommendations.slice(0, 10); // Top 10
  }

  /**
   * Extract risk level
   */
  extractRiskLevel(markdown) {
    const lowerText = markdown.toLowerCase();
    
    if (lowerText.includes('yüksek risk') || lowerText.includes('risk seviyesi: yüksek')) {
      return 'high';
    } else if (lowerText.includes('orta risk') || lowerText.includes('risk seviyesi: orta')) {
      return 'medium';
    } else if (lowerText.includes('düşük risk') || lowerText.includes('risk seviyesi: düşük')) {
      return 'low';
    }
    
    return 'unknown';
  }

  /**
   * Extract sentence estimate
   */
  extractSentenceEstimate(markdown) {
    const regex = /(\d+)[-–](\d+)\s+(yıl|ay)/gi;
    const matches = markdown.match(regex);
    
    if (matches && matches.length > 0) {
      return matches[0];
    }
    
    return 'Belirlenemedi';
  }

  /**
   * Save analysis to history
   */
  async saveAnalysisToHistory(analysis) {
    try {
      const history = JSON.parse(localStorage.getItem('ai_analysis_history') || '[]');
      history.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        caseType: analysis.caseData.caseType,
        description: analysis.caseData.description.substring(0, 100),
        riskLevel: analysis.riskLevel,
        sentenceEstimate: analysis.sentenceEstimate,
        fullAnalysis: analysis
      });
      
      // Keep only last 50 analyses
      if (history.length > 50) {
        history.length = 50;
      }
      
      localStorage.setItem('ai_analysis_history', JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Failed to save analysis:', error);
      return false;
    }
  }

  /**
   * Get analysis history
   */
  getAnalysisHistory() {
    try {
      return JSON.parse(localStorage.getItem('ai_analysis_history') || '[]');
    } catch (error) {
      return [];
    }
  }

  /**
   * Clear analysis history
   */
  clearAnalysisHistory() {
    localStorage.removeItem('ai_analysis_history');
  }
}

/**
 * API Key Management
 */
class APIKeyManager {
  constructor() {
    this.storageKey = 'openai_api_key_enc';
  }

  /**
   * Save API key (encrypted)
   */
  saveAPIKey(apiKey) {
    try {
      // Simple encoding (in production, use proper encryption)
      const encoded = btoa(apiKey);
      localStorage.setItem(this.storageKey, encoded);
      return true;
    } catch (error) {
      console.error('Failed to save API key:', error);
      return false;
    }
  }

  /**
   * Load API key (decrypted)
   */
  loadAPIKey() {
    try {
      const encoded = localStorage.getItem(this.storageKey);
      if (!encoded) return null;
      return atob(encoded);
    } catch (error) {
      console.error('Failed to load API key:', error);
      return null;
    }
  }

  /**
   * Remove API key
   */
  removeAPIKey() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Validate API key format
   */
  validateAPIKey(apiKey) {
    // OpenAI keys start with 'sk-'
    return apiKey && apiKey.startsWith('sk-') && apiKey.length > 20;
  }
}

/**
 * Export
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AICaseAnalyzer,
    APIKeyManager,
    AnalysisTypes,
    AI_CONFIG
  };
}
