import { useEffect, useState } from "react";
import { getProductos, crearProducto } from "../api/api.ts";
import type { Producto } from "../types/index.ts";
import Card from "../components/Card.tsx";
import { toast } from "react-hot-toast";

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");

  const cargarProductos = async () => {
    const data = await getProductos();
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !categoria) {
      toast("Completa todos los campos", { icon: "⚠️" });
      return;
    }

    try {
      await crearProducto({
        nombre,
        categoria,
      });

      toast.success("Producto creado");

      setNombre("");
      setCategoria("");
      cargarProductos();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear producto");
    }
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
            <label className="text-xs font-bold text-[#A39E9B] uppercase tracking-wider mb-2 ml-1">
              Nombre del producto
            </label>
            <input
              className="p-4 rounded-2xl border-none bg-[#F7F3F0] text-[#3D3A38] placeholder-[#C2BCB8] focus:ring-2 focus:ring-[#FF9E5E] transition-all duration-300 outline-none"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Galleta de Lavanda"
            />
          </div>

          {/* Categoria */}
          <div className="flex flex-col w-64">
            <label className="text-xs font-bold text-[#A39E9B] uppercase tracking-wider mb-2 ml-1">
              Tipo de categoría
            </label>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                    <path d="M7 21h10"/>
                    <path d="M12 3v18"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#3D3A38]">
                    {p.nombre}
                  </span>
                  <span className="text-xs text-[#A39E9B] uppercase tracking-wider">
                    {p.categoria}
                  </span>
                </div>
              </div>

              <button className="text-[#A39E9B] hover:text-[#FF9E5E] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="12" cy="5" r="1"/>
                  <circle cx="12" cy="19" r="1"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}