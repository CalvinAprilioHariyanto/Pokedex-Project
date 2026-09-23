import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPokemonPage, fetchPokemonBatch, GENERATIONS } from '../api.js'
import { capitalize, getOfficialArtwork, padId } from '../utils.js'
import { getTypeColor, ALL_TYPES } from '../typeColors.js'

const ITEMS_PER_PAGE = 24

function PokemonList() {
  const [pokemons, setPokemons] = useState([])
  const [selectedType, setSelectedType] = useState('all')
  const [selectedGen, setSelectedGen] = useState(0) // 0 = all, 1-9 = specific gen
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // Load Pokemon based on generation or paginated
  useEffect(() => {
    let isCurrent = true

    async function loadPokemons() {
      setIsLoading(true)
      setError(null)
      setPokemons([])
      setPage(0)

      try {
        if (selectedGen > 0) {
          // Load specific generation
          const gen = GENERATIONS.find(g => g.id === selectedGen)
          const response = await fetchPokemonPage(gen.offset, gen.limit)
          const details = await fetchPokemonBatch(response.results)
          if (isCurrent) {
            setPokemons(details)
            setTotalCount(gen.limit)
          }
        } else {
          // Load first page of all Pokemon
          const response = await fetchPokemonPage(0, ITEMS_PER_PAGE)
          const details = await fetchPokemonBatch(response.results)
          if (isCurrent) {
            setPokemons(details)
            setTotalCount(response.count)
          }
        }
      } catch (err) {
        if (isCurrent) setError(err.message)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    loadPokemons()
    return () => { isCurrent = false }
  }, [selectedGen])

  // Load more (only for "All" mode)
  async function loadMore() {
    if (isLoadingMore || selectedGen > 0) return
    setIsLoadingMore(true)

    try {
      const nextOffset = (page + 1) * ITEMS_PER_PAGE
      const response = await fetchPokemonPage(nextOffset, ITEMS_PER_PAGE)
      const details = await fetchPokemonBatch(response.results)
      setPokemons(prev => [...prev, ...details])
      setPage(prev => prev + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Filter by type
  const filteredPokemons = useMemo(() => {
    if (selectedType === 'all') return pokemons
    return pokemons.filter((p) => p.types.some(({ type }) => type.name === selectedType))
  }, [pokemons, selectedType])

  const hasMore = selectedGen === 0 && pokemons.length < totalCount

  if (error) {
    return (
      <div className="rounded-3xl bg-red-50 p-10 text-center">
        <p className="text-lg font-semibold text-red-700">Could not load the encyclopedia</p>
        <p className="mt-2 text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Browse & filter</p>
          <p className="mt-1 text-sm text-slate-500">Narrow down your search.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Generation filter */}
          <select
            value={selectedGen}
            onChange={(e) => {
              setSelectedGen(Number(e.target.value))
              setSelectedType('all')
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value={0}>All Generations</option>
            {GENERATIONS.map(gen => (
              <option key={gen.id} value={gen.id}>{gen.name} — {gen.label}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium capitalize outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All Types</option>
            {ALL_TYPES.map((type) => (
              <option key={type} value={type}>{capitalize(type)} type</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="mb-4 text-sm text-slate-500">
        Showing <strong className="text-slate-800">{filteredPokemons.length}</strong> Pokémon
        {selectedGen > 0 && (
          <span className="ml-1 text-slate-400">
            from {GENERATIONS.find(g => g.id === selectedGen)?.name}
          </span>
        )}
      </p>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-white/70" />
          ))}
        </div>
      )}

      {/* Pokemon Grid */}
      {!isLoading && filteredPokemons.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-400">
          No Pokémon match your filters.
        </div>
      )}

      {!isLoading && filteredPokemons.length > 0 && (
        <ul className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPokemons.map((pokemon) => {
            const primaryType = pokemon.types[0]?.type.name
            const colors = getTypeColor(primaryType)

            return (
              <li key={pokemon.id} className="animate-fade-in-up" style={{ opacity: 0 }}>
                <Link
                  to={`/pokemon/${pokemon.name}`}
                  className="group relative block overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Gradient header by type */}
                  <div className={`relative h-32 bg-gradient-to-br ${colors.gradient} p-4`}>
                    {/* Pokeball watermark */}
                    <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full border-[12px] border-white/10" />
                    <div className="absolute -right-2 top-0 h-16 w-16 rounded-full border-[8px] border-white/5" />

                    <span className="font-mono text-sm font-bold text-white/60">#{padId(pokemon.id)}</span>

                    {/* Artwork */}
                    <img
                      className="absolute -bottom-6 right-2 h-28 w-28 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-2xl"
                      src={getOfficialArtwork(pokemon.id)}
                      alt={pokemon.name}
                      width="112"
                      height="112"
                      loading="lazy"
                    />
                  </div>

                  {/* Card body */}
                  <div className="p-4 pt-3">
                    <h3 className="text-lg font-bold capitalize text-slate-800 transition-colors group-hover:text-slate-950">
                      {capitalize(pokemon.name)}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pokemon.types.map(({ type }) => {
                        const tc = getTypeColor(type.name)
                        return (
                          <span
                            key={type.name}
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tc.badge}`}
                          >
                            {type.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {/* Load More */}
      {!isLoading && hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </span>
            ) : (
              `Load More Pokémon`
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default PokemonList
