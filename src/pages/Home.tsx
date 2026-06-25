import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts } from '../services/api'
import { useAuth } from '../context/authContext'
import { Link } from "react-router-dom";
import type { Post } from '../types'
import '../styles/pages/home.css'

const PAGE_SIZE = 2

const INSTITUTOS_CONFIG: Record<string, { color: string, name: string }> = {
    'Tec. e Ingenieria': { color: '#e67e22', name: 'Tec. e Ingeniería' },
    'Biotecnologia': { color: '#0073bc', name: 'Biotecnología' },
    'Educacion': { color: '#c0392b', name: 'Educación' },
    'Salud Comunitaria': { color: '#00a69c', name: 'Salud Comunitaria' }
};

function Home() {
    const [allPosts, setAllPosts] = useState<Post[]>([])
    const [visiblePosts, setVisiblePosts] = useState<Post[]>([])
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
    const [institutoFilter, setInstitutoFilter] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const loaderRef = useRef<HTMLDivElement>(null)
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()

    // 1. Cargar todas las publicaciones de la API al iniciar
    useEffect(() => {
        getPosts().then(data => {
            setAllPosts(data)
        })
    }, [])

    // 2. Filtrar publicaciones según el instituto seleccionado
    useEffect(() => {
        let result = allPosts;
        
        if (institutoFilter) {
            result = allPosts.filter(post => {
                // Validación temporal por si el usuario aún no posee el atributo instituto de forma nativa
                const instUsuario = post.User?.instituto || (post.id % 2 === 0 ? 'Tec. e Ingenieria' : 'Biotecnologia');
                return instUsuario === institutoFilter;
            });
        }

        setFilteredPosts(result);
        setVisiblePosts(result.slice(0, PAGE_SIZE));
        setPage(1);
        setHasMore(result.length > PAGE_SIZE);
    }, [allPosts, institutoFilter])

    // 3. Control del Scroll Infinito sobre los elementos filtrados
    const loadMore = useCallback(() => {
        if (loading) return
        setLoading(true)
        setTimeout(() => {
            const nextPage = page + 1
            const next = filteredPosts.slice(0, nextPage * PAGE_SIZE)
            setVisiblePosts(next)
            setPage(nextPage)
            setHasMore(next.length < filteredPosts.length)
            setLoading(false)
        }, 400)
    }, [page, filteredPosts, loading])

    useEffect(() => {
        if (filteredPosts.length === 0) return

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) loadMore()
        }, { threshold: 0.5 })

        if (loaderRef.current) observer.observe(loaderRef.current)
        return () => observer.disconnect()
    }, [loadMore, hasMore, loading, filteredPosts])

