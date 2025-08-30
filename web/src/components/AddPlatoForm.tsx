"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Ingrediente = { id: string; nombre: string; };
type IngredienteDePlato = { id: string; nombre: string; cantidad_base: number; unidad_medida: string; };

export default function AddPlatoForm({ hogarId, ingredientesMaestros }: { hogarId: string, ingredientesMaestros: Ingrediente[] }) {
  const [nombrePlato, setNombrePlato] = useState('');
  const [tipoComida, setTipoComida] = useState('comida');
  const [ingredientes, setIngredientes] = useState<IngredienteDePlato[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [ingSeleccionado, setIngSeleccionado] = useState(ingredientesMaestros[0]?.id || '');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('gramos');

  const handleAddIngrediente = () => {
    if (!ingSeleccionado || !cantidad) return;
    const ingredienteExistente = ingredientesMaestros.find(i => i.id === ingSeleccionado);
    if (!ingredienteExistente) return;
    
    setIngredientes([...ingredientes, {
      id: ingSeleccionado,
      nombre: ingredienteExistente.nombre,
      cantidad_base: parseFloat(cantidad),
      unidad_medida: unidad,
    }]);
    setCantidad('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nombrePlato || ingredientes.length === 0) {
      setError("El plato debe tener un nombre y al menos un ingrediente.");
      return;
    }

    const response = await fetch(`http://localhost:3001/api/hogares/${hogarId}/platos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombrePlato,
        tipo_comida: tipoComida,
        ingredientes: ingredientes.map(({ id, cantidad_base, unidad_medida }) => ({ id, cantidad_base, unidad_medida }))
      }),
    });

    if (response.ok) {
      router.refresh();
      setNombrePlato('');
      setIngredientes([]);
    } else {
      setError("No se pudo crear el plato.");
    }
  };

  return (
    <div>
      <h3 className="text-xl mb-4 font-semibold">Crear Nuevo Plato</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input value={nombrePlato} onChange={(e) => setNombrePlato(e.target.value)} placeholder="Nombre del Plato" className="bg-slate-700 p-2 rounded col-span-2" />
          <select value={tipoComida} onChange={(e) => setTipoComida(e.target.value)} className="bg-slate-700 p-2 rounded col-span-2">
            <option value="desayuno">Desayuno</option>
            <option value="comida">Comida</option>
            <option value="cena">Cena</option>
          </select>
        </div>
        <div className="p-4 border border-slate-700 rounded-lg mb-4">
          <h4 className="font-semibold mb-2">Añadir Ingredientes</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select value={ingSeleccionado} onChange={(e) => setIngSeleccionado(e.target.value)} className="bg-slate-600 p-2 rounded">
              {ingredientesMaestros.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
            </select>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" className="bg-slate-600 p-2 rounded" />
            <input value={unidad} onChange={(e) => setUnidad(e.target.value)} placeholder="Unidad (ej: gramos)" className="bg-slate-600 p-2 rounded" />
          </div>
          <button type="button" onClick={handleAddIngrediente} className="w-full mt-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
            + Añadir Ingrediente a la lista
          </button>
        </div>
        
        {ingredientes.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Ingredientes del Plato:</h4>
            <ul className="list-disc list-inside">
              {ingredientes.map((ing, index) => <li key={index}>{ing.nombre} ({ing.cantidad_base} {ing.unidad_medida})</li>)}
            </ul>
          </div>
        )}
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Crear Plato</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
