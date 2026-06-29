import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../styles/pages/perfil.css'; 
import { getPostsByUser, getCommentsByPost, deletePost } from '../services/api'; 
import type { Post } from '../types';

interface PostConComentarios extends Post {
  cantidadComentarios: number;
}

export const Perfil: React.FC = () => {
  const { usuario, logout } = useAuth(); 
  const [posts, setPosts] = useState<PostConComentarios[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || !usuario.id) return;

    const cargarPerfil = async () => {
      try {
        const listaPosts = await getPostsByUser(usuario.id);

        if (Array.isArray(listaPosts)) {
          const postsCompletos = await Promise.all(
            listaPosts.map(async (post: Post) => {
              try {
                const comentarios = await getCommentsByPost(post.id);
                return {
                  ...post,
                  cantidadComentarios: Array.isArray(comentarios) ? comentarios.length : 0
                };
              } catch (err) {
                console.error(`Error al traer comentarios del post ${post.id}`, err);
                return { ...post, cantidadComentarios: 0 };
              }
            })
          );
          setPosts(postsCompletos);
        }
      } catch (error) {
        console.error("Error al cargar las publicaciones del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [usuario]);

  const handleDelete = async (postId: number) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar esta publicación?");
    if (!confirmar) return;

    try {
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      alert("Publicación eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      alert("No se pudo eliminar la publicación. Intentalo de nuevo.");
    }
  };

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
                  
                  <div className="post-actions">
                    <Link to={`/post/${post.id}`} className="btn-ver-mas">
                      Ver más
                    </Link>
                    
                    {/* BOTÓN DE ELIMINAR */}
                    <button 
                      onClick={() => handleDelete(post.id)} 
                      className="btn-eliminar"
                      title="Eliminar publicación"
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </div>

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