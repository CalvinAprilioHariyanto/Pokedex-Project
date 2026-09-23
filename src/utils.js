import { SPRITE_BASE_URL } from './config.js'

export function getIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean)
  return parts[parts.length - 1]
}

export function capitalize(name) {
  if (!name) return ''
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getSpriteUrl(id) {
  return `${SPRITE_BASE_URL}/${id}.png`
}

export function getOfficialArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export function getAnimatedSprite(sprites) {
  return sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default || null
}

export function getAnimatedSpriteBack(sprites) {
  return sprites?.versions?.['generation-v']?.['black-white']?.animated?.back_default || null
}

export function getAnimatedSpriteShiny(sprites) {
  return sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_shiny || null
}

export function getAnimatedSpriteShinyBack(sprites) {
  return sprites?.versions?.['generation-v']?.['black-white']?.animated?.back_shiny || null
}

// Format stat name for display
export function formatStatName(statName) {
  const map = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed',
  }
  return map[statName] || capitalize(statName)
}

// Get evolution trigger description
export function getEvolutionTrigger(trigger) {
  if (!trigger) return null

  const parts = []
  if (trigger.trigger?.name === 'level-up') {
    if (trigger.min_level) parts.push(`Lv. ${trigger.min_level}`)
    else parts.push('Level up')
    if (trigger.min_happiness) parts.push(`Happiness ${trigger.min_happiness}`)
    if (trigger.time_of_day) parts.push(capitalize(trigger.time_of_day))
    if (trigger.known_move) parts.push(`Knows ${capitalize(trigger.known_move.name)}`)
    if (trigger.location) parts.push(`at ${capitalize(trigger.location.name)}`)
  } else if (trigger.trigger?.name === 'use-item') {
    if (trigger.item) parts.push(capitalize(trigger.item.name))
  } else if (trigger.trigger?.name === 'trade') {
    parts.push('Trade')
    if (trigger.held_item) parts.push(`holding ${capitalize(trigger.held_item.name)}`)
  } else {
    parts.push(capitalize(trigger.trigger?.name || 'Unknown'))
  }

  return parts.join(' · ')
}

// Pad pokemon ID to 3 digits
export function padId(id) {
  return String(id).padStart(3, '0')
}