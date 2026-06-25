import { useEffect, useState } from 'react'
import '../../styles/components/home/sugeridos.css'
import type { User } from '../../types'

const BASE_URL = 'http://localhost:3001'

function Sugeridos() {
    const [usuarios, setUsuarios] = useState<User[]>([])

    useEffect(() => {
        fetch(`${BASE_URL}/users`)
            .then(r => r.json())
            .then(data => setUsuarios(data.slice(0, 4)))
    }, [])

    return (
        <div className="suggestions-card" data-reveal="right" data-reveal-delay="200">
            <h4>Quizás los conozcas</h4>
            {usuarios.map(user => (
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
                    <button>+ Seguir</button>
                </div>
            ))}
        </div>
    )
}

export default Sugeridos