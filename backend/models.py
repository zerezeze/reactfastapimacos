from pydantic import BaseModel
from typing import Optional
from enum import Enum

class TaskStatus(str, Enum):
    """Enum para os status possíveis de uma tarefa"""
    PENDENTE = "pendente"
    EM_ANDAMENTO = "em andamento"
    CONCLUIDO = "concluído"

class TaskBase(BaseModel):
    """Schema base para tarefas"""
    title: str
    description: str
    status: TaskStatus = TaskStatus.PENDENTE

class TaskCreate(TaskBase):
    """Schema para criar uma tarefa"""
    pass

class TaskUpdate(BaseModel):
    """Schema para atualizar uma tarefa (todos os campos opcionais)"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None

class Task(TaskBase):
    """Schema completo de uma tarefa com ID"""
    id: int

    class Config:
        from_attributes = True