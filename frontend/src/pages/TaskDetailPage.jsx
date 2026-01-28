import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteTask, fetchTask, updateTask, uploadTaskImage } from '../api/tasks.js'
import TaskForm from '../components/TaskForm.jsx'

const STATUS_LABELS = {
  pendente: 'Pendente',
  'em andamento': 'Em andamento',
  concluído: 'Concluída',
}

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await fetchTask(id)
        setTask(data)
      } catch (err) {
        setError(err.message ?? 'Erro ao carregar atividade')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleUpdate(formData) {
    try {
      setSubmitting(true)
      setError('')
      const updated = await updateTask(id, formData)
      setTask(updated)
      setEditing(false)
    } catch (err) {
      setError(err.message ?? 'Erro ao atualizar atividade')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      return
    }
    try {
      await deleteTask(id)
      navigate('/')
    } catch (err) {
      setError(err.message ?? 'Erro ao excluir atividade')
    }
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      setError('')
      const updated = await uploadTaskImage(id, file)
      setTask(updated)
    } catch (err) {
      setError(err.message ?? 'Erro ao enviar imagem')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Carregando atividade...</p>
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
        <Link
          to="/"
          className="inline-flex text-sm font-medium text-slate-700 hover:underline"
        >
          Voltar para a lista
        </Link>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Atividade não encontrada.</p>
        <Link
          to="/"
          className="inline-flex text-sm font-medium text-slate-700 hover:underline"
        >
          Voltar para a lista
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {task.title}
          </h2>
          <p className="text-sm text-slate-600">
            Status:{' '}
            <span className="font-medium">
              {STATUS_LABELS[task.status] ?? task.status}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing((prev) => !prev)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {editing ? 'Fechar edição' : 'Editar'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Excluir
          </button>
        </div>
      </div>

      {/* Imagem anexada, se existir */}
      {task.image_url && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-slate-800">
            Anexo
          </h3>
          {/*
            A API salva image_url como caminho relativo (ex: /uploads/task_1.png).
            Aqui garantimos que a imagem seja carregada a partir do backend FastAPI.
          */}
          <img
            src={
              task.image_url.startsWith('http')
                ? task.image_url
                : `http://127.0.0.1:8000${task.image_url}`
            }
            alt={`Anexo da atividade ${task.title}`}
            className="max-h-64 rounded-md border border-slate-200 object-contain bg-white"
          />
        </div>
      )}

      {/* Upload de nova imagem */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-800">
          Adicionar / trocar imagem
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          className="block text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
        />
        {uploading && (
          <p className="mt-1 text-xs text-slate-600">
            Enviando imagem...
          </p>
        )}
      </div>

      {task.description && (
        <p className="whitespace-pre-wrap rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
          {task.description}
        </p>
      )}

      {editing && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Editar atividade
          </h3>
          <TaskForm
            initialTask={task}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            submitting={submitting}
          />
        </div>
      )}

      <Link
        to="/"
        className="inline-flex text-sm font-medium text-slate-700 hover:underline"
      >
        ← Voltar para a lista
      </Link>
    </div>
  )
}

