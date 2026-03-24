import React, { useMemo } from 'react';
import { sar } from '../utils/helpers';

/* ─── SVG ring for the Life Score hero card ──────────────────────────────── */
function ScoreRing({ value = 0, size = 120, stroke = 8 }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#06b6d4" />
          <stop offset="50%"  stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={stroke}
      />
      {/* Fill */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
          filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.7))',
        }}
      />
    </svg>
  );
}

/* ─── Thin neon progress bar ─────────────────────────────────────────────── */
function GlowBar({ value = 0, color = 'cyan' }) {
  const gradients = {
    cyan:   'linear-gradient(90deg,#06b6d4,#0891b2)',
    purple: 'linear-gradient(90deg,#7c3aed,#a78bfa)',
    green:  'linear-gradient(90deg,#059669,#10b981)',
    amber:  'linear-gradient(90deg,#d97706,#f59e0b)',
    mixed:  'linear-gradient(90deg,#06b6d4,#7c3aed,#10b981)',
  };
  const glows = {
    cyan:   'rgba(6,182,212,0.6)',
    purple: 'rgba(124,58,237,0.6)',
    green:  'rgba(16,185,129,0.6)',
    amber:  'rgba(245,158,11,0.6)',
    mixed:  'rgba(6,182,212,0.5)',
  };
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-inner"
        style={{
          width: `${Math.min(100, value)}%`,
          background: gradients[color] || gradients.cyan,
          boxShadow: `0 0 8px ${glows[color] || glows.cyan}`,
        }}
      />
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, progress, progressColor, badge, glowColor }) {
  const glowBorder = {
    cyan:   'rgba(6,182,212,0.15)',
    purple: 'rgba(124,58,237,0.15)',
    green:  'rgba(16,185,129,0.15)',
    amber:  'rgba(245,158,11,0.15)',
  };
  return (
    <div
      className="stat-card"
      style={glowColor ? { borderColor: glowBorder[glowColor] } : undefined}
    >
      <div className="flex items-center justify-between">
        <span className="metric-label">{label}</span>
        {badge && <span className="pill text-[10px]">{badge}</span>}
      </div>

      <p className="metric-value" style={{ color: '#e2e8f0' }}>
        {value}
      </p>

      {progress !== undefined && (
        <GlowBar value={progress} color={progressColor || 'mixed'} />
      )}

      {sub && (
        <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>{sub}</p>
      )}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
function Dashboard({
  goals,
  finances,
  skills,
  pomodoro,
  aiProgress,
  ieltsProgress,
  monthlySurplus,
  debtDaysRemaining,
}) {
  const today = new Date().toISOString().slice(0, 10);

  const todaysTasks = useMemo(
    () => goals.filter((g) => g.dueDate === today && !g.completed).slice(0, 5),
    [goals, today],
  );

  const openHighPriority = useMemo(
    () => goals.filter((g) => g.priority === 'High' && !g.completed).slice(0, 4),
    [goals],
  );

  const totalDebtRemaining = finances.debts.reduce(
    (sum, d) => sum + Number(d.remaining || 0),
    0,
  );

  const pomodoroToday =
    pomodoro.sessionsByDate?.[today]?.focusSessions || 0;

  const completedGoals = goals.filter((g) => g.completed).length;
  const totalGoals     = goals.length || 1;
  const goalsCompletion = Math.round((completedGoals / totalGoals) * 100);

  /* Life score = average of all key metrics */
  const lifeScore = Math.round(
    (aiProgress + ieltsProgress + goalsCompletion) / 3,
  );

  const totalMonthlyDebt = finances.debts.reduce(
    (sum, d) => sum + Number(d.monthlyPayment || 0),
    0,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Hero card: Life OS Score ──────────────────────────────────── */}
      <section
        className="glass-card-cyan"
        style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ScoreRing value={lifeScore} size={110} stroke={9} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  background: 'linear-gradient(135deg,#22d3ee,#a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {lifeScore}
              </span>
              <span style={{ fontSize: '9px', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                score
              </span>
            </div>
          </div>

          {/* Hero text */}
          <div style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  margin: 0,
                  color: '#f1f5f9',
                }}
              >
                Life OS · Mission Control
              </h2>
              <span className="pill-cyan" style={{ fontSize: '10px' }}>LIVE</span>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
              Flight attendant → AI &amp; fintech operator · Debt freedom in{' '}
              <span style={{ color: '#34d399', fontWeight: 600 }}>{debtDaysRemaining} days</span>
            </p>

            {/* Three mini metrics inline */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { label: 'AI Skills',   val: `${aiProgress}%`,    color: '#22d3ee' },
                { label: 'IELTS',       val: `${ieltsProgress}%`, color: '#a78bfa' },
                { label: 'Goals Done',  val: `${goalsCompletion}%`, color: '#34d399' },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: "'Outfit',system-ui,sans-serif", fontSize: '1.1rem', fontWeight: 700, color, letterSpacing: '-0.02em' }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats grid ───────────────────────────────────────────────── */}
      <section className="card-grid">
        <StatCard
          label="AI Learning"
          value={`${aiProgress}%`}
          badge="Target: remote AI"
          progress={aiProgress}
          progressColor="cyan"
          sub="Python · n8n · APIs · Agents"
          glowColor="cyan"
        />

        <StatCard
          label="IELTS Progress"
          value={`${ieltsProgress}%`}
          badge="Band 7.5+ target"
          progress={ieltsProgress}
          progressColor="purple"
          sub="Reading · Writing · Listening · Speaking"
          glowColor="purple"
        />

        <StatCard
          label="Monthly Surplus"
          value={sar(monthlySurplus)}
          badge={`Income: ${sar(finances.monthlyIncome)}`}
          sub="After expenses and debt payments."
          glowColor={monthlySurplus >= 0 ? 'green' : undefined}
        />

        <StatCard
          label="Debt Freedom"
          value={`${debtDaysRemaining}d`}
          badge="Countdown"
          sub={`Remaining: ${sar(totalDebtRemaining)} · Oct 27, 2026`}
          glowColor="amber"
        />

        <StatCard
          label="Deep Work Today"
          value={`${pomodoroToday} sessions`}
          badge="Pomodoro"
          sub="25 min blocks compounding into your career."
        />

        <StatCard
          label="Goal Completion"
          value={`${goalsCompletion}%`}
          badge="Life OS"
          progress={goalsCompletion}
          progressColor="green"
          sub={`${completedGoals} of ${totalGoals} goals completed.`}
          glowColor="green"
        />
      </section>

      {/* ── Today + Skills ───────────────────────────────────────────── */}
      <section style={{ display: 'grid', gap: '14px', gridTemplateColumns: '1fr' }}>
        <style>{`@media(min-width:1024px){.today-grid{grid-template-columns:1fr 1fr!important}}`}</style>
        <div className="today-grid" style={{ display: 'grid', gap: '14px' }}>

          {/* Today's Runway */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div className="section-title">
              <h2>Today&apos;s Runway</h2>
              <span className="pill" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px' }}>
                <span className="badge-dot" style={{ background: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }} />
                Flights · Study · AI
              </span>
            </div>

            {todaysTasks.length === 0 && openHighPriority.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                No tasks due today — choose one high-leverage goal and schedule a focused block.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {todaysTasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '2px' }}>
                        {task.title}
                      </p>
                      <p style={{ fontSize: '11px', color: '#475569' }}>
                        {task.category} · {task.priority} priority
                      </p>
                    </div>
                    <span className="pill" style={{ fontSize: '10px', flexShrink: 0, marginLeft: '8px' }}>
                      {task.estimatedTime || 1}h
                    </span>
                  </div>
                ))}

                {openHighPriority.length > 0 && (
                  <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                      High-priority backlog
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {openHighPriority.map((goal) => (
                        <span key={goal.id} className="pill" style={{ fontSize: '10px' }}>
                          {goal.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills Snapshot */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div className="section-title">
              <h2>Systems Status</h2>
              <span className="pill" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px' }}>
                <span className="badge-dot" style={{ background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }} />
                AI · Finance · IELTS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {skills.core.slice(0, 3).map((s, i) => {
                const colors = ['cyan', 'purple', 'green'];
                const textColors = ['#22d3ee', '#a78bfa', '#34d399'];
                return (
                  <div key={s.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{s.name}</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', color: textColors[i % 3] }}>
                        {s.progress}% / {s.target}%
                      </span>
                    </div>
                    <GlowBar value={(s.progress / (s.target || 1)) * 100} color={colors[i % 3]} />
                  </div>
                );
              })}

              {/* IELTS module pills */}
              <div style={{ marginTop: '4px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {skills.ielts.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      background: 'rgba(124,58,237,0.06)',
                      border: '1px solid rgba(124,58,237,0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                    }}
                  >
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{m.name}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '12px', fontWeight: 600, color: '#a78bfa' }}>
                      {m.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Financial Flight Path ─────────────────────────────────────── */}
      <section style={{ display: 'grid', gap: '14px', gridTemplateColumns: '1fr' }}>
        <style>{`@media(min-width:1024px){.finance-grid{grid-template-columns:2fr 1fr!important}}`}</style>
        <div className="finance-grid" style={{ display: 'grid', gap: '14px' }}>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div className="section-title">
              <h2>Financial Flight Path</h2>
              <span className="pill" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px' }}>
                <span className="badge-dot" style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Shariah-compliant
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {[
                {
                  label: 'Savings',
                  value: sar(finances.savings),
                  sub: `Target: ${sar(finances.savingsTarget)}`,
                  color: '#34d399',
                },
                {
                  label: 'Investments',
                  value: sar(finances.investments),
                  sub: 'Halal, long-term assets.',
                  color: '#22d3ee',
                },
                {
                  label: 'Debt Payments',
                  value: sar(totalMonthlyDebt),
                  sub: 'Clearing runway for investing.',
                  color: '#fbbf24',
                },
              ].map(({ label, value, sub, color }) => (
                <div
                  key={label}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: "'Outfit',system-ui,sans-serif", fontSize: '1.2rem', fontWeight: 700, color, letterSpacing: '-0.02em' }}>
                    {value}
                  </p>
                  <p style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Cockpit */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div className="section-title">
              <h2>Focus Cockpit</h2>
              <span className="pill" style={{ fontSize: '10px' }}>Pomodoro</span>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
              Use <span className="kbd">Ctrl+P</span> to start a 25-min block. Protect 1–3 sessions
              around your flights.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { sessions: 1, label: 'Minimum daily commitment', color: '#fbbf24' },
                { sessions: 3, label: 'Strong compounding week',  color: '#34d399' },
                { sessions: 5, label: 'Elite operator mode',      color: '#22d3ee' },
              ].map(({ sessions, label, color }) => (
                <div
                  key={sessions}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: pomodoroToday >= sessions ? `rgba(${color === '#22d3ee' ? '6,182,212' : color === '#34d399' ? '16,185,129' : '245,158,11'},0.06)` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${pomodoroToday >= sessions ? `${color}30` : 'rgba(255,255,255,0.04)'}`,
                  }}
                >
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', fontWeight: 700, color: pomodoroToday >= sessions ? color : '#334155', minWidth: '14px' }}>
                    {sessions}×
                  </span>
                  <span style={{ fontSize: '11px', color: pomodoroToday >= sessions ? '#94a3b8' : '#334155' }}>
                    {label}
                  </span>
                  {pomodoroToday >= sessions && (
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
