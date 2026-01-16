import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const canais = [
  { nome: "Eleven Sports 1", src: "https://topembed.pw/channel/ElevenSports1%5BPortugal%5D", color: "bg-gray-800", textColor: "text-white" },
  { nome: "Eleven Sports 2", src: "https://topembed.pw/channel/ElevenSports2%5BPortugal%5D", color: "bg-gray-800", textColor: "text-white" },
  { nome: "Eleven Sports 3", src: "https://topembed.pw/channel/ElevenSports3%5BPortugal%5D", color: "bg-gray-800", textColor: "text-white" },
  { nome: "SportTV 1", src: "https://topembed.pw/channel/SportTV1%5BPortugal%5D", color: "bg-blue-600", textColor: "text-white" },
  { nome: "SportTV 2", src: "https://topembed.pw/channel/SportTV2%5BPortugal%5D", color: "bg-blue-600", textColor: "text-white" },
  { nome: "DAZN 1", src: "https://topembed.pw/channel/DAZN1%5BPortugal%5D", color: "bg-indigo-600", textColor: "text-white" },
];

function CanaisTV() {
  const [canalAtivo, setCanalAtivo] = useState(canais[0]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        Televisão em Direto
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Player Area */}
        <div className="lg:w-3/4 w-full">
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-xl">
            <AnimatePresence mode="wait">
              <motion.iframe
                key={canalAtivo.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                title={canalAtivo.nome}
                src={canalAtivo.src}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
            </AnimatePresence>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
            A ver: {canalAtivo.nome}
          </h2>
        </div>

        {/* Channel List */}
        <div className="lg:w-1/4 w-full">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Canais Disponíveis</h3>
          <div className="space-y-2">
            {canais.map(canal => {
              const isAtivo = canal.nome === canalAtivo.nome;
              return (
                <button
                  key={canal.nome}
                  onClick={() => setCanalAtivo(canal)}
                  className={`w-full flex items-center text-left p-3 rounded-lg transition-all duration-300 transform ${
                    isAtivo
                      ? `shadow-lg scale-105 ${canal.color} ${canal.textColor}`
                      : `${canal.textColor} ${canal.color} bg-opacity-70 hover:bg-opacity-100`
                  }`}
                >
                  <span className="flex-grow font-bold">{canal.nome}</span>
                  {isAtivo && (
                    <motion.div layoutId="playingIndicator" className="flex items-center space-x-1">
                      <span className="text-sm">A emitir</span>
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanaisTV;