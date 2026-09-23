import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-red-900/20 bg-red-700 text-white shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link to="/" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Pokedex Mini
          </Link>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-50">
            Kanto 001-020
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout