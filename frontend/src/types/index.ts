export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
};

export type VentaItemRequest = {
  catalogo_producto_id: number;
  cantidad: number;
};

export type VentaItem = {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
};

export type Venta = {
  id: number;
  total: number;
  fecha: string;
};

export type ProductoCatalogo = {
  producto_id: number;
  nombre: string;
  precio: number;
  stock_actual: number;
};