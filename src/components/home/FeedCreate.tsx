import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import '../../styles/components/home/feedCreate.css'

function FeedCreate() {
    const navigate = useNavigate()
    const { usuario } = useAuth()

    return (
        <div className="feed-create" data-reveal="up" data-reveal-delay="80">
            {usuario?.fotoPerfil ? (
                <img src={usuario.fotoPerfil} alt={usuario.nickName} className="avatar-img feed-create-avatar" />
            ) : (
                <i className="bi bi-person-circle feed-create-avatar"></i>
            )}
            <button className="feed-create-btn" onClick={() => navigate('/new-post')}>
                ¿Qué estás pensando?
            </button>
        </div>
    )
}

export default FeedCreate