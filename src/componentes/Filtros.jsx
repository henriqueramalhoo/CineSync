function Filtros({ generos, paises, linguas, filtros, onFiltroChange, tipo }) {
  
  const anos = [];
  const anoAtual = new Date().getFullYear();
  for (let i = anoAtual; i >= 1900; i--) {
    anos.push(i);
  }

  const handleChange = (e) => {
    onFiltroChange(e.target.name, e.target.value);
  };

  const labelDataLancamento = tipo === 'movie' ? 'Data de Lançamento' : 'Data de Estreia';

  return (
    <div className="bg-slate-200 dark:bg-navy-800 p-4 rounded-lg mb-8 flex flex-wrap gap-4 items-center">
      {/* Filtro de Ordenação */}
      <select name="sort_by" value={filtros.sort_by} onChange={handleChange} className="filtro-select">
        <option value="popularity.desc">Popularidade</option>
        <option value={tipo === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'}>{labelDataLancamento}</option>
        <option value="vote_average.desc">Melhor Avaliação</option>
      </select>
      
      {/* Filtro de Género */}
      <select name="genre" value={filtros.genre} onChange={handleChange} className="filtro-select">
        <option value="">Todos os Géneros</option>
        {generos.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      {/* Filtro de Ano */}
      <select name="year" value={filtros.year} onChange={handleChange} className="filtro-select">
        <option value="">Todos os Anos</option>
        {anos.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      {/* Filtro de País */}
      <select name="country" value={filtros.country} onChange={handleChange} className="filtro-select">
        <option value="">Todos os Países</option>
        {paises.map(p => <option key={p.iso_3166_1} value={p.iso_3166_1}>{p.native_name}</option>)}
      </select>

      {/* Filtro de Língua */}
      <select name="language" value={filtros.language} onChange={handleChange} className="filtro-select">
        <option value="">Todas as Línguas</option>
        {linguas.map(l => <option key={l.iso_639_1} value={l.iso_639_1}>{l.english_name}</option>)}
      </select>
    </div>
  );
}

export default Filtros;
