import ItemCarrossel from './ItemCarrossel';

function Carrossel({ titulo, itens, tipo }) {
  if (!itens || itens.length === 0) {
    return null; // Não mostra nada se não houver itens
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">{titulo}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {itens.map(item => (
          <div key={item.id} className="flex-shrink-0 w-40 sm:w-48">
            <ItemCarrossel item={item} tipo={tipo} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carrossel;
