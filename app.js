// app.js
// Scripts principais da aplicação

let client;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicação iniciada!');
    
    // Verificar se a configuração está disponível
    if (typeof window.API_CONFIG === 'undefined') {
        showConfigError();
        return;
    }

    // Verificar se o cliente está disponível
    if (typeof window.FootballAPIClient === 'undefined') {
        showError('FootballAPIClient não encontrado. Verifique se footballClient.js está incluído.');
        return;
    }

    // Inicializar cliente
    try {
        client = new window.FootballAPIClient(window.API_CONFIG);
        console.log('✅ Cliente inicializado com sucesso!');
        
        // Testar conexão (opcional)
        // client.testConnection();
        
    } catch (error) {
        console.error('❌ Erro ao inicializar cliente:', error);
        showError(`Erro na inicialização: ${error.message}`);
    }
});

// Função principal para buscar fixtures
async function fetchFixtures() {
    if (!client) {
        showError('Cliente não inicializado. Verifique se os arquivos config.js e footballClient.js estão incluídos.');
        return;
    }

    const btn = document.getElementById('fetchBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    // Mostrar loading
    btn.disabled = true;
    loading.style.display = 'block';
    results.style.display = 'none';
    
    try {
        const params = {
            league: document.getElementById('league').value,
            season: document.getElementById('season').value,
            status: document.getElementById('status').value
        };

        // Adicionar round se especificado
        const round = document.getElementById('round').value.trim();
        if (round) {
            params.round = round;
        }

        console.log('🚀 Iniciando busca com parâmetros:', params);
        
        const data = await client.getFixtures(params);
        
        console.log('📦 Dados completos recebidos:', data);
        
        displayResults(data);
        
    } catch (error) {
        console.error('❌ Erro completo:', error);
        showError(`Erro na requisição: ${error.message}`);
    } finally {
        btn.disabled = false;
        loading.style.display = 'none';
    }
}

// Função para exibir os resultados
function displayResults(data) {
    const results = document.getElementById('results');
    const stats = document.getElementById('stats');
    const fixtures = document.getElementById('fixtures');
    
    // Limpar resultados anteriores
    stats.innerHTML = '';
    fixtures.innerHTML = '';
    
    if (!data.response || data.response.length === 0) {
        const league = document.getElementById('league').selectedOptions[0].text;
        const season = document.getElementById('season').value;
        const status = document.getElementById('status').selectedOptions[0].text;
        
        fixtures.innerHTML = `
            <div class="warning">
                <h3>📭 Nenhuma fixture encontrada</h3>
                <p><strong>Parâmetros utilizados:</strong></p>
                <ul style="margin: 10px 0 10px 20px;">
                    <li>Liga: ${league}</li>
                    <li>Temporada: ${season}</li>
                    <li>Status: ${status}</li>
                </ul>
                <p><strong>💡 Sugestões:</strong></p>
                <ul style="margin: 10px 0 0 20px;">
                    <li>Tente uma temporada mais recente (2023 ou 2024)</li>
                    <li>Verifique se a liga teve jogos na temporada selecionada</li>
                    <li>Para ligas brasileiras, use temporadas como 2023 ou 2024</li>
                </ul>
            </div>
        `;
        results.style.display = 'block';
        return;
    }
    
    // Estatísticas
    stats.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${data.response.length}</div>
            <div class="stat-label">Jogos encontrados</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${data.paging?.current || 1}</div>
            <div class="stat-label">Página atual</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${data.paging?.total || 1}</div>
            <div class="stat-label">Total páginas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${data.results || 0}</div>
            <div class="stat-label">Total resultados</div>
        </div>
    `;
    
    // Fixtures
    data.response.forEach(fixture => {
        const card = createFixtureCard(fixture);
        fixtures.appendChild(card);
    });
    
    results.style.display = 'block';
}

// Função para criar card de fixture
function createFixtureCard(fixture) {
    const div = document.createElement('div');
    div.className = 'fixture-card';
    
    const date = new Date(fixture.fixture.date);
    const formattedDate = date.toLocaleString('pt-BR');
    
    div.innerHTML = `
        <div class="match-header">
            <span class="league-info">${fixture.league.name} - ${fixture.league.round}</span>
            <span class="match-date">${formattedDate}</span>
        </div>
        
        <div class="teams">
            <div class="team">
                <img src="${fixture.teams.home.logo}" alt="${fixture.teams.home.name}" class="team-logo" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNkZGQiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI3IiB5PSI3Ij4KPHBhdGggZD0iTTggMEE4IDggMCAwIDAgOCAxNkE4IDggMCAwIDAgOCAwWiIgZmlsbD0iIzk5OSIvPgo8L3N2Zz4KPC9zdmc+'" />
                <span>${fixture.teams.home.name}</span>
            </div>
            
            <div class="score">
                ${fixture.goals.home !== null ? fixture.goals.home : '-'} x ${fixture.goals.away !== null ? fixture.goals.away : '-'}
            </div>
            
            <div class="team">
                <span>${fixture.teams.away.name}</span>
                <img src="${fixture.teams.away.logo}" alt="${fixture.teams.away.name}" class="team-logo"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNkZGQiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI3IiB5PSI3Ij4KPHBhdGggZD0iTTggMEE4IDggMCAwIDAgOCAxNkE4IDggMCAwIDAgOCAwWiIgZmlsbD0iIzk5OSIvPgo8L3N2Zz4KPC9zdmc+'" />
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 10px; font-size: 0.9rem; color: #7f8c8d;">
            Status: ${getStatusText(fixture.fixture.status.short)} | Estádio: ${fixture.fixture.venue.name || 'N/A'}
        </div>
    `;
    
    return div;
}

// Função para traduzir status
function getStatusText(status) {
    const statusMap = {
        'NS': 'Não iniciado',
        'FT': 'Finalizado',
        'LIVE': 'Ao vivo',
        '1H': '1º Tempo',
        '2H': '2º Tempo',
        'HT': 'Intervalo',
        'ET': 'Prorrogação',
        'P': 'Pênaltis',
        'SUSP': 'Suspenso',
        'PST': 'Adiado',
        'CANC': 'Cancelado',
        'ABD': 'Abandonado',
        'AWD': 'Walkover',
        'WO': 'Walkover'
    };
    return statusMap[status] || status;
}

// Função para mostrar erro de configuração
function showConfigError() {
    const content = document.querySelector('.content');
    content.innerHTML = `
        <div class="error">
            <h3>❌ Configuração não encontrada</h3>
            <p>Por favor, crie e configure o arquivo <strong>config.js</strong> com sua chave da API.</p>
            <br>
            <p><strong>Passo a passo:</strong></p>
            <ol style="margin-left: 20px; margin-top: 10px;">
                <li>Crie o arquivo <code>config.js</code> no mesmo diretório do HTML</li>
                <li>Substitua <code>XxXxXxXxXxXxXxXxXxXxXxXx</code> pela sua chave real da API</li>
                <li>Adicione <code>config.js</code> ao seu <code>.gitignore</code></li>
                <li>Recarregue esta página</li>
            </ol>
        </div>
    `;
}

// Função para mostrar erros gerais
function showError(message) {
    const results = document.getElementById('results');
    results.innerHTML = `<div class="error">${message}</div>`;
    results.style.display = 'block';
}

// Função para mostrar avisos
function showWarning(message) {
    const results = document.getElementById('results');
    const existingContent = results.innerHTML;
    results.innerHTML = `<div class="warning">${message}</div>` + existingContent;
    results.style.display = 'block';
}

// Função para testar a conexão (pode ser chamada manualmente)
async function testConnection() {
    if (!client) {
        console.error('Cliente não inicializado');
        return;
    }
    
    console.log('🧪 Testando conexão...');
    const isConnected = await client.testConnection();
    
    if (isConnected) {
        showError('✅ Conexão OK! A API está funcionando corretamente.');
    } else {
        showError('❌ Falha na conexão. Verifique sua chave da API e conexão com a internet.');
    }
}

// Log inicial
console.log('🏆 Scripts carregados! Use o console para acompanhar as requisições.');
console.log('💡 Dica: Você pode chamar testConnection() no console para testar a API.');

// Disponibilizar função de teste globalmente
window.testConnection = testConnection;