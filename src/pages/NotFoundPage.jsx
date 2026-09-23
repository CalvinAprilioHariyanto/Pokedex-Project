import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <p className="text-6xl font-black text-red-700">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-950">There is nothing here.</h1>
      <Link to="/" className="mt-6 inline-block font-semibold text-red-700 hover:underline">Back to list</Link>
    </div>
  )
}

export default NotFoundPage