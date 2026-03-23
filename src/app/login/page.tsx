import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Agua Limpia</h1>
          <p className="text-gray-500">Acceso Administrativo</p>
        </div>
        <form className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@agualimpia.com"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            formAction={login}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}
