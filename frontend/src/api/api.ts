import type { Producto, VentaItemRequest } from "../types/index.ts";

const API_URL = "http://localhost:3000/api";

// 🧁 Productos
export const getProductos = async (): Promise<Producto[]> => {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
};

export const crearProducto = async (
  data: Partial<Producto>
): Promise<Producto> => {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 💰 Ventas
export const crearVenta = async (data: {
  productos: VentaItemRequest[];
}) => {
  const res = await fetch(`${API_URL}/ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

type CatalogoItemRequest = {
  producto_id: number;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
};

// 📦 Catalogo
export const crearCatalogo = async (data: {
  mes: number;
  anio: number;
  productos: CatalogoItemRequest[];
}) => {
  const res = await fetch(`${API_URL}/catalogos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getCatalogo = async (mes: number, anio: number) => {
  const res = await fetch(
    `${API_URL}/catalogos?mes=${mes}&anio=${anio}`
  );

  return res.json();
};