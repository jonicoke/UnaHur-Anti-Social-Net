import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Perfil from "./pages/Perfil";
import Home from "./pages/Home";
import Login from "./pages/Login";
import './styles/mobileFooter.css'
import { useScrollDirection } from './hooks/useScrollDirection'

function MobileFooter() {
    const navigate = useNavigate();
    const visible = useScrollDirection()

    return (
          <nav className={`mobile-footer ${visible ? '' : 'mobile-footer-hidden'}`}>
            <button onClick={() => navigate('/')}>
                <i className="bi bi-house-fill"></i>
                <span>Inicio</span>
            </button>
            <button onClick={() => navigate('/new-post')} className="mobile-footer-publish">
                <i className="bi bi-plus-square-fill"></i>
                <span>Publicar</span>
            </button>
            <button onClick={() => navigate('#')}>
                <i className="bi bi-chat-fill"></i>
                <span>Mensajes</span>
            </button>
        </nav>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <RutaProtegida>
                        <NavBar />
                        <Perfil />
                        <Home />
                        <MobileFooter />
                    </RutaProtegida>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;