import "../styles/components/NavBar.css";
import logo from "../assets/logo.png";
import { useState } from "react";
import MenuDesplegable from "./MenuDesplegable";

function NavBar() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <nav className="navbar">

            <div className="navbar-left">
                <img
                    className="navbar-logo"
                    src={logo}
                    alt="logo unahur antisocial net"
                />

                <input
                    className="navbar-search"
                    type="text"
                    placeholder="Buscar..."
                />
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

                <button
                    className="navbar-avatar"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    <i className="bi bi-person-circle"></i>
                </button>

                {menuAbierto && (
                    <MenuDesplegable />
                )}

            </div>

        </nav>
    );
}

export default NavBar;