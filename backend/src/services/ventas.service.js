import pool from '../config/db.js';

// ✅ Validaciones
const validarVenta = (ventaData) => {
  if (!ventaData.productos || !Array.isArray(ventaData.productos)) {
    throw new Error('Debe enviar una lista de productos');
  }

  if (ventaData.productos.length === 0) {
    throw new Error('La venta debe tener al menos un producto');
  }

  for (const item of ventaData.productos) {
    if (!item.catalogo_producto_id) {
      throw new Error('catalogo_producto_id es obligatorio');
    }

    if (!item.cantidad || item.cantidad <= 0) {
      throw new Error('Cantidad inválida');
    }
  }
};

export const crearVenta = async (ventaData) => {
  validarVenta(ventaData);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 🧾 Crear venta
    const ventaResult = await client.query(
      `INSERT INTO ventas DEFAULT VALUES RETURNING *`
    );

    const ventaId = ventaResult.rows[0].id;

    let total = 0;

    // 🔥 Obtener todos los productos del catálogo (lookup eficiente)
    const productosCatalogo = await client.query(`
      SELECT 
        cp.id,
        cp.producto_id,
        cp.stock_actual,
        cp.precio,
        p.nombre
      FROM catalogo_productos cp
      JOIN productos p ON p.id = cp.producto_id
    `);

    for (const item of ventaData.productos) {
      const { catalogo_producto_id, cantidad } = item;

      const producto = productosCatalogo.rows.find(
        (p) => p.id === catalogo_producto_id
      );

      if (!producto) {
        throw new Error(`Producto no existe en catálogo`);
      }

      // 🔍 Validar stock
      if (producto.stock_actual < cantidad) {
        throw new Error(
          `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock_actual}`
        );
      }

      const subtotal = cantidad * producto.precio;
      total += subtotal;

      // 🧾 Insertar detalle (🔥 SOLO catalogo_producto_id)
      await client.query(
        `INSERT INTO detalle_ventas 
          (venta_id, catalogo_producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          ventaId,
          catalogo_producto_id,
          cantidad,
          producto.precio,
          subtotal,
        ]
      );

      // 📦 Descontar stock
      await client.query(
        `UPDATE catalogo_productos
         SET stock_actual = stock_actual - $1
         WHERE id = $2`,
        [cantidad, catalogo_producto_id]
      );

      // 📊 Movimiento de stock
      await client.query(
        `INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo)
         VALUES ($1, 'salida', $2, 'venta')`,
        [producto.producto_id, cantidad]
      );
    }

    // 🏁 Actualizar total
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

// 📊 Obtener ventas
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


// 🔍 Venta por ID
export const obtenerVentaPorId = async (id) => {
  const venta = await pool.query(
    `SELECT * FROM ventas WHERE id = $1`,
    [id]
  );

  if (venta.rows.length === 0) {
    throw new Error('Venta no encontrada');
  }

  const detalle = await pool.query(
    `SELECT 
        dv.id,
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal,
        p.nombre,
        p.categoria
     FROM detalle_ventas dv
     JOIN catalogo_productos cp ON cp.id = dv.catalogo_producto_id
     JOIN productos p ON p.id = cp.producto_id
     WHERE dv.venta_id = $1`,
    [id]
  );

  return {
    ...venta.rows[0],
    productos: detalle.rows
  };
};