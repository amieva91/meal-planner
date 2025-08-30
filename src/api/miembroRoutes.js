const express = require('express');
const prisma = require('../data/prismaClient.js');
const NutritionalCalculator = require('../core/calculations/nutritionalCalculator.js');
const PlanGenerator = require('../core/planGenerator.js');

const router = express.Router();

// GET /api/miembros/:miembroId/necesidades
router.get('/:miembroId/necesidades', async (req, res) => {
    const { miembroId } = req.params;
    try {
        const miembro = await prisma.miembro.findUnique({ where: { id: miembroId } });
        if (!miembro) {
            return res.status(404).json({ error: 'Miembro no encontrado.' });
        }
        const necesidades = NutritionalCalculator.calculateNutritionalNeeds(miembro);
        res.status(200).json(necesidades);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// GET /api/miembros/:miembroId/generar-plan
router.get('/:miembroId/generar-plan', async (req, res) => {
    try {
        const plan = await PlanGenerator.generatePlan(req.params.miembroId);
        res.status(200).json(plan);
    } catch (error) {
        if (error.message.includes("Miembro no encontrado") || error.message.includes("No hay suficientes platos")) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al generar el plan: ' + error.message });
    }
});

module.exports = router;
