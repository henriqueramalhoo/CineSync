import { useState, useEffect, useCallback } from 'react';
import { buscarFilmesEmExibicao, buscarSeriesNoAr } from '../servicos/apiFilmes';
import Hero from '../componentes/Hero';
import Carrossel from '../componentes/Carrossel';
import Spinner from '../componentes/Spinner';

function NovaPaginaHome() {
  const [itemHeroi, setItemHeroi] = useState(null);
  const [filmes, setFilmes] = useState([]);
  const [series, setSeries] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarPaginaHome = useCallback(async () => {
    try {
      setCarregando(true);
      const [dadosFilmes, dadosSeries] = await Promise.all([
        buscarFilmesEmExibicao(),
        buscarSeriesNoAr(),
      ]);

      if (dadosFilmes.results.length > 0) {
        setFilmes(dadosFilmes.results);
        setItemHeroi(dadosFilmes.results[0]); // Define o primeiro filme como herói
      }
      if (dadosSeries.results.length > 0) {
        setSeries(dadosSeries.results);
      }

      setErro(null);
    } catch (e) {
      setErro('Lamentamos, ocorreu um erro ao carregar o conteúdo da página inicial.');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPaginaHome();
  }, [carregarPaginaHome]);

  if (carregando) {
    return <div className="pt-24"><Spinner /></div>;
  }
  if (erro) {
    return <p className="text-center text-xl text-red-500 pt-24">{erro}</p>;
  }

  return (
    <>
      <Hero item={itemHeroi} tipo="movie" />
      <div className="container mx-auto p-4 -mt-16 sm:-mt-24 relative z-10">
        <Carrossel titulo="Filmes em Exibição" itens={filmes} tipo="movie" />
        <Carrossel titulo="Séries no Ar" itens={series} tipo="tv" />
      </div>
    </>
  );
}

export default NovaPaginaHome;
