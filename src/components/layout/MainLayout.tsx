// src/components/layout/MainLayout.tsx
import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import { getPostsByUser, getPosts } from "../../services/api"
import type { Post } from "../../types"

import ProfileCard    from "../home/ProfileCard"
import AccesosRapidos from "../home/AccesosRapidos"
import Tendencias     from "../home/Tendencias"
import Sugeridos      from "../home/Sugeridos"
import HomeFooter     from "../Footer"

interface Props {
    children: React.ReactNode
    sidebarRightExtra?: React.ReactNode
    layoutRef?: React.Ref<HTMLDivElement>   // nuevo
 
}

function MainLayout({ children, sidebarRightExtra, layoutRef }: Props) {
    const { usuario } = useAuth()
    const [userStats, setUserStats] = useState({ posts: 0, comentarios: 0 })
    const [topTrends, setTopTrends] = useState<{ name: string; count: number }[]>([])

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
                {children}
            </main>

            <aside className="home-sidebar-right">
                {sidebarRightExtra}
                <Tendencias trends={topTrends} />
                <div className="sticky-sidebar">
                    <Sugeridos />
                    <HomeFooter />
                </div>
            </aside>
        </div>
    )
}

export default MainLayout