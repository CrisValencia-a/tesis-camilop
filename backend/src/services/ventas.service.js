import pool from '../config/db.js';

// Validaciones correspondientes a la creación de una venta
const validarVenta = (ventaData) => {
  if (!ventaData.productos || !Array.isArray(ventaData.productos)) {
    throw new Error('Debe enviar una lista de productos');
  }

  if (ventaData.productos.length === 0) {
    throw new Error('La venta debe tener al menos un producto');
  }

  for (const item of ventaData.productos) {
    if (!item.producto_id) {
      throw new Error('producto_id es obligatorio');
    }

    if (!item.cantidad || item.cantidad <= 0) {
      throw new Error(`Cantidad inválida para producto ${item.producto_id}`);
    }

  }
};

export const crearVenta = async (ventaData) => {
  validarVenta(ventaData);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Crear venta (total se calcula después)
    const ventaResult = await client.query(
      `INSERT INTO ventas DEFAULT VALUES RETURNING *`
    );

    const ventaId = ventaResult.rows[0].id;

    let total = 0;

    for (const item of ventaData.productos) {
      const { producto_id, cantidad } = item;

      // 🔍 1. Verificar que el producto exista
      const productoResult = await client.query(
        `SELECT stock_actual, precio, nombre FROM productos WHERE id = $1`,
        [producto_id]
      );

      if (productoResult.rows.length === 0) {
        throw new Error(`Producto con ID ${producto_id} no existe`);
      }

      const producto = productoResult.rows[0];

      // 🔍 2. Validar stock suficiente
      if (producto.stock_actual < cantidad) {
        throw new Error(
          `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock_actual}`
        );
      }

      const subtotal = cantidad * producto.precio;
      total += subtotal;

      // 🧾 Insertar detalle_ventas usando precio real
      await client.query(
        `INSERT INTO detalle_ventas 
          (venta_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [ventaId, producto_id, cantidad, producto.precio, subtotal]
      );

      // 📦 Descontar stock
      await client.query(
        `UPDATE productos
           SET stock_actual = stock_actual - $1
         WHERE id = $2`,
        [cantidad, producto_id]
      );

      // 📊 Registrar movimiento de stock
      await client.query(
        `INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo)
         VALUES ($1, 'salida', $2, 'venta')`,
        [producto_id, cantidad]
      );
    }

    // 🏁 Actualizar total de la venta
    await client.query(
      `UPDATE ventas SET total = $1 WHERE id = $2`,
      [total, ventaId]
    );

    await client.query('COMMIT');

    return { ventaId, total };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Obtener todas las ventas con filtros opcionales por fecha
export const obtenerVentas = async (filtros) => {
  let query = `SELECT * FROM ventas WHERE 1=1`;
  const values = [];

  if (filtros.desde) {
    values.push(filtros.desde);
    query += ` AND fecha >= $${values.length}`;
  }

  if (filtros.hasta) {
    values.push(filtros.hasta);
    query += ` AND fecha <= $${values.length}`;
  }

  query += ` ORDER BY fecha DESC`;

  const result = await pool.query(query, values);

  return result.rows;
};

// Obtener venta por ID con detalle de productos
export const obtenerVentaPorId = async (id) => {
  // Venta principal
  const venta = await pool.query(
    `SELECT * FROM ventas WHERE id = $1`,
    [id]
  );

  if (venta.rows.length === 0) {
    throw new Error('Venta no encontrada');
  }

  // Detalle de productos
  const detalle = await pool.query(
    `SELECT dv.*, p.nombre
       FROM detalle_ventas dv
       JOIN productos p ON p.id = dv.producto_id
       WHERE dv.venta_id = $1`,
    [id]
  );

  return {
    ...venta.rows[0],
    productos: detalle.rows
  };
};