const API_BASE_URL = 'http://127.0.0.1:8000'

export async function fetchTasks() {
  const res = await fetch(`${API_BASE_URL}/tasks`)
  if (!res.ok) throw new Error('Erro ao carregar tarefas')
  return res.json()
}

export async function fetchTask(id) {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`)
  if (!res.ok) throw new Error('Tarefa não encontrada')
  return res.json()
}

export async function createTask(data) {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao criar tarefa')
  return res.json()
}

export async function updateTask(id, data) {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erro ao atualizar tarefa')
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Erro ao excluir tarefa')
}

export async function uploadTaskImage(id, file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE_URL}/tasks/${id}/image`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Erro ao enviar imagem')
  return res.json()
}


