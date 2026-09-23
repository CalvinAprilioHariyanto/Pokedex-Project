import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { capitalize } from '../utils.js'

function SearchForm({ pokemonNames = [] }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    setError(null)
    setHighlightIndex(-1)

    if (value.trim().length >= 2 && pokemonNames.length > 0) {
      const matches = pokemonNames
        .filter(name => name.includes(value.trim().toLowerCase()))
        .slice(0, 8)
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const name = query.trim().toLowerCase()

    if (name === '') {
      setError('Type a Pokémon name first.')
      return
    }

    setError(null)
    setShowSuggestions(false)
    navigate(`/pokemon/${name}`)
  }

  function handleSelect(name) {
    setQuery(name)
    setShowSuggestions(false)
    navigate(`/pokemon/${name}`)
  }

  function handleKeyDown(e) {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[highlightIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 sm:flex-row">
        <label htmlFor="pokemon-search" className="sr-only">Search Pokémon</label>
        <div className="relative min-w-0 flex-1">
          {/* Search icon */}
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            id="pokemon-search"
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search by name or number..."
            autoComplete="off"
            className="w-full rounded-2xl border border-slate-200 bg-white/80 py-4 pl-12 pr-5 text-slate-900 shadow-sm outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-7 py-4 font-semibold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 active:scale-[0.98]"
        >
          Search
        </button>
      </form>

      {/* Autocomplete suggestions */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:right-auto sm:max-w-md"
        >
          {suggestions.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => handleSelect(name)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                index === highlightIndex
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <img
                className="h-8 w-8 object-contain"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                  pokemonNames.indexOf(name) + 1
                }.png`}
                alt=""
                width="32"
                height="32"
                loading="lazy"
              />
              <span className="capitalize">{capitalize(name)}</span>
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
}

export default SearchForm