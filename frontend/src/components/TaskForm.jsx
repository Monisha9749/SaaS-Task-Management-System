import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

export default function TaskForm({ onSubmit, initial, onCancel, submitLabel }) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setValues({
        title: initial.title || '',
        description: initial.description || '',
        priority: initial.priority || 'medium',
        dueDate: initial.dueDate ? String(initial.dueDate).slice(0, 10) : '',
      });
    } else {
      setValues(emptyForm);
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = 'Title is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      priority: values.priority,
      dueDate: values.dueDate || null,
    };
    await onSubmit(payload);
    if (!initial) {
      setValues(emptyForm);
      setErrors({});
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {initial ? 'Edit task' : 'New task'}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
            maxLength={200}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>
        <div className="sm:col-span-2">
          <label
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="dueDate">
            Due date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
        >
          {submitLabel || (initial ? 'Save changes' : 'Create task')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
