import "../../styles/components/navbar/navbar.css";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuDesplegable from "./MenuDesplegable";
import { useAuth } from "../../context/authContext";
import { useScrollDirection } from '../../hooks/useScrollDirection'

function NavBar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");
    const { usuario } = useAuth();
    const visible = useScrollDirection()

    const buscar = () => {
        const texto = busqueda.trim();
        if (!texto) return;
        navigate(`/search?q=${encodeURIComponent(texto)}`);
    };

    return (
        <nav className={`navbar ${visible ? '' : 'navbar-hidden'}`}>
            <div className="navbar-left">
                <img className="navbar-logo" src={logo} alt="logo unahur antisocial net" />
                <p className="titulo-logo">UNAHUR Anti-Social Net</p>
                
                <div className="navbar-search-wrap">
                    <i className="bi bi-search navbar-search-icon"></i>
                    <input
                        className="navbar-search"
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") buscar(); }}
                    />
                </div>
            </div>

            <div className="navbar-center">
                <a href="/" className="nav-item">
                    <i className="bi bi-house-fill"></i>
                    <span>Inicio</span>
                </a>
                <a href="#" className="nav-item">
                    <i className="bi bi-people-fill"></i>
                    <span>Amigos</span>
                </a>
                <a href="#" className="nav-item">
                    <i className="bi bi-chat-fill"></i>
                    <span>Mensajes</span>
                </a>
                <a href="#" className="nav-item">
                    <i className="bi bi-bell-fill"></i>
                    <span>Notificaciones</span>
                </a>
            </div>

            <div className="navbar-right">
                <button className="navbar-avatar" onClick={() => setMenuAbierto(!menuAbierto)}>
                    {usuario?.fotoPerfil ? (
                        <img src={usuario.fotoPerfil} alt={usuario.nickName} className="navbar-avatar-img" />
                    ) : (
                        <i className="bi bi-person-circle"></i>
                    )}
                </button>
                {menuAbierto && <MenuDesplegable />}
            </div>
        </nav>
    );
}

export default NavBar;