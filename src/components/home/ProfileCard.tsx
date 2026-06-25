import '../../styles/components/home/profileCard.css'

interface Stats {
    posts: number
    comentarios: number
}

interface Props {
    nickName: string
    fotoPerfil: string | null
    instituto: string | null
    descripcion: string | null
    stats: Stats
}

function ProfileCard({ nickName, fotoPerfil, instituto, descripcion, stats }: Props) {
    return (
        <div className="profile-card" data-reveal="left" data-reveal-delay="0">
            <div className="profile-card-banner"></div>
            <div className="profile-card-avatar">
                {fotoPerfil ? (
                    <img src={fotoPerfil} alt={nickName} className="profile-avatar-img" />
                ) : (
                    <i className="bi bi-person-circle"></i>
                )}
            </div>
            <div className="profile-card-info">
                <h3>{nickName}</h3>
                {descripcion && <p className="profile-descripcion">{descripcion}</p>}
                {instituto && <span className="profile-instituto">{instituto}</span>}
            </div>
            <hr />
            <div className="profile-card-stats">
                <div><span>Posts</span><strong>{stats.posts}</strong></div>
                <div><span>Comentarios</span><strong>{stats.comentarios}</strong></div>
            </div>
            <hr />
        </div>
    )
}

export default ProfileCard