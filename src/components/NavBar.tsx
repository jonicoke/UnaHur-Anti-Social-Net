import '../styles/components/NavBar.css'

function NavBar() {
    return (
        <nav className="navbar">

            <div className="navbar-left">
                <span className="navbar-logo">🌐</span>
                <input className="navbar-search" type="text" placeholder="Buscar..." />
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
                <a href="/profile" className="navbar-avatar" title="Mi perfil">
                    <i className="bi bi-person-circle"></i>
                </a>
            </div>

        </nav>
    )
}

export default NavBar