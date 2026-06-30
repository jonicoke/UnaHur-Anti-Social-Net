import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post } from '../../types'
import '../../styles/components/home/postCards.css'
import { useAuth } from '../../context/authContext'
import { followUser, unfollowUser } from '../../services/api'

const INSTITUTOS_CONFIG: Record<string, { color: string; name: string }> = {
    'Tec. e Ingenieria':  { color: '#e67e22', name: 'Tec. e Ingeniería' },
    'Biotecnologia':      { color: '#0073bc', name: 'Biotecnología' },
    'Educacion':          { color: '#c0392b', name: 'Educación' },
    'Salud Comunitaria':  { color: '#00a69c', name: 'Salud Comunitaria' },
}

function timeAgo(dateStr: string) {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins < 1)   return 'justo ahora'
    if (mins < 60)  return `hace ${mins} min`
    if (hours < 24) return `hace ${hours} h`
    return `hace ${days} día${days !== 1 ? 's' : ''}`
}

interface Props {
    post: Post
    index: number
    siguiendoIds: number[]
    onToggleSeguir: (userId: number, nuevoEstado: boolean) => void
}

function PostCard({ post, index, siguiendoIds, onToggleSeguir }: Props) {
    const { usuario } = useAuth()
    const instKey = post.User?.instituto || (post.id % 2 === 0 ? 'Tec. e Ingenieria' : 'Biotecnologia')
    const config  = INSTITUTOS_CONFIG[instKey] || { color: '#00843D', name: 'Salud' }
    const delay   = Math.min(index * 80, 400)
    const perfilUrl = post.User?.id ? `/profile/${post.User.id}` : '#';
    const esMiPost = usuario?.id === post.User?.id;

    // Estado local para alternar el botón de seguir en este post específico
    const [cargando, setCargando] = useState(false);
    const [siguiendo, setSiguiendo] = useState<boolean>(
        post.User?.Seguidores?.some((s: any) => s.id === usuario?.id) ?? false
    );

    useEffect(() => {
        if (post.User?.id) {
            setSiguiendo(siguiendoIds.includes(post.User.id));
        }
    }, [siguiendoIds, post.User?.id]);

     const handleSeguirToggle = async () => {
        if (!usuario || !usuario.id || !post.User?.id) return;
        setCargando(true);

        try {
            if (siguiendo) {
                await unfollowUser(post.User.id, usuario.id);
                onToggleSeguir(post.User.id, false);
            } else {
                await followUser(post.User.id, usuario.id);
                onToggleSeguir(post.User.id, true);
            }
        } catch (error) {
            console.error("Error al cambiar seguimiento desde el feed:", error);
        } finally {
            setCargando(false);
        }
    };
    
    return (
        <div className="post-card" data-reveal="up" data-reveal-delay={String(delay)}>
            <div className="post-card-header">
                <div className="post-avatar">
                    <Link to={perfilUrl}>
                        {post.User?.fotoPerfil ? (
                            <img src={post.User.fotoPerfil} alt={post.User.nickName} className="avatar-img" />
                        ) : (
                            <i className="bi bi-person-circle" style={{ color: 'inherit' }}></i>
                        )}
                    </Link>
                </div>
                <div style={{ flex: 1 }}>
                    <div className="post-header-user-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to={perfilUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <strong>{post.User?.nickName ?? 'Usuario desconocido'}</strong>
                        </Link>
                        
                        {/* BOTÓN SEGUIR / DEJAR DE SEGUIR EN EL FEED */}
                        {!esMiPost && post.User?.id && (
                            <button 
                                onClick={handleSeguirToggle}
                                disabled={cargando}
                                className={`feed-seguir-btn ${siguiendo ? 'siguiendo' : 'seguir'}`}
                            >
                                {cargando ? <span className="feed-seguir-spinner" /> : (siguiendo ? 'Siguiendo' : 'Seguir')}
                            </button>
                        )}

                        <span className="post-user-institute-tag" style={{ backgroundColor: config.color, marginLeft: 'auto' }}>
                            {config.name}
                        </span>
                    </div>
                    <p>{timeAgo(post.createdAt)}</p>
                </div>
            </div>

            <p className="post-description">{post.description}</p>

            {post.PostImages?.length > 0 && (
                <div className="post-images">
                    {post.PostImages.map((img: { url: string }, i: number) => (
                        <img key={i} src={img.url} alt={`imagen ${i + 1}`} className="post-img" />
                    ))}
                </div>
            )}

            {post.Tags?.length > 0 && (
                <div className="post-tags">
                    {post.Tags.map(tag => (
                        <span className="tag" key={tag.id}>#{tag.name}</span>
                    ))}
                </div>
            )}

            <div className="post-footer-actions">
                <button className="action-btn">
                    <i className="bi bi-chat-left-text"></i>
                    <span>8 comentarios</span>
                </button>
                <button className="action-btn">
                    <i className="bi bi-share"></i>
                    <span>Compartir</span>
                </button>
                <Link to={`/post/${post.id}`} className="post-ver-mas-action">
                    Ver más <i className="bi bi-arrow-right-short"></i>
                </Link>
            </div>
        </div>
    )
}

export default PostCard