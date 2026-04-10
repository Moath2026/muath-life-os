export default function StatCard({ icon, label, value, sub, color = 'cyan', className = '' }) {
  const ring = {
    cyan:   'border-accent-cyan/20 bg-accent-cyan/5',
    purple: 'border-purple-500/20 bg-purple-500/5',
    green:  'border-green-500/20 bg-green-500/5',
    amber:  'border-amber-500/20 bg-amber-500/5',
    red:    'border-red-500/20 bg-red-500/5',
    blue:   'border-blue-500/20 bg-blue-500/5',
  }
  const text = {
    cyan:   'text-accent-cyan',
    purple: 'text-purple-400',
    green:  'text-green-400',
    amber:  'text-amber-400',
    red:    'text-red-400',
    blue:   'text-blue-400',
  }
  return (
    <div className={`glass-card p-4 flex flex-col gap-1 border ${ring[color] ?? ring.cyan} ${className}`}>
      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <p className={`font-heading font-bold text-2xl ${text[color] ?? text.cyan}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}
