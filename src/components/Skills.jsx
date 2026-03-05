import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Minus, Plus, Brain, BookOpen } from 'lucide-react'

const COLOR_MAP = {
  blue: { bar: 'progress-blue', badge: 'text-blue-400 bg-blue-500/10', glow: 'shadow-blue-500/20' },
  purple: { bar: 'progress-purple', badge: 'text-purple-400 bg-purple-500/10', glow: 'shadow-purple-500/20' },
  green: { bar: 'progress-green', badge: 'text-green-400 bg-green-500/10', glow: 'shadow-green-500/20' },
  amber: { bar: 'progress-amber', badge: 'text-amber-400 bg-amber-500/10', glow: 'shadow-amber-500/20' },
}

function SkillRow({ skill, onUpdate }) {
  const c = COLOR_MAP[skill.color] || COLOR_MAP.blue
  return (
    <div className="glass-card-hover p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`badge ${c.badge}`}>{skill.category}</span>
          <span className="text-sm font-medium text-white">{skill.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onUpdate(skill.id, skill.progress - 5)} className="w-6 h-6 rounded-lg bg-bg-tertiary hover:bg-slate-600 flex items-center justify-center text-slate-400 transition-colors">
            <Minus size={12} />
          </button>
          <span className="font-mono font-bold text-white w-10 text-center">{skill.progress}%</span>
          <button onClick={() => onUpdate(skill.id, skill.progress + 5)} className="w-6 h-6 rounded-lg bg-bg-tertiary hover:bg-slate-600 flex items-center justify-center text-slate-400 transition-colors">
            <Plus size={12} />
          </button>
        </div>
      </div>
      <div className="progress-bar-track h-2.5 relative">
        <div className={`h-full rounded-full ${c.bar} transition-all duration-500 shadow-lg ${c.glow}`} style={{ width: `${skill.progress}%` }} />
        {skill.progress === 100 && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs ml-1">✅</span>
        )}
      </div>
    </div>
  )
}

export default function Skills() {
  const { skills, updateSkill } = useApp()
  const aiSkills = skills.filter(s => s.category === 'AI' || s.category === 'Finance')
  const ieltsSkills = skills.filter(s => s.category === 'IELTS')

  const avgAI = Math.round(aiSkills.reduce((s, x) => s + x.progress, 0) / aiSkills.length)
  const avgIELTS = Math.round(ieltsSkills.reduce((s, x) => s + x.progress, 0) / ieltsSkills.length)

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-2"><Brain size={18} className="text-blue-400" /><span className="text-sm font-medium text-slate-300">AI & Tech Skills</span></div>
          <p className="font-mono font-bold text-3xl text-white">{avgAI}%</p>
          <div className="progress-bar-track mt-2"><div className="h-full progress-blue rounded-full transition-all duration-700" style={{ width: `${avgAI}%` }} /></div>
          <p className="text-xs text-slate-500 mt-1">Average across {aiSkills.length} skills</p>
        </div>
        <div className="glass-card p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-2"><BookOpen size={18} className="text-amber-400" /><span className="text-sm font-medium text-slate-300">IELTS Modules</span></div>
          <p className="font-mono font-bold text-3xl text-white">{avgIELTS}%</p>
          <div className="progress-bar-track mt-2"><div className="h-full progress-amber rounded-full transition-all duration-700" style={{ width: `${avgIELTS}%` }} /></div>
          <p className="text-xs text-slate-500 mt-1">Target: Band 7.5+</p>
        </div>
      </div>

      {/* AI Skills */}
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <Brain size={16} className="text-blue-400" /> AI & Tech Skills
        </h3>
        <div className="space-y-3">
          {aiSkills.map(skill => <SkillRow key={skill.id} skill={skill} onUpdate={updateSkill} />)}
        </div>
      </div>

      {/* IELTS Skills */}
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-amber-400" /> IELTS Preparation
        </h3>
        <p className="text-xs text-slate-500 mb-4">Goal: 7.5+ band score for international remote work opportunities</p>
        <div className="space-y-3">
          {ieltsSkills.map(skill => <SkillRow key={skill.id} skill={skill} onUpdate={updateSkill} />)}
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">Click +/- buttons to update your progress. Changes are saved automatically.</p>
    </div>
  )
}
