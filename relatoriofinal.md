# Relatório Final da Aplicação CineSync

## 1. Introdução

Este documento detalha a arquitetura, tecnologias e funcionalidades da aplicação **CineSync**. O projeto consiste numa plataforma web moderna para explorar, pesquisar e organizar filmes e séries de televisão. A aplicação foi desenvolvida com foco numa experiência de utilizador fluida, design responsivo e funcionalidades ricas, como gestão de perfis, listas de favoritos e um sistema de streaming integrado.

O relatório baseia-se numa análise estática do código-fonte para documentar todos os aspetos relevantes do sistema.

## 2. Visão Geral e Arquitetura

A aplicação segue uma arquitetura de componentes baseada em **React**, utilizando **Vite** como ferramenta de construção e servidor de desenvolvimento. A estilização é maioritariamente realizada com **Tailwind CSS**, o que permite um desenvolvimento rápido de interfaces de utilizador modernas e responsivas.

A estrutura de ficheiros principal é a seguinte:

```
src/
├── assets/         # Imagens e outros recursos estáticos
├── componentes/    # Componentes React reutilizáveis (ex: Carrossel, Menu)
├── contextos/      # Gestão de estado global com React Context
├── paginas/        # Componentes que representam as páginas da aplicação
└── servicos/       # Módulos para comunicação com APIs externas e locais
```

- **`componentes/`**: Contém blocos de construção da UI, como botões, seletores, e grelhas, promovendo a reutilização de código.
- **`contextos/`**: Centraliza a lógica de estado que precisa de ser partilhada por toda a aplicação, como o tema (claro/escuro), o perfil do utilizador e o estado da pesquisa.
- **`paginas/`**: Cada ficheiro corresponde a uma rota da aplicação (ex: Home, Detalhes de um Filme), orquestrando os componentes necessários para essa vista.
- **`servicos/`**: Isola a lógica de acesso a dados, com uma clara separação entre a API externa (TMDB) e a API local (json-server).

### Análise de Código: Roteamento em `App.jsx`

O ficheiro `App.jsx` não só define o layout principal (cabeçalho, conteúdo, rodapé), como também centraliza a definição das rotas da aplicação usando o `react-router-dom`.

```jsx
// Dentro do componente App.jsx

<main className={!isMainPage ? "pt-24" : ""}> 
  <Routes>
    <Route path="/" element={<NovaPaginaHome />} />
    <Route path="/filmes" element={<PaginaFilmes />} />
    <Route path="/series" element={<Series />} />
    <Route path="/favoritos" element={<MeusFavoritos />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/filme/:id" element={<DetalhesFilme />} />
    <Route path="/serie/:id" element={<DetalhesSerie />} />
  </Routes>
</main>
```

**Pontos-chave do código:**

1.  **`<Routes>`**: Este componente atua como um contentor para todas as rotas individuais.
2.  **`<Route>`**: Cada `Route` mapeia um `path` (o URL no navegador) para um `element` (o componente React que deve ser renderizado).
3.  **Rotas Dinâmicas**: As rotas como `/filme/:id` são dinâmicas. O segmento `:id` é um parâmetro que pode ser lido dentro do componente `DetalhesFilme` (usando o hook `useParams`) para saber qual filme específico deve ser carregado e exibido.

Esta estrutura declarativa torna o fluxo de navegação da aplicação fácil de entender e de manter.

## 3. Tecnologias Utilizadas

- **Frontend Library**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animações**: Framer Motion
- **Linting**: ESLint
- **API Externa**: The Movie Database (TMDB)
- **API Local (Mock)**: JSON Server

## 4. Funcionalidades Detalhadas

### 4.1. Gestão de Perfis

A aplicação suporta múltiplos perfis de utilizador, permitindo uma experiência personalizada para cada pessoa.

- **Seleção de Perfil**: Um componente `SeletorPerfil`, localizado no menu principal, permite ao utilizador alternar entre os perfis disponíveis.
- **Persistência**: O perfil selecionado é guardado no `localStorage` do navegador, para que a escolha seja mantida entre sessões. Ao mudar de perfil, a página é recarregada para garantir que todos os dados (como a lista de favoritos) são atualizados.
- **Fonte de Dados**: Os perfis são carregados a partir do ficheiro `db.json` através do `json-server`.

