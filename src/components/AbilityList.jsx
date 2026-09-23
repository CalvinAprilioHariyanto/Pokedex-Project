import { useEffect, useState } from 'react'
import { fetchAbility } from '../api.js'
import { capitalize } from '../utils.js'

function AbilityList({ abilities }) {
  const [abilityDetails, setAbilityDetails] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedAbility, setExpandedAbility] = useState(null)

  useEffect(() => {
    let isCurrent = true

    async function load() {
      try {
        const details = await Promise.all(
          abilities.map(async (a) => {
            const data = await fetchAbility(a.ability.name)
            const shortEffect = data.effect_entries
              .find(e => e.language.name === 'en')?.short_effect || ''
            const longEffect = data.effect_entries
              .find(e => e.language.name === 'en')?.effect || ''
            const flavorText = data.flavor_text_entries
              .find(e => e.language.name === 'en')?.flavor_text || ''

            return {
              name: a.ability.name,
              isHidden: a.is_hidden,
              shortEffect,
              longEffect,
              flavorText,
            }
          })
        )
        if (isCurrent) setAbilityDetails(details)
      } catch {
        // Silently fail
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    load()
    return () => { isCurrent = false }
  }, [abilities])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {abilities.map((a) => (
          <div key={a.ability.name} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {abilityDetails.map((ability) => (
        <button
          key={ability.name}
          onClick={() => setExpandedAbility(expandedAbility === ability.name ? null : ability.name)}
          className="group w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold capitalize text-slate-800">{capitalize(ability.name)}</span>
              {ability.isHidden && (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600">
                  Hidden
                </span>
              )}
            </div>
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform ${expandedAbility === ability.name ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <p className="mt-1 text-sm text-slate-500">{ability.shortEffect || ability.flavorText}</p>

          {expandedAbility === ability.name && ability.longEffect && (
            <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">
              {ability.longEffect}
            </p>
          )}
        </button>
      ))}
    </div>
  )
}

export default AbilityList
