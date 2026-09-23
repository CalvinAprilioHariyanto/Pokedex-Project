import PokemonList from '../components/pokemonList.jsx'
import SearchForm from '../components/SearchForm.jsx'

function ListPage() {
  return (
    <>
      <section className="mb-8 max-w-2xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-red-700">Pokedex index</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Choose your Pokemon</h1>
        <p className="mt-3 text-lg text-slate-600">Browse the first twenty entries or jump straight to a name.</p>
      </section>
      <SearchForm />
      <PokemonList />
    </>
  )
}

export default ListPage