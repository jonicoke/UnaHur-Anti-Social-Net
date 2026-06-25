import { Link } from 'react-router-dom'
import type { Post } from '../../types'
import '../../styles/components/home/postCards.css'

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
}

function PostCard({ post, index }: Props) {
    const instKey = post.User?.instituto || (post.id % 2 === 0 ? 'Tec. e Ingenieria' : 'Biotecnologia')
    const config  = INSTITUTOS_CONFIG[instKey] || { color: '#00843D', name: 'Salud' }
    const delay   = Math.min(index * 80, 400)

    return (
        <div className="post-card" data-reveal="up" data-reveal-delay={String(delay)}>
            <div className="post-card-header">
                <div className="post-avatar">
                    {post.User?.fotoPerfil ? (
                        <img src={post.User.fotoPerfil} alt={post.User.nickName} className="avatar-img" />
                    ) : (
                        <i className="bi bi-person-circle"></i>
                    )}
                </div>
                <div>
                <div className="post-header-user-row">
                    <strong>{post.User?.nickName ?? 'Usuario desconocido'}</strong>
                    <span className="post-user-institute-tag" style={{ backgroundColor: config.color }}>
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