import { BrowserRouter, Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos.tsx";
import Ventas from "./pages/Ventas.tsx";
import Navbar from "./components/Navbar.tsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <div className="space-y-8 bg-[#FAF5F2] p-8 min-h-screen font-sans">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "16px",
              background: "#FFF7F2",
              color: "#3D3A38",
              border: "1px solid #F1E9E4",
            },
          }}
        />

        <Navbar />

        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Productos />} />
            <Route path="/ventas" element={<Ventas />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
