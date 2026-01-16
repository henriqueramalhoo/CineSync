import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarDetalhesSerie, buscarDetalhesTemporada, obterCreditosSerie, obterImagensSerie } from '../servicos/apiFilmes';
import { 
  adicionarFavorito, 
  removerFavorito, 
  verificarSeFavorito,
  verificarSeVisto,
  atualizarEpisodioVisto
} from '../servicos/apiLocal';
import { usePerfil } from '../contextos/PerfilContexto';
import Spinner from '../componentes/Spinner';
import Elenco from '../componentes/Elenco';
import GaleriaImagens from '../componentes/GaleriaImagens';

const SERVIDORES_SERIES = [
    { name: 'VidLink.pro', template: 'https://vidlink.pro/tv/{id}/{temporada}-{episodio}' },
    { name: 'Vidsrc.to', template: 'https://vidsrc.to/embed/tv/{id}/{temporada}-{episodio}' },
    { name: 'vidsrc-embed.ru', template: 'https://vidsrc-embed.ru/embed/tv/{id}/{temporada}-{episodio}' },
];

const IMAGEM_BASE_URL = 'https://image.tmdb.org/t/p/w780';

function DetalhesSerie() {
  const { id } = useParams();
  const { perfilAtual } = usePerfil();

  const [serie, setSerie] = useState(null);
  const [creditos, setCreditos] = useState(null);
  const [imagens, setImagens] = useState(null);
  const [detalhesTemporada, setDetalhesTemporada] = useState(null);
  const [temporadaSelecionada, setTemporadaSelecionada] = useState(1);
  const [episodioSelecionado, setEpisodioSelecionado] = useState(1);
  const [servidorSelecionado, setServidorSelecionado] = useState(SERVIDORES_SERIES[0].template);
  const [urlPlayer, setUrlPlayer] = useState('');
  const [favoritoId, setFavoritoId] = useState(null);
  const [historicoSerie, setHistoricoSerie] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [carregandoFavorito, setCarregandoFavorito] = useState(false);

  const carregarDadosIniciais = useCallback(async () => {
    const serieId = parseInt(id, 10);
    if (isNaN(serieId)) {
      setErro(`O ID da série "${id}" não é válido.`);
      setCarregando(false);
      return;
    }
    try {
      setCarregando(true);
      setErro(null);
      const [dadosSerie, dadosCreditos, dadosImagens, favoritoExistente, historicoExistente] = await Promise.all([
        buscarDetalhesSerie(serieId),
        obterCreditosSerie(serieId),
        obterImagensSerie(serieId),
        perfilAtual ? verificarSeFavorito(serieId, perfilAtual) : null,
        perfilAtual ? verificarSeVisto(serieId, perfilAtual) : null,
      ]);
      
      if (!dadosSerie || !dadosSerie.id) throw new Error('Dados da série incompletos.');

      setSerie(dadosSerie);
      setCreditos(dadosCreditos);
      setImagens(dadosImagens);
      setFavoritoId(favoritoExistente ? favoritoExistente.id : null);
      setHistoricoSerie(historicoExistente);
    } catch (e) {
      setErro(`Lamentamos, ocorreu um erro: ${e.message}`);
    } finally {
      setCarregando(false);
    }
  }, [id, perfilAtual]);

  useEffect(() => {
    window.scrollTo(0, 0);
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  useEffect(() => {
    if (!id || !serie) return;
    const carregarTemporada = async () => {
        try {
            const dadosTemporada = await buscarDetalhesTemporada(id, temporadaSelecionada);
            setDetalhesTemporada(dadosTemporada);
            if (dadosTemporada?.episodes.length > 0) {
              setEpisodioSelecionado(1);
            }
        } catch (e) {
            setDetalhesTemporada(null);
        }
    };
    carregarTemporada();
  }, [id, temporadaSelecionada, serie]);

  useEffect(() => {
    if (id && temporadaSelecionada && episodioSelecionado) {
      const url = servidorSelecionado
        .replace('{id}', id)
        .replace('{temporada}', temporadaSelecionada)
        .replace('{episodio}', episodioSelecionado);
      setUrlPlayer(url);
    }
  }, [id, temporadaSelecionada, episodioSelecionado, servidorSelecionado]);

  const lidarComToggleFavorito = async () => {
    if (!serie || !perfilAtual) return;
    setCarregandoFavorito(true);
    try {
      if (favoritoId) {
        await removerFavorito(favoritoId);
        setFavoritoId(null);
      } else {
        const itemParaAdicionar = { ...serie, media_type: 'tv' };
        const novoFavorito = await adicionarFavorito(itemParaAdicionar, perfilAtual);
        setFavoritoId(novoFavorito.id);
      }
    } catch (e) {
      alert('Ocorreu um erro na operação de favoritos.');
    } finally {
      setCarregandoFavorito(false);
    }
  };

  const lidarComToggleEpisodioVisto = async (episodioNum, visto) => {
    if (!serie || !perfilAtual) return;

    // Otimisticamente atualiza a UI
    const novoHistorico = { ...historicoSerie };
    if (!novoHistorico.temporadasVistas) novoHistorico.temporadasVistas = {};
    if (!novoHistorico.temporadasVistas[temporadaSelecionada]) novoHistorico.temporadasVistas[temporadaSelecionada] = [];
    
    if (visto) {
      novoHistorico.temporadasVistas[temporadaSelecionada].push(episodioNum);
    } else {
      novoHistorico.temporadasVistas[temporadaSelecionada] = novoHistorico.temporadasVistas[temporadaSelecionada].filter(ep => ep !== episodioNum);
    }
    setHistoricoSerie(novoHistorico);
    
    // Envia a alteração para a API
    try {
      const historicoAtualizado = await atualizarEpisodioVisto(perfilAtual, serie, temporadaSelecionada, episodioNum, visto);
      // Sincroniza o estado com a resposta da API
      setHistoricoSerie(historicoAtualizado);
    } catch (error) {
      alert('Não foi possível atualizar o estado do episódio.');
      // Reverte a alteração otimista em caso de erro
      carregarDadosIniciais(); 
    }
  };

  if (carregando) return <div className="pt-24"><Spinner /></div>;
  if (erro) return <p className="text-center text-xl text-red-500 pt-24">{erro}</p>;
  if (!serie) return null;

  const posterUrl = `${IMAGEM_BASE_URL}${serie.poster_path}`;
  const temporadasVisiveis = serie.seasons.filter(s => s.season_number > 0);
  const eFavorito = !!favoritoId;
  const episodiosVistosNaTemporada = historicoSerie?.temporadasVistas?.[temporadaSelecionada] || [];

  return (
    <div className="container mx-auto p-4 pt-24">
      <Link to="/series" className="text-accent-600 dark:text-accent-400 hover:underline transition-colors duration-300 mb-4 inline-block">&larr; Voltar à lista</Link>
      <div className="bg-white dark:bg-navy-800 rounded-lg shadow-xl overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 flex-shrink-0"><img src={posterUrl} alt={`Poster de ${serie.name}`} className="w-full h-full object-cover" /></div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-4xl font-bold mb-2 text-slate-800 dark:text-white">{serie.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-4 italic">{serie.tagline}</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{serie.overview}</p>
            <div className="mt-4">
              <span className="font-bold text-slate-600 dark:text-slate-100">Temporadas:</span> {serie.number_of_seasons}
            </div>
            <div className="mt-2">
              <span className="font-bold text-slate-600 dark:text-slate-100">Avaliação Média:</span> {serie.vote_average.toFixed(1)} / 10
            </div>
            <button
              onClick={lidarComToggleFavorito}
              disabled={carregandoFavorito || !perfilAtual}
              className={`mt-6 px-6 py-3 rounded-lg text-white font-bold transition-colors duration-300 ${
                eFavorito ? 'bg-red-600 hover:bg-red-700' : 'bg-accent-500 hover:bg-accent-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={!perfilAtual ? 'Selecione um perfil para adicionar aos favoritos' : ''}
            >
              {carregandoFavorito ? 'A processar...' : (eFavorito ? 'Remover Favorito' : 'Adicionar Favorito')}
            </button>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-navy-700">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center">
              <label htmlFor="server-select" className="mr-2 font-bold text-slate-700 dark:text-slate-100">Servidor:</label>
              <select
                id="server-select"
                value={servidorSelecionado}
                onChange={(e) => setServidorSelecionado(e.target.value)}
                className="bg-slate-200 dark:bg-navy-700 border border-slate-300 dark:border-navy-600 rounded-lg p-2"
              >
                {SERVIDORES_SERIES.map(server => (
                  <option key={server.name} value={server.template}>{server.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="season-select" className="mr-2 font-bold text-slate-700 dark:text-slate-100">Temporada:</label>
              <select
                id="season-select"
                value={temporadaSelecionada}
                onChange={(e) => setTemporadaSelecionada(Number(e.target.value))}
                className="bg-slate-200 dark:bg-navy-700 border border-slate-300 dark:border-navy-600 rounded-lg p-2"
              >
                {temporadasVisiveis.map(season => (
                  <option key={season.id} value={season.season_number}>{season.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-6">
            <iframe title="player" src={urlPlayer} frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
          </div>

          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Episódios</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {detalhesTemporada?.episodes.map(ep => {
              const foiVisto = episodiosVistosNaTemporada.includes(ep.episode_number);
              return (
                <label key={ep.id} htmlFor={`ep-${ep.id}`} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 cursor-pointer">
                  <input 
                    type="checkbox"
                    id={`ep-${ep.id}`}
                    className="h-5 w-5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                    checked={foiVisto}
                    onChange={(e) => lidarComToggleEpisodioVisto(ep.episode_number, e.target.checked)}
                    disabled={!perfilAtual}
                  />
                  <span className="ml-3 text-slate-700 dark:text-slate-300">{ep.episode_number}. {ep.name}</span>
                  <button 
                    className="ml-auto text-sm text-accent-500 hover:underline"
                    onClick={() => setEpisodioSelecionado(ep.episode_number)}
                  >
                    Ver
                  </button>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {creditos && <Elenco creditos={creditos} />}
      {imagens && <GaleriaImagens imagens={imagens} />}
    </div>
  );
}

export default DetalhesSerie;
