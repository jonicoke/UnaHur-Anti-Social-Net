import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components/home/profileCard.css'; 


interface Post {
  id: number;
  description: string;
}

export const Perfil: React.FC = () => {
  const { usuario, logout } = useAuth(); 
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || !usuario.id) return;

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts?userId=${usuario.id}`);
        if (!response.ok) throw new Error('Error al cargar las publicaciones');
        
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error al buscar los posts del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [usuario]);

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  if (!usuario) return <div>Cargando datos de usuario...</div>;

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        {/* NICKNAME USUARIOO */}
        <h2>Perfil de: <span className="nickname-highlight">{usuario.nickName}</span></h2>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </header>

      <section className="perfil-posts-section">
        <h3>Mis Publicaciones</h3>
        
        {loading ? (
          <p>Cargando tus publicaciones...</p>
        ) : posts.length === 0 ? (
          <p className="no-posts-msg">Aún no has realizado ninguna publicación[cite: 53].</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <p className="post-description">{post.description}</p>
                <div className="post-footer">
                  <Link to={`/post/${post.id}`} className="btn-ver-mas">
                    Ver más
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Perfil;