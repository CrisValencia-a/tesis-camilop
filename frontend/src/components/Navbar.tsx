import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#FAF5F2]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#F1E9E4]">
      <div className="max-w-5xl mx-auto px-8 py-5 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-2xl transform group-hover:rotate-12 transition-transform duration-300">🍪</span>
          <h1 className="text-2xl font-black text-[#3D3A38] tracking-tight">
            CamiLop <span className="text-[#FF9E5E]">Pastelería</span>
          </h1>
        </div>

        {/* Navegación */}
        <div className="flex gap-8 items-center">

          {/* PRODUCTOS */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-bold pb-1 border-b-2 transition-all ${
                isActive
                  ? "text-[#FF9E5E] border-[#FF9E5E]"
                  : "text-[#A39E9B] border-transparent hover:text-[#3D3A38]"
              }`
            }
          >
            Productos
          </NavLink>

          {/* VENTAS */}
          <NavLink
            to="/ventas"
            className={({ isActive }) =>
              `text-sm font-bold pb-1 border-b-2 transition-all ${
                isActive
                  ? "text-[#FF9E5E] border-[#FF9E5E]"
                  : "text-[#A39E9B] border-transparent hover:text-[#3D3A38]"
              }`
            }
          >
            Ventas
          </NavLink>

        </div>
      </div>
    </nav>
  );
}