import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarDetalhesFilme, obterCreditosFilme, obterImagensFilme } from '../servicos/apiFilmes';
import { adicionarFavorito, removerFavorito, verificarSeFavorito } from '../servicos/apiLocal';
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

          console.log(`[DEBUG DetalhesFilme] A buscar detalhes para o filme ID: ${filmeId}`);

          const [dadosFilme, dadosCreditos, dadosImagens, favoritoExistente] = await Promise.all([

              buscarDetalhesFilme(filmeId),

              obterCreditosFilme(filmeId),

              obterImagensFilme(filmeId),

              perfilAtual ? verificarSeFavorito(filmeId, perfilAtual) : Promise.resolve(null)

          ]);

  

          console.log('[DEBUG DetalhesFilme] Dados do filme recebidos:', dadosFilme);

          console.log('[DEBUG DetalhesFilme] Créditos recebidos:', dadosCreditos);

          console.log('[DEBUG DetalhesFilme] Imagens recebidas:', dadosImagens);

          console.log('[DEBUG DetalhesFilme] Resultado da verificação de favorito:', favoritoExistente);

  

          if (!dadosFilme || !dadosFilme.id) throw new Error('Dados do filme incompletos.');

          

          setFilme(dadosFilme);

          setCreditos(dadosCreditos);

          setImagens(dadosImagens);

          setFavoritoId(favoritoExistente ? favoritoExistente.id : null);

        } catch (e) {

          console.error(`[DEBUG DetalhesFilme] Erro ao carregar dados: ${e.message}`, e);

          setErro(`Lamentamos, ocorreu um erro: ${e.message}`);

        } finally {

          setCarregando(false);

        }

      };

      window.scrollTo(0, 0); // Rola para o topo ao carregar

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
        alert('Filme removido dos favoritos!');
      } else {
        const itemParaAdicionar = { ...filme, media_type: 'movie' };
        const novoFavorito = await adicionarFavorito(itemParaAdicionar, perfilAtual);
        setFavoritoId(novoFavorito.id);
        alert('Filme adicionado aos favoritos!');
      }
    } catch (e) {
      alert(`Ocorreu um erro na operação de favoritos.`);
    } finally {
      setCarregandoFavorito(false);
    }
  };

  if (carregando) return <div className="pt-24"><Spinner /></div>;
  if (erro) return <p className="text-center text-xl text-red-500 pt-24">{erro}</p>;
  if (!filme) return null;
  
  const posterUrl = filme.poster_path ? `${IMAGEM_BASE_URL}${filme.poster_path}` : 'https://via.placeholder.com/780x1170?text=Sem+Imagem';
  const eFavorito = !!favoritoId;

  return (
    <div className="container mx-auto p-4 pt-24">
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