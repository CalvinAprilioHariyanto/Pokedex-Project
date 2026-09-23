import { useState } from 'react'
import { getAnimatedSprite, getAnimatedSpriteBack, getAnimatedSpriteShiny, getAnimatedSpriteShinyBack } from '../utils.js'
import { capitalize } from '../utils.js'

function BattleShowcase({ pokemon }) {
  const [view, setView] = useState('front') // front | back
  const [isShiny, setIsShiny] = useState(false)
  const [isAttacking, setIsAttacking] = useState(false)

  const sprites = pokemon.sprites
  const animated = {
    front: getAnimatedSprite(sprites),
    back: getAnimatedSpriteBack(sprites),
    frontShiny: getAnimatedSpriteShiny(sprites),
    backShiny: getAnimatedSpriteShinyBack(sprites),
  }

  // Fallback to static sprites
  const staticSprites = {
    front: sprites.front_default,
    back: sprites.back_default,
    frontShiny: sprites.front_shiny,
    backShiny: sprites.back_shiny,
  }

  const getCurrentSprite = () => {
    if (view === 'front' && isShiny) return animated.frontShiny || staticSprites.frontShiny
    if (view === 'back' && isShiny) return animated.backShiny || staticSprites.backShiny
    if (view === 'back') return animated.back || staticSprites.back
    return animated.front || staticSprites.front
  }

  const currentSprite = getCurrentSprite()
  const hasAnimated = animated.front !== null

  function triggerAttack() {
    setIsAttacking(true)
    setTimeout(() => setIsAttacking(false), 600)
  }

  if (!currentSprite) return null

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Battle showcase</p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">Arena View</h2>
        </div>
        {hasAnimated && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
            ✦ Animated
          </span>
        )}
      </div>

      {/* Battle Arena */}
      <div className="battle-arena relative overflow-hidden rounded-3xl">
        {/* Shadow on the ground */}
        <div className="absolute bottom-[18%] left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-black/30 blur-md" />

        {/* Sprite */}
        <div className="flex items-end justify-center px-6 pb-8 pt-16">
          <img
            className={`h-32 w-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] sm:h-40 sm:w-40 ${
              isAttacking ? 'animate-attack' : 'animate-idle-bounce'
            }`}
            src={currentSprite}
            alt={`${capitalize(pokemon.name)} battle sprite`}
            style={{ imageRendering: hasAnimated ? 'pixelated' : 'auto' }}
          />
        </div>

        {/* Arena floor gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Pokemon name plate */}
        <div className="glass-dark absolute left-4 top-4 rounded-xl px-3 py-2">
          <p className="text-xs font-bold capitalize text-white">{capitalize(pokemon.name)}</p>
          <p className="text-[10px] text-slate-300">Lv. 50</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setView(view === 'front' ? 'back' : 'front')}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          {view === 'front' ? 'Show Back' : 'Show Front'}
        </button>

        <button
          onClick={() => setIsShiny(!isShiny)}
          className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all active:scale-95 ${
            isShiny
              ? 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-md'
          }`}
        >
          <span>✨</span>
          {isShiny ? 'Normal' : 'Shiny'}
        </button>

        <button
          onClick={triggerAttack}
          disabled={isAttacking}
          className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-all hover:bg-red-100 hover:shadow-md active:scale-95 disabled:opacity-50"
        >
          <span>⚔️</span>
          Attack!
        </button>
      </div>
    </div>
  )
}

export default BattleShowcase
