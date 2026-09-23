import { API_BASE_URL } from './config.js'

// Simple in-memory cache to avoid re-fetching
const cache = new Map()

async function cachedFetch(url) {
  if (cache.has(url)) return cache.get(url)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`API error: ${response.status} for ${url}`)
  const data = await response.json()
  cache.set(url, data)
  return data
}

// Fetch a paginated list of pokemon (basic name/url list)
export async function fetchPokemonPage(offset = 0, limit = 24) {
  const data = await cachedFetch(`${API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`)
  return data
}

// Fetch full detail for a single pokemon by name or id
export async function fetchPokemonDetail(nameOrId) {
  return cachedFetch(`${API_BASE_URL}/pokemon/${nameOrId}`)
}

// Fetch species data (flavor text, evolution chain url, habitat, etc.)
export async function fetchPokemonSpecies(nameOrId) {
  return cachedFetch(`${API_BASE_URL}/pokemon-species/${nameOrId}`)
}

// Fetch evolution chain by chain ID or full URL
export async function fetchEvolutionChain(urlOrId) {
  const url = typeof urlOrId === 'string' && urlOrId.startsWith('http')
    ? urlOrId
    : `${API_BASE_URL}/evolution-chain/${urlOrId}`
  return cachedFetch(url)
}

// Fetch type data (damage relations)
export async function fetchTypeData(typeName) {
  return cachedFetch(`${API_BASE_URL}/type/${typeName}`)
}

// Fetch ability data (effect text)
export async function fetchAbility(abilityName) {
  return cachedFetch(`${API_BASE_URL}/ability/${abilityName}`)
}

// Fetch generation data (species list for that gen)
export async function fetchGeneration(genId) {
  return cachedFetch(`${API_BASE_URL}/generation/${genId}`)
}

// Fetch a move's details
export async function fetchMove(nameOrId) {
  return cachedFetch(`${API_BASE_URL}/move/${nameOrId}`)
}

// Fetch a batch of pokemon details from a list of {name, url} objects
export async function fetchPokemonBatch(pokemonList) {
  return Promise.all(
    pokemonList.map(async (p) => {
      const url = p.url || `${API_BASE_URL}/pokemon/${p.name || p}`
      return cachedFetch(url)
    })
  )
}

// Calculate combined type matchups for a pokemon with one or two types
export function calculateTypeMatchups(typeDataArray) {
  const matchups = {}

  // Initialize all types with 1x multiplier
  const allTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]
  allTypes.forEach(t => { matchups[t] = 1 })

  // Multiply damage relations for each of the pokemon's types
  typeDataArray.forEach(typeData => {
    const dr = typeData.damage_relations
    dr.double_damage_from.forEach(t => { matchups[t.name] *= 2 })
    dr.half_damage_from.forEach(t => { matchups[t.name] *= 0.5 })
    dr.no_damage_from.forEach(t => { matchups[t.name] *= 0 })
  })

  // Group by effectiveness
  const weaknesses = []    // > 1x
  const resistances = []   // < 1x and > 0
  const immunities = []    // 0x

  allTypes.forEach(t => {
    const mult = matchups[t]
    if (mult === 0) immunities.push({ type: t, multiplier: mult })
    else if (mult > 1) weaknesses.push({ type: t, multiplier: mult })
    else if (mult < 1) resistances.push({ type: t, multiplier: mult })
  })

  // Sort by severity
  weaknesses.sort((a, b) => b.multiplier - a.multiplier)
  resistances.sort((a, b) => a.multiplier - b.multiplier)

  return { weaknesses, resistances, immunities }
}

// Flatten evolution chain into an array, handling branching
export function flattenEvolutionChain(chain) {
  const stages = []

  function walk(node, depth = 0) {
    stages.push({
      name: node.species.name,
      url: node.species.url,
      depth,
      trigger: node.evolution_details?.[0] || null,
    })
    node.evolves_to.forEach(child => walk(child, depth + 1))
  }

  walk(chain)
  return stages
}

// Generation ranges for filtering
export const GENERATIONS = [
  { id: 1, name: 'Gen I', label: 'Kanto (1–151)', offset: 0, limit: 151 },
  { id: 2, name: 'Gen II', label: 'Johto (152–251)', offset: 151, limit: 100 },
  { id: 3, name: 'Gen III', label: 'Hoenn (252–386)', offset: 251, limit: 135 },
  { id: 4, name: 'Gen IV', label: 'Sinnoh (387–493)', offset: 386, limit: 107 },
  { id: 5, name: 'Gen V', label: 'Unova (494–649)', offset: 493, limit: 156 },
  { id: 6, name: 'Gen VI', label: 'Kalos (650–721)', offset: 649, limit: 72 },
  { id: 7, name: 'Gen VII', label: 'Alola (722–809)', offset: 721, limit: 88 },
  { id: 8, name: 'Gen VIII', label: 'Galar (810–905)', offset: 809, limit: 96 },
  { id: 9, name: 'Gen IX', label: 'Paldea (906–1025)', offset: 905, limit: 120 },
]

// Clear the cache (useful for testing)
export function clearCache() {
  cache.clear()
}
