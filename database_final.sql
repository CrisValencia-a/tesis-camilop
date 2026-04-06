-- 🧹 OPCIONAL: eliminar tablas si existen (para recrear limpio)
DROP TABLE IF EXISTS movimientos_stock CASCADE;
DROP TABLE IF EXISTS detalle_ventas CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;
DROP TABLE IF EXISTS catalogo_productos CASCADE;
DROP TABLE IF EXISTS catalogos CASCADE;
DROP TABLE IF EXISTS productos CASCADE;

-- 📦 PRODUCTOS
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

-- 📅 CATALOGOS (por mes/año)
CREATE TABLE catalogos (
    id SERIAL PRIMARY KEY,
    mes INT NOT NULL,
    anio INT NOT NULL,
    UNIQUE (mes, anio)
);

-- 📦 PRODUCTOS EN CATALOGO (snapshot mensual)
CREATE TABLE catalogo_productos (
    id SERIAL PRIMARY KEY,
    catalogo_id INT NOT NULL,
    producto_id INT NOT NULL,
    precio INT NOT NULL,
    stock_actual INT NOT NULL,
    stock_minimo INT NOT NULL,

    FOREIGN KEY (catalogo_id) REFERENCES catalogos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- 🧾 VENTAS
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total INT DEFAULT 0
);

-- 🧾 DETALLE DE VENTAS (🔥 NUEVA ESTRUCTURA)
CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL,
    catalogo_producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario INT NOT NULL,
    subtotal INT NOT NULL,

    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (catalogo_producto_id) REFERENCES catalogo_productos(id)
);

-- 📊 MOVIMIENTOS DE STOCK
CREATE TABLE movimientos_stock (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo VARCHAR(10) CHECK (tipo IN ('entrada', 'salida')),
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(100),

    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- 🚀 ÍNDICES (MEJORAN RENDIMIENTO PARA BI)
CREATE INDEX idx_catalogo_productos_catalogo ON catalogo_productos(catalogo_id);
CREATE INDEX idx_catalogo_productos_producto ON catalogo_productos(producto_id);
CREATE INDEX idx_detalle_ventas_venta ON detalle_ventas(venta_id);
CREATE INDEX idx_detalle_ventas_catalogo_producto ON detalle_ventas(catalogo_producto_id);
CREATE INDEX idx_movimientos_producto ON movimientos_stock(producto_id);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);


-------------------------------------------------------------------------------------------

-- VIEW PARA BI (INTEGRACIÓN DE DATOS)
CREATE OR REPLACE VIEW vw_ventas_bi AS
SELECT 
  v.id AS venta_id,
  v.fecha,
  DATE_TRUNC('month', v.fecha) AS mes_fecha,
  DATE_TRUNC('week', v.fecha) AS semana_fecha,
  v.total,

  p.id AS producto_id,
  p.nombre,
  p.categoria,

  dv.cantidad,
  dv.subtotal,

  cp.precio,
  cp.stock_actual,
  cp.stock_minimo,

  c.mes,
  c.anio

FROM ventas v
JOIN detalle_ventas dv 
  ON dv.venta_id = v.id
JOIN catalogo_productos cp 
  ON cp.id = dv.catalogo_producto_id
JOIN productos p 
  ON p.id = cp.producto_id
JOIN catalogos c 
  ON c.id = cp.catalogo_id;

--DROP VIEW vw_ventas_bi;
SELECT * FROM vw_ventas_bi LIMIT 10;