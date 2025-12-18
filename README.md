# CineSync: Um Portal de Filmes e Séries

## Descrição do Tema e Objetivos

O **CineSync** é uma aplicação web moderna e reativa, desenvolvida em React, Vite e Tailwind CSS, que permite aos utilizadores explorar um vasto catálogo de filmes e séries. O principal objetivo é proporcionar uma experiência de utilizador intuitiva e visualmente apelativa para a descoberta de conteúdo, bem como a gestão personalizada de favoritos através de um sistema de perfis simulado.

A aplicação simula um serviço de streaming, onde os utilizadores podem:
*   Descobrir filmes e séries em destaque.
*   Pesquisar e filtrar conteúdo por vários critérios (género, ano, país, língua).
*   Visualizar detalhes de filmes e séries, incluindo a opção de assistir a trailers ou conteúdo através de players incorporados.
*   Gerir uma lista personalizada de filmes e séries favoritas, associada a perfis de utilizador simulados.

## API Externa Utilizada

A principal fonte de dados para o catálogo de filmes e séries é a **The Movie Database (TMDB) API**.

*   **Website:** [https://www.themoviedb.org/](https://www.themoviedb.org/)
*   **Documentação da API:** [https://developer.themoviedb.org/](https://developer.themoviedb.org/)

### Obter a Chave de API (API Key) do TMDB

Para que a aplicação funcione corretamente, é necessário obter uma chave de API gratuita do TMDB:
1.  Regista-te em [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup).
2.  Após o registo, vai às configurações do teu perfil e seleciona a secção "API".
3.  Gera uma nova chave de API (v3).

## Instruções para Correr o Projeto

### Pré-requisitos
*   Node.js (versão LTS recomendada)
*   npm (vem com o Node.js)

### 1. Clonar o Repositório
```bash
git clone <URL_DO_TEU_REPOSITORIO>
cd react_final_henriqueramalho # ou o nome da pasta do teu projeto
```

### 2. Configurar a Chave de API do TMDB

Cria um ficheiro na raiz do projeto chamado `.env.local` e adiciona a tua chave de API do TMDB (obtida no passo anterior):
```
VITE_TMDB_API_KEY="A_TUA_CHAVE_API_AQUI"
```
Substitui `"A_TUA_CHAVE_API_AQUI"` pela chave que obtiveste do TMDB.

### 3. Instalar Dependências
```bash
npm install
```

### 4. Iniciar o Servidor de Dados Local (json-server)

Para a funcionalidade de perfis e favoritos, o projeto utiliza um servidor de dados falso que guarda as informações no ficheiro `db.json`.
**Este servidor deve ser iniciado numa janela de terminal SEPARADA e mantido em execução:**
```bash
npm run server
```
Certifica-te de que o ficheiro `db.json` existe na raiz do projeto e contém a estrutura inicial de perfis e favoritos:
```json
{
  "perfis": [
    { "id": "Joel", "nome": "Joel" },
    { "id": "Travassos", "nome": "Travassos" }
  ],
  "favoritos": []
}
```

### 5. Iniciar a Aplicação React

**Abre uma NOVA janela de terminal** (mantendo o `json-server` a correr na primeira) e inicia a aplicação React:
```bash
npm run dev
```
A aplicação será aberta no teu browser, geralmente em `http://localhost:5173/`.

## Breve Explicação das Funcionalidades

O CineSync oferece as seguintes funcionalidades principais:

*   **Página Home (`/`):** Exibe os filmes em exibição e as séries no ar, com uma imagem de destaque dinâmica.
*   **Páginas de Filmes (`/filmes`) e Séries (`/series`):**
    *   Permitem navegar por um vasto catálogo de conteúdo.
    *   Incluem uma barra de pesquisa para procurar filmes/séries por texto.
    *   Oferecem filtros avançados por **género, ano, país e língua original**.
    *   Permitem **ordenar** os resultados por popularidade, data de lançamento/estreia e avaliação.
    *   Possuem **paginação** para navegar por todas as páginas de resultados.
*   **Páginas de Detalhes (`/filme/:id` e `/serie/:id`):**
    *   Mostram informações detalhadas sobre o filme ou série (sinopse, data, avaliação).
    *   Disponibilizam um **leitor de vídeo incorporado** para assistir a trailers ou ao conteúdo (com a opção de selecionar vários servidores de embed). Para séries, permite selecionar a temporada e o episódio.
*   **Sistema de Perfis Simulados:**
    *   Pode-se selecionar um perfil (ex: "Joel", "Travassos") no menu.
    *   A lista de favoritos e as estatísticas do dashboard são personalizadas para o perfil ativo.
*   **Gestão de Favoritos (CRUD):**
    *   Na página de detalhes de um filme ou série, pode-se **adicionar** ou **remover** o item da lista de favoritos do perfil selecionado.
    *   A página "Meus Favoritos" (`/favoritos`) mostra todos os itens favoritos, separados por filmes e séries, e permite **remover** itens diretamente da lista.
*   **Dashboard do Perfil (`/dashboard`):** Uma página que apresenta estatísticas sobre os favoritos do perfil ativo, incluindo o total de filmes e séries e um gráfico dos géneros mais favoritados.
*   **Tema Claro/Escuro:** Alterna entre um tema claro e um tema escuro (navy blue) através de um botão no menu, com a preferência guardada no browser.
*   **Design Responsivo:** A aplicação adapta-se a diferentes tamanhos de ecrã (desktop, tablet, mobile).