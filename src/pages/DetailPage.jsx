import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'
import { capitalize } from '../utils.js'

function getEnglishText(entries, key) {
  return entries.find((entry) => entry.language.name === 'en')?.[key] ?? ''
}

function flattenEvolutionChain(chain) {
  const evolutions = []
  let current = chain

  while (current) {
    evolutions.push(current.species)
    current = current.evolves_to[0]
  }

  return evolutions
}

function getIdFromUrl(url) {
  return url.split('/').filter(Boolean).pop()
}

function DetailPage() {
  const { name } = useParams()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    let isCurrent = true

    async function loadProfile() {
      setIsLoading(true)
      setError(null)
      setProfile(null)

      try {
        const pokemonResponse = await fetch(`${API_BASE_URL}/pokemon/${name}`)
        if (!pokemonResponse.ok) throw new Error(`No Pokemon named "${name}" - check the spelling.`)
        const pokemon = await pokemonResponse.json()
        const speciesResponse = await fetch(pokemon.species.url)
        const species = await speciesResponse.json()
        const evolutionResponse = await fetch(species.evolution_chain.url)
        const evolution = await evolutionResponse.json()

        if (isCurrent) setProfile({ pokemon, species, evolution })
      } catch (err) {
        if (isCurrent) setError(err.message)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    loadProfile()
    return () => { isCurrent = false }
  }, [name])

  if (isLoading) return <div className="space-y-5"><div className="h-8 w-32 animate-pulse rounded bg-slate-200" /><div className="h-112 animate-pulse rounded-4xl bg-white" /></div>
  if (error) return <div className="py-16 text-center"><p className="text-lg font-semibold text-red-700">{error}</p><Link to="/" className="mt-5 inline-block font-semibold text-red-700 hover:underline">&larr; Back to Pokedex</Link></div>

  const { pokemon, species, evolution } = profile
  const artwork = pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default
  const animated = pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default
  const displaySprite = animated ?? artwork
  const description = getEnglishText(species.flavor_text_entries, 'flavor_text').replace(/\s+/g, ' ')
  const evolutions = flattenEvolutionChain(evolution.chain)

  function playCry() {
    const audioUrl = pokemon.cries?.latest || `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`
    const audio = new Audio(audioUrl)
    audio.volume = 0.5
    audio.onplay = () => setIsSpeaking(true)
    audio.onended = () => setIsSpeaking(false)
    audio.onerror = () => setIsSpeaking(false)
    audio.play()
  }

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-block font-semibold text-red-700 hover:underline">&larr; Back to Pokedex</Link>
      <section className="overflow-hidden rounded-4xl bg-white shadow-xl">
        <div className="relative bg-slate-950 px-6 pb-8 pt-8 text-white sm:px-10">
          <div className="relative z-10 max-w-xl">
            <p className="font-mono text-sm text-red-300">#{String(pokemon.id).padStart(3, '0')} / Pokemon</p>
            <h1 className="mt-2 text-5xl font-extrabold capitalize tracking-tight sm:text-7xl">{capitalize(pokemon.name)}</h1>
            <div className="mt-5 flex flex-wrap gap-2">{pokemon.types.map((type) => <span key={type.type.name} className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold capitalize text-red-100">{type.type.name}</span>)}</div>
          </div>
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-28 border-red-500/20" />
        </div>
        <div className="grid gap-8 p-6 sm:grid-cols-[260px_1fr] sm:p-10">
          <div className="flex flex-col gap-4">
            <div className="flex min-h-64 items-center justify-center rounded-3xl bg-red-50 p-4"><img className="h-56 w-56 object-contain" src={displaySprite} alt={pokemon.name} width="224" height="224" /></div>
            <button type="button" onClick={playCry} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100">{isSpeaking ? 'Playing...' : 'Play Cry'} <span aria-hidden="true">&#128266;</span></button>
            <p className="text-center text-xs text-slate-400">Pokemon cry from PokeAPI</p>
          </div>
          <div>
            <p className="text-lg leading-8 text-slate-600">{description || 'No English field note is available for this Pokemon yet.'}</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-slate-100 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Height</p><p className="mt-1 text-lg font-bold">{(pokemon.height / 10).toFixed(1)} m</p></div>
              <div className="rounded-2xl bg-slate-100 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Weight</p><p className="mt-1 text-lg font-bold">{(pokemon.weight / 10).toFixed(1)} kg</p></div>
              <div className="rounded-2xl bg-slate-100 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Habitat</p><p className="mt-1 truncate text-lg font-bold capitalize">{species.habitat?.name ?? 'Unknown'}</p></div>
              <div className="rounded-2xl bg-slate-100 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Growth</p><p className="mt-1 truncate text-lg font-bold capitalize">{species.growth_rate.name.replace('-', ' ')}</p></div>
            </div>
          </div>
        </div>
      </section>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-4xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Battle profile</p><h2 className="mt-1 text-2xl font-extrabold">Base stats</h2></div><span className="text-sm text-slate-400">Total {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}</span></div>
          <div className="mt-7 space-y-4">{pokemon.stats.map((stat) => <div key={stat.stat.name}><div className="mb-1 flex justify-between text-sm"><span className="capitalize text-slate-500">{stat.stat.name.replace('-', ' ')}</span><strong>{stat.base_stat}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-red-600" style={{ width: `${Math.min(stat.base_stat / 2.55, 100)}%` }} /></div></div>)}</div>
          <div className="mt-8 border-t border-slate-100 pt-6"><p className="mb-3 text-sm font-bold text-slate-500">Abilities</p><div className="flex flex-wrap gap-2">{pokemon.abilities.map((ability) => <span key={ability.ability.name} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm capitalize">{ability.ability.name.replace('-', ' ')}</span>)}</div></div>
        </section>
        <section className="rounded-4xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Family tree</p><h2 className="mt-1 text-2xl font-extrabold">Evolution chain</h2>
          <div className="mt-7 flex flex-wrap items-center gap-3">{evolutions.map((evolutionPokemon, index) => <div key={evolutionPokemon.name} className="flex items-center gap-3"><Link to={`/pokemon/${evolutionPokemon.name}`} className="group text-center"><div className="rounded-2xl bg-slate-100 p-2 transition group-hover:bg-red-50"><img className="h-20 w-20 object-contain" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(evolutionPokemon.url)}.png`} alt={evolutionPokemon.name} width="80" height="80" /></div><span className="mt-2 block text-sm font-semibold capitalize">{evolutionPokemon.name}</span></Link>{index < evolutions.length - 1 && <span className="text-xl text-red-400">&rarr;</span>}</div>)}</div>
        </section>
      </div>

      {/* Skills / Moves & Other Details */}
      <section className="rounded-4xl bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Combat</p>
        <h2 className="mt-1 text-2xl font-extrabold">Skills & Additional Details</h2>
        <div className="mt-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="mb-4 text-sm font-bold text-slate-500">Notable Moves (Skills)</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.moves.slice(0, 15).map((moveInfo) => (
                <span key={moveInfo.move.name} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm capitalize text-slate-700">
                  {moveInfo.move.name.replace('-', ' ')}
                </span>
              ))}
              {pokemon.moves.length > 15 && (
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-400">
                  + {pokemon.moves.length - 15} more
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 border-t border-slate-100 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <h3 className="mb-4 text-sm font-bold text-slate-500">Other Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-sm text-slate-500">Base Experience</span>
                <span className="font-semibold text-slate-800">{pokemon.base_experience || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-sm text-slate-500">Base Happiness</span>
                <span className="font-semibold text-slate-800">{species.base_happiness || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-sm text-slate-500">Catch Rate</span>
                <span className="font-semibold text-slate-800">{species.capture_rate || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DetailPage
