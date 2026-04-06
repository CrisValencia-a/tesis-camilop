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
-- TABLA: catalogos
-- =========================================
CREATE TABLE IF NOT EXISTS catalogos (
  id SERIAL PRIMARY KEY,
  mes INT NOT NULL,
  anio INT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (mes, anio)
);

-- =========================================
-- TABLA: catalogo_productos
-- =========================================
CREATE TABLE IF NOT EXISTS catalogo_productos (
  id SERIAL PRIMARY KEY,
  catalogo_id INT REFERENCES catalogos(id) ON DELETE CASCADE,
  producto_id INT REFERENCES productos(id),

  UNIQUE (catalogo_id, producto_id)
);

ALTER TABLE productos
DROP COLUMN precio,
DROP COLUMN stock_actual,
DROP COLUMN stock_minimo;

ALTER TABLE catalogo_productos
ADD COLUMN precio NUMERIC(10,2) NOT NULL default 1,
ADD COLUMN stock_actual INT NOT NULL default 1,
ADD COLUMN stock_minimo INT NOT NULL default 1;

ALTER TABLE detalle_ventas
ADD COLUMN catalogo_id INT;

ALTER TABLE detalle_ventas
ADD CONSTRAINT fk_catalogo_producto
FOREIGN KEY (catalogo_id)
REFERENCES catalogo_productos(id)
ON DELETE CASCADE;


SELECT * FROM productos

select * from catalogos WHERE mes=4 and anio=2026
SELECT * FROM catalogo_productos where catalogo_id=16
SELECT * FROM ventas 
WHERE fecha >= '2026-01-03' AND fecha < '2025-02-05';

SELECT * FROM ventas order by fecha where fecha  >= '2026-03-26' AND fecha < '2026-04-27' order by fecha
SELECT * FROM ventas where id in (485, 486,487)
SELECT SUM(total) AS total_ventas
FROM ventas;

--select SUM(subtotal) as subtotal from detalle_ventas
--SELECT SUM(cantidad) as cantidad FROM detalle_ventas
select * from detalle_ventas where 
SELECT  * FROM detalle_ventas where venta_id in (SELECT id FROM ventas 
WHERE fecha >= '2025-01-01' AND fecha < '2025-02-01') and producto_id=1

SELECT SUM(subtotal) AS total_ventas
FROM detalle_ventas;

select * from movimientos_stock where producto_id=5 and motivo='stock inicial'

ALTER TABLE detalle_ventas
ADD COLUMN catalogo_producto_id INT;

UPDATE detalle_ventas dv
SET catalogo_producto_id = cp.id
FROM catalogo_productos cp
WHERE dv.producto_id = cp.producto_id
AND dv.catalogo_id = cp.catalogo_id;

ALTER TABLE detalle_ventas DROP COLUMN producto_id;
ALTER TABLE detalle_ventas DROP COLUMN catalogo_id;

-- RESET DE TABLAS
TRUNCATE TABLE 
detalle_ventas,
ventas,
movimientos_stock,
catalogo_productos,
catalogos,
productos
RESTART IDENTITY CASCADE;