import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../styles/pages/perfil.css'; 
import { 
  getPostsByUser, 
  getCommentsByPost, 
  deletePost, 
  getUserById, 
  followUser, 
  unfollowUser,
  removeFollower 
} from '../services/api'; 
import type { Post, User } from '../types';

interface PostConComentarios extends Post {
  cantidadComentarios: number;
}

export const Perfil: React.FC = () => {
  const { usuario, logout } = useAuth(); 
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostConComentarios[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [perfilActual, setPerfilActual] = useState<any>(null);
  
  // Guardamos las listas completas de usuarios para renderizarlas en los modals
  const [seguidoresList, setSeguidoresList] = useState<User[]>([]);
  const [siguiendoList, setSiguiendoList] = useState<User[]>([]);
  
  // Estado para controlar qué modal está a la vista ('seguidores' | 'siguiendo' | null)
  const [modalAbierto, setModalAbierto] = useState<'seguidores' | 'siguiendo' | null>(null);

  const [loSiguo, setLoSiguo] = useState<boolean>(false);
  const [cargandoAction, setCargandoAction] = useState(false);

  const perfilId = id ? Number(id) : usuario?.id;
  const esMiPerfil = usuario?.id === perfilId;

  const cargarPerfil = async () => {
    if (!perfilId) return;
    try {
      const userData = await getUserById(perfilId);
      setPerfilActual(userData);
      
      // Llenamos las listas con los datos que nos trae el include de Sequelize
      setSeguidoresList(userData.Seguidores || []);
      setSiguiendoList(userData.Siguiendo || []);

      if (usuario?.id) {
        const yaLoSigo = userData.Seguidores?.some((s: any) => s.id === usuario.id);
        setLoSiguo(yaLoSigo ?? false);
      }

      const listaPosts = await getPostsByUser(perfilId);
      if (Array.isArray(listaPosts)) {
        const postsCompletos = await Promise.all(
          listaPosts.map(async (post: Post) => {
            try {
              const resComments = await getCommentsByPost(post.id);
              return { ...post, cantidadComentarios: Array.isArray(resComments) ? resComments.length : 0 };
            } catch {
              return { ...post, cantidadComentarios: 0 };
            }
          })
        );
        setPosts(postsCompletos);
      }
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, [perfilId, usuario?.id]);

  const handlePerfilFollowToggle = async () => {
    if (!usuario || !usuario.id || !perfilId) return;
    setCargandoAction(true);
    try {
      if (loSiguo) {
        const confirmar = window.confirm(`¿Dejar de seguir a ${perfilActual.nickName}?`);
        if (confirmar) {
          await unfollowUser(perfilId, usuario.id);
          setLoSiguo(false);
          setSeguidoresList(prev => prev.filter(s => s.id !== usuario.id));
        }
      } else {
        await followUser(perfilId, usuario.id);
        setLoSiguo(true);
        if (usuario) setSeguidoresList(prev => [...prev, usuario as any]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoAction(false);
    }
  };

  // ACCIÓN: Dejar de seguir a alguien desde mi lista de "Siguiendo"
  const handleDejarDeSeguirDesdeLista = async (targetId: number, name: string) => {
    if (!usuario?.id) return;
    if (!window.confirm(`¿Estás seguro de dejar de seguir a ${name}?`)) return;

    try {
      await unfollowUser(targetId, usuario.id);
      setSiguiendoList(prev => prev.filter(u => u.id !== targetId));
    } catch (error) {
      console.error(error);
    }
  };

  // ACCIÓN: Eliminar un seguidor para que deje de seguirme
  const handleEliminarSeguidor = async (targetId: number, name: string) => {
    if (!usuario?.id) return;
    if (!window.confirm(`¿Estás seguro de eliminar a ${name} de tus seguidores?`)) return;

    try {
      await removeFollower(targetId, usuario.id);
      setSeguidoresList(prev => prev.filter(u => u.id !== targetId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm("¿Eliminar publicación?")) return;
    try {
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  if (!perfilActual) return <div>Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <header className="perfil-header" style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px' }}>
        <div className="perfil-avatar">
          {perfilActual.fotoPerfil ? (
            <img src={perfilActual.fotoPerfil} alt={perfilActual.nickName} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <i className="bi bi-person-circle" style={{ fontSize: '100px', color: '#ccc' }}></i>
          )}
        </div>

        <div className="perfil-header-info" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2>Perfil de: <span className="nickname-highlight">{perfilActual.nickName}</span></h2>
            
            {/* BOTÓN ESTILIZADO CON CLASES PURAS */}
            {!esMiPerfil && (
              <button
                onClick={handlePerfilFollowToggle}
                disabled={cargandoAction}
                className={`btn-perfil-follow ${loSiguo ? 'btn-siguiendo' : 'btn-seguir'}`}
              >
                {cargandoAction ? '...' : (loSiguo ? 'Siguiendo' : 'Seguir')}
              </button>
            )}
          </div>
          
          {/* AGREGAMOS EL CONTADOR DE PUBLICACIONES A LA IZQUIERDA */}
          <div className="perfil-stats" style={{ marginTop: '10px', display: 'flex', gap: '20px' }}>
            
            <div className="stat-item">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">Publicaciones</span>
            </div>

            <div className="stat-item" onClick={() => setModalAbierto('seguidores')} style={{ cursor: 'pointer' }}>
              <span className="stat-number">{seguidoresList.length}</span>
              <span className="stat-label">Seguidores</span>
            </div>
            
            <div className="stat-item" onClick={() => setModalAbierto('siguiendo')} style={{ cursor: 'pointer' }}>
              <span className="stat-number">{siguiendoList.length}</span>
              <span className="stat-label">Siguiendo</span>
            </div>

          </div>
        </div>

        {esMiPerfil && <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>}
      </header>

      {/* SECCIÓN DE PUBLICACIONES */}
      <section className="perfil-posts-section">
        <h3>{esMiPerfil ? "Mis Publicaciones" : `Publicaciones de ${perfilActual.nickName}`}</h3>
        {loading ? <p>Cargando publicaciones...</p> : posts.length === 0 ? <p className="no-posts-msg">Aún no hay publicaciones.</p> : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <p className="post-description">{post.description}</p>
               <div className="post-footer">
                  
                  {/* GRUPO IZQUIERDO: Comentarios y Ver más */}
                  <div className="post-footer-left">
                    <div className="comments-count" title="Comentarios">
                      <i className="bi bi-chat"></i>
                      <span>{post.cantidadComentarios}</span>
                    </div>
                    
                    <Link to={`/post/${post.id}`} className="btn-ver-mas">
                      Ver más
                    </Link>
                  </div>
                  
                  {/* GRUPO DERECHO: Tachito de eliminar */}
                  {esMiPerfil && (
                    <div className="post-footer-right">
                      <button 
                        onClick={() => handleDelete(post.id)} 
                        className="btn-eliminar"
                        title="Eliminar publicación"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================== */}
      {/* RENDERIZADO DEL MODAL (VENTANA EMERGENTE)  */}
      {/* ========================================== */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalAbierto === 'seguidores' ? 'Seguidores' : 'Seguidos'}</h3>
              <button className="btn-close-modal" onClick={() => setModalAbierto(null)}>&times;</button>
            </div>
            <div className="modal-body">
              {modalAbierto === 'seguidores' ? (
                seguidoresList.length === 0 ? <p>No tiene seguidores aún.</p> : seguidoresList.map(item => (
                  <div key={item.id} className="modal-user-item">
                    <span>{item.nickName}</span>
                    {esMiPerfil && (
                      <button className="btn-modal-action-danger" onClick={() => handleEliminarSeguidor(item.id, item.nickName)}>Eliminar</button>
                    )}
                  </div>
                ))
              ) : (
                siguiendoList.length === 0 ? <p>No sigue a ningún usuario todavía.</p> : siguiendoList.map(item => (
                  <div key={item.id} className="modal-user-item">
                    <span>{item.nickName}</span>
                    {esMiPerfil && (
                      <button className="btn-modal-action" onClick={() => handleDejarDeSeguirDesdeLista(item.id, item.nickName)}>Dejar de seguir</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;