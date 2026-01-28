import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'pendente',
}

/**
 * Formulário reutilizável para criar/editar tarefas.
 */
export default function TaskForm({ initialTask, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title ?? '',
        description: initialTask.description ?? '',
        status: initialTask.status ?? 'pendente',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [initialTask])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-white p-4 shadow"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Título
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="Ex: Estudar FastAPI"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Descrição
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="Detalhes da atividade"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          <option value="pendente">Pendente</option>
          <option value="em andamento">Em andamento</option>
          <option value="concluído">Concluída</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

