import { useState } from 'react';

const canais = [
  { nome: "Eleven Sports 1", src: "https://topembed.pw/channel/ElevenSports1%5BPortugal%5D" },
  { nome: "Eleven Sports 2", src: "https://topembed.pw/channel/ElevenSports2%5BPortugal%5D" },
  { nome: "Eleven Sports 3", src: "https://topembed.pw/channel/ElevenSports3%5BPortugal%5D" },
  { nome: "SportTV 1", src: "https://topembed.pw/channel/SportTV1%5BPortugal%5D" },
  { nome: "SportTV 2", src: "https://topembed.pw/channel/SportTV2%5BPortugal%5D" },
  { nome: "DAZN 1", src: "https://topembed.pw/channel/DAZN1%5BPortugal%5D" },
];

function CanaisTV() {
  const [canalAtivo, setCanalAtivo] = useState(canais[0]);

  return (
    <div className="container mx-auto p-4 pt-24">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        Canais de Televisão
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {canais.map(canal => (
          <button
            key={canal.nome}
            onClick={() => setCanalAtivo(canal)}
            className={`px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${
              canalAtivo.nome === canal.nome
                ? 'bg-accent-500 text-white'
                : 'bg-slate-200 dark:bg-navy-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-navy-600'
            }`}
          >
            {canal.nome}
          </button>
        ))}
      </div>

      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-xl">
        <iframe
          title={canalAtivo.nome}
          src={canalAtivo.src}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}

export default CanaisTV;