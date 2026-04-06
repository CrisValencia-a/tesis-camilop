import {
  crearCatalogoService,
  obtenerCatalogoActualService,
  obtenerCatalogoPorFechaService
} from "../services/catalogos.service.js";

export const crearCatalogo = async (req, res) => {
  try {
    const result = await crearCatalogoService(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message,
    });
  }
};

export const obtenerCatalogoActual = async (req, res) => {
  try {
    const data = await obtenerCatalogoActualService();
    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener catálogo",
    });
  }
};


export const obtenerCatalogo = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({
        error: "Mes y año son requeridos",
      });
    }

    const data = await obtenerCatalogoPorFechaService(
      Number(mes),
      Number(anio)
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener catálogo",
    });
  }
};