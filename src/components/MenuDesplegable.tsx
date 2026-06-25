import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/components/menuDesplegable.css";
import { useTema } from "../context/TemaContext";
import { BsSun, BsMoon } from "react-icons/bs";

function MenuDesplegable() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
  const { oscuro, setOscuro } = useTema();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="menu-desplegable">

            <div className="menu-header">
                <i className="bi bi-person-circle"></i>

                <div>
                    <h4>{usuario?.nickName}</h4>
                    <p>Estudiante · UNAHUR</p>
                </div>
            </div>

            <Link className="perfil-btn" to="/profile">
                Ver perfil completo
            </Link>

            <div className="menu-section">
                <span className="menu-title">
                    Cuenta
                </span>

                <Link to="/profile">
                    <i className="bi bi-person"></i>
                    Mi perfil
                </Link>

                <Link to="/my-posts">
                    <i className="bi bi-file-post"></i>
                    Mis publicaciones
                </Link>
            </div>
             <button className="icon-btn" onClick={() => setOscuro(!oscuro)} aria-label="Cambiar tema">
            {oscuro ? <BsSun /> : <BsMoon />}
          </button>
            <button
                className="logout-btn-menu"
                onClick={handleLogout}
            >
                <i className="bi bi-box-arrow-right"></i>
                Cerrar sesión
            </button>

        </div>
    );
}

export default MenuDesplegable;