import { useEffect, useState } from 'react'
import { formatStatName } from '../utils.js'

function getStatColor(value) {
  if (value >= 120) return 'bg-emerald-500'
  if (value >= 90) return 'bg-green-500'
  if (value >= 60) return 'bg-yellow-500'
  if (value >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

function StatRadar({ stats }) {
  const [mounted, setMounted] = useState(false)
  const total = stats.reduce((sum, s) => sum + s.base_stat, 0)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Battle profile</p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">Base Stats</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Total</span>
          <span className="rounded-xl bg-slate-900 px-3 py-1 text-sm font-bold text-white">{total}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {stats.map((stat) => {
          const pct = Math.min((stat.base_stat / 255) * 100, 100)
          return (
            <div key={stat.stat.name} className="group">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 transition-colors group-hover:text-slate-700">
                  {formatStatName(stat.stat.name)}
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-800 transition-colors group-hover:bg-slate-200">
                  {stat.base_stat}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${getStatColor(stat.base_stat)} transition-all duration-300`}
                  style={{
                    width: mounted ? `${pct}%` : '0%',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StatRadar
