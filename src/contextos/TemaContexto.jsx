import { createContext, useState, useEffect, useContext } from 'react';

// Cria o Contexto com um valor inicial (que será substituído pelo Provider)
const TemaContexto = createContext();

// Cria o Provedor do tema
export function TemaProvider({ children }) {
  // O estado 'tema' guarda 'light' or 'dark'
  const [tema, setTema] = useState(() => {
    // No carregamento inicial, verifica o localStorage ou a preferência do sistema
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado) {
      return temaGuardado;
    }
    // Se não houver nada guardado, usa a preferência do browser
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement; // O elemento <html>
    
    // Remove a classe antiga e adiciona a nova
    if (tema === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Guarda a preferência no localStorage
    localStorage.setItem('tema', tema);
  }, [tema]);

  // Função para alternar o tema
  const toggleTema = () => {
    setTema(temaAnterior => (temaAnterior === 'light' ? 'dark' : 'light'));
  };

  return (
    <TemaContexto.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContexto.Provider>
  );
}

// Hook personalizado para usar o contexto do tema mais facilmente
export function useTema() {
  return useContext(TemaContexto);
}
