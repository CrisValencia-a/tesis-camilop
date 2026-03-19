import { crearProductoService, obtenerProductosService } from '../services/productos.service.js';

export const crearProducto = async (req, res) => {
  try {
    const producto = await crearProductoService(req.body);
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message || 'Error al crear producto'
    });
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await obtenerProductosService();
    res.json(productos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al obtener productos'
    });
  }
};