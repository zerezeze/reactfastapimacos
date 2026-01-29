## Task Manager – FastAPI + React

Aplicação para gerenciamento de atividades, com backend em FastAPI (Python) e frontend em React + Vite + Tailwind. Permite criar, listar, editar, excluir e atualizar o status das atividades, além de anexar uma imagem opcional à atividade.

## Requisitos do ambiente

- Python 3.11 ou 3.12
- Node.js 18+
- npm ou yarn

> Observação: o projeto não é compatível com Python 3.14 (preview) devido a dependências nativas do Pydantic/FastAPI.


### Funcionalidades

- **Atividades**
  - Adicionar novas atividades com título, descrição e status (`pendente`, `em andamento`, `concluído`).
  - Editar atividades existentes.
  - Excluir atividades.
  - Atualizar o status da atividade.
- **Exibição**
  - Board com 3 colunas (Pendente, Em andamento, Concluída).
  - Cada coluna mostra o título do status, o total de atividades e as atividades daquele grupo.
- **Anexo de imagem (diferencial)**
  - Upload de imagem associado a uma atividade.
  - Exibição da imagem na página de detalhes da atividade.
- **Navegação (diferencial)**
  - `React Router` com:
    - `/` – lista/board de atividades.
    - `/tasks/:id` – detalhes da atividade.
- **Persistência**
  - Todas as atividades são salvas em arquivo JSON no backend.

---

## Backend (FastAPI)

### Estrutura principal

- `backend/main.py`
  - Cria a aplicação FastAPI.
  - Configura CORS para permitir o frontend (`http://localhost:5173`).
  - Endpoints REST:
    - `GET /` – mensagem de boas-vindas.
    - `GET /tasks` – lista todas as tarefas.
    - `GET /tasks/{task_id}` – obtém uma tarefa específica.
    - `POST /tasks` – cria uma nova tarefa.
    - `PUT /tasks/{task_id}` – atualiza uma tarefa existente.
    - `DELETE /tasks/{task_id}` – remove uma tarefa.
    - `POST /tasks/{task_id}/image` – **upload de imagem** vinculada à tarefa.
  - Monta a rota estática `/uploads` para servir as imagens enviadas.

- `backend/models.py`
  - `TaskStatus` – enum com `pendente`, `em andamento`, `concluído`.
  - `TaskBase` – campos base: `title`, `description`, `status`, `image_url?`.
  - `TaskCreate`, `TaskUpdate`, `Task` – schemas da API.

- `backend/database.py`
  - Classe `Database` responsável por ler/escrever o arquivo JSON:
    - Arquivo padrão: `backend/data/tasks.json`.
  - Métodos:
    - `get_all_tasks()`, `get_task_by_id(id)`.
    - `create_task(task_create)`.
    - `update_task(id, task_update)` (incluindo `image_url`).
    - `delete_task(id)`.

### Como rodar o backend

No diretório raiz do projeto:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: source venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

O backend ficará acessível em `http://127.0.0.1:8000`.

### Endpoints principais

- `GET /tasks` – lista de tarefas.
- `GET /tasks/{id}` – detalhe de uma tarefa.
- `POST /tasks`
  - Corpo JSON:
    ```json
    {
      "title": "Estudar FastAPI",
      "description": "Ler documentação oficial",
      "status": "pendente"
    }
    ```
- `PUT /tasks/{id}` – corpo JSON com campos opcionais.
- `DELETE /tasks/{id}` – remove a tarefa.
- `POST /tasks/{id}/image`
  - Envia `multipart/form-data` com campo `file` (imagem).
  - A API salva o arquivo em `backend/uploads/` e atualiza o campo `image_url` da tarefa.

### Testes de backend

Os testes utilizam `pytest` e `fastapi.testclient`.

Para executar:

```bash
cd backend
source venv/bin/activate  # Windows: source venv/Scripts/activate
python -m pytest
```

O arquivo `backend/tests/test_tasks.py` cobre:

- Criação de tarefa e persistência no JSON.
- Listagem das tarefas criadas.
- Atualização de status e descrição.
- Exclusão de tarefa.
- Upload de imagem e associação do campo `image_url`.

---

## Frontend (React + Vite + Tailwind)

### Estrutura principal

- `frontend/src/main.jsx`
  - Ponto de entrada da aplicação React.
- `frontend/src/App.jsx`
  - Configura o `BrowserRouter` e as rotas:
    - `/` → `TaskBoardPage`.
    - `/tasks/:id` → `TaskDetailPage`.

