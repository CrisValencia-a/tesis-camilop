import { Router } from 'express';
import { crearProducto, obtenerProductos } from '../controllers/productos.controller.js';

const router = Router();

router.post('/', crearProducto);
router.get('/', obtenerProductos);

export default router;