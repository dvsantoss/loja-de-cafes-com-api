# ☕ Loja de Café (Single Page Application)

Este projeto é um website dinâmico desenvolvido para uma loja de cafés.  
O objetivo principal foi construir uma aplicação utilizando **JavaScript Puro** para manipulação do **DOM**, consumindo dados de uma **API local** e gerenciando um **carrinho de compras** via **localStorage**.

O projeto segue o conceito de **SPA (Single Page Application)**, onde todo o conteúdo é gerado dinamicamente dentro de uma única `div` no HTML.

---

## 🚀 Funcionalidades

- **Vitrine de Produtos:** Carregamento dinâmico de cafés vindos de uma API JSON.  
- **Carrinho de Compras:**
  - Adicionar e remover itens.  
  - Alterar quantidades.  
  - Persistência de dados (o carrinho não some ao atualizar a página) usando Web Storage.  
- **Interface Responsiva:** Layout adaptável para mobile e desktop utilizando **Bootstrap 5**.  
- **Checkout:** Modal de finalização de compra com validação de formulário.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3**  
- **JavaScript (ES6 Modules):** Código modularizado (import/export)  
- **Bootstrap 5:** Para estilização e componentes (Navbar, Cards, Offcanvas, Modal)  
- **JSON Server:** Para simular uma API REST localmente  

---

## 📂 Estrutura do Projeto

O código foi organizado em módulos para separar as responsabilidades, facilitando a manutenção:

```
LOJA-DE-CAFE-COM-API/
│
├── 📁 node_modules/      # Dependências do projeto (json-server, etc.)
│
├── 📄 api.js             # Módulo responsável por buscar os dados (fetch) no db.json
├── 📄 carrinho.js        # Lógica do carrinho (salvar/ler do localStorage)
├── 📄 dom.js             # Criação dinâmica dos elementos HTML (Cards de café)
├── 📄 main.js            # Arquivo principal: orquestra a API, DOM e Eventos
│
├── 📄 db.json            # Banco de dados simulado com a lista de cafés
├── 📄 index.html         # Ponto de entrada (contém apenas a <div id="root">)
├── 📄 package.json       # Configurações e scripts do projeto
└── 📄 requisitos.pdf     # Descrição dos requisitos
```

---

## ⚙️ Como Rodar o Projeto

**Pré-requisitos:**  
Você precisa ter o **Node.js** instalado no seu computador.

### 1. Instalar Dependências
Abra o terminal na pasta do projeto e execute:
```bash
npm install
```

### 2. Iniciar a API Local
O projeto precisa que o servidor esteja rodando para carregar os cafés.  
No terminal, execute:
```bash
npx json-server db.json
```
Isso iniciará a API em `http://localhost:3000/coffee`.

### 3. Rodar a Aplicação
Como o projeto usa **Módulos ES (import/export)**, você **não pode abrir o index.html direto no navegador**.  
Você precisa de um servidor local.

Se você usa o **VS Code**:
1. Instale a extensão **Live Server**.  
2. Clique com o botão direito no `index.html`.  
3. Escolha **"Open with Live Server"**.  

---

## 📚 O que foi aprendido

- Manipulação avançada do DOM (`createElement`, `appendChild`).  
- Uso de **Fetch API** e **Async/Await** para requisições HTTP.  
- Gerenciamento de estado local com **LocalStorage**.  
- Conceito de **Modularização em JavaScript**.  
- Integração de lógica JS com componentes visuais do **Bootstrap**.
