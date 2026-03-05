import React, { useMemo, useState } from 'react';

const EVENT_TYPES = [
  { type: 'Study', label: 'Study', color: 'bg-blue-500' },
  { type: 'AI', label: 'AI work', color: 'bg-purple-500' },
  { type: 'Finance', label: 'Finance', color: 'bg-emerald-500' },
  { type: 'Deadline', label: 'Deadlines', color: 'bg-red-500' },
  { type: 'Flight', label: 'Flight days', color: 'bg-slate-400' },
  { type: 'Off', label: 'Off days', color: 'bg-slate-600' },
];

function CalendarView({ calendar, goals, onChange }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().slice(0, 10),
  );
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Study',
  });

  const firstOfMonth = useMemo(
    () => new Date(year, month, 1),
    [month, year],
  );
  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [month, year],
  );
  const startWeekday = firstOfMonth.getDay(); // 0=Sunday

  const eventByDate = useMemo(() => {
    const map = {};
    for (const ev of calendar.events || []) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [calendar.events]);

  const selectedEvents = eventByDate[selectedDate] || [];

  const goalsForDate = useMemo(
    () => goals.filter((g) => g.dueDate === selectedDate),
    [goals, selectedDate],
  );

  function changeMonth(offset) {
    const d = new Date(year, month + offset, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function formattedDate(day) {
    return new Date(year, month, day).toISOString().slice(0, 10);
  }

  function handleAddEvent(event) {
    event.preventDefault();
    const title = newEvent.title.trim();
    if (!title) return;
    const ev = {
      id: `ev-${Date.now()}`,
      date: selectedDate,
      title,
      type: newEvent.type,
    };
    onChange({
      ...calendar,
      events: [...(calendar.events || []), ev],
    });
    setNewEvent({ title: '', type: newEvent.type });
  }

  function handleDeleteEvent(id) {
    onChange({
      ...calendar,
      events: calendar.events.filter((ev) => ev.id !== id),
    });
  }

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <div className="section-title">
          <h2>Schedule cockpit</h2>
          <span className="pill text-[10px]">
            Designed for irregular flight schedules
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="pill"
            >
              ←
            </button>
            <div className="font-heading text-sm">
              {firstOfMonth.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="pill"
            >
              →
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px]">
            {EVENT_TYPES.map((e) => (
              <span
                key={e.type}
                className="pill flex items-center gap-1"
              >
                <span className={`badge-dot ${e.color}`} />
                {e.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)]">
        <div className="glass-card p-4">
          <div className="grid grid-cols-7 text-[11px] text-slate-400 mb-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                className="text-center py-1"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {Array.from({ length: startWeekday }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = formattedDate(day);
              const isToday = dateKey === today.toISOString().slice(0, 10);
              const isSelected = dateKey === selectedDate;
              const events = eventByDate[dateKey] || [];
              const hasGoals =
                goals.findIndex((g) => g.dueDate === dateKey) !== -1;

              // Choose up to 2 event type colors to show as small dots.
              const uniqueTypes = Array.from(
                new Set(events.map((e) => e.type)),
              ).slice(0, 2);

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={`relative h-16 rounded-2xl border text-left px-2 py-1.5 flex flex-col gap-1 transition-colors ${
                    isSelected
                      ? 'border-accentBlue/70 bg-accentBlue/20'
                      : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] ${
                        isToday ? 'text-accentGreen font-semibold' : ''
                      }`}
                    >
                      {day}
                    </span>
                    {hasGoals && (
                      <span className="badge-dot bg-accentAmber" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {uniqueTypes.map((t) => {
                      const meta =
                        EVENT_TYPES.find((x) => x.type === t) ||
                        EVENT_TYPES[0];
                      return (
                        <span
                          key={t}
                          className={`badge-dot ${meta.color}`}
                        />
                      );
                    })}
                  </div>
                  {events.length > 0 && (
                    <span className="absolute bottom-1 right-2 text-[10px] text-slate-400">
                      {events.length} item{events.length > 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold">
              {selectedDate}{' '}
              <span className="text-[11px] text-slate-400 ml-1">
                ({new Date(selectedDate).toLocaleDateString('en', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
                )
              </span>
            </h2>
          </div>

          <form
            onSubmit={handleAddEvent}
            className="grid gap-2 grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
          >
            <input
              type="text"
              className="rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
              placeholder="Add event (e.g. Evening Python study)"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <select
              className="rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs"
              value={newEvent.type}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              {EVENT_TYPES.map((t) => (
                <option
                  key={t.type}
                  value={t.type}
                >
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="pill bg-accentBlue/20 border-accentBlue/40 text-[11px]"
            >
              Add
            </button>
          </form>

          <div className="space-y-2">
            <p className="text-[11px] text-slate-400">
              Use color to block days: blue for focused study, purple for AI & automations, green
              for finances, red for deadlines, grey for flights.
            </p>
            <div>
              <p className="text-[11px] text-slate-300 mb-1">Events</p>
              {selectedEvents.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  No events yet. Add study blocks around flight days. Protect 1–3 deep work
                  sessions each &quot;off&quot; day.
                </p>
              ) : (
                <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedEvents.map((ev) => {
                    const meta =
                      EVENT_TYPES.find((t) => t.type === ev.type) ||
                      EVENT_TYPES[0];
                    return (
                      <li
                        key={ev.id}
                        className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-2.5 py-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`badge-dot ${meta.color}`}
                          />
                          <span className="text-[12px] text-slate-100">
                            {ev.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="pill text-[10px] bg-accentRed/20 border-accentRed/40"
                        >
                          ✕
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <p className="text-[11px] text-slate-300 mb-1">Goals due</p>
              {goalsForDate.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  No goals due this day.
                </p>
              ) : (
                <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {goalsForDate.map((g) => (
                    <li
                      key={g.id}
                      className="rounded-xl bg-white/5 border border-white/10 px-2.5 py-1.5 text-[12px] flex items-center justify-between"
                    >
                      <span>{g.title}</span>
                      <span className="pill text-[10px]">
                        {g.category} · {g.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CalendarView;

