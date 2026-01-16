const API_LOCAL_URL = 'https://cinesync-api-2dpa.onrender.com';

// A função genérica fetchLocalApi permanece a mesma.
const fetchLocalApi = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_LOCAL_URL}${endpoint}`;
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) {
    options.body = JSON.stringify(data);
  }
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Erro na API local (${response.status}): ${errorData.message}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error(`Falha ao contactar a API local em ${url}:`, error);
    throw error;
  }
};

/**
 * Obtém a lista de favoritos para um perfil específico.
 * @param {string} perfilId - O ID do perfil.
 * @returns {Promise<Array>} - Um array de itens favoritos.
 */
export const obterFavoritos = (perfilId) => {
  if (!perfilId) return Promise.resolve([]); // Retorna vazio se não houver perfil
  return fetchLocalApi(`/favoritos?perfilId=${perfilId}`);
};

/**
 * Adiciona um item aos favoritos de um perfil.
 * @param {Object} item - O objeto do filme ou série a ser adicionado.
 * @param {string} perfilId - O ID do perfil.
 * @returns {Promise<Object>} - O item favorito adicionado com um novo ID único.
 */
export const adicionarFavorito = (item, perfilId) => {
  const { id, ...rest } = item;
  // O novo objeto a ser guardado tem o ID da TMDB (renomeado para tmdbId),
  // o ID do perfil, e o resto dos dados do item.
  // O json-server irá gerar um 'id' numérico único para esta entrada.
  const novoFavorito = {
    tmdbId: id,
    perfilId: perfilId,
    ...rest
  };
  return fetchLocalApi('/favoritos', 'POST', novoFavorito);
};

/**
 * Remove um item dos favoritos.
 * @param {number} favoritoId - O ID único do item na lista de favoritos (não o ID da TMDB).
 * @returns {Promise<Object>} - Objeto vazio em caso de sucesso.
 */
export const removerFavorito = (favoritoId) => {
  return fetchLocalApi(`/favoritos/${favoritoId}`, 'DELETE');
};

/**
 * Verifica se um item já é favorito para um perfil.
 * @param {number} tmdbId - O ID do filme ou série na TMDB.
 * @param {string} perfilId - O ID do perfil.
 * @returns {Promise<Object|null>} - O objeto favorito (incluindo o seu ID único) se encontrado, senão null.
 */
export const verificarSeFavorito = async (tmdbId, perfilId) => {
  if (!perfilId) return null;
  // Busca por uma correspondência exata de tmdbId e perfilId
  const resultados = await fetchLocalApi(`/favoritos?tmdbId=${tmdbId}&perfilId=${perfilId}`);
  // A API retorna um array, pegamos o primeiro resultado se existir
  return resultados.length > 0 ? resultados[0] : null;
};

// ===============================================
// Funções para Histórico de Visualização
// ===============================================

/**
 * Obtém o histórico de visualização para um perfil específico.
 * @param {string} perfilId - O ID do perfil.
 * @returns {Promise<Array>} - Um array de itens no histórico.
 */
export const obterHistorico = (perfilId) => {
  if (!perfilId) return Promise.resolve([]);
  return fetchLocalApi(`/historico?perfilId=${perfilId}`);
};

/**
 * Adiciona um item ao histórico de um perfil.
 * @param {Object} item - O objeto do filme ou série a ser adicionado.
 * @param {string} perfilId - O ID do perfil.
 * @returns {Promise<Object>} - O item de histórico adicionado.
 */
export const adicionarAoHistorico = (item, perfilId) => {
  const { id, ...rest } = item;
  const novoItemHistorico = {
    tmdbId: id,
    perfilId: perfilId,
    vistoEm: new Date().toISOString(),
    ...rest
  };
  return fetchLocalApi('/historico', 'POST', novoItemHistorico);
};

/**
 * Remove um item do histórico.
 * @param {string} historicoId - O ID único do item na lista de histórico.
 * @returns {Promise<Object>} - Objeto vazio em caso de sucesso.
 */
export const removerDoHistorico = (historicoId) => {
  return fetchLocalApi(`/historico/${historicoId}`, 'DELETE');
};

/**
 * Verifica se um item já está no histórico de um perfil.
 * @param {number} tmdbId - O ID do filme ou série na TMDB.
 * @param {string} perfilId - O ID do perfil.
 * @returns {Promise<Object|null>} - O objeto do histórico se encontrado, senão null.
 */
export const verificarSeVisto = async (tmdbId, perfilId) => {
  if (!perfilId) return null;
  const resultados = await fetchLocalApi(`/historico?tmdbId=${tmdbId}&perfilId=${perfilId}`);
  return resultados.length > 0 ? resultados[0] : null;
};

/**
 * Atualiza o estado de um episódio (visto/não visto) no histórico de uma série.
 * @param {string} perfilId
 * @param {Object} serie
 * @param {number} temporadaNum
 * @param {number} episodioNum
 * @param {boolean} marcarComoVisto - true para marcar, false para desmarcar
 * @returns {Promise<Object>} - O registo do histórico atualizado.
 */
export const atualizarEpisodioVisto = async (perfilId, serie, temporadaNum, episodioNum, marcarComoVisto) => {
  const registroExistente = await verificarSeVisto(serie.id, perfilId);

  if (marcarComoVisto) {
    if (registroExistente) {
      // Atualiza um registro existente
      const temporadasVistas = registroExistente.temporadasVistas || {};
      const episodiosVistos = temporadasVistas[temporadaNum] || [];
      if (!episodiosVistos.includes(episodioNum)) {
        episodiosVistos.push(episodioNum);
      }
      temporadasVistas[temporadaNum] = episodiosVistos.sort((a, b) => a - b);
      const registroAtualizado = { ...registroExistente, temporadasVistas };
      return fetchLocalApi(`/historico/${registroExistente.id}`, 'PUT', registroAtualizado);
    } else {
      // Cria um novo registro
      const { id, ...rest } = serie;
      const novoRegistro = {
        tmdbId: id,
        perfilId: perfilId,
        media_type: 'tv',
        temporadasVistas: {
          [temporadaNum]: [episodioNum]
        },
        ...rest
      };
      return fetchLocalApi('/historico', 'POST', novoRegistro);
    }
  } else {
    // Desmarcar como visto
    if (!registroExistente) return null; // Não há nada a fazer

    const temporadasVistas = registroExistente.temporadasVistas || {};
    const episodiosVistos = temporadasVistas[temporadaNum] || [];
    
    const novosEpisodiosVistos = episodiosVistos.filter(ep => ep !== episodioNum);

    if (novosEpisodiosVistos.length > 0) {
      temporadasVistas[temporadaNum] = novosEpisodiosVistos;
    } else {
      delete temporadasVistas[temporadaNum]; // Remove a temporada se não houver mais episódios
    }

    const registroAtualizado = { ...registroExistente, temporadasVistas };
    return fetchLocalApi(`/historico/${registroExistente.id}`, 'PUT', registroAtualizado);
  }
};