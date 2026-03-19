import pool from '../config/db.js';

export const crearProductoService = async (data) => {
  const { nombre, categoria, precio, stock_actual, stock_minimo } = data;

  // 🧠 Validaciones
  if (!nombre || !categoria || precio == null) {
    throw new Error("Faltan campos obligatorios");
  }

  const result = await pool.query(
    `INSERT INTO productos (nombre, categoria, precio, stock_actual, stock_minimo)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre, categoria, precio, stock_actual, stock_minimo]
  );

  return result.rows[0];
};

export const obtenerProductosService = async () => {
  const result = await pool.query('SELECT * FROM productos');
  return result.rows;
};