*`[INSERIR PRINT DO SELETOR DE PERFIL NO MENU AQUI]`*

### 4.2. Página Principal (`NovaPaginaHome`)

A página principal serve como montra do conteúdo mais recente e relevante.

- **Hero Section**: Exibe um filme em destaque, geralmente o primeiro da lista de "Filmes em Exibição", com imagem de fundo, título e descrição.
- **Carrosséis de Conteúdo**: Apresenta secções de "Filmes em Exibição" e "Séries no Ar" em carrosséis horizontais, permitindo uma visualização rápida e apelativa do conteúdo.
- **Carregamento Assíncrono**: Os dados são carregados de forma assíncrona da API da TMDB. Um spinner é exibido durante o carregamento.

*`[INSERIR PRINT DA PÁGINA PRINCIPAL, MOSTRANDO O HERO E OS CARROSSÉIS AQUI]`*

### 4.3. Navegação e Páginas de Listagem

A aplicação possui páginas dedicadas para listar filmes e séries, com funcionalidades de descoberta.

- **`PaginaFilmes` e `Series`**: Exibem uma grelha paginada de itens.
- **Filtros e Ordenação**: Um componente `Filtros` permite ao utilizador refinar os resultados por género, ano de lançamento, país, língua e ordenar por popularidade, data de lançamento ou avaliação.
- **Paginação**: Um componente `Paginacao` permite navegar entre as várias páginas de resultados.

*`[INSERIR PRINT DA PÁGINA DE FILMES COM OS FILTROS VISÍVEIS AQUI]`*

### 4.4. Página de Detalhes

Esta é uma das páginas mais ricas da aplicação, fornecendo informações completas sobre um filme ou série.

- **Informações Completas**: Exibe o poster, título, tagline, sinopse, data de lançamento e avaliação média.
- **Player de Vídeo Embutido**: Uma funcionalidade central da página é um `iframe` que permite o streaming do conteúdo. O utilizador pode escolher entre vários servidores de streaming externos.
- **Sistema de Favoritos**: Um botão permite adicionar ou remover o item da lista de favoritos do perfil atual. O estado do botão (cor e texto) reflete se o item já é um favorito.
- **Conteúdo Adicional**: Apresenta o elenco (`Elenco`) e uma galeria de imagens (`GaleriaImagens`) relacionados com o filme ou série.

*`[INSERIR PRINT DA PÁGINA DE DETALHES DE UM FILME, MOSTRANDO O PLAYER E O BOTÃO DE FAVORITOS AQUI]`*

### Análise de Código: `DetalhesFilme.jsx`

Esta página demonstra duas funcionalidades cruciais: o carregamento eficiente de múltiplos recursos de dados e a interação com a API local para gerir o estado dos favoritos.

**1. Carregamento Eficiente de Dados**

Para evitar pedidos sequenciais à API, que tornariam o carregamento lento, a página utiliza `Promise.all` para executar todas as chamadas de rede em paralelo.

```javascript
useEffect(() => {
  const carregarTudo = async () => {
    try {
      setCarregando(true);
      const filmeId = parseInt(id, 10);

      // Executa todas as promessas em paralelo
      const [dadosFilme, dadosCreditos, dadosImagens, favoritoExistente] = await Promise.all([
          buscarDetalhesFilme(filmeId),
          obterCreditosFilme(filmeId),
          obterImagensFilme(filmeId),
          perfilAtual ? verificarSeFavorito(filmeId, perfilAtual) : Promise.resolve(null)
      ]);

      // Atualiza o estado apenas depois de todos os dados terem chegado
      setFilme(dadosFilme);
      setCreditos(dadosCreditos);
      setImagens(dadosImagens);
      setFavoritoId(favoritoExistente ? favoritoExistente.id : null);

    } catch (e) {
      setErro(`Lamentamos, ocorreu um erro: ${e.message}`);
    } finally {
      setCarregando(false);
    }
  };

  carregarTudo();
}, [id, perfilAtual]);
```

Isto garante que a página só tenta ser renderizada com os dados completos, e o tempo total de espera é ditado pela chamada à API mais lenta, em vez da soma de todas.

