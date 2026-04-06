import pool from "../config/db.js";

export const crearCatalogoService = async (data) => {
  const { mes, anio, productos } = data;

  if (!mes || !anio) {
    throw new Error("Mes y año son obligatorios");
  }

  if (!productos || productos.length === 0) {
    throw new Error("Debes agregar al menos un producto");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔍 1. Verificar si ya existe catálogo del mes
    const existe = await client.query(
      `SELECT * FROM catalogos WHERE mes = $1 AND anio = $2`,
      [mes, anio]
    );

    let catalogoId;

    if (existe.rows.length > 0) {
      catalogoId = existe.rows[0].id;
    } else {
      // 🆕 Crear catálogo
      const nuevo = await client.query(
        `INSERT INTO catalogos (mes, anio)
         VALUES ($1, $2)
         RETURNING *`,
        [mes, anio]
      );

      catalogoId = nuevo.rows[0].id;
    }

    // 📦 2. Insertar productos en catálogo
    for (const item of productos) {
      const {
        producto_id,
        precio,
        stock_actual,
        stock_minimo,
      } = item;

      if (!producto_id || !precio) {
        throw new Error("Datos incompletos en productos");
      }

      await client.query(
        `INSERT INTO catalogo_productos
        (catalogo_id, producto_id, precio, stock_actual, stock_minimo)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          catalogoId,
          producto_id,
          precio,
          stock_actual,
          stock_minimo,
        ]
      );
    }

    await client.query("COMMIT");

    return { catalogoId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const obtenerCatalogoActualService = async () => {
  const fecha = new Date();

  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();

  const result = await pool.query(
    `
    SELECT 
      cp.*,
      p.nombre,
      p.categoria
    FROM catalogo_productos cp
    JOIN catalogos c ON c.id = cp.catalogo_id
    JOIN productos p ON p.id = cp.producto_id
    WHERE c.mes = $1 AND c.anio = $2
    `,
    [mes, anio]
  );

  return result.rows;
};

export const obtenerCatalogoPorFechaService = async (mes, anio) => {
  const result = await pool.query(
    `
    SELECT 
      cp.id,
      cp.producto_id,
      cp.precio,
      cp.stock_actual,
      cp.stock_minimo,
      p.nombre,
      p.categoria
    FROM catalogo_productos cp
    JOIN catalogos c ON c.id = cp.catalogo_id
    JOIN productos p ON p.id = cp.producto_id
    WHERE c.mes = $1 AND c.anio = $2
    `,
    [mes, anio]
  );

  return result.rows;
};