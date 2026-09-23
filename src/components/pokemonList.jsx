import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config.js'
import { capitalize, getIdFromUrl, getSpriteUrl } from '../utils.js'

function PokemonList(){
    const [pokemons, setPokemons] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadPokemons() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`${API_BASE_URL}/pokemon?limit=20`)

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
        return <p className="py-10 text-center text-lg text-slate-500">Loading Pokemon...</p>
    }

    if (error) {
        return <p className="py-10 text-center text-lg text-red-700">Couldn't load the list: {error}</p>
    }

    return (
        <ul className="grid gap-3 sm:grid-cols-2">
            {pokemons.map((pokemon) => {
                const id = getIdFromUrl(pokemon.url)

                return (
                    <li key={pokemon.name}>
                        <Link
                            to={`/pokemon/${pokemon.name}`}
                            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
                        >
                            <img
                                className="h-16 w-16 rounded-xl bg-slate-100 object-contain"
                                src={getSpriteUrl(id)}
                                alt={pokemon.name}
                                width="64"
                                height="64"
                            />
                            <span className="font-mono text-sm text-slate-400">#{id.padStart(3, '0')}</span>
                            <span className="font-semibold capitalize text-slate-800">{capitalize(pokemon.name)}</span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default PokemonList

