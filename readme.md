# ⚽ API Football Tester

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![API](https://img.shields.io/badge/API-Football-green?style=for-the-badge)

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success.svg?style=flat-square)

Uma aplicação web simples e elegante para testar e consumir a API-Football de forma controlada, com proteção de credenciais e compatibilidade total com planos gratuitos.

## 📋 Características

- 🔒 **Proteção de Credenciais** - Chave da API em arquivo separado
- 🆓 **Plano Gratuito** - Compatível com limitações do plano gratuito
- ⏱️ **Rate Limiting** - Controle automático de requisições
- 📱 **Responsivo** - Interface adaptável para mobile e desktop
- 🎨 **Design Moderno** - Interface limpa com gradientes e animações
- 🔍 **Logs Detalhados** - Console com informações completas de debug
- ⚡ **Sem Dependências** - Vanilla JavaScript puro

## 🚀 Funcionalidades

- Busca de fixtures por liga, temporada e status
- Filtro por rodada específica
- Visualização de resultados com logos dos times
- Estatísticas da consulta (total de jogos, paginação)
- Tratamento robusto de erros
- Teste de conectividade com a API

## 📁 Estrutura do Projeto

```
api-football-tester/
├── index.html          # Interface principal
├── styles.css          # Estilos da aplicação
├── app.js              # Lógica da interface
├── footballClient.js   # Cliente da API
├── config.js           # Configurações da API (não versionado)
├── .gitignore         # Arquivos ignorados pelo Git
└── README.md          # Documentação
```

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/api-football-tester.git
cd api-football-tester
```

### 2. Configure a API
Crie o arquivo `config.js` na raiz do projeto:

```javascript
const API_CONFIG = {
  BASE_URL: 'https://v3.football.api-sports.io',
  API_KEY: 'SUA_CHAVE_AQUI', // Substitua pela sua chave real
  HEADERS: {
    'x-rapidapi-host': 'v3.football.api-sports.io',
    'x-rapidapi-key': 'SUA_CHAVE_AQUI' // Substitua pela sua chave real
  }
};

// Para usar no Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}

// Para usar no browser
if (typeof window !== 'undefined') {
  window.API_CONFIG = API_CONFIG;
}
```

### 3. Execute a aplicação
Abra o arquivo `index.html` em um navegador moderno ou use um servidor local:

```bash
# Com Python
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Com PHP
php -S localhost:8000
```

## 🎯 Como Usar

1. **Configure sua chave da API** no arquivo `config.js`
2. **Abra o index.html** no navegador
3. **Selecione os parâmetros** desejados:
   - Liga (Premier League, La Liga, etc.)
   - Temporada (2023, 2024, etc.)
   - Status (Finalizados, Não iniciados, Ao vivo)
   - Rodada (opcional)
4. **Clique em "Buscar Fixtures"** para fazer a consulta
5. **Acompanhe os logs** no console do navegador (F12)

## 🔧 Parâmetros Disponíveis

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `league` | ID da liga | `39` (Premier League) |
| `season` | Ano da temporada | `2023` |
| `status` | Status dos jogos | `FT`, `NS`, `LIVE` |
| `round` | Rodada específica | `Regular Season - 1` |

## 📊 Ligas Suportadas

- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League (ID: 39)
- 🇪🇸 La Liga (ID: 140) 
- 🇩🇪 Bundesliga (ID: 78)
- 🇮🇹 Serie A (ID: 135)
- 🇫🇷 Ligue 1 (ID: 61)
- 🇧🇷 Brasileirão (ID: 71)

## 🛡️ Segurança

- ✅ Arquivo `config.js` incluído no `.gitignore`
- ✅ Rate limiting para evitar excesso de requisições
- ✅ Tratamento seguro de erros da API
- ✅ Validação de parâmetros no cliente

## 📱 Compatibilidade

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🐛 Solução de Problemas

### Erro: "Configuração não encontrada"
- Verifique se o arquivo `config.js` existe
- Confirme se sua chave da API está configurada

### Erro: "Plano Gratuito"
- Esta aplicação é totalmente compatível com planos gratuitos
- Evite usar parâmetros não suportados como `last`

### Nenhum resultado encontrado
- Verifique se a temporada selecionada é válida
- Tente uma liga diferente
- Para o Brasileirão, use temporadas recentes (2023+)

## 🔗 Links Úteis

- [API-Football Documentação](https://www.api-football.com/documentation-v3)
- [Obter Chave da API](https://rapidapi.com/api-sports/api/api-football/)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Desenvolvido por André Batista para facilitar o teste da API-Football