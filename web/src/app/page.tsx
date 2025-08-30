import Link from 'next/link';
import AddHogarForm from '@/components/AddHogarForm';

type Hogar = { id: string; nombre: string; };

export default async function HomePage() {
  let hogares: Hogar[] = [];
  try {
    const response = await fetch('http://localhost:3001/api/hogares', { cache: 'no-cache' });
    if (!response.ok) { throw new Error('No se pudo conectar con la API.'); }
    const data = await response.json();
    hogares = data.hogares;
  } catch (error) { /* Manejo de error */ }

  return (
    <main className="bg-slate-900 text-white min-h-screen">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">Meal Planner</h1>

        <nav className="mb-6">
          <Link href="/ingredientes" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Gestionar Ingredientes
          </Link>
        </nav>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Mis Hogares</h2>
          {hogares.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {hogares.map((hogar) => (
                <li key={hogar.id} className="text-lg">
                  <Link href={`/hogares/${hogar.id}`} className="text-cyan-400 hover:underline">
                    {hogar.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          ) : ( <p className="text-slate-400">Aún no has creado ningún hogar.</p> )}
          <AddHogarForm />
        </div>
      </div>
    </main>
  );
}
