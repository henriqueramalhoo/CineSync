# Relatório Técnico da Aplicação de Streaming de Filmes e Séries

**Autor:** Henrique Ramalho
**Data:** 18/12/2025

## 1. Introdução

Este documento detalha a arquitetura, tecnologia e funcionalidades da aplicação "Catálogo de Média", uma plataforma web interativa para explorar, pesquisar e gerir uma coleção de filmes e séries.

O objetivo principal da aplicação é fornecer uma interface de utilizador moderna, intuitiva e responsiva, que permite aos utilizadores descobrir novos conteúdos, ver detalhes, gerir perfis de utilizador e guardar os seus títulos favoritos. O projeto foi desenvolvido com tecnologias web modernas, focando-se na componentização e na gestão de estado eficiente.

`[INSERIR PRINT AQUI: Ecrã completo da página inicial da aplicação, dando uma visão geral do design.]`

## 2. Arquitetura do Projeto

A aplicação segue uma arquitetura baseada em componentes, típica de projetos React. A estrutura de pastas principal está organizada da seguinte forma:

-   **`src/`**: Contém todo o código-fonte da aplicação.
    -   **`componentes/`**: Armazena componentes React reutilizáveis (ex: `BarraPesquisa`, `Carrossel`, `GrelhaItens`), que são os blocos de construção da UI.
    -   **`paginas/`**: Contém os componentes de nível superior que representam as diferentes páginas da aplicação (ex: `NovaPaginaHome`, `PaginaFilmes`, `DetalhesFilme`).
    -   **`contextos/`**: Gere o estado global da aplicação usando a Context API do React. Inclui contextos para o tema (claro/escuro), perfis de utilizador e estado da pesquisa.
    -   **`servicos/`**: Isola a lógica de comunicação com APIs. Contém `apiFilmes.js` para interagir com a API externa (ex: The Movie Database) e `apiLocal.js` para comunicar com o servidor local (`db.json`) para dados de perfis e favoritos.
    -   **`assets/`**: Ficheiros estáticos como imagens e SVGs.
-   **`public/`**: Ficheiros estáticos que não são processados pelo build do Vite.
-   **`db.json`**: Um ficheiro JSON que atua como uma base de dados mock para desenvolvimento, servida pelo `json-server`. Armazena dados como perfis e listas de favoritos.

## 3. Tecnologias Utilizadas

-   **React**: Biblioteca principal para a construção da interface de utilizador.
-   **Vite**: Ferramenta de build e servidor de desenvolvimento rápido.
-   **Tailwind CSS**: Framework de CSS utility-first para estilização rápida e consistente.
-   **React Router**: Para a gestão de rotas e navegação entre as diferentes páginas.
-   **JSON Server**: Para simular uma API RESTful a partir do ficheiro `db.json`, permitindo o desenvolvimento do frontend de forma isolada.
-   **ESLint**: Para garantir a qualidade e a consistência do código.

## 4. Funcionalidades Principais

A aplicação oferece um conjunto robusto de funcionalidades para o utilizador.

### 4.1. Seleção e Gestão de Perfis

A aplicação suporta múltiplos perfis de utilizador. Ao iniciar, o utilizador pode escolher um perfil. Esta seleção personaliza a experiência, nomeadamente a lista de favoritos.

-   **Componente Principal**: `SeletorPerfil.jsx`
-   **Gestão de Estado**: `PerfilContexto.jsx`

`[INSERIR PRINT AQUI: O seletor de perfis, de preferência a mostrar os diferentes perfis disponíveis para seleção.]`

### 4.2. Página Inicial Dinâmica

A página inicial (`NovaPaginaHome`) serve como um portal de descoberta, apresentando:
-   Uma secção "Hero" com um filme ou série em destaque.
-   Vários carrosséis horizontais que exibem listas de conteúdos, como "Filmes Populares", "Séries em Alta", etc.

-   **Componentes Principais**: `Hero.jsx`, `Carrossel.jsx`, `ItemCarrossel.jsx`

`[INSERIR PRINT AQUI: A página inicial completa, destacando a secção Hero e os carrosséis de conteúdo abaixo.]`

### 4.3. Navegação, Pesquisa e Filtragem

A interface permite uma navegação fluida e uma pesquisa poderosa:
-   **Menu de Navegação**: Um menu fixo (`Menu.jsx`) que permite navegar para as páginas de Filmes, Séries e Meus Favoritos.
-   **Barra de Pesquisa**: O componente `BarraPesquisa.jsx` permite aos utilizadores procurar títulos em tempo real. O estado da pesquisa é gerido globalmente pelo `PesquisaContexto.jsx`.
-   **Filtros**: Nas páginas de listagem (`PaginaFilmes`, `Series`), o utilizador pode aplicar filtros (ex: por género, ano) para refinar os resultados.

