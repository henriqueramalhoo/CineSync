import { usePerfil } from '../contextos/PerfilContexto';

function SeletorPerfil() {
  const { perfis, perfilAtual, mudarPerfil } = usePerfil();

  if (!perfis || perfis.length === 0) {
    return null;
  }

  const handleMudarPerfil = (e) => {
    mudarPerfil(e.target.value);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="perfil-select" className="text-sm text-slate-700 dark:text-slate-200 mr-2">Perfil:</label>
      <select
        id="perfil-select"
        value={perfilAtual || ''}
        onChange={handleMudarPerfil}
        className="filtro-select" // Reutiliza o estilo dos outros filtros
      >
        {perfis.map(p => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>
    </div>
  );
}

export default SeletorPerfil;
