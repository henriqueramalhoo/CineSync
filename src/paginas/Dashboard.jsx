import { useState, useEffect, useCallback } from 'react';
import { obterFavoritos } from '../servicos/apiLocal';
import { obterGenerosFilmes, obterGenerosSeries } from '../servicos/apiFilmes';
import { usePerfil } from '../contextos/PerfilContexto';
import Spinner from '../componentes/Spinner';

function Dashboard() {
  const { perfilAtual } = usePerfil();
  const [stats, setStats] = useState({ total: 0, filmes: 0, series: 0, generos: [] });
  const [carregando, setCarregando] = useState(true);

  const calcularEstatisticas = useCallback(async () => {
    if (!perfilAtual) {
      setStats({ total: 0, filmes: 0, series: 0, generos: [] });
      setCarregando(false);
      return;
    }
    try {
      setCarregando(true);
      const [favoritos, generosFilmesData, generosSeriesData] = await Promise.all([
        obterFavoritos(perfilAtual),
        obterGenerosFilmes(),
        obterGenerosSeries(),
      ]);

      const total = favoritos.length;
      const filmes = favoritos.filter(f => f.media_type === 'movie').length;
      const series = favoritos.filter(f => f.media_type === 'tv').length;
      
      const mapaGeneros = new Map();
      [...generosFilmesData.genres, ...generosSeriesData.genres].forEach(g => {
        mapaGeneros.set(g.id, g.name);
      });

      const contagemGeneros = favoritos.reduce((acc, item) => {
        item.genres.forEach(g => {
          const nomeGenero = mapaGeneros.get(g.id);
          if (nomeGenero) {
            acc[nomeGenero] = (acc[nomeGenero] || 0) + 1;
          }
        });
        return acc;
      }, {});

      const generosOrdenados = Object.entries(contagemGeneros)
        .map(([nome, contagem]) => ({ nome, contagem }))
        .sort((a, b) => b.contagem - a.contagem)
        .slice(0, 10); // Limita aos top 10

      setStats({ total, filmes, series, generos: generosOrdenados });

    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error);
    } finally {
      setCarregando(false);
    }
  }, [perfilAtual]);

  useEffect(() => {
    calcularEstatisticas();
  }, [calcularEstatisticas]);

  if (carregando) return <div className="pt-24"><Spinner /></div>;
  if (!perfilAtual) {
    return (
      <div className="container mx-auto p-4 pt-24 text-center">
        <p className="text-slate-500 dark:text-slate-400">Selecione um perfil no menu para ver o dashboard.</p>
      </div>
    );
  }

  const maxContagem = stats.generos.length > 0 ? stats.generos[0].contagem : 0;

  return (
    <div className="container mx-auto p-4 pt-24">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        Dashboard de {perfilAtual}
      </h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white dark:bg-navy-800 rounded-lg shadow-md text-center">
          <h3 className="text-4xl font-bold text-accent-500 dark:text-accent-400">{stats.total}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Total de Favoritos</p>
        </div>
        <div className="p-6 bg-white dark:bg-navy-800 rounded-lg shadow-md text-center">
          <h3 className="text-4xl font-bold text-accent-500 dark:text-accent-400">{stats.filmes}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Filmes</p>
        </div>
        <div className="p-6 bg-white dark:bg-navy-800 rounded-lg shadow-md text-center">
          <h3 className="text-4xl font-bold text-accent-500 dark:text-accent-400">{stats.series}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Séries</p>
        </div>
      </div>

      {/* Gráfico de Géneros */}
      <div className="p-6 bg-white dark:bg-navy-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Top Géneros Favoritos</h2>
        <div className="space-y-4">
          {stats.generos.length > 0 ? stats.generos.map(g => (
            <div key={g.nome} className="flex items-center">
              <span className="w-32 text-right mr-4 text-slate-600 dark:text-slate-300">{g.nome}</span>
              <div className="flex-grow bg-slate-200 dark:bg-navy-700 rounded-full h-6">
                <div 
                  className="bg-accent-500 h-6 rounded-full flex items-center justify-end pr-2 text-white text-sm"
                  style={{ width: `${(g.contagem / maxContagem) * 100}%` }}
                >
                  {g.contagem}
                </div>
              </div>
            </div>
          )) : (
            <p className="text-slate-500 dark:text-slate-400">Sem dados de géneros para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;