import json
import os
from pathlib import Path

from fastapi.testclient import TestClient

from main import app
from database import Database


TEST_DATA_PATH = Path(__file__).parent / "tasks_test.json"


def setup_module(module):
  """
  Antes de qualquer teste, garantimos um arquivo JSON limpo e
  apontamos o Database global para esse arquivo de teste.
  """
  if TEST_DATA_PATH.exists():
    TEST_DATA_PATH.unlink()

  # Substitui a instância global de banco de dados para usar o arquivo de teste
  from database import db as global_db

  global_db.file_path = str(TEST_DATA_PATH)
  global_db._initialize_file()


def teardown_module(module):
  """Remove o arquivo JSON de teste ao final da suíte."""
  if TEST_DATA_PATH.exists():
    TEST_DATA_PATH.unlink()


client = TestClient(app)


def test_create_task_persists_in_json():
  payload = {
    "title": "Tarefa de teste",
    "description": "Descrição de teste",
    "status": "pendente",
  }

  response = client.post("/tasks", json=payload)
  assert response.status_code == 201
  data = response.json()
  assert data["id"] == 1
  assert data["title"] == payload["title"]
  assert data["status"] == payload["status"]

  # Confirma que foi salvo no JSON de teste
  with TEST_DATA_PATH.open() as f:
    tasks_in_file = json.load(f)

  assert len(tasks_in_file) == 1
  assert tasks_in_file[0]["title"] == payload["title"]


def test_get_tasks_returns_created_task():
  response = client.get("/tasks")
  assert response.status_code == 200
  data = response.json()
  assert isinstance(data, list)
  assert len(data) == 1
  assert data[0]["title"] == "Tarefa de teste"


def test_update_task_changes_status_and_description():
  payload_update = {
    "status": "em andamento",
    "description": "Atualizada",
  }

  response = client.put("/tasks/1", json=payload_update)
  assert response.status_code == 200
  data = response.json()
  assert data["status"] == "em andamento"
  assert data["description"] == "Atualizada"

  # Confirma persistência
  with TEST_DATA_PATH.open() as f:
    tasks_in_file = json.load(f)

  assert tasks_in_file[0]["status"] == "em andamento"


def test_delete_task_removes_from_json():
  response = client.delete("/tasks/1")
  assert response.status_code == 204

  # Lista deve ficar vazia
  response_list = client.get("/tasks")
  assert response_list.status_code == 200
  assert response_list.json() == []

  with TEST_DATA_PATH.open() as f:
    tasks_in_file = json.load(f)

  assert tasks_in_file == []


def test_upload_image_associates_url(tmp_path, monkeypatch):
  """
  Garante que o endpoint de upload salva a imagem e associa a URL na tarefa.
  """
  # Reconfigura o caminho de upload para um diretório temporário de teste
  from main import UPLOAD_DIR as MAIN_UPLOAD_DIR
  MAIN_UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

  payload = {
    "title": "Com imagem",
    "description": "Teste imagem",
    "status": "pendente",
  }
  # Cria tarefa
  resp_create = client.post("/tasks", json=payload)
  assert resp_create.status_code == 201
  task_id = resp_create.json()["id"]

  files = {"file": ("teste.png", b"conteudo fake", "image/png")}
  resp_upload = client.post(f"/tasks/{task_id}/image", files=files)
  assert resp_upload.status_code == 200
  data = resp_upload.json()
  assert "image_url" in data
  assert data["image_url"].startswith("/uploads/task_")

