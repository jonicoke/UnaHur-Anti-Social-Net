import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "../../styles/components/navbar/menuDesplegable.css";
import { useTema } from "../../context/TemaContext";
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

            {/* Header: foto + info + botón perfil */}
            <div className="menu-header">
                <div className="menu-avatar-wrap">
                    {usuario?.fotoPerfil ? (
                        <img src={usuario.fotoPerfil} alt={usuario.nickName} className="avatar-img" />
                    ) : (
                        <div className="avatar-placeholder">
                            <i className="bi bi-person-fill"></i>
                        </div>
                    )}
                </div>
                <div className="menu-user-info">
                    <span className="menu-username">{usuario?.nickName}</span>
                    <span className="menu-institute">{usuario?.instituto ?? 'Estudiante · UNAHUR'}</span>
                </div>
                <Link className="perfil-btn" to="/profile">
                    Ver perfil
                </Link>
            </div>

            <div className="menu-divider" />

            {/* Links de cuenta */}
            <div className="menu-section">
                <Link to="/profile" className="menu-item">
                    <span className="menu-item-icon"><i className="bi bi-person"></i></span>
                    <span>Mi perfil</span>
                </Link>

                <button className="menu-item menu-item-btn" onClick={() => setOscuro(!oscuro)} aria-label="Cambiar tema">
                    <span className="menu-item-icon">
                        {oscuro ? <BsSun /> : <BsMoon />}
                    </span>
                    <span>Cambiar tema</span>
                </button>
            </div>

            <div className="menu-divider" />

            {/* Logout */}
            <button className="menu-item menu-item-btn menu-item-danger" onClick={handleLogout}>
                <span className="menu-item-icon"><i className="bi bi-box-arrow-right"></i></span>
                <span>Cerrar sesión</span>
            </button>

        </div>
    );
}

export default MenuDesplegable;