# Relatório Final de Projeto: CineSync

---

## **Capa**

**Título do Projeto:** CineSync

**Nome do Aluno:** Henrique Ramalho

**Curso:** Curso Técnico Superior Profissional em Tecnologias e Programação de Sistemas de Informação

**Unidade Curricular:** Programação Web II

**Ano Letivo:** 2025/2026

---

## 1. Introdução

No panorama atual do entretenimento digital, a abundância de serviços de streaming resulta numa fragmentação da informação, dificultando a tarefa de descobrir novos conteúdos e gerir uma lista pessoal de filmes e séries para assistir. O projeto **CineSync** foi concebido para resolver este problema, atuando como um *hub* centralizado e personalizado para a exploração do universo audiovisual.

O objetivo primordial foi desenvolver uma aplicação web *single-page application* (SPA) rica, reativa e com uma experiência de utilizador de alto nível, utilizando um stack tecnológico moderno composto por **React**, **Vite** e **Tailwind CSS**. O projeto integra uma API externa de grande escala, o **The Movie Database (TMDB)**, para popular o seu catálogo, e simula um backend multi-perfil com `json-server` para persistência de dados local, cumprindo e expandindo os requisitos fundamentais da unidade curricular de Programação Web II.

---

## 2. Arquitetura da Aplicação

O CineSync foi desenvolvido com uma arquitetura modular e escalável, centrada na componentização e na separação de responsabilidades. A estrutura de pastas reflete esta organização:

*   **`src/componentes`**: Contém componentes React reutilizáveis que formam os blocos de construção da UI. A estratégia foi criar componentes genéricos (`GrelhaItens`, `Carrossel`, `Filtros`) que podem ser adaptados para diferentes tipos de conteúdo (filmes ou séries), evitando a duplicação de código.
*   **`src/paginas`**: Cada página da aplicação (Home, Filmes, Séries, Detalhes, etc.) tem o seu próprio componente, responsável por orquestrar os componentes de UI e a lógica específica da página.
*   **`src/contextos`**: A gestão de estado global é centralizada através da Context API do React. Foram criados contextos separados para o **Tema**, **Perfis de Utilizador** e **Pesquisa**, garantindo que o estado é partilhado de forma eficiente e sem "prop drilling".
*   **`src/servicos`**: A comunicação com as APIs (tanto a externa do TMDB como a local do `json-server`) está abstraída em módulos de serviço. Esta camada é responsável por fazer os pedidos HTTP, tratar as respostas e devolver os dados num formato consistente para a aplicação.

---

## 3. Desenvolvimento

### 3.1. Funcionalidades Implementadas

#### **Página Home e Navegação**

A página principal serve como portal de entrada, apresentando ao utilizador o conteúdo mais relevante. Inclui um componente "Hero" com uma imagem de destaque e carrosséis para "Filmes em Exibição" e "Séries no Ar". A navegação principal é assegurada por um menu acessível e intuitivo.

> **[SUGESTÃO DE PRINT]**: Ecrã completo da Página Home, mostrando o Hero e os carrosséis.

#### **Descoberta Avançada e Pesquisa**

As páginas de catálogo (`/filmes` e `/series`) são o núcleo da descoberta de conteúdo.

*   **Pesquisa por Texto:** Permite encontrar títulos específicos.
*   **Filtros Avançados:** O utilizador pode refinar a sua busca por Género, Ano, País de Origem e Língua.
*   **Ordenação:** Os resultados podem ser ordenados por Popularidade, Data de Lançamento e Avaliação.
*   **Paginação:** Navegação eficiente através de múltiplas páginas de resultados.

> **[SUGESTÃO DE PRINT]**: Ecrã da página `/filmes` com a secção de filtros aberta e alguns filtros aplicados.

#### **Página de Detalhes**

A página de detalhes oferece uma visão completa sobre um filme ou série.

*   **Informação Detalhada:** Apresenta título, sinopse, avaliação, elenco principal e uma galeria de imagens.
*   **Leitor de Vídeo:** Um leitor de vídeo incorporado permite assistir a trailers ou ao conteúdo, com a opção de selecionar diferentes servidores. Para séries, inclui um seletor de temporada e episódio.

> **[SUGESTÃO DE PRINT]**: Ecrã da página de detalhes de um filme, destacando o leitor de vídeo e a secção do elenco.

#### **Sistema de Perfis e Gestão de Favoritos (CRUD)**

A aplicação simula um ambiente multi-perfil, onde cada utilizador tem a sua própria lista de favoritos.

*   **Seleção de Perfil:** Um menu permite alternar entre perfis, com a seleção a ser guardada no `localStorage`.
*   **CRUD de Favoritos:**
    *   **Adicionar:** Um botão na página de detalhes permite adicionar o item aos favoritos do perfil ativo.
    *   **Ler:** A página "Meus Favoritos" lista todos os itens guardados.
    *   **Remover:** É possível remover um item da lista, tanto na página de favoritos como na de detalhes.

> **[SUGESTÃO DE PRINT]**: Ecrã da página "Meus Favoritos", mostrando uma lista de filmes e séries favoritados por um perfil.

