import "../../styles/components/navbar/navbar.css";
import logo from "../../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import MenuDesplegable from "./MenuDesplegable";
import { useAuth } from "../../context/authContext";
import { useScrollDirection } from '../../hooks/useScrollDirection'

function NavBar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()
    const [busqueda, setBusqueda] = useState("");
    const { usuario } = useAuth();
    const visible = useScrollDirection()
    const menuRef = useRef<HTMLDivElement>(null)

    // Cierra al cambiar de página
    useEffect(() => {
        setMenuAbierto(false)
    }, [location.pathname])

    // Cierra al clickear afuera
    useEffect(() => {
        if (!menuAbierto) return
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuAbierto(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [menuAbierto])

    const buscar = () => {
        const texto = busqueda.trim();
        if (!texto) return;
        navigate(`/search?q=${encodeURIComponent(texto)}`);
    };

    return (
        <nav className={`navbar ${visible ? '' : 'navbar-hidden'}`}>
            <div className="navbar-left">
                <NavLink to="/inicio" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <img className="navbar-logo" src={logo} alt="logo unahur antisocial net" />
                </NavLink>
                
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
                <NavLink
                    to="/inicio"
                    className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                >
                    <i className="bi bi-house-fill"></i>
                    <span>Inicio</span>
                </NavLink>
                <div className="nav-item nav-item-disabled">
                    <i className="bi bi-people-fill"></i>
                    <span>Seguidos</span>
                </div>
                <div className="nav-item nav-item-disabled">
                    <i className="bi bi-chat-fill"></i>
                    <span>Mensajes</span>
                </div>
                <div className="nav-item nav-item-disabled">
                    <i className="bi bi-bell-fill"></i>
                    <span>Alertas</span>
                </div>
            </div>

            <div className="navbar-right" ref={menuRef}>
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