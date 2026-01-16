import { useState, useEffect, useCallback } from 'react';
import { obterFavoritos, removerFavorito } from '../servicos/apiLocal';
import { usePerfil } from '../contextos/PerfilContexto';
import GrelhaItens from '../componentes/GrelhaItens';
import Spinner from '../componentes/Spinner';

function MeusFavoritos() {
  const { perfilAtual } = usePerfil();

  const [filmesFavoritos, setFilmesFavoritos] = useState([]);
  const [seriesFavoritas, setSeriesFavoritas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarFavoritos = useCallback(async () => {
    if (!perfilAtual) {
      setFilmesFavoritos([]);
      setSeriesFavoritas([]);
      setCarregando(false);
      return;
    }
    try {
      setCarregando(true);
      const dados = await obterFavoritos(perfilAtual);
      setFilmesFavoritos(dados.filter(item => item.media_type === 'movie'));
      setSeriesFavoritas(dados.filter(item => item.media_type === 'tv'));
      setErro(null);
    } catch (e) {
      setErro('Lamentamos, ocorreu um erro ao carregar os seus favoritos.');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [perfilAtual]);

  useEffect(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  const handleRemoverFavorito = async (favoritoId) => {
    try {
      await removerFavorito(favoritoId);
      // Recarrega a lista de favoritos após a remoção
      carregarFavoritos();
      alert('Item removido dos favoritos!');
    } catch (error) {
      alert('Não foi possível remover o item dos favoritos.');
      console.error(error);
    }
  };

  if (carregando) {
    return <div className="pt-24"><Spinner /></div>;
  }

  if (!perfilAtual) {
    return (
      <div className="container mx-auto p-4 pt-24 text-center">
        <p className="text-slate-500 dark:text-slate-400">Por favor, selecione um perfil no menu para ver os seus favoritos.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {erro && (
        <p className="text-center text-xl text-red-500 dark:text-red-400">{erro}</p>
      )}

      {!erro && (
        <>
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
              Filmes Favoritos de {perfilAtual}
            </h1>
            {filmesFavoritos.length > 0 ? (
              <GrelhaItens itens={filmesFavoritos} tipo="movie" onRemover={handleRemoverFavorito} />
            ) : (
              <p className="text-slate-500 dark:text-slate-400">Nenhum filme adicionado aos favoritos para este perfil.</p>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
              Séries Favoritas de {perfilAtual}
            </h1>
            {seriesFavoritas.length > 0 ? (
              <GrelhaItens itens={seriesFavoritas} tipo="tv" onRemover={handleRemoverFavorito} />
            ) : (
              <p className="text-slate-500 dark:text-slate-400">Nenhuma série adicionada aos favoritos para este perfil.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MeusFavoritos;