// Constantes da API
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Função base para fazer pedidos à API do TMDB.
 * @param {string} endpoint - O endpoint da API a ser chamado (ex: /movie/popular).
 * @param {Object} [params={}] - Parâmetros de query adicionais.
 * @returns {Promise<Object>} - A resposta da API em formato JSON.
 */
const fetchDaApi = async (endpoint, params = {}) => {
  // Constrói a URL de base com a chave da API
  const urlParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'pt-PT', // Define o idioma para português de Portugal
    ...params,
  });

  const url = `${API_BASE_URL}${endpoint}?${urlParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Se a resposta não for 'ok' (ex: erro 404, 401), lança um erro
      console.error('Erro na resposta da API:', response);
      throw new Error(`Erro na API: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Se houver um erro de rede ou outro problema no fetch
    console.error('Falha ao contactar a API da TMDB:', error);
    throw error;
  }
};

/**
 * Busca a lista de filmes populares.
 * @returns {Promise<Object>} - A lista de filmes populares.
 */
export const buscarFilmesPopulares = () => {
  return fetchDaApi('/movie/popular');
};

/**
 * Busca a lista de filmes em tendência (trending) da semana.
 * @returns {Promise<Object>}
 */
export const buscarFilmesEmTendencia = () => {
  return fetchDaApi('/trending/movie/week');
};

/**
 * Busca a lista de filmes mais bem votados.
 * @returns {Promise<Object>}
 */
export const buscarFilmesMaisVotados = () => {
  return fetchDaApi('/movie/top_rated');
};

/**
 * Busca a lista de filmes que serão lançados em breve.
 * @returns {Promise<Object>}
 */
export const buscarFilmesProximos = () => {
  return fetchDaApi('/movie/upcoming');
};

/**
 * Busca a lista de filmes que estão em exibição nos cinemas.
 * @returns {Promise<Object>}
 */
export const buscarFilmesEmExibicao = () => {
  return fetchDaApi('/movie/now_playing');
};

/**
 * Busca os detalhes de um filme específico.
 * @param {number} filmeId - O ID do filme.
 * @returns {Promise<Object>} - Os detalhes do filme.
 */
export const buscarDetalhesFilme = (filmeId) => {
  return fetchDaApi(`/movie/${filmeId}`);
};

/**
 * Busca os créditos (elenco e equipa) de um filme específico.
 * @param {number} filmeId - O ID do filme.
 * @returns {Promise<Object>}
 */
export const obterCreditosFilme = (filmeId) => {
  return fetchDaApi(`/movie/${filmeId}/credits`);
};

/**
 * Busca as imagens de um filme específico.
 * @param {number} filmeId - O ID do filme.
 * @returns {Promise<Object>}
 */
export const obterImagensFilme = (filmeId) => {
  return fetchDaApi(`/movie/${filmeId}/images`);
};

/**
 * Procura por filmes com base numa query.
 * @param {string} query - O termo a ser procurado.
 * @returns {Promise<Object>} - A lista de filmes encontrados.
 */
export const procurarFilmes = (options) => {
  const { query, ano, page } = options;
  const params = { query, page };
  if (ano) {
    params.primary_release_year = ano;
  }
  return fetchDaApi('/search/movie', params);
};

// ===============================================
// Funções para Séries de TV
// ===============================================

/**
 * Busca a lista de séries populares.
 * @returns {Promise<Object>}
 */
export const buscarSeriesPopulares = () => {
  return fetchDaApi('/tv/popular');
};

/**
 * Busca a lista de séries em tendência (trending) da semana.
 * @returns {Promise<Object>}
 */
export const buscarSeriesEmTendencia = () => {
  return fetchDaApi('/trending/tv/week');
};

/**
 * Busca a lista de séries mais bem votadas.
 * @returns {Promise<Object>}
 */
export const buscarSeriesMaisVotadas = () => {
  return fetchDaApi('/tv/top_rated');
};

/**
 * Busca a lista de séries que estão no ar.
 * @returns {Promise<Object>}
 */
export const buscarSeriesNoAr = () => {
  return fetchDaApi('/tv/on_the_air');
};

/**
 * Busca os detalhes de uma série específica.
 * @param {number} serieId - O ID da série.
 * @returns {Promise<Object>}
 */
export const buscarDetalhesSerie = (serieId) => {
  return fetchDaApi(`/tv/${serieId}`);
};

/**
 * Busca os créditos (elenco e equipa) de uma série específica.
 * @param {number} serieId - O ID da série.
 * @returns {Promise<Object>}
 */
export const obterCreditosSerie = (serieId) => {
  return fetchDaApi(`/tv/${serieId}/credits`);
};

/**
 * Busca as imagens de uma série específica.
 * @param {number} serieId - O ID da série.
 * @returns {Promise<Object>}
 */
export const obterImagensSerie = (serieId) => {
  return fetchDaApi(`/tv/${serieId}/images`);
};

/**
 * Busca os detalhes de uma temporada específica de uma série.
 * @param {number} serieId - O ID da série.
 * @param {number} temporadaNumero - O número da temporada.
 * @returns {Promise<Object>}
 */
export const buscarDetalhesTemporada = (serieId, temporadaNumero) => {
  return fetchDaApi(`/tv/${serieId}/season/${temporadaNumero}`);
};

/**
 * Procura por séries com base numa query.
 * @param {string} query - O termo a ser procurado.
 * @returns {Promise<Object>}
 */
export const procurarSeries = (options) => {
  const { query, ano, page } = options;
  const params = { query, page };
  if (ano) {
    params.first_air_date_year = ano;
  }
  return fetchDaApi('/search/tv', params);
};

// ===============================================
// Funções de Descoberta e Configuração
// ===============================================

/**
 * Busca filmes com base num conjunto de filtros.
 * @param {Object} filtros - Opções de filtro (ex: { with_genres: '28', primary_release_year: '2023' })
 * @returns {Promise<Object>}
 */
export const descobrirFilmes = (filtros) => {
  return fetchDaApi('/discover/movie', filtros);
};

/**
 * Busca séries com base num conjunto de filtros.
 * @param {Object} filtros - Opções de filtro (ex: { with_genres: '10759', first_air_date_year: '2023' })
 * @returns {Promise<Object>}
 */
export const descobrirSeries = (filtros) => {
  return fetchDaApi('/discover/tv', filtros);
};

/**
 * Obtém a lista oficial de géneros de filmes.
 * @returns {Promise<Object>}
 */
export const obterGenerosFilmes = () => {
  return fetchDaApi('/genre/movie/list');
};

/**
 * Obtém a lista oficial de géneros de séries.
 * @returns {Promise<Object>}
 */
export const obterGenerosSeries = () => {
  return fetchDaApi('/genre/tv/list');
};

/**
 * Obtém a lista de países suportados.
 * @returns {Promise<Array>}
 */
export const obterPaises = () => {
  return fetchDaApi('/configuration/countries');
};

/**
 * Obtém a lista de línguas suportadas.
 * @returns {Promise<Array>}
 */
export const obterLinguas = () => {
  return fetchDaApi('/configuration/languages');
};
