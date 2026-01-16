import { useState, useEffect, useCallback } from 'react';
import { obterHistorico, removerDoHistorico } from '../servicos/apiLocal';
import { usePerfil } from '../contextos/PerfilContexto';
import GrelhaItens from '../componentes/GrelhaItens';
import ItemCarrossel from '../componentes/ItemCarrossel';
import Spinner from '../componentes/Spinner';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

// Componente para um item de série na grelha de histórico
function SerieVistaCard({ item, onRemover }) {
  const calcularTotalEpisodiosVistos = (temporadasVistas) => {
    if (!temporadasVistas) return 0;
    return Object.values(temporadasVistas).reduce((total, episodios) => total + episodios.length, 0);
  };

  const totalVistos = calcularTotalEpisodiosVistos(item.temporadasVistas);

  return (
    <div>
      <ItemCarrossel item={item} tipo="tv" onRemover={onRemover} />
      <p className="text-center text-sm mt-2 text-slate-600 dark:text-slate-400">
        {totalVistos} {totalVistos === 1 ? 'episódio visto' : 'episódios vistos'}
      </p>
    </div>
  );
}

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
    return <div className="pt-0"><Spinner /></div>;
  }

  if (!perfilAtual) {
    return (
      <div className="container mx-auto p-4 pt-0 text-center">
        <p className="text-slate-500 dark:text-slate-400">Por favor, selecione um perfil no menu para ver o seu histórico.</p>
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
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {seriesVistas.map(item => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <SerieVistaCard item={item} onRemover={() => handleRemoverDoHistorico(item.id)} />
                  </motion.div>
                ))}
              </motion.div>
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

