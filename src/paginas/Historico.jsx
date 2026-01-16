import { useState, useEffect, useCallback } from 'react';
import { obterHistorico, removerDoHistorico } from '../servicos/apiLocal';
import { usePerfil } from '../contextos/PerfilContexto';
import GrelhaItens from '../componentes/GrelhaItens';
import Spinner from '../componentes/Spinner';

function Historico() {
  const { perfilAtual } = usePerfil();

  const [filmesVistos, setFilmesVistos] = useState([]);
  const [seriesVistas, setSeriesVistas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarHistorico = useCallback(async () => {
    if (!perfilAtual) {
      setFilmesVistos([]);
      setSeriesVistas([]);
      setCarregando(false);
      return;
    }
    try {
      setCarregando(true);
      const dados = await obterHistorico(perfilAtual);
      setFilmesVistos(dados.filter(item => item.media_type === 'movie'));
      setSeriesVistas(dados.filter(item => item.media_type === 'tv'));
      setErro(null);
    } catch (e) {
      setErro('Lamentamos, ocorreu um erro ao carregar o seu histórico.');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [perfilAtual]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const handleRemoverDoHistorico = async (historicoId) => {
    try {
      await removerDoHistorico(historicoId);
      carregarHistorico(); // Recarrega a lista após a remoção
    } catch (error) {
      alert('Não foi possível remover o item do histórico.');
      console.error(error);
    }
  };

  if (carregando) {
    return <div className="pt-24"><Spinner /></div>;
  }

  if (!perfilAtual) {
    return (
      <div className="container mx-auto p-4 pt-24 text-center">
        <p className="text-slate-500 dark:text-slate-400">Por favor, selecione um perfil no menu para ver o seu histórico.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-24">
      {erro && (
        <p className="text-center text-xl text-red-500 dark:text-red-400">{erro}</p>
      )}

      {!erro && (
        <>
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
              Filmes Vistos por {perfilAtual}
            </h1>
            {filmesVistos.length > 0 ? (
              <GrelhaItens itens={filmesVistos} tipo="movie" onRemover={handleRemoverDoHistorico} />
            ) : (
              <p className="text-slate-500 dark:text-slate-400">Nenhum filme marcado como visto para este perfil.</p>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
              Séries Vistas por {perfilAtual}
            </h1>
            {seriesVistas.length > 0 ? (
              <GrelhaItens itens={seriesVistas} tipo="tv" onRemover={handleRemoverDoHistorico} />
            ) : (
              <p className="text-slate-500 dark:text-slate-400">Nenhuma série marcada como vista para este perfil.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Historico;
