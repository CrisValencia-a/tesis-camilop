import { useEffect, useState } from "react";
import Card from "../components/Card";
import { getProductos, crearCatalogo } from "../api/api";
import { toast } from "react-hot-toast";

type Producto = {
  id: number;
  nombre: string;
  categoria: string;
};

type ItemCatalogo = {
  producto_id: number;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
};

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [items, setItems] = useState<ItemCatalogo[]>([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  // ➕ Agregar producto
  const agregarProducto = () => {
    if (productos.length === 0) {
      toast("No hay productos disponibles", { icon: "📦" });
      return;
    }

    setItems([
      ...items,
      {
        producto_id: 0,
        precio: 0,
        stock_actual: 0,
        stock_minimo: 0,
      },
    ]);
  };

  // 🔄 Actualizar
  const actualizarItem = (
    index: number,
    campo: keyof ItemCatalogo,
    valor: number
  ) => {
    const nuevos = [...items];

    if (campo === "producto_id") {
      const existe = nuevos.some(
        (item, i) => item.producto_id === valor && i !== index
      );

      if (existe) {
        toast("Este producto ya fue agregado", { icon: "⚠️" });
        return;
      }
    }

    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setItems(nuevos);
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };


  // 💾 Guardar catálogo
  const guardarCatalogo = async () => {
    if (items.length === 0) {
      toast("Agrega al menos un producto", { icon: "⚠️" });
      return;
    }

    const hayErrores = items.some(
      (i) =>
        i.producto_id === 0 ||
        i.precio <= 0 ||
        i.stock_actual < 0 ||
        i.stock_minimo < 0
    );

    if (hayErrores) {
      toast.error("Revisa productos, precios y stock");
      return;
    }

    try {
      const fecha = new Date();

      await crearCatalogo({
        mes: fecha.getMonth() + 1,
        anio: fecha.getFullYear(),
        productos: items,
      });

      toast.success("Catálogo guardado");
      setItems([]);
    } catch {
      toast.error("Error al guardar catálogo");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-3xl font-black text-[#3D3A38] mb-8 tracking-tight">
          Catálogo del Mes
        </h2>


        {/* ➕ AGREGAR */}
        <button
          onClick={agregarProducto}
          className="flex items-center gap-2 text-[#FF9E5E] font-bold hover:text-[#F28C48] transition-all group mb-6"
        >
          <span className="w-6 h-6 rounded-full bg-[#FF9E5E] text-white flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
            +
          </span>
          Agregar producto al catálogo
        </button>

        {/* 📦 ITEMS */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-3xl bg-[#F7F3F0]/40 border border-[#F1E9E4]"
            >
              <div className="flex gap-4 flex-wrap items-center">

                {/* SELECT */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#A39E9B] uppercase mb-1">
                    Producto
                  </label>
                  <select
                    value={item.producto_id}
                    onChange={(e) =>
                      actualizarItem(index, "producto_id", Number(e.target.value))
                    }
                    className="p-4 rounded-2xl bg-white focus:ring-2 focus:ring-[#FF9E5E] outline-none"
                  >
                    <option value={0}>Seleccionar</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRECIO */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#A39E9B] uppercase mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={item.precio}
                    onChange={(e) =>
                      actualizarItem(index, "precio", Number(e.target.value))
                    }
                    className="p-4 rounded-2xl bg-white w-28 focus:ring-2 focus:ring-[#FF9E5E] outline-none"
                  />
                </div>

                {/* STOCK */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#A39E9B] uppercase mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={item.stock_actual}
                    onChange={(e) =>
                      actualizarItem(index, "stock_actual", Number(e.target.value))
                    }
                    className="p-4 rounded-2xl bg-white w-28 focus:ring-2 focus:ring-[#FF9E5E] outline-none"
                  />
                </div>

                {/* STOCK MIN */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#A39E9B] uppercase mb-1">
                    Stock mín
                  </label>
                  <input
                    type="number"
                    value={item.stock_minimo}
                    onChange={(e) =>
                      actualizarItem(index, "stock_minimo", Number(e.target.value))
                    }
                    className="p-4 rounded-2xl bg-white w-28 focus:ring-2 focus:ring-[#FF9E5E] outline-none"
                  />
                </div>

                {/* ELIMINAR */}
                <button
                  onClick={() => eliminarItem(index)}
                  className="mt-6 text-red-400 hover:text-red-500"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 💾 GUARDAR */}
        <button
          onClick={guardarCatalogo}
          disabled={items.length === 0}
          className={`mt-8 w-full py-5 rounded-2xl text-white font-bold transition-all ${
            items.length === 0
              ? "bg-stone-200 cursor-not-allowed shadow-none"
              : "bg-linear-to-r from-[#FF9E5E] to-[#FF8C3D] hover:scale-105 active:scale-95 shadow-[#FF9E5E]/20"
          }`}
        >
          Guardar catálogo
        </button>
      </Card>
    </div>
  );
}