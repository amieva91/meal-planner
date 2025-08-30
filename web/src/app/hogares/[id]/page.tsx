import AddMiembroForm from '@/components/AddMiembroForm';
import AddPlatoForm from '@/components/AddPlatoForm';

type Hogar = { id: string; nombre: string; };
type Miembro = { id: string; nombre: string; sexo: string; peso: number; altura: number; };
type Plato = { id: string; nombre: string; tipo_comida: string };
type Ingrediente = { id: string; nombre: string; };

async function getHogarData(hogarId: string) {
  const [hogarRes, miembrosRes, platosRes, ingredientesRes] = await Promise.all([
    fetch(`http://localhost:3001/api/hogares/${hogarId}`, { cache: 'no-cache' }),
    fetch(`http://localhost:3001/api/hogares/${hogarId}/miembros`, { cache: 'no-cache' }),
    fetch(`http://localhost:3001/api/hogares/${hogarId}/platos`, { cache: 'no-cache' }),
    fetch(`http://localhost:3001/api/ingredientes`, { cache: 'no-cache' })
  ]);
  if (!hogarRes.ok) throw new Error("Hogar no encontrado");
  const { hogar } = await hogarRes.json();
  const { miembros } = await miembrosRes.json();
  const { platos } = await platosRes.json();
  const { ingredientes } = await ingredientesRes.json();
  return { hogar, miembros, platos, ingredientes };
}

export default async function HogarDetailPage({ params }: { params: { id: string } }) {
  const { hogar, miembros, platos, ingredientes } = await getHogarData(params.id);

  return (
    <main className="bg-slate-900 text-white min-h-screen">
      <div className="container mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <div>
            <a href="/" className="text-cyan-400 hover:underline mb-6 block">&larr; Volver</a>
            <h1 className="text-4xl font-bold mb-2">Hogar: {hogar.nombre}</h1>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-2xl mb-4">Miembros</h2>
            {miembros.length > 0 ? (
              <ul className="divide-y divide-slate-700">
                {miembros.map((m: Miembro) => <li key={m.id} className="py-3"><p className="font-semibold">{m.nombre}</p><p className="text-sm text-slate-400">{m.sexo} - {m.peso} kg - {m.altura} cm</p></li>)}
              </ul>
            ) : ( <p className="text-slate-400">No hay miembros.</p> )}
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-2xl mb-4">Platos</h2>
            {platos.length > 0 ? (
              <ul className="divide-y divide-slate-700">
                {platos.map((p: Plato) => <li key={p.id} className="py-3"><p className="font-semibold">{p.nombre}</p><p className="text-sm text-slate-400 capitalize">{p.tipo_comida}</p></li>)}
              </ul>
            ) : ( <p className="text-slate-400">No hay platos.</p> )}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="bg-slate-800 p-6 rounded-lg">
            <AddMiembroForm hogarId={hogar.id} />
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <AddPlatoForm hogarId={hogar.id} ingredientesMaestros={ingredientes} />
          </div>
        </div>
      </div>
    </main>
  );
}
