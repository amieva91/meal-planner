"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddIngredienteForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    grupo_alimentario: 'otros',
    kcal_100g: '',
    proteinas_100g: '',
    carbohidratos_100g: '',
    grasas_100g: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const submissionData = {
      ...formData,
      kcal_100g: parseFloat(formData.kcal_100g),
      proteinas_100g: parseFloat(formData.proteinas_100g),
      carbohidratos_100g: parseFloat(formData.carbohidratos_100g),
      grasas_100g: parseFloat(formData.grasas_100g),
    };
    
    const response = await fetch(`http://localhost:3001/api/ingredientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    });

    if (response.ok) {
      router.refresh();
      setFormData({ nombre: '', grupo_alimentario: 'otros', kcal_100g: '', proteinas_100g: '', carbohidratos_100g: '', grasas_100g: '' });
    } else {
      const data = await response.json();
      setError(data.error || 'No se pudo crear el ingrediente.');
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-700">
      <h3 className="text-xl mb-4 font-semibold">Añadir Nuevo Ingrediente</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="bg-slate-700 p-2 rounded" />
        <input name="kcal_100g" type="number" step="0.1" value={formData.kcal_100g} onChange={handleChange} placeholder="Kcal por 100g" className="bg-slate-700 p-2 rounded" />
        <input name="proteinas_100g" type="number" step="0.1" value={formData.proteinas_100g} onChange={handleChange} placeholder="Proteínas por 100g" className="bg-slate-700 p-2 rounded" />
        <input name="carbohidratos_100g" type="number" step="0.1" value={formData.carbohidratos_100g} onChange={handleChange} placeholder="Carbs. por 100g" className="bg-slate-700 p-2 rounded" />
        <input name="grasas_100g" type="number" step="0.1" value={formData.grasas_100g} onChange={handleChange} placeholder="Grasas por 100g" className="bg-slate-700 p-2 rounded" />
        <select name="grupo_alimentario" value={formData.grupo_alimentario} onChange={handleChange} className="bg-slate-700 p-2 rounded">
            <option value="verduras">Verduras</option>
            <option value="frutas">Frutas</option>
            <option value="proteinas">Proteínas</option>
            <option value="cereales">Cereales</option>
            <option value="grasas">Grasas</option>
            <option value="lacteos">Lácteos</option>
            <option value="otros">Otros</option>
        </select>
        <div className="md:col-span-3">
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Añadir Ingrediente
          </button>
        </div>
        {error && <p className="text-red-500 md:col-span-3">{error}</p>}
      </form>
    </div>
  );
}
