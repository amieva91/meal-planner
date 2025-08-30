"use client"; // Esta directiva es crucial, marca este archivo como un Componente de Cliente.

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddHogarForm() {
  // 'useState' para guardar lo que el usuario escribe en el campo de texto.
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario.
    setError(null);

    if (!nombre.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }

    // Hacemos la llamada a la API desde el navegador.
    const response = await fetch('http://localhost:3001/api/hogares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre }),
    });

    if (response.ok) {
      setNombre(''); // Limpia el campo de texto si fue exitoso.
      // 'router.refresh()' le dice a Next.js que vuelva a cargar los datos de la página del servidor.
      // Esto actualiza la lista de hogares sin recargar la página completa.
      router.refresh();
    } else {
      const data = await response.json();
      setError(data.error || 'No se pudo crear el hogar.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h3 className="text-xl mb-2">Añadir Nuevo Hogar</h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del hogar"
          className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button 
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Crear
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
