import { useState } from 'react'
import { capitalize } from '../utils.js'

function FlavorText({ species }) {
  const [showAll, setShowAll] = useState(false)

  // Get all unique English flavor text entries with their version
  const entries = species.flavor_text_entries
    .filter(e => e.language.name === 'en')
    .map(e => ({
      text: e.flavor_text.replace(/[\f\n\r]/g, ' ').replace(/\s+/g, ' ').trim(),
      version: e.version.name,
    }))

  // Remove duplicates by text content
  const seen = new Set()
  const unique = entries.filter(e => {
    if (seen.has(e.text)) return false
    seen.add(e.text)
    return true
  })

  const displayed = showAll ? unique : unique.slice(0, 3)

  if (unique.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-400">No Pokédex entries available.</p>
  }

  return (
    <div>
      <div className="space-y-3">
        {displayed.map((entry, index) => (
          <div
            key={index}
            className="animate-fade-in-up rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white"
            style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
          >
            <p className="text-sm leading-relaxed text-slate-700">{entry.text}</p>
            <span className="mt-2 inline-block rounded-lg bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {capitalize(entry.version)}
            </span>
          </div>
        ))}
      </div>

      {unique.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          {showAll ? 'Show fewer entries' : `Show all ${unique.length} entries`}
        </button>
      )}
    </div>
  )
}

export default FlavorText
