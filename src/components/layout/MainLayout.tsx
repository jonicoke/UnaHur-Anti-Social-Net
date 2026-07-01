// src/components/layout/MainLayout.tsx
import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import { getPostsByUser, getPosts, getUserById } from "../../services/api"
import type { Post } from "../../types"

import ProfileCard    from "../home/ProfileCard"
import AccesosRapidos from "../home/AccesosRapidos"
import Tendencias     from "../home/Tendencias"
import Sugeridos      from "../home/Sugeridos"
import HomeFooter     from "../Footer"

interface RenderProps {
    siguiendoIds: number[]
    onToggleSeguir: (userId: number, nuevoEstado: boolean) => void
}

interface Props {
    children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
    sidebarRightExtra?: React.ReactNode
    layoutRef?: React.Ref<HTMLDivElement>
}

function MainLayout({ children, sidebarRightExtra, layoutRef }: Props) {
    const { usuario } = useAuth()
    const [userStats, setUserStats] = useState({ posts: 0, comentarios: 0 })
    const [topTrends, setTopTrends] = useState<{ name: string; count: number }[]>([])
    const [siguiendoIds, setSiguiendoIds] = useState<number[] | null>(null);

    useEffect(() => {
        if (!usuario?.id) return
        getPostsByUser(usuario.id).then(async (posts: Post[]) => {
            const comentariosTotales = await Promise.all(
                posts.map((p) =>
                    fetch(`http://localhost:3001/comments/post/${p.id}`)
                        .then(r => r.json())
                        .then(c => c.length)
                )
            )
            setUserStats({
                posts: posts.length,
                comentarios: comentariosTotales.reduce((a, b) => a + b, 0),
            })
        })
    }, [usuario])

    useEffect(() => {
        getPosts().then((data: Post[]) => {
            const counts: Record<string, { name: string; count: number }> = {}
            data.forEach(post =>
                post.Tags?.forEach(tag => {
                    if (!counts[tag.name]) counts[tag.name] = { name: tag.name, count: 0 }
                    counts[tag.name].count++
                })
            )
            setTopTrends(Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 4))
        })
    }, [])

    // Trae a quién sigue el usuario logueado (fuente única de verdad)
    useEffect(() => {
        if (!usuario?.id) return
        getUserById(usuario.id).then(data => {
            const ids = (data.Siguiendo ?? []).map((u: any) => u.id);
            setSiguiendoIds(ids);
        })
    }, [usuario])

    const handleToggleSeguir = (userId: number, nuevoEstado: boolean) => {
        setSiguiendoIds(prev =>
            nuevoEstado
                ? [...prev, userId]
                : prev.filter(id => id !== userId)
        )
    }

    return (
        <div className="home-layout" ref={layoutRef}>
            <aside className="home-sidebar-left sticky-sidebar">
                <div>
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

            <main className="home-feed">
                {typeof children === "function"
                    ? children({ siguiendoIds, onToggleSeguir: handleToggleSeguir })
                    : children}
            </main>

            <aside className="home-sidebar-right">
                {sidebarRightExtra}
                <Tendencias trends={topTrends} />
                <div className="sticky-sidebar">
                    <Sugeridos
                        siguiendoIds={siguiendoIds}
                        onToggleSeguir={handleToggleSeguir}
                    />
                    <HomeFooter />
                </div>
            </aside>
        </div>
    )
}

export default MainLayout