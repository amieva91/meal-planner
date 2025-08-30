class NutritionalCalculator {
    // ... (los primeros 4 métodos para calcular necesidades de miembros se mantienen sin cambios)
    static _calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) { edad--; }
        return edad;
    }
    static _calculateTMB(sexo, peso, altura, edad) {
        if (sexo === 'masculino') { return 66.5 + (13.75 * peso) + (5.0 * altura) - (6.78 * edad); } 
        else { return 655 + (9.56 * peso) + (1.85 * altura) - (4.68 * edad); }
    }
    static _calculateActivityFactor(miembro) {
        const { sexo, trabajo_tipo, horas_cardio_semanal, horas_fuerza_semanal, horas_deportes_semanal, horas_moderado_semanal } = miembro;
        const factoresBase = { sedentario: { masculino: 1.2, femenino: 1.2 }, activo: { masculino: 1.4, femenino: 1.3 }, muy_activo: { masculino: 1.6, femenino: 1.5 } };
        const factoresEjercicio = { cardio: { masculino: 0.12, femenino: 0.10 }, fuerza: { masculino: 0.15, femenino: 0.13 }, deportes: { masculino: 0.14, femenino: 0.12 }, moderado: { masculino: 0.08, femenino: 0.07 } };
        let fa = factoresBase[trabajo_tipo][sexo];
        fa += (horas_cardio_semanal || 0) * factoresEjercicio.cardio[sexo];
        fa += (horas_fuerza_semanal || 0) * factoresEjercicio.fuerza[sexo];
        fa += (horas_deportes_semanal || 0) * factoresEjercicio.deportes[sexo];
        fa += (horas_moderado_semanal || 0) * factoresEjercicio.moderado[sexo];
        const limiteMax = sexo === 'masculino' ? 2.5 : 2.2;
        return Math.min(fa, limiteMax);
    }
    static calculateNutritionalNeeds(miembro) {
        const edad = this._calcularEdad(miembro.fecha_nacimiento);
        const tmb = this._calculateTMB(miembro.sexo, miembro.peso, miembro.altura, edad);
        const factorActividad = this._calculateActivityFactor(miembro);
        const get = tmb * factorActividad;
        let carbos = (get * 0.525) / 4, protes = (get * 0.15) / 4, grasas = (get * 0.275) / 9;
        const proteinaMinima = miembro.peso * 0.83;
        if (protes < proteinaMinima) { protes = proteinaMinima; }
        return { edad: Math.round(edad), tmb: Math.round(tmb), factorActividad: parseFloat(factorActividad.toFixed(2)), get_diario: Math.round(get), objetivos_diarios: { carbohidratos_g: Math.round(carbos), proteinas_g: Math.round(protes), grasas_g: Math.round(grasas) } };
    }

    /**
     * MÉTODO REFACTORIZADO: Ahora recibe los datos directamente.
     * @param {Array} ingredientesDelPlato - Un array de objetos con los datos de los ingredientes.
     * @returns {object} Los totales nutricionales del plato.
     */
    static analyzePlatoNutrition(ingredientesDelPlato) {
        const totales = { kcal: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 };

        ingredientesDelPlato.forEach(item => {
            const factor = item.cantidad_base / 100.0;
            totales.kcal += item.ingrediente.kcal_100g * factor;
            totales.proteinas_g += item.ingrediente.proteinas_100g * factor;
            totales.carbohidratos_g += item.ingrediente.carbohidratos_100g * factor;
            totales.grasas_g += item.ingrediente.grasas_100g * factor;
        });

        for (const key in totales) {
            totales[key] = parseFloat(totales[key].toFixed(1));
        }
        return totales;
    }
}
module.exports = NutritionalCalculator;
