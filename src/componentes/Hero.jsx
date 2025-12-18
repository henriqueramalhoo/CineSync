import { Link } from 'react-router-dom';

const IMAGEM_BASE_URL = 'https://image.tmdb.org/t/p/original';

function Hero({ item, tipo }) {
  if (!item) {
    return (
      <div className="w-full h-[450px] sm:h-[700px] bg-slate-200 dark:bg-navy-800 animate-pulse"></div>
    );
  }

  const backgroundUrl = `${IMAGEM_BASE_URL}${item.backdrop_path || item.poster_path}`;
  const titulo = tipo === 'movie' ? item.title : item.name;
  const linkPara = tipo === 'movie' ? `/filme/${item.id}` : `/serie/${item.id}`;

  return (
    <div 
      className="w-full h-[450px] sm:h-[700px] relative text-white"
      style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative h-full flex flex-col justify-end items-start text-left pb-12 sm:pb-20 pt-24">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 drop-shadow-lg max-w-lg">{titulo}</h1>
        <p className="max-w-2xl text-slate-200 hidden sm:block mb-6 drop-shadow-md">{item.overview}</p>
        
        <div className="flex space-x-4">
          <Link 
            to={linkPara} 
            className="px-6 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg font-bold transition-colors duration-300"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
