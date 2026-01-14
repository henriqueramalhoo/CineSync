function Paginacao({ paginaAtual, totalPaginas, onPageChange }) {
  if (totalPaginas <= 1) {
    return null; // Não mostra a paginação se houver apenas uma página
  }

  const irParaAnterior = () => {
    if (paginaAtual > 1) {
      onPageChange(paginaAtual - 1);
    }
  };

  const irParaProxima = () => {
    if (paginaAtual < totalPaginas) {
      onPageChange(paginaAtual + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={irParaAnterior}
        disabled={paginaAtual === 1}
        className="px-4 py-2 bg-accent-500 text-white font-bold rounded-lg hover:bg-accent-600 transition-colors disabled:bg-slate-300 dark:disabled:bg-navy-700 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      <span className="text-slate-700 dark:text-slate-300">
        Página {paginaAtual} de {totalPaginas}
      </span>

      <button
        onClick={irParaProxima}
        disabled={paginaAtual === totalPaginas}
        className="px-4 py-2 bg-accent-500 text-white font-bold rounded-lg hover:bg-accent-600 transition-colors disabled:bg-slate-300 dark:disabled:bg-navy-700 disabled:cursor-not-allowed"
      >
        Próxima
      </button>
    </div>
  );
}

export default Paginacao;
