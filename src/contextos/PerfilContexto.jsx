import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const PerfilContexto = createContext();

// A URL da nossa API local
const API_LOCAL_URL = 'https://cinesync-api-2dpa.onrender.com';

export function PerfilProvider({ children }) {
  const [perfis, setPerfis] = useState([]);
  const [perfilAtual, setPerfilAtual] = useState(() => {
    // No carregamento, tenta obter o perfil guardado no localStorage
    return localStorage.getItem('perfilAtual') || null;
  });

  // Busca a lista de perfis disponíveis quando o componente é montado
  useEffect(() => {
    const buscarPerfis = async () => {
      try {
        const response = await fetch(`${API_LOCAL_URL}/perfis`);
        if (!response.ok) throw new Error('Não foi possível carregar os perfis.');
        const data = await response.json();
        setPerfis(data);
        // Se não houver perfil atual definido, define o primeiro da lista como padrão
        if (!perfilAtual && data.length > 0) {
          setPerfilAtual(data[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar perfis:", error);
        // Em caso de erro, define uma lista vazia para não quebrar a UI
        setPerfis([]);
      }
    };
    buscarPerfis();
  }, [perfilAtual]); // Dependência em perfilAtual para o caso de não haver um no localStorage

  // Função para mudar o perfil ativo
  const mudarPerfil = useCallback((perfilId) => {
    setPerfilAtual(perfilId);
    localStorage.setItem('perfilAtual', perfilId);
    // Recarrega a página para garantir que todos os componentes atualizam os dados
    window.location.reload();
  }, []);

  const value = {
    perfis,
    perfilAtual,
    mudarPerfil,
  };

  return (
    <PerfilContexto.Provider value={value}>
      {children}
    </PerfilContexto.Provider>
  );
}

// Hook personalizado para usar o contexto do perfil
export function usePerfil() {
  const context = useContext(PerfilContexto);
  if (context === undefined) {
    throw new Error('usePerfil deve ser usado dentro de um PerfilProvider');
  }
  return context;
}
