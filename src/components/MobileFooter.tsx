import { useNavigate } from "react-router-dom";
import { useScrollDirection } from '../hooks/useScrollDirection'
import { useFeedCreate } from "../context/FeedCreateContext";

function MobileFooter() {
    const navigate = useNavigate();
    const visible = useScrollDirection()
    const { abrirFeed } = useFeedCreate();

    return (
          <nav className={`mobile-footer ${visible ? '' : 'mobile-footer-hidden'}`}>
            <button onClick={() => { navigate('/inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                <i className="bi bi-house-fill"></i>
                <span>Inicio</span>
            </button>
                <button
                    onClick={abrirFeed}
                    className="mobile-footer-publish">                
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

export default MobileFooter
