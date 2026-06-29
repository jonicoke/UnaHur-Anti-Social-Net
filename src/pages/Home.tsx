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
import ProfileCard    from '../components/home/ProfileCard'
import AccesosRapidos from '../components/home/AccesosRapidos'
import Tendencias     from '../components/home/Tendencias'
import Sugeridos      from '../components/home/Sugeridos'
import HomeFooter     from '../components/Footer'
import FiltroInstituto, { INSTITUTOS_CONFIG } from '../components/home/FiltroInstituto'

const PAGE_SIZE = 2

function Home() {
    const [allPosts,      setAllPosts]      = useState<Post[]>([])
    const [visiblePosts,  setVisiblePosts]  = useState<Post[]>([])
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
    const [institutoFilter, setInstitutoFilter] = useState<string | null>(null)
    const [page,    setPage]    = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [userStats, setUserStats] = useState({ posts: 0, comentarios: 0 })
    const loaderRef  = useRef<HTMLDivElement>(null)
    const layoutRef  = useReveal([visiblePosts])
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()

    // Stats del usuario
    useEffect(() => {
        if (!usuario?.id) return
        getPostsByUser(usuario.id).then(async posts => {
            const comentariosTotales = await Promise.all(
                posts.map((p: Post) =>
                    fetch(`http://localhost:3000/comments/post/${p.id}`)
                        .then(r => r.json())
                        .then(c => c.length)
                )
            )
            setUserStats({
                posts: posts.length,
                comentarios: comentariosTotales.reduce((a: number, b: number) => a + b, 0),
            })
        })
    }, [usuario])

    // Función reutilizable para cargar y actualizar los posts con imágenes
    const actualizarFeed = () => {
        getPosts().then(async data => {
            const postsConImagenes = await Promise.all(
                data.map(async post => {
                    const images = await getPostImages(post.id)
                    return { ...post, PostImages: images }
                })
            )
            setAllPosts(postsConImagenes.reverse())
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

    // Tendencias
    const topTrends = (() => {
        const counts: Record<string, { name: string; count: number }> = {}
        allPosts.forEach(post =>
            post.Tags?.forEach(tag => {
                if (!counts[tag.name]) counts[tag.name] = { name: tag.name, count: 0 }
                counts[tag.name].count++
            })
        )
        return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 4)
    })()

    return (
        <div className="home-layout" ref={layoutRef}>

            {/* IZQUIERDA */}
            <aside className="home-sidebar-left sticky-sidebar">
                <div className="">
                    <ProfileCard
                        nickName={usuario?.nickName ?? 'Invitado'}
                        fotoPerfil={usuario?.fotoPerfil ?? null}
                        instituto={usuario?.instituto ?? null}
                        descripcion={usuario?.descripcion ?? null}
                        stats={userStats}
                    />
                    <AccesosRapidos />
                </div>
            </aside>

            {/* FEED CENTRAL */}
            <main className="home-feed">
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

                {visiblePosts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                ))}

                <div ref={loaderRef} className="feed-loader">
                    {loading && <span className="feed-loader-dot"></span>}
                    {!hasMore && !loading && (
                        <p className="feed-end">Ya viste todo. Andate a hacer algo productivo.</p>
                    )}
                </div>
            </main>

            {/* DERECHA */}
            <aside className="home-sidebar-right">
                <FiltroInstituto
                    institutoFilter={institutoFilter}
                    onFilterChange={setInstitutoFilter}/>

                <Tendencias trends={topTrends} />

                <div className="sticky-sidebar">
                    <Sugeridos />
                    <HomeFooter />
                </div>
            </aside>

        </div>
    )
}

export default Home