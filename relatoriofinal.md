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

### 4.5. Sistema de Favoritos (`MeusFavoritos`)

Os utilizadores podem guardar os seus filmes e séries preferidos para fácil acesso.

- **Adicionar/Remover**: A funcionalidade é acedida através da página de detalhes.
- **Listagem**: A página `MeusFavoritos` exibe uma grelha com todos os itens que o utilizador marcou como favoritos para o perfil ativo.
- **Dados Locais**: A lista de favoritos é gerida pelo `json-server` e associada a um `perfilId`, garantindo que cada perfil tem a sua própria lista.

*`[INSERIR PRINT DA PÁGINA "MEUS FAVORITOS" COM VÁRIOS ITENS GUARDADOS AQUI]`*

### 4.6. Pesquisa

A funcionalidade de pesquisa é acessível através da `BarraPesquisa` e permite encontrar filmes e séries.

- **Estado Global**: A lógica de pesquisa (termo pesquisado, resultados, estado de carregamento) é gerida pelo `PesquisaContexto`.
- **Resultados Dinâmicos**: Os resultados são exibidos dinamicamente à medida que o utilizador interage com a pesquisa.

### 4.7. Tema Claro/Escuro

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

## 8. Conclusão

A aplicação **CineSync** é um projeto de frontend robusto e bem estruturado. Demonstra um excelente domínio de conceitos modernos de desenvolvimento web com React, incluindo componentização, gestão de estado com Context, routing, e comunicação com APIs. A separação clara de responsabilidades, a reutilização de componentes e as funcionalidades focadas no utilizador final resultam numa aplicação coesa e de alta qualidade.
