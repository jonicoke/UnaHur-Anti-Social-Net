import { useEffect, useState } from 'react'
import '../../styles/components/home/sugeridos.css'
import type { User } from '../../types'
import { useAuth } from '../../context/authContext';

const BASE_URL = 'http://localhost:3001'

type EstadoSeguir = 'idle' | 'cargando' | 'seguido'

function Sugeridos() {
    const { usuario } = useAuth()

    const [usuarios, setUsuarios] = useState<User[]>([])
    const [estados, setEstados] = useState<Record<number, EstadoSeguir>>({})

    useEffect(() => {
        fetch(`${BASE_URL}/users`)
            .then(r => r.json())
            .then(data => setUsuarios(data.filter((u: User) => u.nickName !== usuario?.nickName).slice(0, 4)))
    }, [])

    const handleSeguir = (id: number) => {
        if (estados[id] === 'seguido') return

        setEstados(prev => ({ ...prev, [id]: 'cargando' }))

        // Simulá tu llamada real a la API acá
        setTimeout(() => {
            setEstados(prev => ({ ...prev, [id]: 'seguido' }))
        }, 1000)
    }

    return (
        <div className="suggestions-card">
            <h4>Quizás los conozcas</h4>
            {usuarios.map(user => {
                const estado = estados[user.id] ?? 'idle'
                return (
                    <div className="suggestion-item" key={user.id}>
                        {user.fotoPerfil ? (
                            <img src={user.fotoPerfil} alt={user.nickName} className="avatar-img" />
                        ) : (
                            <i className="bi bi-person-circle"></i>
                        )}
                        <div>
                            <strong>{user.nickName}</strong>
                            <p>{user.instituto ?? 'UNAHUR'}</p>
                        </div>
                        <button
                            className={`seguir-btn seguir-btn--${estado}`}
                            onClick={() => handleSeguir(user.id)}
                            disabled={estado === 'cargando' || estado === 'seguido'}
                        >
                            {estado === 'idle' && '+ Seguir'}
                            {estado === 'cargando' && <span className="seguir-spinner" />}
                            {estado === 'seguido' && '✓ Seguido'}

                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default Sugeridos