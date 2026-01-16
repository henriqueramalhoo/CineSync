import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarDetalhesFilme, obterCreditosFilme, obterImagensFilme } from '../servicos/apiFilmes';
import { 
  adicionarFavorito, 
  removerFavorito, 
  verificarSeFavorito,
  adicionarAoHistorico,
  removerDoHistorico,
  verificarSeVisto
} from '../servicos/apiLocal';
import { usePerfil } from '../contextos/PerfilContexto';
import Spinner from '../componentes/Spinner';
import Elenco from '../componentes/Elenco';
import GaleriaImagens from '../componentes/GaleriaImagens';

const SERVIDORES = [
    {name: 'MultiEmbed', template: 'https://multiembed.mov/?video_id={id}&tmdb=1'},
    {name: 'AutoEmbed', template: 'https://player.autoembed.cc/embed/movie/{id}'},
    {name: 'Vidsrc.to', template: 'https://vidsrc.to/embed/movie/{id}'},
    {name: 'Vidsrc ICU', template: 'https://vidsrc.icu/embed/movie/{id}'},
];

const IMAGEM_BASE_URL = 'https://image.tmdb.org/t/p/w780';

function DetalhesFilme() {
  const { id } = useParams();
  const { perfilAtual } = usePerfil();
  
  const [filme, setFilme] = useState(null);
  const [creditos, setCreditos] = useState(null);
  const [imagens, setImagens] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [servidorSelecionado, setServidorSelecionado] = useState(SERVIDORES[0].template);
  const [urlPlayer, setUrlPlayer] = useState('');
  
  const [favoritoId, setFavoritoId] = useState(null);
  const [carregandoFavorito, setCarregandoFavorito] = useState(false);

  const [historicoId, setHistoricoId] = useState(null);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);

    useEffect(() => {
      const carregarTudo = async () => {
        const filmeId = parseInt(id, 10);
        if (isNaN(filmeId)) {
          setErro(`O ID do filme "${id}" não é válido.`);
          setCarregando(false);
          return;
        }

        try {
          setCarregando(true);
          setErro(null);

          const [
            dadosFilme, 
            dadosCreditos, 
            dadosImagens, 
            favoritoExistente,
            historicoExistente
          ] = await Promise.all([
              buscarDetalhesFilme(filmeId),
              obterCreditosFilme(filmeId),
              obterImagensFilme(filmeId),
              perfilAtual ? verificarSeFavorito(filmeId, perfilAtual) : null,
              perfilAtual ? verificarSeVisto(filmeId, perfilAtual) : null
          ]);
  
          if (!dadosFilme || !dadosFilme.id) throw new Error('Dados do filme incompletos.');
          
          setFilme(dadosFilme);
          setCreditos(dadosCreditos);
          setImagens(dadosImagens);
          setFavoritoId(favoritoExistente ? favoritoExistente.id : null);
          setHistoricoId(historicoExistente ? historicoExistente.id : null);

        } catch (e) {
          console.error(`[DEBUG DetalhesFilme] Erro ao carregar dados: ${e.message}`, e);
          setErro(`Lamentamos, ocorreu um erro: ${e.message}`);
        } finally {
          setCarregando(false);
        }
      };

      window.scrollTo(0, 0);
      carregarTudo();
    }, [id, perfilAtual]);

  useEffect(() => {
    if (id) {
        const url = servidorSelecionado.replace('{id}', id);
        setUrlPlayer(url);
    }
  }, [id, servidorSelecionado]);

  const lidarComToggleFavorito = async () => {
    if (!filme || !perfilAtual) return;
    setCarregandoFavorito(true);
    try {
      if (favoritoId) {
        await removerFavorito(favoritoId);
        setFavoritoId(null);
      } else {
        const itemParaAdicionar = { ...filme, media_type: 'movie' };
        const novoFavorito = await adicionarFavorito(itemParaAdicionar, perfilAtual);
        setFavoritoId(novoFavorito.id);
      }
    } catch (e) {
      alert(`Ocorreu um erro na operação de favoritos.`);
    } finally {
      setCarregandoFavorito(false);
    }
  };

  const lidarComToggleVisto = async () => {
    if (!filme || !perfilAtual) return;
    setCarregandoHistorico(true);
    try {
      if (historicoId) {
        await removerDoHistorico(historicoId);
        setHistoricoId(null);
      } else {
        const itemParaAdicionar = { ...filme, media_type: 'movie' };
        const novoHistorico = await adicionarAoHistorico(itemParaAdicionar, perfilAtual);
        setHistoricoId(novoHistorico.id);
      }
    } catch (e) {
      alert(`Ocorreu um erro na operação de histórico.`);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  if (carregando) return <div className="pt-0"><Spinner /></div>;
  if (erro) return <p className="text-center text-xl text-red-500 pt-0">{erro}</p>;
  if (!filme) return null;
  
  const posterUrl = filme.poster_path ? `${IMAGEM_BASE_URL}${filme.poster_path}` : 'https://via.placeholder.com/780x1170?text=Sem+Imagem';
  const eFavorito = !!favoritoId;
  const foiVisto = !!historicoId;

  return (
    <div className="container mx-auto p-4">
      <Link to="/filmes" className="text-accent-600 dark:text-accent-400 hover:underline transition-colors duration-300 mb-4 inline-block">&larr; Voltar à lista</Link>
      <div className="bg-white dark:bg-navy-800 rounded-lg shadow-xl overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 flex-shrink-0">
            <img src={posterUrl} alt={`Poster do filme ${filme.title}`} className="w-full h-full object-cover" />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-4xl font-bold mb-2 text-slate-800 dark:text-white">{filme.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-4 italic">{filme.tagline}</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{filme.overview}</p>
            <div className="mt-4">
              <span className="font-bold text-slate-600 dark:text-slate-100">Data de Lançamento:</span> {new Date(filme.release_date).toLocaleDateString('pt-PT')}
            </div>
            <div className="mt-2">
              <span className="font-bold text-slate-600 dark:text-slate-100">Avaliação Média:</span> {filme.vote_average.toFixed(1)} / 10
            </div>
            <div className="flex gap-4">
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
              <button
                onClick={lidarComToggleVisto}
                disabled={carregandoHistorico || !perfilAtual}
                className={`mt-6 px-6 py-3 rounded-lg font-bold transition-colors duration-300 ${
                  foiVisto 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-slate-300 dark:bg-navy-700 text-slate-800 dark:text-slate-200 hover:bg-slate-400 dark:hover:bg-navy-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={!perfilAtual ? 'Selecione um perfil para gerir o histórico' : ''}
              >
                {carregandoHistorico ? 'A processar...' : (foiVisto ? 'Visto' : 'Marcar como Visto')}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-navy-700">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Ver Agora</h2>
          <div className="flex items-center mb-4">
            <label htmlFor="server-select" className="mr-2 font-bold text-slate-700 dark:text-slate-100">Servidor:</label>
            <select 
                id="server-select"
                value={servidorSelecionado}
                onChange={(e) => setServidorSelecionado(e.target.value)}
                className="bg-slate-200 dark:bg-navy-700 border border-slate-300 dark:border-navy-600 text-slate-800 dark:text-white text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 p-2.5"
            >
                {SERVIDORES.map(server => (
                    <option key={server.name} value={server.template}>
                        {server.name}
                    </option>
                ))}
            </select>
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

export default DetalhesFilme;