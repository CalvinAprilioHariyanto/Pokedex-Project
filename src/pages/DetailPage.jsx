import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'
import { capitalize } from '../utils.js'

function DetailPage() {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isCurrent = true

    async function loadPokemon() {
      setIsLoading(true)
      setError(null)
      setPokemon(null)

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`)

        if (!response.ok) {
          throw new Error(`No Pokemon named "${name}" - check the spelling.`)
        }

        const data = await response.json()

        if (isCurrent) {
          setPokemon(data)
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message)
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadPokemon()

    return () => {
      isCurrent = false
    }
  }, [name])

  if (isLoading) return <p className="py-10 text-center text-lg text-slate-500">Loading {name}...</p>
  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-medium text-red-700">{error}</p>
        <Link to="/" className="mt-5 inline-block font-semibold text-red-700 hover:underline">Back to list</Link>
      </div>
    )
  }

  const artwork = pokemon.sprites.other['official-artwork'].front_default

  return (
    <div>
      <Link to="/" className="mb-8 inline-block font-semibold text-red-700 hover:underline">&larr; Back to list</Link>
      <section className="grid gap-8 rounded-3xl bg-white p-6 shadow-xl sm:grid-cols-[240px_1fr] sm:p-10">
        <div className="flex items-center justify-center rounded-2xl bg-red-50 p-4">
          <img className="h-52 w-52 object-contain" src={artwork} alt={pokemon.name} width="200" height="200" />
        </div>
        <div>
          <p className="font-mono text-sm text-slate-400">#{String(pokemon.id).padStart(3, '0')}</p>
          <h1 className="mt-1 text-4xl font-extrabold capitalize tracking-tight text-slate-950">{capitalize(pokemon.name)}</h1>
          <p className="mt-3 capitalize text-slate-600">{pokemon.types.map((type) => type.type.name).join(', ')}</p>
          <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {pokemon.stats.map((stat) => (
              <li key={stat.stat.name} className="flex justify-between py-3">
                <span className="capitalize text-slate-500">{stat.stat.name}</span>
                <span className="font-bold text-slate-900">{stat.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default DetailPage