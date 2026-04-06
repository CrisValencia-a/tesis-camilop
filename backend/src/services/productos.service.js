import pool from '../config/db.js';

export const crearProductoService = async (data) => {
  const { nombre, categoria } = data;

  // 🧠 Validaciones
  if (!nombre || !categoria) {
    throw new Error("Nombre y categoría son obligatorios");
  }

  const result = await pool.query(
    `INSERT INTO productos (nombre, categoria)
     VALUES ($1, $2) RETURNING *`,
    [nombre, categoria]
  );

  return result.rows[0];
};

export const obtenerProductosService = async () => {
  const result = await pool.query(
    `SELECT * FROM productos ORDER BY id DESC`
  );

  return result.rows;
};