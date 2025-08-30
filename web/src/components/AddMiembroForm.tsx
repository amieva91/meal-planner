"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Le pasamos el ID del hogar como una 'prop' para saber dónde añadir el miembro.
export default function AddMiembroForm({ hogarId }: { hogarId: string }) {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_nacimiento: '',
    sexo: 'femenino',
    peso: '',
    altura: '',
    trabajo_tipo: 'sedentario',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Convertimos peso y altura a números
    const submissionData = {
      ...formData,
      peso: parseFloat(formData.peso),
      altura: parseInt(formData.altura, 10),
    };
    
    // Validación simple
    for (const key in submissionData) {
      if (!submissionData[key as keyof typeof submissionData]) {
        setError(`El campo ${key} es obligatorio.`);
        return;
      }
    }

    const response = await fetch(`http://localhost:3001/api/hogares/${hogarId}/miembros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    });

    if (response.ok) {
      router.refresh(); // Refresca la lista de miembros en la página
      // Reset form
      setFormData({ nombre: '', fecha_nacimiento: '', sexo: 'femenino', peso: '', altura: '', trabajo_tipo: 'sedentario' });
    } else {
      setError('No se pudo añadir el miembro.');
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-700">
      <h3 className="text-xl mb-4 font-semibold">Añadir Nuevo Miembro</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre completo" className="bg-slate-700 p-2 rounded" />
        <input name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} className="bg-slate-700 p-2 rounded" />
        <select name="sexo" value={formData.sexo} onChange={handleChange} className="bg-slate-700 p-2 rounded">
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
        </select>
        <select name="trabajo_tipo" value={formData.trabajo_tipo} onChange={handleChange} className="bg-slate-700 p-2 rounded">
          <option value="sedentario">Sedentario</option>
          <option value="activo">Activo</option>
          <option value="muy_activo">Muy Activo</option>
        </select>
        <input name="peso" type="number" step="0.1" value={formData.peso} onChange={handleChange} placeholder="Peso (kg)" className="bg-slate-700 p-2 rounded" />
        <input name="altura" type="number" value={formData.altura} onChange={handleChange} placeholder="Altura (cm)" className="bg-slate-700 p-2 rounded" />
        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Añadir Miembro
          </button>
        </div>
        {error && <p className="text-red-500 md:col-span-2">{error}</p>}
      </form>
    </div>
  );
}
