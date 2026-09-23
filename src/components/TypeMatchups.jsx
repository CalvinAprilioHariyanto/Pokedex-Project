import { useEffect, useState } from 'react'
import { fetchTypeData, calculateTypeMatchups } from '../api.js'
import { capitalize } from '../utils.js'
import { getTypeColor } from '../typeColors.js'

function TypeMatchups({ types }) {
  const [matchups, setMatchups] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    async function load() {
      try {
        const typeDataArray = await Promise.all(
          types.map(t => fetchTypeData(t.type.name))
        )
        if (isCurrent) {
          setMatchups(calculateTypeMatchups(typeDataArray))
        }
      } catch {
        // Silently fail — non-critical
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    load()
    return () => { isCurrent = false }
  }, [types])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-slate-200" />
          ))}
        </div>
      </div>
    )
  }

  if (!matchups) return null

  const { weaknesses, resistances, immunities } = matchups

  return (
    <div className="space-y-6">
      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.1 0 1.78-1.2 1.22-2.14L13.22 4.28a1.38 1.38 0 00-2.44 0L3.85 16.86c-.56.94.12 2.14 1.22 2.14z" />
            </svg>
            Weak Against
          </h3>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map(({ type, multiplier }) => {
              const colors = getTypeColor(type)
              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${colors.badge} transition-transform hover:scale-105`}
                >
                  {capitalize(type)}
                  <span className="rounded-md bg-white/25 px-1.5 py-0.5 text-[10px]">×{multiplier}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Resistances */}
      {resistances.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Resistant To
          </h3>
          <div className="flex flex-wrap gap-2">
            {resistances.map(({ type, multiplier }) => {
              const colors = getTypeColor(type)
              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${colors.badge} opacity-75 transition-transform hover:scale-105 hover:opacity-100`}
                >
                  {capitalize(type)}
                  <span className="rounded-md bg-white/25 px-1.5 py-0.5 text-[10px]">×{multiplier}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Immunities */}
      {immunities.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636" />
            </svg>
            Immune To
          </h3>
          <div className="flex flex-wrap gap-2">
            {immunities.map(({ type }) => {
              const colors = getTypeColor(type)
              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${colors.badge} opacity-60 transition-transform hover:scale-105 hover:opacity-100`}
                >
                  {capitalize(type)}
                  <span className="rounded-md bg-white/25 px-1.5 py-0.5 text-[10px]">×0</span>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TypeMatchups