`[INSERIR PRINT AQUI: Um print da página de listagem de filmes com a barra de pesquisa preenchida e os filtros aplicados.]`

### 4.4. Listagem e Paginação de Conteúdo

As páginas `PaginaFilmes.jsx` e `Series.jsx` exibem os conteúdos numa grelha. Para lidar com um grande número de resultados, foi implementado um sistema de paginação.

-   **Componentes Principais**: `GrelhaItens.jsx`, `Paginacao.jsx`

`[INSERIR PRINT AQUI: A grelha de filmes ou séries, com os controlos de paginação (números de página, botões seguinte/anterior) bem visíveis na parte inferior.]`

### 4.5. Página de Detalhes

Ao clicar num item, o utilizador é levado para uma página de detalhes (`DetalhesFilme.jsx` ou `DetalhesSerie.jsx`) que fornece informação completa, incluindo:
-   Poster e título.
-   Sinopse, data de lançamento e avaliação.
-   Lista do elenco principal (`Elenco.jsx`).
-   Uma galeria de imagens relacionadas (`GaleriaImagens.jsx`).
-   Um botão para adicionar ou remover o item dos favoritos.

`[INSERIR PRINT AQUI: A página de detalhes de um filme conhecido, mostrando a sinopse, o elenco e a galeria de imagens.]`

### 4.6. Gestão de Favoritos

Cada perfil de utilizador pode ter a sua própria lista de favoritos. O utilizador pode adicionar/remover um título através da página de detalhes. A página `MeusFavoritos.jsx` exibe todos os títulos guardados para o perfil ativo.

-   **Interação com API**: As alterações são persistidas no `db.json` através do `apiLocal.js`.

`[INSERIR PRINT AQUI: A página "Meus Favoritos" com vários filmes e séries adicionados. Se possível, um segundo print mostrando o ícone de "favorito" ativado na página de detalhes.]`

### 4.7. Dashboard de Estatísticas

A página `Dashboard.jsx` oferece uma visão geral e estatística dos dados locais da aplicação, como o número de perfis criados e o total de favoritos guardados em todos os perfis.

`[INSERIR PRINT AQUI: O ecrã do Dashboard, mostrando os cartões de estatísticas ou gráficos.]`

### 4.8. Tema Claro e Escuro (Dark Mode)

A aplicação inclui um seletor de tema que permite ao utilizador alternar entre um modo claro e um modo escuro, melhorando o conforto visual. O estado do tema é gerido globalmente pelo `TemaContexto.jsx`.

-   **Componente Principal**: `BotaoTema.jsx`

`[INSERIR PRINT AQUI: Duas imagens lado a lado: uma da página inicial em modo claro e outra em modo escuro para comparação.]`

## 5. Estrutura da API Local (db.json)

O ficheiro `db.json` simula a base de dados da aplicação e está estruturado da seguinte forma:

```json
{
  "perfis": [
    {
      "id": 1,
      "nome": "Henrique",
      "avatar": "url_para_o_avatar.jpg"
    }
    // ... outros perfis
  ],
  "favoritos": [
    {
      "id": 1,
      "perfilId": 1,
      "tipo": "movie",
      "mediaId": 12345
    }
    // ... outros favoritos
  ]
}
```

-   **`perfis`**: Uma lista de todos os perfis de utilizador disponíveis.
-   **`favoritos`**: Uma lista que mapeia os itens favoritados (`mediaId`) a um perfil específico (`perfilId`).

## 6. Como Executar o Projeto

Para executar a aplicação em ambiente de desenvolvimento, siga os seguintes passos:

1.  **Instalar as dependências**:
    ```bash
    npm install
    ```

2.  **Iniciar o servidor da API local**:
    Num terminal, execute o `json-server` para servir o ficheiro `db.json`.
    ```bash
    npx json-server --watch db.json --port 3001
    ```

3.  **Iniciar a aplicação React**:
    Noutro terminal, inicie o servidor de desenvolvimento do Vite.
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

## 7. Conclusão

A aplicação "Catálogo de Média" é uma demonstração robusta de uma aplicação web moderna construída com React. A sua arquitetura modular, gestão de estado centralizada e funcionalidades bem definidas resultam numa experiência de utilizador rica e coesa. O projeto demonstra boas práticas de desenvolvimento, como a separação de responsabilidades e a componentização, estabelecendo uma base sólida para futuras expansões.