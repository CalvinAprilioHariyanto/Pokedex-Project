import { Link } from 'react-router-dom'
import { flattenEvolutionChain } from '../api.js'
import { capitalize, getIdFromUrl, getOfficialArtwork, getEvolutionTrigger } from '../utils.js'

function EvolutionChain({ chain, currentName }) {
  if (!chain) return null

  const stages = flattenEvolutionChain(chain)

  if (stages.length <= 1) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <p className="text-sm text-slate-400">This Pokémon does not evolve.</p>
      </div>
    )
  }

  // Group by depth for visual layout
  const grouped = {}
  stages.forEach(stage => {
    if (!grouped[stage.depth]) grouped[stage.depth] = []
    grouped[stage.depth].push(stage)
  })

  const depths = Object.keys(grouped).map(Number).sort((a, b) => a - b)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-4">
      {depths.map((depth, depthIndex) => (
        <div key={depth} className="flex items-center gap-2">
          {/* Arrow between depth groups */}
          {depthIndex > 0 && (
            <div className="flex flex-col items-center px-1">
              <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          )}

          {/* Pokémon at this depth */}
          <div className="flex flex-col gap-3">
            {grouped[depth].map((stage) => {
              const id = getIdFromUrl(stage.url)
              const isCurrent = stage.name === currentName
              const triggerText = getEvolutionTrigger(stage.trigger)

              return (
                <div key={stage.name} className="flex flex-col items-center gap-1">
                  {/* Trigger label */}
                  {triggerText && (
                    <span className="mb-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      {triggerText}
                    </span>
                  )}

                  <Link
                    to={`/pokemon/${stage.name}`}
                    className={`group relative flex flex-col items-center rounded-2xl p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                      isCurrent
                        ? 'bg-gradient-to-br from-indigo-100 to-purple-100 ring-2 ring-indigo-400 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <img
                      className="h-20 w-20 object-contain transition-transform duration-200 group-hover:scale-110"
                      src={getOfficialArtwork(id)}
                      alt={stage.name}
                      width="80"
                      height="80"
                      loading="lazy"
                    />
                    <span className={`mt-1 text-sm font-bold capitalize ${
                      isCurrent ? 'text-indigo-700' : 'text-slate-700'
                    }`}>
                      {capitalize(stage.name)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">#{String(id).padStart(3, '0')}</span>

                    {/* Current indicator */}
                    {isCurrent && (
                      <span className="mt-1 rounded-full bg-indigo-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Current
                      </span>
                    )}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default EvolutionChain
