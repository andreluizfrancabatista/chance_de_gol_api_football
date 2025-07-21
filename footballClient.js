// footballClient.js
// Cliente para consumir a API Football de forma controlada

class FootballAPIClient {
  constructor(config) {
    this.baseUrl = config.BASE_URL;
    this.headers = config.HEADERS;
    this.lastRequestTime = 0;
    this.minInterval = 1000; // Mínimo 1 segundo entre requisições
  }

  // Método para adicionar delay entre requisições
  async waitIfNeeded() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      console.log(`⏳ Aguardando ${waitTime}ms para evitar excesso de requisições...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Método principal para buscar fixtures
  async getFixtures(params = {}) {
    await this.waitIfNeeded();
    
    try {
      // Parâmetros padrão compatíveis com todos os planos
      const defaultParams = {
        league: '39', // Premier League
        season: '2023',
        status: 'FT' // Apenas jogos finalizados
      };

      const queryParams = { ...defaultParams, ...params };
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${this.baseUrl}/fixtures?${queryString}`;

      console.log('🔍 Fazendo requisição para:', url);
      console.log('📊 Parâmetros:', queryParams);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('✅ Resposta recebida:', {
        total: data.response?.length || 0,
        paging: data.paging,
        parameters: data.parameters,
        errors: data.errors
      });

      // Verificar se há erros na resposta da API
      if (data.errors) {
        console.warn('⚠️ Erros da API:', data.errors);
        
        // Tratar erro específico do plano gratuito (quando é objeto)
        if (data.errors.plan) {
          const planError = data.errors.plan;
          if (planError.includes('Live')) {
            throw new Error('❌ Plano Gratuito: Dados ao vivo não estão disponíveis no plano gratuito.');
          }
          throw new Error(`❌ Limitação do Plano: ${planError}`);
        }
        
        // Tratar quando erros é array e tem conteúdo
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          throw new Error(`❌ Erro da API: ${data.errors.join(', ')}`);
        }
        
        // Tratar quando erros é objeto mas não tem 'plan'
        if (typeof data.errors === 'object' && !Array.isArray(data.errors)) {
          const errorMessages = Object.values(data.errors).filter(msg => msg); // Filtrar valores vazios
          if (errorMessages.length > 0) {
            throw new Error(`❌ Erro da API: ${errorMessages.join(', ')}`);
          }
        }
      }

      // Verificar se não há dados mas não há erro específico
      if (!data.response || data.response.length === 0) {
        // Se é temporada/data no futuro, dar dica específica
        const season = queryParams.season;
        const currentYear = new Date().getFullYear();
        if (season && parseInt(season) > currentYear) {
          console.log('ℹ️ Nenhum resultado encontrado - temporada futura');
        } else if (queryParams.from && new Date(queryParams.from) > new Date()) {
          console.log('ℹ️ Nenhum resultado encontrado - data futura');  
        } else {
          console.log('ℹ️ Nenhum resultado encontrado com os parâmetros especificados');
        }
      }

      return data;

    } catch (error) {
      console.error('❌ Erro na requisição:', error.message);
      throw error;
    }
  }

  // Método otimizado para plano gratuito (sem parâmetro 'last')
  async getFixturesFreePlan(params = {}) {
    const freePlanParams = { ...params };
    
    // Remover parâmetros não suportados no plano gratuito
    delete freePlanParams.last;
    delete freePlanParams.live;
    
    console.log('🆓 Usando parâmetros compatíveis com plano gratuito:', freePlanParams);
    
    return await this.getFixtures(freePlanParams);
  }

  // Método para buscar jogos de hoje (cuidado com o limite)
  async getTodayFixtures() {
    const today = new Date().toISOString().split('T')[0];
    return await this.getFixtures({ 
      date: today,
      timezone: 'America/Sao_Paulo'
    });
  }

  // Método para buscar jogos ao vivo (use com moderação)
  async getLiveFixtures() {
    return await this.getFixtures({ 
      live: 'all',
      timezone: 'America/Sao_Paulo'
    });
  }

  // Método para testar a conexão com a API
  async testConnection() {
    try {
      console.log('🧪 Testando conexão com a API...');
      const data = await this.getFixtures({ league: '39', season: '2023', status: 'FT' });
      console.log('✅ Conexão OK! API funcionando corretamente.');
      return true;
    } catch (error) {
      console.error('❌ Falha na conexão:', error.message);
      return false;
    }
  }
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FootballAPIClient;
}

// Disponibilizar no browser
if (typeof window !== 'undefined') {
  window.FootballAPIClient = FootballAPIClient;
}

/*
Exemplo de uso no Node.js:

const API_CONFIG = require('./config');
const FootballAPIClient = require('./footballClient');

const client = new FootballAPIClient(API_CONFIG);

// Teste básico
client.getFixtures({ league: '39', season: '2023', status: 'FT' })
  .then(data => {
    console.log('Dados recebidos:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Erro:', error);
  });

// Testar conexão
client.testConnection();
*/