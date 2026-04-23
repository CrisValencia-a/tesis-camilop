import { useEffect, useState } from "react";
import { crearVenta, getCatalogo } from "../api/api.ts";
import Card from "../components/Card.tsx";
import { toast } from "react-hot-toast";

// 🔥 NUEVO tipo basado en catálogo
type ProductoCatalogo = {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  stock_actual: number;
};

type VentaItemRequest = {
  catalogo_producto_id: number;
  cantidad: number;
  tipo_cliente: string;
};

export default function Ventas() {
  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [items, setItems] = useState<VentaItemRequest[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // 🔥 NUEVO
  const [tipoCliente, setTipoCliente] = useState<string>("Cliente Personal");

  const tiposCliente = [
    "Cliente Personal",
    "Cliente Eventos",
    "Cliente Corporativo",
    "Cliente Comercial",
  ];

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const fecha = new Date();
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();

      const data = await getCatalogo(mes, anio);

      if (data.length === 0) {
        toast("No hay catálogo definido para este mes", {
          icon: "📅",
        });
      }

      setProductos(data);
    } catch (error) {
      console.error("Error al cargar catálogo", error);
    }
  };

  const agregarProducto = () => {
    if (productos.length === 0) {
      toast("No hay productos disponibles en el catálogo", {
        icon: "⚠️",
      });
      return;
    }

    const disponibles = productos.filter(
      (p) => !items.some((i) => i.catalogo_producto_id === p.id)
    );

    if (disponibles.length === 0) {
      toast("Todos los productos ya están agregados", {
        icon: "📦",
      });
      return;
    }

    setItems([
      ...items,
      {
        catalogo_producto_id: disponibles[0].id,
        cantidad: 1,
        tipo_cliente: tipoCliente,
      },
    ]);
  };

  const actualizarItem = (
    index: number,
    campo: "catalogo_producto_id" | "cantidad",
    valor: number
  ) => {
    const nuevos = [...items];

    if (campo === "catalogo_producto_id") {
      const existe = nuevos.some(
        (item, i) => item.catalogo_producto_id === valor && i !== index
      );

      if (existe) {
        toast("Este producto ya fue agregado", {
          icon: "⚠️",
        });
        return;
      }
    }

    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setItems(nuevos);
  };

  const eliminarItem = (index: number) => {
    const nuevos = items.filter((_, i) => i !== index);
    setItems(nuevos);
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => {
      const producto = productos.find(
        (p) => p.id === item.catalogo_producto_id
      );

      return total + (producto?.precio || 0) * item.cantidad;
    }, 0);
  };

  const confirmarVenta = async () => {
    try {
      if (items.length === 0) {
        toast("Agrega al menos un producto", {
          icon: "⚠️",
        });
        return;
      }

      await crearVenta({
        tipo_cliente: tipoCliente, // 🔥 NUEVO
        productos: items,
      });

      toast.success("Venta registrada correctamente");

      setItems([]);
      setTipoCliente("Cliente Personal"); // reset
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar venta");
    } finally {
      setMostrarModal(false);
      cargarProductos();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-black text-[#3D3A38] tracking-tighter">
            Registrar Venta
          </h2>

          <div className="flex items-center gap-4">
            {/* 🔥 SELECT TIPO CLIENTE */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-[#A39E9B] uppercase tracking-widest mb-1 ml-1">
                Tipo Cliente
              </label>
              <select
                value={tipoCliente}
                onChange={(e) => setTipoCliente(e.target.value)}
                className="p-2 rounded-xl bg-white shadow-sm border-none focus:ring-2 focus:ring-[#FF9E5E] outline-none"
              >
                {tiposCliente.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={agregarProducto}
              className="flex items-center gap-2 text-[#FF9E5E] font-bold hover:text-[#F28C48] transition-all group bg-[#FF9E5E]/5 px-4 py-2 rounded-full"
            >
              <span className="w-6 h-6 rounded-full bg-[#FF9E5E] text-white flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                +
              </span>
              Agregar producto
            </button>
          </div>
          </div>

        {/* ITEMS */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const producto = productos.find(
              (p) => p.id === item.catalogo_producto_id
            );

            const stockDisponible = producto?.stock_actual || 0;
            const sinStock = item.cantidad > stockDisponible;

            return (
              <div key={index} className="group">
                <div className="flex gap-6 items-center p-6 rounded-3xl bg-[#F7F3F0]/40 border border-[#F1E9E4] transition-all hover:bg-[#F7F3F0]/60">

                  {/* SELECT */}
                  <div className="relative flex-2">
                  <label className="text-[10px] font-bold text-[#A39E9B] uppercase tracking-widest mb-1 ml-1 block">Producto</label>
                  <div className="relative">
                    <select
                      className="w-full p-4 rounded-2xl border-none bg-white text-[#3D3A38] appearance-none focus:ring-2 focus:ring-[#FF9E5E] transition-all outline-none cursor-pointer shadow-sm"
                      value={item.catalogo_producto_id}
                      onChange={(e) =>
                        actualizarItem(index, "catalogo_producto_id", Number(e.target.value))
                      }
                    >
                      {productos.map((p) => (
                        <option key={p.id} value={p.id} >
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A39E9B]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                  </div>

                  {/* CANTIDAD */}
                  <div className="flex flex-col w-32">
                    <label className="text-[10px] font-bold text-[#A39E9B] uppercase tracking-widest mb-1 ml-1 block">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        actualizarItem(index, "cantidad", Number(e.target.value))
                      }
                      className={`p-4 rounded-2xl border-none bg-white text-[#3D3A38] shadow-sm focus:ring-2 transition-all outline-none text-center font-bold ${
                            sinStock ? "ring-2 ring-red-300 focus:ring-red-400" : "focus:ring-[#FF9E5E]"
                      }`}
                    />
                  </div>

                  {/* SUBTOTAL */}
                  <div className="flex flex-col w-32">
                  <label className="text-[10px] font-bold text-[#A39E9B] uppercase tracking-widest mb-1 ml-1 block">Subtotal</label>
                    <div className="p-4 rounded-2xl bg-[#F1E9E4]/30 text-[#3D3A38] font-bold text-center">
                      ${(producto?.precio || 0) * item.cantidad}
                    </div>
                  </div>

                  {/* ELIMINAR */}
                  <div className="pt-5">
                    <button onClick={() => eliminarItem(index)} className="w-12 h-12 rounded-full flex items-center justify-center text-[#A39E9B] hover:text-red-400 hover:bg-red-50 transition-all bg-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                </div>

                {/* STOCK */}
                <div className="flex gap-4 mt-2 px-4">
                  <span className="text-[10px] font-medium text-[#A39E9B]">
                    Stock disponible: {stockDisponible}
                  </span>
                    {sinStock && (
                      <span className="text-[10px] font-bold text-red-400">
                        ⚠️ Stock insuficiente
                      </span>
                    )}
                  </div>
                </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="mt-12 pt-10 border-t-2 border-[#F7F3F0] flex justify-between items-center">
          <div className="flex flex-col">
                <span className="text-[#A39E9B] font-bold uppercase tracking-widest text-[10px] mb-1">Total de la venta</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#FF9E5E]">$</span>
                  <span className="text-4xl font-black text-[#3D3A38] tracking-tighter">
                    {calcularTotal()}
                  </span>
                </div>
              </div>

          <button
            onClick={() => setMostrarModal(true)}
            disabled={
              items.length === 0 ||
              items.some(
                (i) =>
                  i.cantidad >
                  (productos.find((p) => p.id === i.catalogo_producto_id)?.stock_actual || 0)
              )
            }
            className={`px-12 py-5 rounded-4xl text-white font-extrabold text-lg shadow-xl transition-all duration-300 flex items-center gap-3 ${
                  items.length === 0 || items.some(i => i.cantidad > (productos.find(p => p.id === i.catalogo_producto_id)?.stock_actual || 0))
                    ? "bg-stone-200 cursor-not-allowed shadow-none"
                    : "bg-linear-to-r from-[#FF9E5E] to-[#FF8C3D] hover:scale-105 active:scale-95 shadow-[#FF9E5E]/20"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Guardar Venta
          </button>
        </div>
      </Card>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-[#3D3A38]/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-[#F1E9E4] transform transition-all scale-100 flex flex-col items-center text-center">
            {/* Icono Centrado */}
            <div className="w-20 h-20 rounded-full bg-[#FF9E5E]/10 flex items-center justify-center text-[#FF9E5E] mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-[#3D3A38] mb-3 tracking-tight">
              Confirmar venta
            </h3>
            <p className="text-[#A39E9B] mb-10 font-medium leading-relaxed">
              ¿Estás seguro de confirmar el registro de la venta?
            </p>

            <div className="flex gap-4 w-full">
              <button onClick={() => setMostrarModal(false)} className="flex-1 py-4 rounded-2xl text-[#A39E9B] font-bold hover:bg-[#F7F3F0] transition-colors">
                Revisar
              </button>
              <button onClick={confirmarVenta} className="flex-1 py-4 rounded-2xl bg-[#3D3A38] text-white font-bold hover:bg-[#2A2826] shadow-lg transition-all">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}