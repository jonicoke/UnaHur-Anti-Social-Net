import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/components/home/sugeridos.css'
import type { User } from '../../types'
import { useAuth } from '../../context/authContext';
import { followUser, unfollowUser } from '../../services/api'; 

const BASE_URL = 'http://localhost:3001'

interface Props {
    siguiendoIds: number[]
    onToggleSeguir: (userId: number, nuevoEstado: boolean) => void
}

function Sugeridos({ siguiendoIds, onToggleSeguir }: Props) {
    const { usuario } = useAuth()

    const [usuarios, setUsuarios] = useState<User[]>([])
    const [cargandoIds, setCargandoIds] = useState<number[]>([])
    const yaCargado = useRef(false)

    useEffect(() => {
        if (!usuario) return
        if (yaCargado.current) return // ya se cargó una vez, no recargar al cambiar siguiendoIds
        yaCargado.current = true

        fetch(`${BASE_URL}/users`)
            .then(r => r.json())
            .then(data => setUsuarios(
                data.filter((u: User) =>
                    u.nickName !== usuario?.nickName &&
                    !siguiendoIds.includes(u.id)
                ).slice(0, 4)
            ))
    }, [usuario, siguiendoIds])

    const handleSeguirToggle = async (id: number, yaLoSigo: boolean) => {
        if (!usuario || !usuario.id) return
        setCargandoIds(prev => [...prev, id])

        try {
            if (yaLoSigo) {
                await unfollowUser(id, usuario.id)
                onToggleSeguir(id, false)
            } else {
                await followUser(id, usuario.id)
                onToggleSeguir(id, true)
            }
        } catch (error) {
            console.error("Error al cambiar seguimiento desde sugeridos:", error)
        } finally {
            setCargandoIds(prev => prev.filter(i => i !== id))
        }
    }

    return (
        <div className="suggestions-card">
            <h4>Quizás los conozcas</h4>
            {usuarios.map(user => {
                const cargando = cargandoIds.includes(user.id)
                const yaLoSigo = siguiendoIds.includes(user.id)
                return (
                    <div className="suggestion-item" key={user.id}>
                        <Link to={`/profile/${user.id}`} className="suggestion-item-link">
                            {user.fotoPerfil ? (
                                <img src={user.fotoPerfil} alt={user.nickName} className="avatar-img" />
                            ) : (
                                <i className="bi bi-person-circle"></i>
                            )}
                            <div>
                                <strong>{user.nickName}</strong>
                                <p>{user.instituto ?? 'UNAHUR'}</p>
                            </div>
                        </Link>
                        <button
                            className={`seguir-btn ${yaLoSigo ? 'seguir-btn--seguido' : 'seguir-btn--idle'}`}
                            onClick={() => handleSeguirToggle(user.id, yaLoSigo)}
                            disabled={cargando}
                        >
                            {cargando ? <span className="seguir-spinner" /> : (yaLoSigo ? 'Siguiendo' : '+ Seguir')}
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default Sugeridos