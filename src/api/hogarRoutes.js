const express = require('express');
const prisma = require('../data/prismaClient.js');
const router = express.Router();
// ... (todos los endpoints anteriores se mantienen)
router.post('/', async (req, res) => { try { const n = await prisma.hogar.create({ data: req.body }); res.status(201).json({ m: 'Hogar creado.', h: n }); } catch (e) { res.status(500).json({ e: 'Error.' }); } });
router.get('/', async (req, res) => { try { const h = await prisma.hogar.findMany(); res.status(200).json({ hogares: h }); } catch (e) { res.status(500).json({ e: 'Error.' }); } });
router.get('/:hogarId', async (req, res) => { const { hogarId } = req.params; try { const h = await prisma.hogar.findUnique({ where: { id: hogarId } }); if (!h) { return res.status(404).json({ e: 'No encontrado.' }); } res.status(200).json({ hogar: h }); } catch (e) { res.status(500).json({ e: 'Error.' }); } });
router.post('/:hogarId/miembros', async (req, res) => { const { hogarId } = req.params; try { const n = await prisma.miembro.create({ data: { ...req.body, hogar_id: hogarId } }); res.status(201).json({ m: 'Miembro añadido.', miembro: n }); } catch (e) { res.status(500).json({ e: 'Error.' }); } });
router.get('/:hogarId/miembros', async (req, res) => { const { hogarId } = req.params; try { const m = await prisma.miembro.findMany({ where: { hogar_id: hogarId } }); res.status(200).json({ miembros: m }); } catch (e) { res.status(500).json({ e: 'Error.' }); } });
router.post('/:hogarId/platos', async (req, res) => { const { hogarId } = req.params; const { nombre, tipo_comida, ingredientes } = req.body; try { const r = await prisma.$transaction(async (tx) => { const n = await tx.plato.create({ data: { nombre, tipo_comida, hogar_id: hogarId } }); const d = ingredientes.map((i) => ({ plato_id: n.id, ingrediente_id: i.id, cantidad_base: i.cantidad_base, unidad_medida: i.unidad_medida })); await tx.plato_Ingrediente.createMany({ data: d }); return n; }); res.status(201).json({ m: 'Plato creado.', plato: r }); } catch (e) { res.status(500).json({ e: 'Error.' }); } });

// --- NUEVO ENDPOINT ---
// GET /api/hogares/:hogarId/platos - Listar platos de un hogar
router.get('/:hogarId/platos', async (req, res) => {
  const { hogarId } = req.params;
  try {
    const platos = await prisma.plato.findMany({
      where: { hogar_id: hogarId },
      orderBy: { nombre: 'asc' },
    });
    res.status(200).json({ platos });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los platos.' });
  }
});

module.exports = router;
