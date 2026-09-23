import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'
import { capitalize, getIdFromUrl, getSpriteUrl } from '../utils.js'

function PokemonList() {
    const [pokemons, setPokemons] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadPokemons() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`${API_BASE_URL}/pokemon?limit=151`)

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`)
        }

                const data = await response.json()
                setPokemons(data.results)
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        loadPokemons()
    }, [])

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-3xl bg-white/70" />)}
            </div>
        )
    }

    if (error) {
        return <p className="py-10 text-center text-lg text-red-700">Couldn't load the list: {error}</p>
    }

    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pokemons.map((pokemon) => {
                const id = getIdFromUrl(pokemon.url)

                return (
                    <li key={pokemon.name}>
                        <Link
                            to={`/pokemon/${pokemon.name}`}
                            className="group flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
                        >
                            <img
                                className="h-16 w-16 rounded-2xl bg-slate-100 object-contain transition duration-200 group-hover:scale-110"
                                src={getSpriteUrl(id)}
                                alt={pokemon.name}
                                width="64"
                                height="64"
                            />
                            <div className="min-w-0">
                                <span className="block font-mono text-xs text-slate-400">#{id.padStart(3, '0')}</span>
                                <span className="block truncate font-bold capitalize text-slate-800">{capitalize(pokemon.name)}</span>
                                <span className="text-xs text-slate-400">View profile &rarr;</span>
                            </div>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default PokemonList

