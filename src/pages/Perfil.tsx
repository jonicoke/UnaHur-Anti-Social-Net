import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Ajustado con 'a' minúscula para resolver el conflicto
import '../styles/components/home/profileCard.css'; 
import '../styles/pages/perfil.css';

interface PostConComentarios {
  id: number;
  description: string;
  cantidadComentarios: number;
}

export const Perfil: React.FC = () => {
  const { usuario, logout } = useAuth(); 
  const [posts, setPosts] = useState<PostConComentarios[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || !usuario.id) return;

    const fetchPostsYComentarios = async () => {
      try {
        const resPosts = await fetch(`http://localhost:3000/posts?userId=${usuario.id}`);
        if (!resPosts.ok) throw new Error('Error al cargar las publicaciones');
        const listaPosts = await resPosts.json();

        const postsCompletos = await Promise.all(
          listaPosts.map(async (post: any) => {
            try {
              const resComments = await fetch(`http://localhost:3000/comments/post/${post.id}`);
              if (resComments.ok) {
                const comentarios = await resComments.json();
                return {
                  ...post,
                  cantidadComentarios: comentarios.length
                };
              }
            } catch (err) {
              console.error(`Error al traer comentarios del post ${post.id}`, err);
            }
            return { ...post, cantidadComentarios: 0 };
          })
        );

        setPosts(postsCompletos);
      } catch (error) {
        console.error("Error al buscar los posts del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsYComentarios();
  }, [usuario]);

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  if (!usuario) return <div>Cargando datos de usuario...</div>;

  return (
    <div className="perfil-container">
      <header className="perfil-header">
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
          <p className="no-posts-msg">Aún no has realizado ninguna publicación.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <p className="post-description">{post.description}</p>
                
                <div className="post-footer">
                  <span className="comments-count">
                    Comentarios visibles: {post.cantidadComentarios}
                  </span>
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