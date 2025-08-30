const express = require('express');
const prisma = require('../data/prismaClient.js');
const NutritionalCalculator = require('../core/calculations/nutritionalCalculator.js');

const router = express.Router();

// GET /api/platos/:platoId/nutricion - Analiza la nutrición de un plato
router.get('/:platoId/nutricion', async (req, res) => {
    const { platoId } = req.params;

    try {
        // Prisma obtiene el plato y toda la información relacionada en una sola consulta
        const platoConIngredientes = await prisma.plato.findUnique({
            where: { id: platoId },
            include: {
                ingredientes: { // Esto trae los datos de la tabla de unión
                    include: {
                        ingrediente: true // Y dentro de eso, trae los datos de la tabla Ingrediente
                    }
                }
            }
        });

        if (!platoConIngredientes) {
            return res.status(404).json({ error: "Plato no encontrado." });
        }

        const nutricion = NutritionalCalculator.analyzePlatoNutrition(platoConIngredientes.ingredientes);
        res.status(200).json(nutricion);

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;
