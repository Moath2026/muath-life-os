import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Skills({ skills, onChange }) {
  const coreChartData = useMemo(() => {
    const labels = skills.core.map((s) => s.name);
    const data = skills.core.map((s) => s.progress);
    return {
      labels,
      datasets: [
        {
          label: 'Core AI & finance skills',
          data,
          backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
          borderRadius: 12,
        },
      ],
    };
  }, [skills.core]);

  const ieltsChartData = useMemo(() => {
    const labels = skills.ielts.map((s) => s.name);
    const data = skills.ielts.map((s) => s.progress);
    return {
      labels,
      datasets: [
        {
          label: 'IELTS modules',
          data,
          backgroundColor: '#8b5cf6',
          borderRadius: 12,
        },
      ],
    };
  }, [skills.ielts]);

  function updateSkill(listKey, id, patch) {
    onChange({
      ...skills,
      [listKey]: skills[listKey].map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    });
  }

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <div className="section-title">
          <h2>Skill stack</h2>
          <span className="pill text-[10px]">
            From flight attendant → AI automation & fintech
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400">
              Design your skill stack around problems you can solve for founders: automations,
              analysis, and English communication.
            </p>
            <ul className="space-y-2 text-xs">
              {skills.core.map((s) => (
                <li
                  key={s.id}
                  className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-slate-100">
                      {s.name}
                    </span>
                    <span className="font-mono text-[11px] text-slate-300">
                      {s.progress}% / {s.target}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-inner"
                      style={{
                        width: `${(s.progress / (s.target || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1 text-[10px]">
                    <span className="text-slate-400">
                      Each 25-minute Pomodoro is one rep into this bar.
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateSkill('core', s.id, {
                            progress: Math.max(0, s.progress - 5),
                          })
                        }
                        className="pill"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSkill('core', s.id, {
                            progress: Math.min(100, s.progress + 5),
                          })
                        }
                        className="pill bg-accentBlue/20 border-accentBlue/40"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card bg-black/30 border-dashed border-white/10 p-3 sm:p-4">
            <p className="text-[11px] text-slate-400 mb-2">
              Analytics: snapshot of where your current edge is strongest.
            </p>
            <Bar
              data={coreChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    ticks: { color: '#9ca3af', font: { size: 10 } },
                    grid: { display: false },
                  },
                  y: {
                    ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 20 },
                    grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    min: 0,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="glass-card p-4">
          <div className="section-title">
            <h2>IELTS preparation</h2>
            <span className="pill text-[10px]">Target: band 7.5+</span>
          </div>
          <div className="space-y-2 text-xs">
            {skills.ielts.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-100">
                    {s.name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {s.progress}% / {s.target}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-inner bg-gradient-to-r from-accentPurple via-accentBlue to-accentAmber"
                    style={{
                      width: `${(s.progress / (s.target || 1)) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 mt-1 text-[10px]">
                  <span className="text-slate-400">
                    Add 1–2 study blocks on &quot;off&quot; flight days.
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateSkill('ielts', s.id, {
                          progress: Math.max(0, s.progress - 5),
                        })
                      }
                      className="pill"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSkill('ielts', s.id, {
                          progress: Math.min(100, s.progress + 5),
                        })
                      }
                      className="pill bg-accentPurple/20 border-accentPurple/40"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="section-title">
            <h2>Skill analytics</h2>
            <span className="pill text-[10px]">Core vs. IELTS</span>
          </div>
          <Bar
            data={ieltsChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: { color: '#9ca3af', font: { size: 10 } },
                  grid: { display: false },
                },
                y: {
                  ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 20 },
                  grid: { color: 'rgba(148, 163, 184, 0.2)' },
                  min: 0,
                  max: 100,
                },
              },
            }}
          />
          <p className="mt-2 text-[11px] text-slate-500">
            When these bars all cross 70–80%, your communication and technical edge will feel very
            different in interviews and client calls.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Skills;