- `frontend/src/pages/TaskBoardPage.jsx`
  - Carrega as tarefas da API (`fetchTasks`).
  - Usa `useState` e `useEffect` para gerenciar estado e ciclo de vida.
  - Agrupa tarefas por status (pendente, em andamento, concluído).
  - Exibe board com 3 colunas, usando o componente `TaskColumn`.
  - Possui formulário (`TaskForm`) para criar ou editar uma tarefa.

- `frontend/src/pages/TaskDetailPage.jsx`
  - Carrega uma tarefa específica (`fetchTask`).
  - Exibe título, descrição, status e, se existir, a imagem (`image_url`).
  - Permite:
    - Editar tarefa (título, descrição, status).
    - Excluir tarefa.
    - Fazer **upload/troca de imagem** para a tarefa (`uploadTaskImage`).

- `frontend/src/components/TaskForm.jsx`
  - Formulário reutilizável para criação/edição.
  - Campos:
    - `title` (obrigatório),
    - `description`,
    - `status` (select com `pendente`, `em andamento`, `concluído`).

- `frontend/src/components/TaskColumn.jsx`
  - Representa uma coluna do board.
  - Recebe:
    - `status`,
    - lista de tarefas desse status,
    - callbacks de editar e excluir.
  - Mostra:
    - Título do status,
    - Contador de atividades na coluna,
    - Cards com título/descrição e link para detalhes (`/tasks/{id}`).

- `frontend/src/api/tasks.js`
  - Cliente da API:
    - `fetchTasks`, `fetchTask`, `createTask`, `updateTask`, `deleteTask`.
    - `uploadTaskImage` (POST para `/tasks/{id}/image` com `FormData`).

### Tailwind CSS

- Configuração:
  - `frontend/tailwind.config.js`
  - `frontend/postcss.config.js` usando `@tailwindcss/postcss`.
  - `frontend/src/index.css` com:
    ```css
    @import "tailwindcss";

    body {
      background-color: #f1f5f9;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    ```

As classes utilitárias do Tailwind são usadas nos componentes (`className`) para layout, espaçamento, cores, etc.

### Como rodar o frontend

No diretório raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará acessível em `http://localhost:5173`.

> Importante: certifique-se de que o backend está rodando em `http://127.0.0.1:8000` (padrão do `uvicorn`) para que o frontend consiga consumir a API.

### Testes de frontend

Os testes usam **Vitest** + **React Testing Library**.

- Arquivos de teste:
  - `frontend/src/pages/TaskBoardPage.test.jsx`
    - Mocka a API (`fetchTasks`) e verifica se as tarefas são renderizadas agrupadas por status.
  - `frontend/src/pages/TaskDetailPage.test.jsx`
    - Mocka `fetchTask` e verifica se os detalhes da tarefa e a imagem anexada aparecem corretamente.

Para rodar os testes:

```bash
cd frontend
npm test
```

---

## Como rodar tudo junto

1. **Backend**
   - Suba o servidor FastAPI:
     ```bash
     cd backend
     python -m venv venv
     source venv/bin/activate  # Windows: venv\Scripts\activate
     pip install -r requirements.txt
     uvicorn main:app --reload
     ```

2. **Frontend**
   - Em outro terminal:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

3. **Acessar**
   - Abra `http://localhost:5173` no navegador.

4. **Rodar testes**
   - Backend:
     ```bash
     cd backend
   source venv/bin/activate  # Windows: source venv/Scripts/activate
 python -m pytest
     ```
   - Frontend:
     ```bash
     cd frontend
     npm test
     ```

---

## O que foi implementado em relação ao desafio

- **Frontend**
  - Interface responsiva com React + Tailwind.
  - CRUD de atividades (criar, listar, editar, excluir).
  - Atualização de status (`pendente`, `em andamento`, `concluído`).
  - Exibição agrupada por status, com total por lista.
  - Consumo da API do backend.
  - Uso de `useState` e `useEffect`.
  - Código organizado em páginas, componentes e camada de API.

- **Backend**
  - API REST com FastAPI.
  - Persistência em arquivo JSON (`backend/data/tasks.json`).
  - Suporte a upload de imagem por tarefa (diferencial).

- **Diferenciais**
  - React Router para navegação entre lista (`/`) e detalhes (`/tasks/:id`).
  - Upload de imagem com exibição nos detalhes.
  - Testes unitários no backend (pytest) e testes de frontend (Vitest + Testing Library).

