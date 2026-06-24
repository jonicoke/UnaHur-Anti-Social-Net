import { BrowserRouter, Routes, Route } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/" element={
          <RutaProtegida>
            <NavBar />
            <Home />
            <Footer />
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;