**2. Lógica de Adicionar/Remover Favoritos**

A função `lidarComToggleFavorito` contém a lógica para interagir com a API local, dependendo se o item já está ou não na lista de favoritos.

```javascript
const lidarComToggleFavorito = async () => {
  if (!filme || !perfilAtual) return;
  setCarregandoFavorito(true);
  try {
    if (favoritoId) {
      // Se já é favorito (temos um favoritoId), remove-o
      await removerFavorito(favoritoId);
      setFavoritoId(null); // Atualiza o estado local para refletir a remoção
    } else {
      // Se não é favorito, adiciona-o
      const itemParaAdicionar = { ...filme, media_type: 'movie' };
      const novoFavorito = await adicionarFavorito(itemParaAdicionar, perfilAtual);
      setFavoritoId(novoFavorito.id); // Guarda o novo ID retornado pela API
    }
  } catch (e) {
    alert(`Ocorreu um erro na operação de favoritos.`);
  } finally {
    setCarregandoFavorito(false);
  }
};
```

Este código mostra como o estado da UI (`favoritoId`) é usado para determinar a ação a tomar (chamar `removerFavorito` ou `adicionarFavorito`) e como é subsequentemente atualizado para refletir o resultado da operação, proporcionando feedback imediato ao utilizador.

### 4.5. Sistema de Favoritos (`MeusFavoritos`)

Os utilizadores podem guardar os seus filmes e séries preferidos para fácil acesso.

- **Adicionar/Remover**: A funcionalidade é acedida através da página de detalhes.
- **Listagem**: A página `MeusFavoritos` exibe uma grelha com todos os itens que o utilizador marcou como favoritos para o perfil ativo.
- **Dados Locais**: A lista de favoritos é gerida pelo `json-server` e associada a um `perfilId`, garantindo que cada perfil tem a sua própria lista.

*`[INSERIR PRINT DA PÁGINA "MEUS FAVORITOS" COM VÁRIOS ITENS GUARDADOS AQUI]`*

### 4.6. Dashboard do Utilizador

A página de Dashboard oferece ao utilizador uma visão estatística sobre os seus próprios gostos e atividade na plataforma, com base nos seus itens favoritos.

- **Estatísticas Rápidas**: São apresentados cartões com o número total de favoritos, e a contagem separada de quantos são filmes e quantas são séries.
- **Top Géneros**: A funcionalidade mais elaborada é um gráfico de barras que exibe os 10 géneros mais frequentes entre os favoritos do utilizador, permitindo-lhe visualizar rapidamente as suas preferências.
- **Dependência do Perfil**: A página só apresenta dados se um perfil estiver selecionado, incentivando o uso da funcionalidade de perfis.

*`[INSERIR PRINT DA PÁGINA DE DASHBOARD COM AS ESTATÍSTICAS E GRÁFICO VISÍVEIS AQUI]`*

#### Análise de Código: `Dashboard.jsx`

O cálculo das estatísticas é um bom exemplo de transformação de dados no frontend. A lógica combina os dados dos favoritos do utilizador com os dados de configuração da API da TMDB (as listas de géneros).

```javascript
const calcularEstatisticas = useCallback(async () => {
  if (!perfilAtual) return;
  
  // 1. Obter todos os dados em paralelo
  const [favoritos, generosFilmesData, generosSeriesData] = await Promise.all([
    obterFavoritos(perfilAtual),
    obterGenerosFilmes(),
    obterGenerosSeries(),
  ]);

  // 2. Criar um mapa de ID -> Nome do Género para consulta rápida
  const mapaGeneros = new Map();
  [...generosFilmesData.genres, ...generosSeriesData.genres].forEach(g => {
    mapaGeneros.set(g.id, g.name);
  });

  // 3. Contar a ocorrência de cada género
  const contagemGeneros = favoritos.reduce((acc, item) => {
    item.genres.forEach(g => {
      const nomeGenero = mapaGeneros.get(g.id);
      if (nomeGenero) {
        acc[nomeGenero] = (acc[nomeGenero] || 0) + 1;
      }
    });
    return acc;
  }, {});

  // 4. Ordenar e formatar os dados para o gráfico
  const generosOrdenados = Object.entries(contagemGeneros)
    .map(([nome, contagem]) => ({ nome, contagem }))
    .sort((a, b) => b.contagem - a.contagem)
    .slice(0, 10); // Top 10

  setStats({ 
      total: favoritos.length, 
      filmes: favoritos.filter(f => f.media_type === 'movie').length, 
      series: favoritos.filter(f => f.media_type === 'tv').length, 
      generos: generosOrdenados 
  });
}, [perfilAtual]);
```
Este snippet demonstra como, a partir de uma lista simples de favoritos, é possível extrair e processar dados para apresentar insights valiosos ao utilizador, enriquecendo a sua experiência.

