import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts } from '../services/api'
import { useAuth } from '../context/authContext'
import type { Post } from '../types'
import '../styles/pages/home.css'

function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        getPosts().then(data => setPosts(data.slice(0,5)))
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="home-layout">

            {/* COLUMNA IZQUIERDA - Perfil */}
            <aside className="home-sidebar-left">
                <div className="profile-card">
                    <div className="profile-card-banner"></div>
                    <div className="profile-card-avatar">
                        <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="profile-card-info">
                        <h3>{usuario?.nickName}</h3>
                        <p>Desarrollador Frontend · UNAHUR</p>
                        <span>Buenos Aires, Argentina</span>
                    </div>
                    <hr />
                    <div className="profile-card-stats">
                        <div>
                            <span>Publicaciones</span>
                            <strong>12</strong>
                        </div>
                        <div>
                            <span>Comentarios</span>
                            <strong>34</strong>
                        </div>
                    </div>
                    <hr />
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* COLUMNA CENTRAL - Feed */}
            <main className="home-feed">
                <div className="feed-create">
                    <i className="bi bi-person-circle feed-create-avatar"></i>
                    <button className="feed-create-btn">Crear publicación...</button>
                </div>

                {posts.length === 0 && <p className="feed-loading">Cargando publicaciones...</p>}

                {posts.map(post => (
                    <div className="post-card" key={post.id}>
                        <div className="post-card-header">
                            <i className="bi bi-person-circle post-avatar"></i>
                            <div>
                                <strong>Usuario #{post.userId}</strong>
                                <p>hace un momento</p>
                            </div>
                        </div>
                        <p className="post-description">{post.description}</p>
                        {post.tags?.length > 0 && (
                            <div className="post-tags">
                                {post.tags.map(tag => (
                                    <span className="tag" key={tag.id}>#{tag.name}</span>
                                ))}
                            </div>
                        )}
                        <div className="post-footer">
                            <a href={`/post/${post.id}`} className="post-ver-mas">Ver más →</a>
                        </div>
                    </div>
                ))}
            </main>

            {/* COLUMNA DERECHA - Sugeridos + Footer */}
            <aside className="home-sidebar-right">
                <div className="suggestions-card">
                    <h4>Quizás los conozcas</h4>
                    {[1, 2, 3].map(n => (
                        <div className="suggestion-item" key={n}>
                            <i className="bi bi-person-circle"></i>
                            <div>
                                <strong>Usuario {n}</strong>
                                <p>UNAHUR</p>
                            </div>
                            <button>+ Seguir</button>
                        </div>
                    ))}
                </div>
                <footer className="home-footer">
                    <p>UnaHur Anti-Social Net · 2025</p>
                    <p>Construcción de Interfaces de Usuario</p>
                </footer>
            </aside>

        </div>
    )
}

export default Home