// TENDENCIAS
// Obtener los 4 tags más repetidos de forma dinámica
const topTrends = (() => {
    const tagCounts: Record<string, { name: string; count: number }> = {};

    allPosts.forEach(post => {
        post.Tags?.forEach(tag => {
            if (!tagCounts[tag.name]) {
                tagCounts[tag.name] = { name: tag.name, count: 0 };
            }
            tagCounts[tag.name].count += 1;
        });
    });

    return Object.values(tagCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);
})();

    return (
        <div className="home-layout">

            <aside className="home-sidebar-left ">
                <section className="sticky-sidebar">
                    <div className="profile-card ">
                        <div className="profile-card-banner"></div>
                        <div className="profile-card-avatar">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="profile-card-info">
                            <h3>{usuario?.nickName ?? 'Invitado'}</h3>
                            <p>Desarrollador Frontend · UNAHUR</p>
                            <span>Buenos Aires, Argentina</span>
                        </div>
                        <hr />
                        <div className="profile-card-stats">
                            <div><span>Posts</span><strong>12</strong></div>
                            <div><span>Comentarios</span><strong>34</strong></div>
                        </div>
                        <hr />

                    
                    </div>
                    {/* NUEVA SECCIÓN: Accesos Rápidos */}
                    <div className="suggestions-card accesos-rapidos-card ">
                        <h4>ACCESOS RÁPIDOS</h4>
                        <a href="https://unahur.edu.ar/calendario-academico/" target="_blank" rel="noreferrer" className="acceso-item">
                            <span className="icon-box geo-green"><i className="bi bi-calendar3"></i></span>
                            <span>Calendario</span>
                        </a>
                        <a href="https://unahur.edu.ar/biblioteca/" target="_blank" className="acceso-item">
                            <span className="icon-box geo-blue"><i className="bi bi-book"></i></span>
                        <span>Biblioteca</span>
                        </a>
                        <a href="https://campus.unahur.edu.ar/" target="_blank" className="acceso-item">
                            <span className="icon-box geo-cyan"><i className="bi bi-laptop"></i></span>
                            <span>Campus virtual</span>
                        </a>
                        <a href="https://servicios.unahur.edu.ar/unahur3w/ "target="_blank" className="acceso-item">
                            <span className="icon-box geo-orange"><i className="bi bi-mortarboard"></i></span>
                            <span>SIU Guaraní</span>
                        </a>
                    </div>
                </section>
            </aside>

            <main className="home-feed">
                <div className="home-banner">
                    <div className="home-banner-content">
                        <h1>UNAHUR Anti-Social Net</h1>

                        <p>
                            La red donde los estudiantes comparten proyectos,
                            sobreviven a los parciales y fingen no socializar.
                        </p>
                    </div>
                </div>
                 {/* Filtro activo info */}
                {institutoFilter && (
                    <div className="filter-alert">
                        <span>Mostrando contenido de: <strong>{INSTITUTOS_CONFIG[institutoFilter]?.name}</strong></span>
                        <button onClick={() => setInstitutoFilter(null)}>Quitar filtro</button>
                    </div>
                )}
                <div className="feed-create">
                    <i className="bi bi-person-circle feed-create-avatar"></i>
                    <button className="feed-create-btn" onClick={() => navigate('/new-post')}>
                        ¿Qué estás pensando?
                    </button>
                </div>

                {/* Iteración de Publicaciones */}
                {visiblePosts.map(post => {
                    // Asignación de color simulada en base al ID o propiedad si existe
                    const instKey = post.User?.instituto || (post.id % 2 === 0 ? 'Tec. e Ingenieria' : 'Biotecnologia');
                    const config = INSTITUTOS_CONFIG[instKey] || { color: '#00843D', name: 'UNAHUR' };

                    return (
                        <div 
                            className="post-card" 
                            key={post.id} 
                            style={{ '--post-border-color': config.color } as React.CSSProperties}
                        >
                            <div className="post-card-header">
                                <i className="bi bi-person-circle post-avatar"></i>
                                <div>
                                    <div className="post-header-user-row">
                                        <strong>{post.User?.nickName ?? 'Usuario desconocido'}</strong>
                                        <span className="post-user-institute-tag" style={{ backgroundColor: config.color }}>
                                            {config.name}
                                        </span>
                                    </div>
                                    <p>hace un momento</p>
                                </div>
                            </div>
                            <p className="post-description">{post.description}</p>
                            
                            {post.Tags?.length > 0 && (
                                <div className="post-tags">
                                    {post.Tags.map(tag => (
                                        <span className="tag" key={tag.id}>#{tag.name}</span>
                                    ))}
                                </div>
                            )}

                            {/* NUEVO PIE DE POST: Comentarios, Compartir y Ver más */}
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
                    );
                })}


                <div ref={loaderRef} className="feed-loader">
                    {loading && <span className="feed-loader-dot"></span>}
                    {!hasMore && !loading && (
                        <p className="feed-end">Ya viste todo. Andate a hacer algo productivo.</p>
                    )}
                </div>
            </main>

            <aside className="home-sidebar-right">

                                    {/* NUEVA SECCIÓN: Filtro por Institutos */}
                    <div className="suggestions-card">
                        <h4>INSTITUTOS</h4>
                        <div className="institutos-grid">
                            <button 
                                className={`inst-btn tec ${institutoFilter === 'Tec. e Ingenieria' ? 'active' : ''}`}
                                onClick={() => setInstitutoFilter(institutoFilter === 'Tec. e Ingenieria' ? null : 'Tec. e Ingenieria')}
                            >
                                Tec. e Ingeniería
                            </button>
                            <button 
                                className={`inst-btn bio ${institutoFilter === 'Biotecnologia' ? 'active' : ''}`}
                                onClick={() => setInstitutoFilter(institutoFilter === 'Biotecnologia' ? null : 'Biotecnologia')}
                            >
                                Biotecnología
                            </button>
                            <button 
                                className={`inst-btn edu ${institutoFilter === 'Educacion' ? 'active' : ''}`}
                                onClick={() => setInstitutoFilter(institutoFilter === 'Educacion' ? null : 'Educacion')}
                            >
                                Educación
                            </button>
                            <button 
                                className={`inst-btn salud ${institutoFilter === 'Salud Comunitaria' ? 'active' : ''}`}
                                onClick={() => setInstitutoFilter(institutoFilter === 'Salud Comunitaria' ? null : 'Salud Comunitaria')}
                            >
                                Salud Comunitaria
                            </button>
                        </div>
                    </div>
                <div className="suggestions-card">
                    <h4>TENDENCIAS</h4>
                    <div className="trend-tag-container">
                        {topTrends.length > 0 ? (
                            topTrends.map((trend, index) => (
                                <div className="trend-item" key={trend.name}>
                                    {/* Le pasamos el índice (0, 1, 2 o 3) en una variable CSS para manejar los colores en el CSS */}
                                    <div className="trend-hashtag-box" data-index={index}>
                                        #
                                    </div>
                                    <div className="trend-info">
                                        <span className="trend-name">#{trend.name}</span>
                                        <small className="trend-count">
                                            {trend.count} {trend.count === 1 ? 'post' : 'posts'}
                                        </small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-trends">No hay tendencias aún.</p>
                        )}
                    </div>
                </div>
                <div className="sticky-sidebar">
                    <div className="suggestions-card">
                        <h4>Quizás los conozcas</h4>
                        {['luna', 'sol', 'marcos', 'vale'].map(nick => (
                            <div className="suggestion-item" key={nick}>
                                <i className="bi bi-person-circle"></i>
                                <div>
                                    <strong>{nick}</strong>
                                    <p>UNAHUR</p>
                                </div>
                                <button>+ Seguir</button>
                            </div>
                        ))}
                    </div>
                    <footer className="home-footer">
                        <div className="footer-links">
                            <a href="#">Acerca de</a>
                            <a href="#">Centro de ayuda</a>
                            <a href="#">Normas de la comunidad</a>
                            <a href="#">Privacidad y condiciones</a>
                            <a href="#">Etiquetas</a>
                            <a href="#">Proyectos</a>
                            <a href="#">Comunidad</a>
                        </div>

                        <p>
                            UNAHUR Anti-Social Net © 2026
                        </p>
                    </footer>
                </div>
            </aside>

        </div>
    )
}

export default Home