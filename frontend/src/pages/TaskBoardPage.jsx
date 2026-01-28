import { useEffect, useMemo, useState } from 'react'
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  uploadTaskImage,
} from '../api/tasks.js'
import TaskForm from '../components/TaskForm.jsx'
import TaskColumn from '../components/TaskColumn.jsx'

const STATUSES = ['pendente', 'em andamento', 'concluído']

export default function TaskBoardPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await fetchTasks()
        setTasks(data)
      } catch (err) {
        setError(err.message ?? 'Erro ao carregar atividades')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const groupedTasks = useMemo(() => {
    const groups = {
      pendente: [],
      'em andamento': [],
      concluído: [],
    }
    for (const t of tasks) {
      if (!groups[t.status]) groups[t.status] = []
      groups[t.status].push(t)
    }
    return groups
  }, [tasks])

  async function handleCreate(formData, imageFile) {
    try {
      setSubmitting(true)
      setError('')
      // cria tarefa primeiro
      const created = await createTask(formData)

      // se houver imagem, faz upload em seguida e usa a tarefa atualizada
      let finalTask = created
      if (imageFile) {
        finalTask = await uploadTaskImage(created.id, imageFile)
      }

      setTasks((prev) => [...prev, finalTask])
      setEditingTask(null)
    } catch (err) {
      setError(err.message ?? 'Erro ao criar atividade')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(formData, imageFile) {
    try {
      if (!editingTask) return
      setSubmitting(true)
      setError('')
      // atualiza dados básicos
      let updated = await updateTask(editingTask.id, formData)

      // se uma nova imagem foi selecionada, envia e usa retorno
      if (imageFile) {
        updated = await uploadTaskImage(editingTask.id, imageFile)
      }
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updated : t)),
      )
      setEditingTask(null)
    } catch (err) {
      setError(err.message ?? 'Erro ao atualizar atividade')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Tem certeza que deseja excluir "${task.title}"?`)) {
      return
    }
    try {
      await deleteTask(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } catch (err) {
      setError(err.message ?? 'Erro ao excluir atividade')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">
            {editingTask ? 'Editar atividade' : 'Nova atividade'}
          </h2>
          <p className="mb-3 text-sm text-slate-600">
            Preencha os campos abaixo para cadastrar ou atualizar uma atividade.
          </p>
          <TaskForm
            initialTask={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={editingTask ? () => setEditingTask(null) : undefined}
            submitting={submitting}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-600">Carregando atividades...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={groupedTasks[status] ?? []}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

