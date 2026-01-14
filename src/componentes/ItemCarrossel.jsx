import { Link } from 'react-router-dom';

const IMAGEM_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function ItemCarrossel({ item, tipo, onRemover }) {
  const posterUrl = item.poster_path
    ? `${IMAGEM_BASE_URL}${item.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem';
  
  // Determina o ID a usar para o link (TMDB ID)
  const idParaLink = item.tmdbId || item.id;
  
  // Determina o título e o link com base no tipo (filme ou série)
  const titulo = tipo === 'movie' ? item.title : item.name;
  const linkPara = tipo === 'movie' ? `/filme/${idParaLink}` : `/serie/${idParaLink}`;

  const handleRemoverClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemover(item.id); // 'item.id' aqui é o ID único do favorito no json-server
  };

  return (
    <Link to={linkPara} className="block group relative overflow-hidden rounded-lg shadow-lg dark:border dark:border-navy-700/50">
      <img 
        src={posterUrl} 
        alt={`Poster de ${titulo}`} 
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-500 ease-in-out flex items-end p-4">
        <h3 className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
          {titulo}
        </h3>
      </div>

      {onRemover && (
        <button
          onClick={handleRemoverClick}
          className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600"
          aria-label="Remover dos favoritos"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      )}
    </Link>
  );
}

export default ItemCarrossel;
