import React, { useEffect, useMemo, useState } from 'react';

const CATEGORY_OPTIONS = ['AI', 'Finance', 'IELTS', 'Career', 'Habits'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

function Goals({ goals, onChange, selectedGoalId, onSelectedGoalChange }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [sortBy, setSortBy] = useState('priority');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [form, setForm] = useState(() => createEmptyForm());

  // Listen for global "open-add-goal" event from keyboard shortcut.
  useEffect(() => {
    function handleOpenAdd() {
      setEditingGoal(null);
      setForm(createEmptyForm());
      setIsFormOpen(true);
    }
    document.addEventListener('open-add-goal', handleOpenAdd);
    return () => document.removeEventListener('open-add-goal', handleOpenAdd);
  }, []);

  const filteredGoals = useMemo(() => {
    let list = [...goals];

    if (filterCategory !== 'All') {
      list = list.filter((g) => g.category === filterCategory);
    }
    if (filterPriority !== 'All') {
      list = list.filter((g) => g.priority === filterPriority);
    }
    if (filterStatus === 'Active') {
      list = list.filter((g) => !g.completed);
    } else if (filterStatus === 'Completed') {
      list = list.filter((g) => g.completed);
    }

    if (sortBy === 'priority') {
      const order = { High: 0, Medium: 1, Low: 2 };
      list.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === 'dueDate') {
      list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    } else if (sortBy === 'createdAt') {
      list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    }
    return list;
  }, [goals, filterCategory, filterPriority, filterStatus, sortBy]);

  function createEmptyForm() {
    const today = new Date();
    const inSevenDays = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      title: '',
      category: 'AI',
      priority: 'High',
      dueDate: inSevenDays.toISOString().slice(0, 10),
      estimatedTime: 5,
      notes: '',
    };
  }

  function handleToggleComplete(goalId) {
    onChange(
      goals.map((g) =>
        g.id === goalId ? { ...g, completed: !g.completed } : g,
      ),
    );
    onSelectedGoalChange?.(goalId);
  }

  function handleEdit(goal) {
    setEditingGoal(goal);
    setForm({
      title: goal.title,
      category: goal.category,
      priority: goal.priority,
      dueDate: goal.dueDate || '',
      estimatedTime: goal.estimatedTime || 1,
      notes: goal.notes || '',
    });
    setIsFormOpen(true);
  }

  function handleDelete(goalId) {
    if (!window.confirm('Delete this goal?')) return;
    onChange(goals.filter((g) => g.id !== goalId));
    if (selectedGoalId === goalId) {
      onSelectedGoalChange?.(null);
    }
  }

  function handleReorder(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= goals.length) return;
    const copy = [...goals];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    onChange(copy);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const base = {
      title: form.title.trim(),
      category: form.category,
      priority: form.priority,
      dueDate: form.dueDate || null,
      estimatedTime: Number(form.estimatedTime) || 1,
      notes: form.notes.trim(),
    };

    if (!base.title) return;

    if (editingGoal) {
      onChange(
        goals.map((g) =>
          g.id === editingGoal.id ? { ...g, ...base } : g,
        ),
      );
    } else {
      const newGoal = {
        id: `g-${Date.now()}`,
        ...base,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      onChange([newGoal, ...goals]);
    }

    setIsFormOpen(false);
    setEditingGoal(null);
    setForm(createEmptyForm());
  }

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <div className="section-title">
          <h2>Goal cockpit</h2>
          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setEditingGoal(null);
                setForm(createEmptyForm());
                setIsFormOpen(true);
              }}
              className="pill bg-accentBlue/20 border-accentBlue/40 text-[11px]"
            >
              + New goal (Ctrl + N)
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4 text-[11px]">
          <div className="space-y-1">
            <p className="text-slate-400 uppercase tracking-widest">Category</p>
            <select
              className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option>All</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 uppercase tracking-widest">Priority</p>
            <select
              className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option>All</option>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 uppercase tracking-widest">Status</p>
            <select
              className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="All">All</option>
            </select>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400 uppercase tracking-widest">Sort</p>
            <select
              className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due date</option>
              <option value="createdAt">Created</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <div className="glass-card p-4">
          <div className="section-title mb-2">
            <h2>Life OS backlog</h2>
            <span className="pill text-[10px]">
              {goals.filter((g) => !g.completed).length} active ·{' '}
              {goals.filter((g) => g.completed).length} completed
            </span>
          </div>

          {filteredGoals.length === 0 ? (
            <p className="text-xs text-slate-500">
              No goals match this filter. Start by capturing 3–5 high-leverage outcomes for AI,
              finance, IELTS, and career.
            </p>
          ) : (
            <ul className="space-y-2 text-sm max-h-[460px] overflow-y-auto pr-1">
              {filteredGoals.map((goal, index) => {
                const isSelected = goal.id === selectedGoalId;
                return (
                  <li
                    key={goal.id}
                    className={`group rounded-2xl border border-white/5 px-3 py-2.5 flex items-start gap-3 cursor-pointer ${
                      goal.completed
                        ? 'bg-emerald-900/20 border-emerald-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    } ${isSelected ? 'ring-1 ring-accentBlue/50' : ''}`}
                    onClick={() => onSelectedGoalChange?.(goal.id)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(goal.id);
                      }}
                      className={`mt-0.5 h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${
                        goal.completed
                          ? 'bg-accentGreen border-accentGreen text-black'
                          : 'border-slate-500/60 text-slate-300'
                      }`}
                    >
                      {goal.completed ? '✓' : ''}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p
                            className={`text-[13px] font-medium ${
                              goal.completed ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {goal.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-400 flex flex-wrap gap-1.5">
                            <span className="pill">
                              {goal.category}
                            </span>
                            <span className="pill">
                              Priority: {goal.priority}
                            </span>
                            {goal.dueDate && (
                              <span className="pill">
                                Due: {goal.dueDate}
                              </span>
                            )}
                            {goal.estimatedTime && (
                              <span className="pill">
                                ~{goal.estimatedTime}h
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(index, -1);
                              }}
                              className="pill"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(index, 1);
                              }}
                              className="pill"
                            >
                              ↓
                            </button>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(goal);
                              }}
                              className="pill bg-accentBlue/20 border-accentBlue/40"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(goal.id);
                              }}
                              className="pill bg-accentRed/20 border-accentRed/40"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      {goal.notes && (
                        <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                          {goal.notes}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="glass-card p-4">
          <div className="section-title mb-2">
            <h2>{editingGoal ? 'Edit goal' : 'New goal'}</h2>
            <button
              type="button"
              onClick={() => setIsFormOpen((x) => !x)}
              className="pill text-[10px]"
            >
              {isFormOpen ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {isFormOpen ? (
            <form
              className="space-y-3 text-xs"
              onSubmit={handleSubmit}
            >
              <div className="space-y-1">
                <label className="block text-slate-300 text-[11px]">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Build first paid n8n automation for a client"
                  required
                />
              </div>

              <div className="grid gap-2 grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-slate-300 text-[11px]">
                    Category
                  </label>
                  <select
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-300 text-[11px]">
                    Priority
                  </label>
                  <select
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
                    value={form.priority}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priority: e.target.value }))
                    }
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-2 grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-slate-300 text-[11px]">
                    Due date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dueDate: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-300 text-[11px]">
                    Estimated focus hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
                    value={form.estimatedTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, estimatedTime: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 text-[11px]">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs resize-y"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Break this into sub-steps, resources, and checkpoints."
                />
              </div>

              <div className="flex justify-end gap-2">
                {editingGoal && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGoal(null);
                      setForm(createEmptyForm());
                    }}
                    className="pill"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="submit"
                  className="pill bg-accentGreen/20 border-accentGreen/40 text-[11px]"
                >
                  {editingGoal ? 'Save changes' : 'Add goal'}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-xs text-slate-500">
              Use this panel to design outcomes for AI, finance, IELTS, career, and habits.
              Capture only what truly matters over the next 3–24 months.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Goals;

