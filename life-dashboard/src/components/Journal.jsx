import React, { useMemo, useState } from 'react';

function Journal({ journal, onChange }) {
  const [form, setForm] = useState(() => ({
    date: new Date().toISOString().slice(0, 10),
    accomplishments: '',
    learnings: '',
    tomorrowPlan: '',
    mood: 'Neutral',
    tags: '',
  }));

  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('All');

  const entries = journal.entries || [];

  const allTags = useMemo(() => {
    const set = new Set();
    for (const entry of entries) {
      (entry.tags || []).forEach((t) => set.add(t));
    }
    return Array.from(set);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = search.toLowerCase();
    return [...entries]
      .filter((e) => {
        if (tagFilter !== 'All' && !(e.tags || []).includes(tagFilter)) {
          return false;
        }
        if (!q) return true;
        const haystack = `${e.accomplishments} ${e.learnings} ${e.tomorrowPlan} ${(
          e.tags || []
        ).join(' ')}`.toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [entries, search, tagFilter]);

  function handleSubmit(event) {
    event.preventDefault();
    const tagsArr = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const entry = {
      id: `j-${Date.now()}`,
      date: form.date,
      accomplishments: form.accomplishments.trim(),
      learnings: form.learnings.trim(),
      tomorrowPlan: form.tomorrowPlan.trim(),
      mood: form.mood,
      tags: tagsArr,
    };
    onChange({
      ...journal,
      entries: [...entries, entry],
    });
    setForm((prev) => ({
      ...prev,
      date: new Date().toISOString().slice(0, 10),
      accomplishments: '',
      learnings: '',
      tomorrowPlan: '',
      mood: 'Neutral',
      tags: '',
    }));
  }

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <div className="section-title">
          <h2>Daily reflection</h2>
          <span className="pill text-[10px]">Ctrl + J → jump here</span>
        </div>
        <form
          className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] text-xs"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-2">
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-300">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-300">
                  Mood
                </label>
                <select
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
                  value={form.mood}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mood: e.target.value }))
                  }
                >
                  <option>Grateful</option>
                  <option>Productive</option>
                  <option>Neutral</option>
                  <option>Stressed</option>
                  <option>Tired</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-300">
                What did I accomplish today?
              </label>
              <textarea
                rows={2}
                className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 resize-y"
                value={form.accomplishments}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    accomplishments: e.target.value,
                  }))
                }
                placeholder="Ship one small thing: a Pomodoro on Python, a financial review, or an IELTS exercise."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-300">
                What did I learn today?
              </label>
              <textarea
                rows={2}
                className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 resize-y"
                value={form.learnings}
                onChange={(e) =>
                  setForm((f) => ({ ...f, learnings: e.target.value }))
                }
                placeholder="Capture insights from AI tools, money decisions, or conversations."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-300">
                What will I do tomorrow?
              </label>
              <textarea
                rows={2}
                className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 resize-y"
                value={form.tomorrowPlan}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tomorrowPlan: e.target.value }))
                }
                placeholder="Decide 1–3 realistic actions around flights."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-slate-300">
                Tags (comma separated)
              </label>
              <input
                type="text"
                className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="e.g. AI, Finance, IELTS, Family, Flight"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="pill bg-accentGreen/20 border-accentGreen/40 text-[11px]"
              >
                Save entry
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
                placeholder="Search reflections..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="w-32 rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="All">All tags</option>
                {allTags.map((t) => (
                  <option
                    key={t}
                    value={t}
                  >
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              Search by keywords, emotions, or tags to see patterns over months of flying and
              studying.
            </p>
          </div>
        </form>
      </section>

      <section className="glass-card p-4">
        <div className="section-title">
          <h2>Timeline</h2>
          <span className="pill text-[10px]">
            {entries.length} entries
          </span>
        </div>
        {filteredEntries.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            Your future self will thank you for even short, honest check-ins. Start with a one-line
            reflection tonight.
          </p>
        ) : (
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-accentBlue/70 via-accentPurple/40 to-transparent" />
            <ul className="space-y-3 max-h-[420px] overflow-y-auto pl-6 pr-2 text-xs">
              {filteredEntries.map((entry) => (
                <li
                  key={entry.id}
                  className="relative pl-3"
                >
                  <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-accentBlue shadow-soft" />
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-slate-300">
                          {entry.date}{' '}
                          <span className="text-slate-500">
                            (
                            {new Date(entry.date).toLocaleDateString('en', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                            )
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Mood: {entry.mood}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(entry.tags || []).map((t) => (
                          <span
                            key={t}
                            className="pill text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    {entry.accomplishments && (
                      <div>
                        <p className="text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-200">
                            Accomplishments:
                          </span>{' '}
                          {entry.accomplishments}
                        </p>
                      </div>
                    )}
                    {entry.learnings && (
                      <div>
                        <p className="text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-200">
                            Learnings:
                          </span>{' '}
                          {entry.learnings}
                        </p>
                      </div>
                    )}
                    {entry.tomorrowPlan && (
                      <div>
                        <p className="text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-200">
                            Tomorrow:
                          </span>{' '}
                          {entry.tomorrowPlan}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default Journal;

