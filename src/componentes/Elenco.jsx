const IMAGEM_ATOR_URL = 'https://image.tmdb.org/t/p/w185';
const IMAGEM_PLACEHOLDER = 'https://via.placeholder.com/185x278?text=Sem+Foto';

function AtorCard({ ator }) {
  const fotoUrl = ator.profile_path
    ? `${IMAGEM_ATOR_URL}${ator.profile_path}`
    : IMAGEM_PLACEHOLDER;

  return (
    <div className="flex-shrink-0 w-32 text-center">
      <img src={fotoUrl} alt={ator.name} className="rounded-lg shadow-md mb-2 w-full h-48 object-cover" />
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{ator.name}</h4>
      <p className="text-xs text-slate-600 dark:text-slate-400">{ator.character}</p>
    </div>
  );
}

function Elenco({ creditos }) {
  // Mostra apenas os primeiros 15 atores, por exemplo
  const elencoPrincipal = creditos.cast.slice(0, 15);

  return (
    <div className="py-6">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Elenco Principal</h3>
      <div className="flex overflow-x-auto gap-4 pb-4">
        {elencoPrincipal.map(ator => (
          <AtorCard key={ator.id} ator={ator} />
        ))}
      </div>
    </div>
  );
}

export default Elenco;