#### **Dashboard Personalizado**

A página de Dashboard oferece uma visão estatística sobre os gostos do utilizador.

*   **Estatísticas:** Contagem de filmes e séries favoritas.
*   **Gráfico de Géneros:** Um gráfico de barras visualiza os géneros mais presentes na lista de favoritos.

> **[SUGESTÃO DE PRINT]**: Ecrã da página "Dashboard" com o gráfico de géneros visível.

#### **UI/UX e Animações**

*   **Tema Claro/Escuro:** Permite ao utilizador escolher o seu tema preferido.
*   **Design Responsivo:** A interface adapta-se a diferentes tamanhos de ecrã.
*   **Animações com Framer Motion:** Animações subtis foram adicionadas para melhorar a fluidez da navegação e interação.

> **[SUGESTÃO DE PRINT]**: Montagem com duas imagens lado a lado, mostrando a mesma página nos temas claro e escuro.

### 3.2. Decisões Técnicas Relevantes

1.  **Arquitetura de Componentes Genéricos:** Para evitar a duplicação de código entre as secções de Filmes e Séries, foi adotada uma estratégia de componentização genérica. Componentes como `GrelhaItens.jsx`, `Carrossel.jsx` e `ItemCarrossel.jsx` foram desenhados para aceitar uma propriedade `tipo` ('movie' ou 'tv'), adaptando-se dinamicamente para mostrar os dados e links corretos.

2.  **Gestão de Estado Global com Context API:** Para gerir estado partilhado por toda a aplicação (tema, perfil, pesquisa), foram criados três contextos React distintos (`TemaContexto`, `PerfilContexto`, `PesquisaContexto`). Esta abordagem evitou o "prop drilling" e centralizou a lógica de negócio, tornando a aplicação mais organizada e fácil de manter.

3.  **Simulação de Backend Relacional com `json-server`:** A persistência de dados foi implementada com `json-server` e uma estrutura relacional. O ficheiro `db.json` contém listas separadas para `perfis` e `favoritos`, com cada favorito a ter uma `perfilId` para simular uma chave estrangeira. Isto permite queries eficientes (ex: `GET /favoritos?perfilId=Joel`) e um código de acesso a dados mais limpo.

4.  **Debounce na Lógica de Filtragem:** Nas páginas de catálogo, a função de busca de dados com base nos filtros está envolvida num `setTimeout` de 500ms. Esta técnica de "debounce" previne chamadas excessivas à API durante a interação do utilizador com os filtros, melhorando a performance e a experiência de utilização.

5.  **Roteamento Dinâmico e Estilos Condicionais:** O `react-router-dom` gere a navegação SPA. O hook `useLocation` é utilizado para aplicar estilos diferentes ao cabeçalho: transparente e sobreposto nas páginas principais (Home, Filmes, Séries), e sólido e fixo (`sticky`) nas restantes, garantindo uma estética imersiva sem sacrificar a legibilidade.

---

## 4. Próximos Passos e Evolução Futura

O passo mais lógico e impactante para a evolução do CineSync é a transição do backend simulado para uma solução real na nuvem. A implementação de um sistema de autenticação e base de dados com **Firebase** (usando Firebase Authentication e Firestore) traria os seguintes benefícios:
*   **Contas de Utilizador Reais:** Os perfis deixariam de ser uma simulação para se tornarem contas de utilizador seguras, com login através de email, Google, etc.
*   **Persistência na Nuvem:** Os dados de favoritos ficariam guardados na nuvem, associados à conta do utilizador, e seriam acessíveis a partir de qualquer dispositivo, em qualquer lugar.
*   **Escalabilidade:** A arquitetura estaria preparada para crescer e suportar um número real de utilizadores.

Esta evolução transformaria o CineSync de um projeto de portfólio robusto para uma aplicação web *full-stack* pronta para produção.

---

## 5. Conclusão

O desenvolvimento do CineSync foi um sucesso, culminando numa aplicação que não só cumpre todos os requisitos obrigatórios do projeto, mas também explora e implementa um conjunto significativo de funcionalidades avançadas e opcionais. O resultado é um produto final polido, funcional e com uma experiência de utilizador coesa e moderna.

Para além de ser um exercício académico, o CineSync demonstrou ser uma ferramenta de grande utilidade pessoal, que pretendo continuar a usar e a desenvolver no meu dia a dia para organizar e descobrir novos filmes e séries.

---

## 6. Bibliografia / Webgrafia

*   **React:** [https://react.dev/](https://react.dev/)
*   **Vite:** [https://vitejs.dev/](https://vitejs.dev/)
*   **Tailwind CSS:** [https://tailwindcss.com/](https://tailwindcss.com/)
*   **The Movie Database (TMDB) API:** [https://www.themoviedb.org/](https://www.themoviedb.org/)
*   **Framer Motion:** [https://www.framer.com/motion/](https://www.framer.com/motion/)
*   **json-server:** [https://github.com/typicode/json-server](https://github.com/typicode/json-server)
*   **React Router:** [https://reactrouter.com/](https://reactrouter.com/)