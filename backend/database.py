import json
import os
from typing import List, Optional
from models import Task, TaskCreate, TaskUpdate, TaskStatus

class Database:
    """Classe para gerenciar a persistência de dados em JSON"""
    
    def __init__(self, file_path: str = "data/tasks.json"):
        self.file_path = file_path
        self._initialize_file()
    
    def _initialize_file(self):
        """Inicializa o arquivo JSON se não existir"""
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)

        if not os.path.exists(self.file_path):
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump([], f)

    
    def _read_tasks(self) -> List[dict]:
        """Lê todas as tarefas do arquivo"""
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    
    def _write_tasks(self, tasks: List[dict]):
        """Escreve as tarefas no arquivo"""
        with open(self.file_path, 'w') as f:
            json.dump(tasks, f, indent=2, ensure_ascii=False)
    
    def get_all_tasks(self) -> List[Task]:
        """Retorna todas as tarefas"""
        tasks_data = self._read_tasks()
        return [Task(**task) for task in tasks_data]
    
    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """Retorna uma tarefa específica por ID"""
        tasks_data = self._read_tasks()
        for task in tasks_data:
            if task['id'] == task_id:
                return Task(**task)
        return None
    
    def create_task(self, task: TaskCreate) -> Task:
        """Cria uma nova tarefa"""
        tasks_data = self._read_tasks()
        
        # Gera novo ID
        new_id = max([t['id'] for t in tasks_data], default=0) + 1
        
        # Cria nova tarefa
        new_task = Task(
            id=new_id,
            title=task.title,
            description=task.description,
            status=task.status,
            image_url=task.image_url,
        )
        
        # Adiciona e salva
        tasks_data.append(new_task.model_dump())
        self._write_tasks(tasks_data)
        
        return new_task
    
    def update_task(self, task_id: int, task_update: TaskUpdate) -> Optional[Task]:
        """Atualiza uma tarefa existente"""
        tasks_data = self._read_tasks()
        
        for i, task in enumerate(tasks_data):
            if task['id'] == task_id:
                # Atualiza apenas os campos fornecidos
                if task_update.title is not None:
                    task['title'] = task_update.title
                if task_update.description is not None:
                    task['description'] = task_update.description
                if task_update.status is not None:
                    task['status'] = task_update.status
                # Atualiza URL da imagem, se fornecida no update
                if getattr(task_update, "image_url", None) is not None:
                    task['image_url'] = task_update.image_url
                
                tasks_data[i] = task
                self._write_tasks(tasks_data)
                return Task(**task)
        
        return None
    
    def delete_task(self, task_id: int) -> bool:
        """Deleta uma tarefa"""
        tasks_data = self._read_tasks()
        initial_length = len(tasks_data)
        
        tasks_data = [t for t in tasks_data if t['id'] != task_id]
        
        if len(tasks_data) < initial_length:
            self._write_tasks(tasks_data)
            return True
        return False

# Instância global do database
db = Database()