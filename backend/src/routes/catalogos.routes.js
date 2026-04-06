import { Router } from "express";
import {
  crearCatalogo,
  obtenerCatalogoActual,
  obtenerCatalogo
} from "../controllers/catalogos.controller.js";

const router = Router();

router.post("/", crearCatalogo);
router.get("/", obtenerCatalogo);
router.get("/actual", obtenerCatalogoActual);

export default router;