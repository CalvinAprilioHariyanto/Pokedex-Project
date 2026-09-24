import { Link, NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 text-white shadow-xl backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            {/* Pokeball logo */}
            <div className="relative flex h-10 w-10 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-10 w-10">
                <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="4" />
                <path d="M 2 50 A 48 48 0 0 1 98 50" fill="#ef4444" stroke="white" strokeWidth="4" />
                <path d="M 2 50 A 48 48 0 0 0 98 50" fill="white" stroke="white" strokeWidth="4" />
                <circle cx="50" cy="50" r="16" fill="white" stroke="#334155" strokeWidth="4" />
                <circle cx="50" cy="50" r="8" fill="#334155" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight sm:text-2xl">Pokédex</span>
              <span className="ml-1.5 hidden text-xs font-medium text-slate-400 sm:inline">Encyclopedia</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="h-6 w-6 opacity-40">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M 2 50 A 48 48 0 0 1 98 50" fill="currentColor" opacity="0.3" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
              </svg>
              <span className="text-sm">Pokédex Encyclopedia</span>
            </div>
            <p className="text-xs text-slate-500">
              Data provided by{' '}
              <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-slate-400 underline hover:text-white">
                PokéAPI
              </a>
              . Pokémon is © Nintendo/Game Freak.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout