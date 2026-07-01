import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post, Comment } from '../../types'
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
    const instKey = post.User?.instituto ?? null
    const config  = instKey ? INSTITUTOS_CONFIG[instKey] : null
    const delay   = Math.min(index * 80, 400)
    const perfilUrl = post.User?.id ? `/profile/${post.User.id}` : '#'
    const esMiPost = usuario?.id === post.User?.id

    // para comentar post
    const [mostrarFormComentario, setMostrarFormComentario] = useState(false)
    const [nuevoComentario, setNuevoComentario] = useState('')
    const [enviando, setEnviando] = useState(false)

    const handleEnviarComentario = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nuevoComentario.trim() || !usuario?.id) return
        setEnviando(true)
        try {
            const res = await fetch(`http://localhost:3001/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: nuevoComentario,
                    postId: post.id,
                    userId: usuario.id
                })
            })
            const creado = await res.json()
            setComentarios(prev => [...prev, { ...creado, User: usuario }])
            setNuevoComentario('')
            setMostrarFormComentario(false)
        } catch {
            console.error('Error al comentar')
        } finally {
            setEnviando(false)
        }
    }

    const [cargando, setCargando] = useState(false)
    const [siguiendo, setSiguiendo] = useState<boolean>(
        post.User?.Seguidores?.some((s: any) => s.id === usuario?.id) ?? false
    )
    const [comentarios, setComentarios] = useState<Comment[]>([])

    useEffect(() => {
        if (post.User?.id) {
            setSiguiendo(siguiendoIds.includes(post.User.id))
        }
    }, [siguiendoIds, post.User?.id])

    useEffect(() => {
        fetch(`http://localhost:3001/comments/post/${post.id}`)
            .then(r => r.json())
            .then(data => setComentarios(Array.isArray(data) ? data : []))
            .catch(() => {})
    }, [post.id])

    const handleSeguirToggle = async () => {
        if (!usuario || !usuario.id || !post.User?.id) return
        setCargando(true)

        try {
            if (siguiendo) {
                await unfollowUser(post.User.id, usuario.id)
                onToggleSeguir(post.User.id, false)
            } else {
                await followUser(post.User.id, usuario.id)
                onToggleSeguir(post.User.id, true)
            }
        } catch (error) {
            console.error("Error al cambiar seguimiento desde el feed:", error)
        } finally {
            setCargando(false)
        }
    }

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

                        {!esMiPost && post.User?.id && (
                            <button
                                onClick={handleSeguirToggle}
                                disabled={cargando}
                                className={`feed-seguir-btn ${siguiendo ? 'siguiendo' : 'seguir'}`}
                            >
                                {cargando ? <span className="feed-seguir-spinner" /> : (siguiendo ? 'Siguiendo' : 'Seguir')}
                            </button>
                        )}

                        {config && (
                            <span className="post-user-institute-tag" style={{ backgroundColor: config.color, marginLeft: 'auto' }}>
                                {config.name}
                            </span>
                        )}
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
                <button
                    className={`action-btn ${mostrarFormComentario ? 'activo' : ''}`}
                    onClick={() => setMostrarFormComentario(!mostrarFormComentario)}
                >
                    <i className="bi bi-chat-left-text"></i>
                    <span>{comentarios.length} comentario{comentarios.length !== 1 ? 's' : ''}</span>
                </button>
                <button className="action-btn">
                    <i className="bi bi-share"></i>
                    <span>Compartir</span>
                </button>
                <Link to={`/post/${post.id}`} className="post-ver-mas-action">
                    Ver más <i className="bi bi-arrow-right-short"></i>
                </Link>
            </div>

            {/* FORMULARIO INLINE */}
            {mostrarFormComentario && (
                <form className="post-comment-form" onSubmit={handleEnviarComentario}>
                    <div className="post-comment-form-row">
                        {usuario?.fotoPerfil ? (
                            <img src={usuario.fotoPerfil} alt={usuario.nickName} className="avatar-img" />
                        ) : (
                            <i className="bi bi-person-circle"></i>
                        )}
                        <input
                            type="text"
                            className="post-comment-input"
                            placeholder="Escribí un comentario..."
                            value={nuevoComentario}
                            onChange={e => setNuevoComentario(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="post-comment-send"
                            disabled={!nuevoComentario.trim() || enviando}
                        >
                            {enviando ? <span className="feed-seguir-spinner" /> : <i className="bi bi-send-fill"></i>}
                        </button>
                    </div>
                </form>
            )}

            {/* PREVIEW DEL ÚLTIMO COMENTARIO */}
            {comentarios.length > 0 && (
                <div className="post-comment-preview">
                    <div className="post-comment-preview-avatar">
                        {comentarios[comentarios.length - 1].User?.fotoPerfil ? (
                            <img 
                                src={comentarios[comentarios.length - 1].User?.fotoPerfil ?? ''} 
                                alt={comentarios[comentarios.length - 1].User?.nickName ?? ''} 
                                className="avatar-img" 
                            />) : (
                            <i className="bi bi-person-circle"></i>
                        )}
                    </div>
                    <div className="post-comment-preview-body">
                        <div className="post-comment-preview-header">
                            <strong>{comentarios[comentarios.length - 1].User?.nickName ?? 'Usuario'}</strong>
                            <span className="post-comment-time">{timeAgo(comentarios[comentarios.length - 1].createdAt)}</span>
                        </div>
                        <p>{comentarios[comentarios.length - 1].content}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostCard