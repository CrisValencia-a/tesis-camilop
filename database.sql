-- =========================================
-- BASE DE DATOS: Pasteleria
-- =========================================

-- (Opcional) Crear base de datos
-- CREATE DATABASE Pasteleria_db;

-- =========================================
-- TABLA: productos
-- =========================================
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT,
  precio NUMERIC(10,2) NOT NULL,
  stock_actual INT NOT NULL DEFAULT 0,
  stock_minimo INT NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABLA: ventas
-- =========================================
CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total NUMERIC(10,2) DEFAULT 0
);

-- =========================================
-- TABLA: detalle_ventas
-- =========================================
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id SERIAL PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,

  CONSTRAINT fk_venta
    FOREIGN KEY (venta_id)
    REFERENCES ventas(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_producto
    FOREIGN KEY (producto_id)
    REFERENCES productos(id)
);

-- =========================================
-- TABLA: movimientos_stock
-- =========================================
CREATE TABLE IF NOT EXISTS movimientos_stock (
  id SERIAL PRIMARY KEY,
  producto_id INT NOT NULL,
  tipo TEXT NOT NULL, -- 'entrada' o 'salida'
  cantidad INT NOT NULL,
  motivo TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_producto_mov
    FOREIGN KEY (producto_id)
    REFERENCES productos(id)
);

-- =========================================
-- ÍNDICES (mejora rendimiento)
-- =========================================
CREATE INDEX IF NOT EXISTS idx_detalle_venta_id ON detalle_ventas(venta_id);
CREATE INDEX IF NOT EXISTS idx_detalle_producto_id ON detalle_ventas(producto_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_producto_id ON movimientos_stock(producto_id);

-- =========================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =========================================
-- Puedes comentar esto si no quieres datos iniciales

-- INSERT INTO productos (nombre, categoria, precio, stock_actual, stock_minimo)
-- VALUES
--   ('Galleta Decorada', 'galletas', 1500, 50, 10),
--   ('Macaron', 'macarons', 1200, 40, 10),
--   ('Torta Chocolate', 'tortas', 15000, 10, 2)
-- ON CONFLICT DO NOTHING;