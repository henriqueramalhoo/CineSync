import { useState, useEffect, useCallback } from 'react';
import {
  descobrirSeries,
  procurarSeries,
  obterGenerosSeries,
  obterPaises,
  obterLinguas,
} from '../servicos/apiFilmes';
import { PesquisaProvider, usePesquisa } from '../contextos/PesquisaContexto';
import GrelhaItens from '../componentes/GrelhaItens';
import BarraPesquisa from '../componentes/BarraPesquisa';
import Filtros from '../componentes/Filtros';
import Paginacao from '../componentes/Paginacao';
import Spinner from '../componentes/Spinner';

function ConteudoPaginaSeries() {
  const { 
    resultadosPesquisa, termoPesquisado, limparPesquisa, carregandoPesquisa, erroPesquisa,
    paginaAtual: paginaPesquisa, totalPaginas: totalPaginasPesquisa, mudarPagina: mudarPaginaPesquisa
  } = usePesquisa();
  
  const [filtros, setFiltros] = useState({ 
    genre: '', year: '', country: '', language: '', sort_by: 'popularity.desc'
  });
  const [listasFiltros, setListasFiltros] = useState({ genres: [], countries: [], languages: [] });
  const [resultadosDescoberta, setResultadosDescoberta] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDadosFiltros = async () => {
      try {
        const [generosData, paisesData, linguasData] = await Promise.all([
          obterGenerosSeries(),
          obterPaises(),
          obterLinguas()
        ]);
        setListasFiltros({
          genres: generosData.genres || [],
          countries: paisesData.sort((a, b) => a.native_name.localeCompare(b.native_name)) || [],
          languages: linguasData.sort((a, b) => a.english_name.localeCompare(b.english_name)) || []
        });
      } catch (error) {
        console.error("Erro ao carregar dados para os filtros:", error);
      }
    };
    carregarDadosFiltros();
  }, []);

  useEffect(() => {
    if (termoPesquisado) return;

    const buscar = async () => {
      setCarregando(true);
      const params = {
        with_genres: filtros.genre,
        first_air_date_year: filtros.year,
        with_origin_country: filtros.country,
        with_original_language: filtros.language,
        sort_by: filtros.sort_by,
        page: paginaAtual,
      };
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const dados = await descobrirSeries(params);
      setResultadosDescoberta(dados.results);
      setTotalPaginas(dados.total_pages > 500 ? 500 : dados.total_pages);
      setCarregando(false);
    };

    const timer = setTimeout(() => buscar(), 500);
    return () => clearTimeout(timer);

  }, [filtros, paginaAtual, termoPesquisado]);
  
  const handleFiltroChange = (nome, valor) => {
    setFiltros(prevFiltros => ({ ...prevFiltros, [nome]: valor }));
    setPaginaAtual(1);
  };

  const mostrarResultados = termoPesquisado ? resultadosPesquisa : resultadosDescoberta;
  const aCarregar = termoPesquisado ? carregandoPesquisa : carregando;
  const erro = termoPesquisado ? erroPesquisa : null;

  return (
    <div className="container mx-auto p-4 pt-28">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Séries de TV</h1>
        <BarraPesquisa />
      </div>
      <Filtros
        generos={listasFiltros.genres}
        paises={listasFiltros.countries}
        linguas={listasFiltros.languages}
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        tipo="tv"
      />
      {erro && <p className="text-center text-xl text-red-500">{erro}</p>}
      {aCarregar ? <Spinner /> : (
        <>
          <GrelhaItens itens={mostrarResultados} tipo="tv" />
          <Paginacao 
            paginaAtual={termoPesquisado ? paginaPesquisa : paginaAtual}
            totalPaginas={termoPesquisado ? totalPaginasPesquisa : totalPaginas}
            onPageChange={termoPesquisado ? mudarPaginaPesquisa : setPaginaAtual}
          />
        </>
      )}
    </div>
  );
}

function Series() {
  return (
    <PesquisaProvider procurarFn={procurarSeries}>
      <ConteudoPaginaSeries />
    </PesquisaProvider>
  );
}

export default Series;