### 4.7. Pesquisa

A funcionalidade de pesquisa é acessível através da `BarraPesquisa` e permite encontrar filmes e séries.

- **Estado Global**: A lógica de pesquisa (termo pesquisado, resultados, estado de carregamento) é gerida pelo `PesquisaContexto`.
- **Resultados Dinâmicos**: Os resultados são exibidos dinamicamente à medida que o utilizador interage com a pesquisa.

### 4.8. Tema Claro/Escuro

A aplicação inclui uma opção de tema para conforto visual do utilizador.

- **Botão de Alternância**: Um `BotaoTema` no menu permite alternar entre o modo claro e escuro.
- **Persistência e Preferência do Sistema**: A escolha do tema é guardada no `localStorage`. Se nenhuma escolha tiver sido feita, a aplicação adota a preferência de tema do sistema operativo do utilizador.
- **Implementação**: A alternância de tema é implementada adicionando ou removendo a classe `dark` ao elemento `<html>`, aproveitando as variantes `dark:` do Tailwind CSS.

*`[INSERIR PRINT DA APLICAÇÃO EM MODO ESCURO AQUI]`*

## 5. Gestão de Estado (React Context)

O estado global é gerido de forma elegante através de três contextos principais:

- **`TemaContexto`**: Gere o tema atual (claro/escuro) e a função para o alternar.
- **`PerfilContexto`**: Gere a lista de perfis disponíveis, o perfil atualmente selecionado e a função para o alterar.
- **`PesquisaContexto`**: Mantém o estado completo da funcionalidade de pesquisa, incluindo o termo, os resultados, e os estados de carregamento e erro.

Esta abordagem permite que componentes distantes na árvore de componentes acedam e modifiquem o estado global sem a necessidade de "prop drilling".

### Análise de Código: `TemaContexto.jsx`

Para ilustrar a implementação, vejamos o `TemaContexto`. Este ficheiro é um exemplo claro de como criar um gestor de estado reutilizável e auto-contido.

```javascript
import { createContext, useState, useEffect, useContext } from 'react';

const TemaContexto = createContext();

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(() => {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado) return temaGuardado;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement; // O elemento <html>
    
    if (tema === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('tema', tema);
  }, [tema]);

  const toggleTema = () => {
    setTema(temaAnterior => (temaAnterior === 'light' ? 'dark' : 'light'));
  };

  return (
    <TemaContexto.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContexto.Provider>
  );
}

export function useTema() {
  return useContext(TemaContexto);
}
```

**Pontos-chave do código:**

1.  **`createContext()`**: Inicia o contexto.
2.  **`useState(() => { ... })`**: O estado `tema` é inicializado de forma inteligente. Primeiro, tenta ler o valor do `localStorage`. Se não existir, utiliza a preferência de tema do sistema operativo do utilizador (`prefers-color-scheme`).
3.  **`useEffect(() => { ... }, [tema])`**: Este hook é executado sempre que o estado `tema` muda. A sua responsabilidade é de aplicar o efeito secundário: adicionar ou remover a classe `dark` do elemento `<html>` e persistir a nova escolha no `localStorage`.
4.  **`toggleTema`**: A função que permite aos componentes alterar o estado, invertendo o tema atual.
5.  **`useTema()`**: Um hook personalizado que simplifica o uso deste contexto noutros componentes, bastando chamar `const { tema, toggleTema } = useTema();`.

Este padrão encapsula toda a lógica do tema, tornando-a fácil de manter e de consumir em qualquer parte da aplicação.

