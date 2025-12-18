import { Routes, Route, Link, useLocation } from 'react-router-dom';
import NovaPaginaHome from './paginas/NovaPaginaHome';
import PaginaFilmes from './paginas/PaginaFilmes';
import Series from './paginas/Series';
import DetalhesFilme from './paginas/DetalhesFilme';
import DetalhesSerie from './paginas/DetalhesSerie';
import MeusFavoritos from './paginas/MeusFavoritos';
import Dashboard from './paginas/Dashboard';
import Menu from './componentes/Menu';

function App() {
  const location = useLocation();
  // Define quais páginas têm o cabeçalho transparente
  const isMainPage = ['/', '/filmes', '/series'].includes(location.pathname);

  const headerClasses = isMainPage
    ? "absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/60 to-transparent"
    : "sticky top-0 z-40 bg-slate-100/90 dark:bg-navy-900/90 backdrop-blur-sm shadow-lg";

  const logoColor = isMainPage ? "text-white" : "text-accent-500 dark:text-accent-400";
  
  return (
    <div className="bg-slate-100 dark:bg-navy-900 text-navy-900 dark:text-slate-200 min-h-screen font-sans transition-colors duration-500">
      <header className={headerClasses}>
        <nav className="container mx-auto p-4 flex justify-between items-center gap-4">
          <Link to="/" className={`text-2xl font-bold drop-shadow-lg transition-colors duration-300 ${logoColor}`}>
            CineSync
          </Link>
          <Menu />
        </nav>
      </header>

      <main className={!isMainPage ? "pt-24" : ""}> 
        <Routes>
          <Route path="/" element={<NovaPaginaHome />} />
          <Route path="/filmes" element={<PaginaFilmes />} />
          <Route path="/series" element={<Series />} />
          <Route path="/favoritos" element={<MeusFavoritos />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/filme/:id" element={<DetalhesFilme />} />
          <Route path="/serie/:id" element={<DetalhesSerie />} />
        </Routes>
      </main>

      <footer className="bg-slate-200 dark:bg-navy-800 text-gray-500 dark:text-slate-400 text-center p-4">
        <p>&copy; 2025 - Henrique Ramalho</p>
      </footer>
    </div>
  );
}

export default App;