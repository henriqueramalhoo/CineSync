import { createContext, useState, useContext, useCallback } from 'react';

const PesquisaContexto = createContext();

export function PesquisaProvider({ children, procurarFn }) {
  const [resultadosPesquisa, setResultadosPesquisa] = useState(null);
  const [termoPesquisado, setTermoPesquisado] = useState('');
  const [carregandoPesquisa, setCarregandoPesquisa] = useState(false);
  const [erroPesquisa, setErroPesquisa] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const lidarComPesquisa = useCallback(async (termo, pagina = 1) => {
    if (!termo || termo.trim() === '') {
      setResultadosPesquisa(null);
      setTermoPesquisado('');
      return;
    }
    setCarregandoPesquisa(true);
    setErroPesquisa(null);
    try {
      const dados = await procurarFn({ query: termo, page: pagina });
      setResultadosPesquisa(dados.results);
      setTermoPesquisado(termo);
      setPaginaAtual(dados.page);
      setTotalPaginas(dados.total_pages);
    } catch (e) {
      console.error("Erro na pesquisa:", e);
      setErroPesquisa('Não foi possível realizar a pesquisa. Tente novamente.');
      setResultadosPesquisa(null);
    } finally {
      setCarregandoPesquisa(false);
    }
  }, [procurarFn]);

  const limparPesquisa = useCallback(() => {
    setResultadosPesquisa(null);
    setTermoPesquisado('');
    setErroPesquisa(null);
    setPaginaAtual(1);
    setTotalPaginas(0);
  }, []);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      lidarComPesquisa(termoPesquisado, novaPagina);
    }
  };

  const value = {
    resultadosPesquisa,
    termoPesquisado,
    carregandoPesquisa,
    erroPesquisa,
    lidarComPesquisa,
    limparPesquisa,
    paginaAtual,
    totalPaginas,
    mudarPagina,
  };

  return (
    <PesquisaContexto.Provider value={value}>
      {children}
    </PesquisaContexto.Provider>
  );
}

export function usePesquisa() {
  const context = useContext(PesquisaContexto);
  if (context === undefined) {
    throw new Error('usePesquisa deve ser usado dentro de um PesquisaProvider');
  }
  return context;
}
