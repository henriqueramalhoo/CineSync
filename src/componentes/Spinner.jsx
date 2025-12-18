// Componente Spinner para feedback visual durante o carregamento.
// Usa uma animação de rotação simples com SVG e Tailwind CSS.
function Spinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent-500"></div>
    </div>
  );
}

export default Spinner;
