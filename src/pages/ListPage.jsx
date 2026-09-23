import PokemonList from '../components/pokemonList.jsx'
import SearchForm from '../components/SearchForm.jsx'

function ListPage() {
  return (
    <>
      <section className="relative mb-10 overflow-hidden rounded-4xl bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-14">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-300">Trainer's field guide</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Know your Pokemon.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Study species, compare battle data, follow evolution paths, and build your own field knowledge.</p>
        </div>
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-32 border-red-500/20" />
        <div className="absolute -bottom-28 right-16 h-60 w-60 rounded-full border-24 border-white/5" />
      </section>
      <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Search the database</p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-950">Find a Pokemon</h2>
          </div>
          <span className="hidden text-sm text-slate-400 sm:block">National Dex 001-151</span>
        </div>
        <SearchForm />
      </section>
      <section className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">The original 151</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">Explore the index</h2>
        </div>
        <span className="text-sm text-slate-400">151 entries</span>
      </section>
      <PokemonList />
    </>
  )
}

export default ListPage