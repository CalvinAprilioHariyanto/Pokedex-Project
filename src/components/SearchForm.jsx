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
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="pokemon-search" className="sr-only">Search Pokemon</label>
        <input
          id="pokemon-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name..."
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
        >
          Search
        </button>
      </form>
      {error && <p className="mt-2 text-sm font-medium text-red-700">{error}</p>}
    </div>
  )
}

export default SearchForm