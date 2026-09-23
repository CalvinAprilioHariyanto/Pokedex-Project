import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchForm() {
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const name = query.trim().toLowerCase()

    if (name === '') {
      setError('Type a Pokemon name first.')
      return
    }

    setError(null)
    navigate(`/pokemon/${name}`)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 sm:flex-row">
        <label htmlFor="pokemon-search" className="sr-only">Search Pokemon</label>
        <input
          id="pokemon-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or number..."
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        />
        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
        >
          Search
        </button>
      </form>
      {error && <p className="mt-2 text-sm font-medium text-red-700">{error}</p>}
    </div>
  )
}

export default SearchForm