import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarDetalhesSerie, buscarDetalhesTemporada, obterCreditosSerie, obterImagensSerie } from '../servicos/apiFilmes';
import { adicionarFavorito, removerFavorito, verificarSeFavorito } from '../servicos/apiLocal';
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
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [carregandoFavorito, setCarregandoFavorito] = useState(false);

  useEffect(() => {
    const carregarTudo = async () => {
      const serieId = parseInt(id, 10);
      if (isNaN(serieId)) {
        setErro(`O ID da série "${id}" não é válido.`);
        setCarregando(false);
        return;
      }
      try {
        setCarregando(true);
        setErro(null);
        const [dadosSerie, dadosCreditos, dadosImagens, favoritoExistente] = await Promise.all([
          buscarDetalhesSerie(serieId),
          obterCreditosSerie(serieId),
          obterImagensSerie(serieId),
          perfilAtual ? verificarSeFavorito(serieId, perfilAtual) : Promise.resolve(null)
        ]);
        
        if (!dadosSerie || !dadosSerie.id) throw new Error('Dados da série incompletos.');

        setSerie(dadosSerie);
        setCreditos(dadosCreditos);
        setImagens(dadosImagens);
        setFavoritoId(favoritoExistente ? favoritoExistente.id : null);
      } catch (e) {
        setErro(`Lamentamos, ocorreu um erro: ${e.message}`);
      } finally {
        setCarregando(false);
      }
    };
    window.scrollTo(0, 0);
    carregarTudo();
  }, [id, perfilAtual]);

  useEffect(() => {
    if (!id || !serie) return;
    const carregarTemporada = async () => {
        try {
            const dadosTemporada = await buscarDetalhesTemporada(id, temporadaSelecionada);
            setDetalhesTemporada(dadosTemporada);
            setEpisodioSelecionado(1);
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

  if (carregando) return <div className="pt-24"><Spinner /></div>;
  if (erro) return <p className="text-center text-xl text-red-500 pt-24">{erro}</p>;
  if (!serie) return null;

  const posterUrl = `${IMAGEM_BASE_URL}${serie.poster_path}`;
  const temporadasVisiveis = serie.seasons.filter(s => s.season_number > 0);
  const eFavorito = !!favoritoId;

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
              {carregandoFavorito ? 'A processar...' : (eFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos')}
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
                  <option key={server.name} value={server.template}>
                    {server.name}
                  </option>
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
                  <option key={season.id} value={season.season_number}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="episode-select" className="mr-2 font-bold text-slate-700 dark:text-slate-100">Episódio:</label>
              <select
                id="episode-select"
                value={episodioSelecionado}
                onChange={(e) => setEpisodioSelecionado(Number(e.target.value))}
                className="bg-slate-200 dark:bg-navy-700 border border-slate-300 dark:border-navy-600 rounded-lg p-2"
              >
                {detalhesTemporada?.episodes.map(ep => (
                  <option key={ep.id} value={ep.episode_number}>
                    {ep.episode_number}. {ep.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
            <iframe title="player" src={urlPlayer} frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
          </div>
        </div>
      </div>

      {creditos && <Elenco creditos={creditos} />}
      {imagens && <GaleriaImagens imagens={imagens} />}
    </div>
  );
}

export default DetalhesSerie;
