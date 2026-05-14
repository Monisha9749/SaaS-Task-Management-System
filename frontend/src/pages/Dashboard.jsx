import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client.js';
import Navbar from '../components/Navbar.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';

const defaultFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  page: 1,
  limit: 8,
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [editing, setEditing] = useState(null);

  const fetchTasks = useCallback(
    async (override = {}) => {
      setLoading(true);
      const merged = { ...filters, ...override };
      try {
        const params = {
          page: merged.page,
          limit: merged.limit,
          search: merged.search || undefined,
          status: merged.status,
          priority: merged.priority,
        };
        const { data } = await api.get('/api/tasks', { params });
        setTasks(data.data);
        setMeta(data.meta);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (payload) => {
    try {
      await api.post('/api/tasks', { ...payload, status: 'pending' });
      toast.success('Task created');
      setFilters((f) => ({ ...f, page: 1 }));
      await fetchTasks({ page: 1 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create task');
      throw err;
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    try {
      await api.put(`/api/tasks/${editing.id}`, payload);
      toast.success('Task updated');
      setEditing(null);
      await fetchTasks({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update task');
      throw err;
    }
  };

  const handleToggle = async (task) => {
    const next = task.status === 'completed' ? 'pending' : 'completed';
    setBusyId(task.id);
    try {
      await api.put(`/api/tasks/${task.id}`, { status: next });
      toast.success(next === 'completed' ? 'Marked complete' : 'Reopened');
      await fetchTasks({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    setBusyId(task.id);
    try {
      await api.delete(`/api/tasks/${task.id}`);
      toast.success('Task deleted');
      if (editing?.id === task.id) setEditing(null);
      await fetchTasks({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setBusyId(null);
    }
  };

  const changeFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: key === 'page' ? value : 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your tasks</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Private workspace — only you can see these tasks.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Search
              </label>
              <input
                type="search"
                placeholder="Search title or description"
                value={filters.search}
                onChange={(e) => changeFilter('search', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => changeFilter('status', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => changeFilter('priority', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {meta.total} task{meta.total === 1 ? '' : 's'} · Page {meta.page} of {meta.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={meta.page <= 1 || loading}
                onClick={() => changeFilter('page', meta.page - 1)}
                className="rounded border border-slate-200 px-2 py-1 text-xs font-medium hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => changeFilter('page', meta.page + 1)}
                className="rounded border border-slate-200 px-2 py-1 text-xs font-medium hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            {editing ? (
              <TaskForm
                key={editing.id}
                initial={editing}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(null)}
                submitLabel="Save changes"
              />
            ) : (
              <TaskForm onSubmit={handleCreate} />
            )}
          </div>
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                busyId={busyId}
                onToggleStatus={handleToggle}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
