const IMAGEM_GALERIA_URL = 'https://image.tmdb.org/t/p/w500';

function ImagemCard({ imagem }) {
  const imageUrl = `${IMAGEM_GALERIA_URL}${imagem.file_path}`;
  return (
    <div className="flex-shrink-0 w-64 rounded-lg overflow-hidden">
      <img src={imageUrl} alt="Cena do filme/série" className="w-full h-full object-cover" />
    </div>
  );
}

function GaleriaImagens({ imagens }) {
  // Mostra apenas as primeiras 10 imagens, por exemplo
  const imagensPrincipais = imagens.backdrops.slice(0, 10);

  if (imagensPrincipais.length === 0) {
    return null; // Não mostra a secção se não houver imagens
  }

  return (
    <div className="py-6">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Galeria</h3>
      <div className="flex overflow-x-auto gap-4 pb-4">
        {imagensPrincipais.map(img => (
          <ImagemCard key={img.file_path} imagem={img} />
        ))}
      </div>
    </div>
  );
}

export default GaleriaImagens;
