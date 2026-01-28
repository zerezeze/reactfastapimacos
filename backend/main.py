from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from models import Task, TaskCreate, TaskUpdate
from database import db

# Criar aplicação FastAPI
app = FastAPI(
    title="Task Manager API",
    description="API para gerenciamento de atividades",
    version="1.0.0"
)

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Endpoint raiz"""
    return {"message": "Task Manager API - Bem-vindo!"}

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    """Retorna todas as tarefas"""
    return db.get_all_tasks()

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    """Retorna uma tarefa específica"""
    task = db.get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return task

@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: TaskCreate):
    """Cria uma nova tarefa"""
    return db.create_task(task)

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate):
    """Atualiza uma tarefa existente"""
    task = db.update_task(task_id, task_update)
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return task

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    """Deleta uma tarefa"""
    success = db.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return None