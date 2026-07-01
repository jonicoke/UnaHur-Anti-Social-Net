import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts, getPostImages, getPostsByUser } from '../services/api'
import { useAuth } from '../context/authContext'
import type { Post } from '../types'
import '../styles/pages/home.css'
import '../styles/animations.css'
import { useReveal } from '../hooks/useReveal'

import HomeBanner     from '../components/home/HomeBanner'
import FeedCreate     from '../components/home/FeedCreate'
import PostCard       from '../components/home/PostCard'
import MainLayout from '../components/layout/MainLayout';
import FiltroInstituto, { INSTITUTOS_CONFIG } from '../components/home/FiltroInstituto';

const PAGE_SIZE = 2

function Home() {
    const [allPosts,      setAllPosts]      = useState<Post[]>([])
    const [visiblePosts,  setVisiblePosts]  = useState<Post[]>([])
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

    const [institutoFilter, setInstitutoFilter] = useState<string | null>(null)
    const [page,    setPage]    = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading] = useState(false)
    const loaderRef  = useRef<HTMLDivElement>(null)
    const layoutRef  = useReveal([visiblePosts])
    const { usuario } = useAuth()
    // Estado para comunicar el MobileFooter
    // const [abrirFeedCreate, setAbrirFeedCreate] = useState(false);

    // Orden de los posts
    const [orden, setOrden] = useState<'recientes' | 'destacados'>('recientes')
    useEffect(() => {
        let result = institutoFilter
            ? allPosts.filter(post => {
                const inst = post.User?.instituto || (post.id % 2 === 0 ? 'Tec. e Ingenieria' : 'Biotecnologia')
                return inst === institutoFilter
            })
            : [...allPosts]

        if (orden === 'destacados') {
            result = [...result].sort((a, b) => (b.comentariosCount ?? 0) - (a.comentariosCount ?? 0))
        }

        setFilteredPosts(result)
        setVisiblePosts(result.slice(0, PAGE_SIZE))
        setPage(1)
        setHasMore(result.length > PAGE_SIZE)
    }, [allPosts, institutoFilter, orden])



    // Función reutilizable para cargar y actualizar los posts con imágenes
    const actualizarFeed = () => {
        getPosts().then(async data => {
            const postsConTodo = await Promise.all(
                data.map(async post => {
                    const [images, comentarios] = await Promise.all([
                        getPostImages(post.id),
                        fetch(`http://localhost:3001/comments/post/${post.id}`).then(r => r.json())
                    ])
                    return { 
                        ...post, 
                        PostImages: images,
                        comentariosCount: Array.isArray(comentarios) ? comentarios.length : 0
                    }
                })
            )
            setAllPosts(postsConTodo.reverse())
        })
    }

    // Cargar posts con imágenes al iniciar el componente
    useEffect(() => {
        actualizarFeed()
    }, [])

    // Filtro por instituto
    useEffect(() => {
        const result = institutoFilter
            ? allPosts.filter(post => {
                const inst = post.User?.instituto || (post.id % 2 === 0 ? 'Tec. e Ingenieria' : 'Biotecnologia')
                return inst === institutoFilter
            })
            : allPosts

        setFilteredPosts(result)
        setVisiblePosts(result.slice(0, PAGE_SIZE))
        setPage(1)
        setHasMore(result.length > PAGE_SIZE)
    }, [allPosts, institutoFilter])

    // Scroll infinito
    const loadMore = useCallback(() => {
        if (loading) return;

        const nextPage = page + 1;
        const next = filteredPosts.slice(0, nextPage * PAGE_SIZE);

        setVisiblePosts(next);
        setPage(nextPage);
        setHasMore(next.length < filteredPosts.length);
    }, [page, filteredPosts, loading]);

    useEffect(() => {
        if (filteredPosts.length === 0) return
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) loadMore()
        }, { threshold: 0.5 })
        if (loaderRef.current) observer.observe(loaderRef.current)
        return () => observer.disconnect()
    }, [loadMore, hasMore, loading, filteredPosts])

    return (
        <MainLayout
            layoutRef={layoutRef}
            sidebarRightExtra={
                <FiltroInstituto
                    institutoFilter={institutoFilter}
                    onFilterChange={setInstitutoFilter}
                />
            }
        >
            {({ siguiendoIds, onToggleSeguir }) => (
                <>
                    <HomeBanner />
                    {institutoFilter && (
                        <div className="filter-alert">
                            <span>Mostrando: <strong>{INSTITUTOS_CONFIG[institutoFilter]?.name}</strong></span>
                            <button onClick={() => setInstitutoFilter(null)}>Quitar filtro</button>
                        </div>
                    )}
                    <FeedCreate
                        onPostCreated={actualizarFeed}
                        fotoPerfil={usuario?.fotoPerfil ?? null}
                    />
                    {/* SELECTOR DE ORDEN */}
                        <div className="feed-orden">
                            <span>Ordenar por</span>
                            <button
                                className={`feed-orden-btn ${orden === 'recientes' ? 'activo' : ''}`}
                                onClick={() => setOrden('recientes')}
                            >
                                <i className="bi bi-clock"></i> Recientes
                            </button>
                            <button
                                className={`feed-orden-btn ${orden === 'destacados' ? 'activo' : ''}`}
                                onClick={() => setOrden('destacados')}
                            >
                                <i className="bi bi-fire"></i> Destacados
                            </button>
                        </div>
                    {visiblePosts.map((post, index) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            index={index}
                            siguiendoIds={siguiendoIds}
                            onToggleSeguir={onToggleSeguir}
                        />
                    ))}
                    <div ref={loaderRef} className="feed-loader">
                        {loading && <span className="feed-loader-dot"></span>}
                    </div>
                </>
            )}
        </MainLayout>
    )
}

export default Home