import { useState } from 'react';
import { usePesquisa } from '../contextos/PesquisaContexto';

function BarraPesquisa() {
  const { lidarComPesquisa } = usePesquisa();
  const [termo, setTermo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    lidarComPesquisa(termo.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
          </svg>
        </div>
        <input
          className="block w-full bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm border border-slate-300 dark:border-navy-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-full py-3 pl-10 pr-3 leading-tight focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 dark:focus:bg-navy-700 dark:focus:border-accent-500 transition-colors duration-300"
          type="text"
          placeholder="Procurar por um filme ou série..."
          aria-label="Campo de pesquisa"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
      </div>
    </form>
  );
}

export default BarraPesquisa;
