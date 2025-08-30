import AddIngredienteForm from '@/components/AddIngredienteForm';

type Ingrediente = {
  id: string;
  nombre: string;
  grupo_alimentario: string;
  kcal_100g: number;
  proteinas_100g: number;
  carbohidratos_100g: number;
  grasas_100g: number;
};

async function getIngredientes() {
  const response = await fetch('http://localhost:3001/api/ingredientes', { cache: 'no-cache' });
  if (!response.ok) throw new Error("No se pudieron cargar los ingredientes.");
  const data = await response.json();
  return data.ingredientes;
}

export default async function IngredientesPage() {
  const ingredientes: Ingrediente[] = await getIngredientes();

  return (
    <main className="bg-slate-900 text-white min-h-screen">
      <div className="container mx-auto p-8">
        <a href="/" className="text-cyan-400 hover:underline mb-6 block">&larr; Volver a la página principal</a>
        <h1 className="text-4xl font-bold mb-6">Gestión de Ingredientes</h1>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Grupo</th>
                  <th className="p-2">Kcal</th>
                  <th className="p-2">Proteínas</th>
                  <th className="p-2">Carbs.</th>
                  <th className="p-2">Grasas</th>
                </tr>
              </thead>
              <tbody>
                {ingredientes.map((ing) => (
                  <tr key={ing.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="p-2 font-semibold">{ing.nombre}</td>
                    <td className="p-2">{ing.grupo_alimentario}</td>
                    <td className="p-2">{ing.kcal_100g}</td>
                    <td className="p-2">{ing.proteinas_100g}</td>
                    <td className="p-2">{ing.carbohidratos_100g}</td>
                    <td className="p-2">{ing.grasas_100g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AddIngredienteForm />
        </div>
      </div>
    </main>
  );
}
