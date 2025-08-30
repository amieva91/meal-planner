const NutritionalCalculator = require('./calculations/nutritionalCalculator.js');
const prisma = require('../data/prismaClient.js');

class PlanGenerator {
    /**
     * Evalúa un conjunto de platos y le da una puntuación. 
     * Un score más bajo significa que se ajusta mejor a los objetivos.
     */
    static _getPlanScore(plan, objetivos) {
        const totales = { kcal: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 };
        Object.values(plan).forEach(plato => {
            if (plato) {
                totales.kcal += plato.nutricion.kcal;
                totales.proteinas_g += plato.nutricion.proteinas_g;
                totales.carbohidratos_g += plato.nutricion.carbohidratos_g;
                totales.grasas_g += plato.nutricion.grasas_g;
            }
        });

        // Calculamos el error porcentual para cada nutriente y lo elevamos al cuadrado para penalizar más las grandes desviaciones.
        const errorKcal = Math.pow((totales.kcal - objetivos.get_diario) / objetivos.get_diario, 2);
        const errorProtes = Math.pow((totales.proteinas_g - objetivos.objetivos_diarios.proteinas_g) / objetivos.objetivos_diarios.proteinas_g, 2);
        const errorCarbs = Math.pow((totales.carbohidratos_g - objetivos.objetivos_diarios.carbohidratos_g) / objetivos.objetivos_diarios.carbohidratos_g, 2);
        const errorGrasas = Math.pow((totales.grasas_g - objetivos.objetivos_diarios.grasas_g) / objetivos.objetivos_diarios.grasas_g, 2);

        // Sumamos los errores ponderados (damos más importancia a las calorías y proteínas)
        return (errorKcal * 0.4) + (errorProtes * 0.3) + (errorCarbs * 0.15) + (errorGrasas * 0.15);
    }

    /**
     * Genera un plan de comidas de 1 día para un miembro.
     * Algoritmo v2: Búsqueda iterativa del mejor plan.
     */
    static async generatePlan(miembroId) {
        // 1. Obtener datos y necesidades
        const miembro = await prisma.miembro.findUnique({ where: { id: miembroId } });
        if (!miembro) throw new Error("Miembro no encontrado");
        const necesidades = NutritionalCalculator.calculateNutritionalNeeds(miembro);

        // 2. Obtener y analizar todos los platos disponibles del hogar
        const platosDisponibles = await prisma.plato.findMany({ 
            where: { hogar_id: miembro.hogar_id },
            include: { ingredientes: { include: { ingrediente: true } } }
        });
        const platosAnalizados = platosDisponibles.map(plato => ({
            ...plato,
            nutricion: NutritionalCalculator.analyzePlatoNutrition(plato.ingredientes),
        }));

        const desayunos = platosAnalizados.filter(p => p.tipo_comida === 'desayuno');
        const comidas = platosAnalizados.filter(p => p.tipo_comida === 'comida' || p.tipo_comida === 'almuerzo');
        const cenas = platosAnalizados.filter(p => p.tipo_comida === 'cena');

        if (desayunos.length === 0 || comidas.length === 0 || cenas.length === 0) {
            throw new Error("No hay suficientes platos de cada tipo (desayuno, comida, cena) para generar un plan completo.");
        }

        // 3. Generar múltiples planes candidatos y elegir el mejor
        let mejorPlan = null;
        let mejorScore = Infinity;
        const ITERACIONES = 50; // Intentaremos 50 combinaciones al azar

        for (let i = 0; i < ITERACIONES; i++) {
            const planCandidato = {
                desayuno: desayunos[Math.floor(Math.random() * desayunos.length)],
                comida: comidas[Math.floor(Math.random() * comidas.length)],
                cena: cenas[Math.floor(Math.random() * cenas.length)],
            };
            const scoreCandidato = this._getPlanScore(planCandidato, necesidades);
            if (scoreCandidato < mejorScore) {
                mejorScore = scoreCandidato;
                mejorPlan = planCandidato;
            }
        }
        
        // 4. Calcular totales y balance del mejor plan encontrado
        const totalesPlan = { kcal: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 };
        Object.values(mejorPlan).forEach(plato => {
            if (plato) {
                totalesPlan.kcal += plato.nutricion.kcal;
                Object.keys(totalesPlan).forEach(key => totalesPlan[key] += plato.nutricion[key] || 0);
            }
        });

        return {
            objetivos: necesidades,
            plan: mejorPlan,
            balance: {
                kcal: totalesPlan.kcal - necesidades.get_diario,
                proteinas_g: totalesPlan.proteinas_g - necesidades.objetivos_diarios.proteinas_g,
                carbohidratos_g: totalesPlan.carbohidratos_g - necesidades.objetivos_diarios.carbohidratos_g,
                grasas_g: totalesPlan.grasas_g - necesidades.objetivos_diarios.grasas_g,
            },
            score: mejorScore
        };
    }
}

module.exports = PlanGenerator;
