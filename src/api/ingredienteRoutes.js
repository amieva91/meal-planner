const express = require('express');
const prisma = require('../data/prismaClient.js');

const router = express.Router();

// POST /api/ingredientes - Añadir un nuevo ingrediente
router.post('/', async (req, res) => {
    const { nombre, grupo_alimentario, kcal_100g, proteinas_100g, carbohidratos_100g, grasas_100g } = req.body;

    try {
        const nuevoIngrediente = await prisma.ingrediente.create({
            data: {
                nombre,
                grupo_alimentario,
                kcal_100g,
                proteinas_100g,
                carbohidratos_100g,
                grasas_100g
            }
        });
        res.status(201).json({ mensaje: 'Ingrediente creado exitosamente.', ingrediente: nuevoIngrediente });
    } catch (error) {
        // Manejo de error para el caso de que el ingrediente ya exista (por el @unique)
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Un ingrediente con ese nombre ya existe.' });
        }
        res.status(500).json({ error: 'Error al guardar el ingrediente.' });
    }
});

// GET /api/ingredientes - Listar todos los ingredientes
router.get('/', async (req, res) => {
    try {
        const ingredientes = await prisma.ingrediente.findMany();
        res.status(200).json({ ingredientes });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los ingredientes.' });
    }
});

module.exports = router;