## 6. Comunicação com APIs

A aplicação utiliza duas fontes de dados distintas, geridas por serviços dedicados:

- **`apiFilmes.js`**: Responsável por toda a comunicação com a API da **TMDB**. Contém dezenas de funções exportadas para buscar listas de filmes/séries, detalhes, créditos, imagens e para usar a funcionalidade de descoberta com filtros. Todas as chamadas são parametrizadas com a língua `pt-PT`.
- **`apiLocal.js`**: Comunica com o **`json-server`** (`localhost:3001`) para gerir dados persistentes do lado do utilizador, como perfis e a relação de favoritos. Este serviço encapsula os métodos HTTP (GET, POST, DELETE) para estas operações.

## 7. Como Executar o Projeto

1.  **Instalar Dependências**:
    ```bash
    npm install
    ```
2.  **Configurar Chave da API**:
    - Criar um ficheiro `.env.local` na raiz do projeto.
    - Adicionar a seguinte linha com a sua chave da API da TMDB:
      ```
      VITE_TMDB_API_KEY=sua_chave_aqui
      ```
3.  **Iniciar o Servidor da API Local**:
    - Num terminal, execute:
      ```bash
      npm run server
      ```
    - Este comando iniciará o `json-server`, que servirá o ficheiro `db.json` na porta 3001.
4.  **Iniciar a Aplicação de Desenvolvimento**:
    - Noutro terminal, execute:
      ```bash
      npm run dev
      ```
    - A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## 8. Planos para o Futuro do Trabalho

Apesar de ser um projeto completo e funcional, o CineSync possui um grande potencial para crescimento. As seguintes funcionalidades poderiam ser implementadas para o tornar ainda mais robusto e competitivo:

- **Sistema de Autenticação com Firebase**: A atual gestão de perfis, baseada em `json-server`, é ideal para desenvolvimento e prototipagem. Uma evolução natural seria substituir este sistema por um serviço de autenticação completo como o **Firebase Authentication**. Isto traria vantagens como:
    - **Login Seguro**: Registo de utilizadores com email/password de forma segura.
    - **Login Social**: Integração fácil com provedores como Google, Facebook, e GitHub.
    - **Gestão de Sessões e Segurança**: Mecanismos de recuperação de password e gestão de sessões de utilizador.
    - **Base de Dados em Tempo Real**: Utilizar o **Firestore** (parte do Firebase) para armazenar os favoritos e outras informações do utilizador, eliminando a necessidade do `json-server` e permitindo sincronização em tempo real entre dispositivos.

- **Sistema de Comentários e Avaliações**: Permitir que os utilizadores deixem as suas próprias classificações (de 1 a 5 estrelas) e escrevam críticas sobre os filmes e séries. Esta funcionalidade aumentaria o engagement e criaria uma comunidade em torno da plataforma.

- **Recomendações Personalizadas**: Com base no histórico de visualizações e nos favoritos de um utilizador, a aplicação poderia sugerir novos conteúdos. Algoritmos simples (ex: "utilizadores que gostaram disto também gostaram de...") ou baseados em géneros e atores em comum poderiam ser implementados.

- **Notificações**: Implementar um sistema que alerte o utilizador (ex: via notificações push no navegador) quando um novo episódio de uma série favorita for lançado ou quando um filme muito aguardado chegar à plataforma.

- **Melhorias de UI/UX**:
    - **Scroll Infinito**: Nas páginas de listagem, substituir a paginação clássica por um sistema de scroll infinito, onde mais conteúdo é carregado automaticamente à medida que o utilizador desce a página.
    - **Animações Avançadas**: Utilizar a `framer-motion` de forma mais extensiva para criar transições de página mais fluidas e micro-interações que melhorem a experiência do utilizador.

## 9. Conclusão

A aplicação **CineSync** é um projeto de frontend robusto e bem estruturado. Demonstra um excelente domínio de conceitos modernos de desenvolvimento web com React, incluindo componentização, gestão de estado com Context, routing, e comunicação com APIs. A separação clara de responsabilidades, a reutilização de componentes e as funcionalidades focadas no utilizador final resultam numa aplicação coesa e de alta qualidade.

