import { Router } from 'express';
import {
  crearVentaController,
  obtenerVentasController,
  obtenerVentaPorIdController
} from '../controllers/ventas.controller.js';

const router = Router();

router.post('/', crearVentaController);
router.get('/', obtenerVentasController);
router.get('/:id', obtenerVentaPorIdController);

export default router;