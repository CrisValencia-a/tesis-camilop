import { useEffect, useState } from "react";
import { getProductos, crearProducto } from "../api/api.ts";
import type { Producto } from "../types/index.ts";
import Card from "../components/Card.tsx";

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stockActual, setStockActual] = useState(0);
  const [stockMinimo, setStockMinimo] = useState(0);
  const [precio, setPrecio] = useState(0);

  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    await crearProducto({
      nombre,
      categoria,
      precio,
      stock_actual: stockActual,
      stock_minimo: stockMinimo,
    });

    setNombre("");
    setCategoria("");
    setStockActual(0);
    setStockMinimo(0);
    setPrecio(0);
    cargarProductos();
  };

  return (
    <div className="space-y-6">
      
      {/* FORM */}
      <Card>
          <h2 className="text-2xl font-bold mb-8 text-[#3D3A38] tracking-tight">
          Nuevo Producto
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
          {/* Nombre */}
          <div className="flex flex-col flex-1 min-w-50">
              <label className="text-xs font-bold text-[#A39E9B] uppercase tracking-wider mb-2 ml-1">Nombre del producto</label>
              <input
                className="p-4 rounded-2xl border-none bg-[#F7F3F0] text-[#3D3A38] placeholder-[#C2BCB8] focus:ring-2 focus:ring-[#FF9E5E] transition-all duration-300 outline-none"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Galleta de Lavanda"
              />
            </div>

            {/* Categoria */}
            <div className="flex flex-col w-64">
              <label className="text-xs font-bold text-[#A39E9B] uppercase tracking-wider mb-2 ml-1">Tipo de categoría</label>
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-4 rounded-2xl border-none bg-[#F7F3F0] text-[#3D3A38] appearance-none focus:ring-2 focus:ring-[#FF9E5E] transition-all duration-300 outline-none cursor-pointer"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="galletas">Galletas</option>
                  <option value="macarons">Macarons</option>
                  <option value="tortas">Tortas</option>
                  <option value="Box mix">Box Mix</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A39E9B]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 w-full lg:w-auto">
              {/* Stock inicial */}
              <div className="flex flex-col w-32">
                <label className="text-xs font-bold text-[#A39E9B] uppercase tracking-wider mb-2 ml-1">Stock inicial</label>
                <input
                  type="number"
                  className="p-4 rounded-2xl border-none bg-[#F7F3F0] text-[#3D3A38] focus:ring-2 focus:ring-[#FF9E5E] transition-all duration-300 outline-none"
                  value={stockActual}
                  onChange={(e) => setStockActual(Number(e.target.value))}
                />
              </div>

              {/* Stock mínimo */}
              <div className="flex flex-col w-32">
                <label className="text-xs font-bold text-[#A39E9B] uppercase tracking-wider mb-2 ml-1">Stock mínimo</label>
                <input
                  type="number"
                  className="p-4 rounded-2xl border-none bg-[#F7F3F0] text-[#3D3A38] focus:ring-2 focus:ring-[#FF9E5E] transition-all duration-300 outline-none"
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(Number(e.target.value))}
                />
              </div>

              {/* Precio */}
              <div className="flex flex-col w-36">
                <label className="text-xs font-bold text-[#A39E9B] uppercase tracking-wider mb-2 ml-1">Precio</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A39E9B]">$</span>
                  <input
                    type="number"
                    className="w-full p-4 pl-8 rounded-2xl border-none bg-[#F7F3F0] text-[#3D3A38] focus:ring-2 focus:ring-[#FF9E5E] transition-all duration-300 outline-none"
                    value={precio}
                    onChange={(e) => setPrecio(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Botón */}
            <div className="w-full flex justify-end mt-2">
              <button
                type="submit"
                className="bg-[#FF9E5E] px-10 py-4 rounded-[1.25rem] text-white font-bold shadow-[0_10px_25px_-5px_rgba(255,158,94,0.4)] hover:bg-[#F28C48] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Agregar Producto
              </button>
            </div>
        </form>
      </Card>

      {/* LISTA */}
      <Card>
    <h2 className="text-2xl font-bold mb-8 text-[#3D3A38] tracking-tight">
      Lista de Productos
    </h2>

    <div className="grid gap-4">
      {productos.map((p) => (
        <div
          key={p.id}
          className="group flex justify-between items-center p-5 rounded-2xl bg-white border border-[#F1E9E4] hover:border-[#FF9E5E]/30 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FF9E5E]/10 flex items-center justify-center text-[#FF9E5E]">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>
            </div>
            <span className="font-semibold text-[#3D3A38]">{p.nombre}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-[#A39E9B] uppercase tracking-widest">Stock Actual</span>
               <span className={`text-sm font-bold ${p.stock_actual <= p.stock_minimo ? 'text-red-400' : 'text-[#3D3A38]'}`}>
                {p.stock_actual} unidades
              </span>
            </div>
            <div className="h-8 w-px bg-[#F1E9E4]"></div>
            <button className="text-[#A39E9B] hover:text-[#FF9E5E] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
      </Card>
    </div>
  );
}