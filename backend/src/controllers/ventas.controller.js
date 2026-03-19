import { crearVenta, obtenerVentas, obtenerVentaPorId } from '../services/ventas.service.js';

export const crearVentaController = async (req, res) => {
  try {
    const result = await crearVenta(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message
    });
  }
};

//Obtener ventas con filtros si se quiere, si no se pasan filtros, se obtienen todas las ventas
export const obtenerVentasController = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const ventas = await obtenerVentas({ desde, hasta });

    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

//Obtener venta por el id
export const obtenerVentaPorIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await obtenerVentaPorId(id);

    res.json(venta);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
};