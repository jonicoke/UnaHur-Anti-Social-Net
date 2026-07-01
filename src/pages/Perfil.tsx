import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../styles/pages/perfil.css'; 
import { 
  getPostsByUser, getCommentsByPost, deletePost, getUserById, 
  followUser, unfollowUser, removeFollower, updateUserProfile 
} from '../services/api'; 
import type { Post, User } from '../types';

interface PostConComentarios extends Post { cantidadComentarios: number; }

export const Perfil: React.FC = () => {
  const { usuario, logout } = useAuth(); 
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostConComentarios[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [perfilActual, setPerfilActual] = useState<any>(null);
  
  const [seguidoresList, setSeguidoresList] = useState<User[]>([]);
  const [siguiendoList, setSiguiendoList] = useState<User[]>([]);
  
  const [modalAbierto, setModalAbierto] = useState<'seguidores' | 'siguiendo' | null>(null);
  const [loSiguo, setLoSiguo] = useState<boolean>(false);
  const [cargandoAction, setCargandoAction] = useState(false);

  // NUEVOS ESTADOS PARA EDICIÓN
  const [modalEdicionAbierto, setModalEdicionAbierto] = useState(false);
  const [formData, setFormData] = useState({ nickName: '', instituto: '', descripcion: '' });
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const perfilId = id ? Number(id) : usuario?.id;
  const esMiPerfil = usuario?.id === perfilId;

  const cargarPerfil = async () => {
    if (!perfilId) return;
    try {
      const userData = await getUserById(perfilId);
      setPerfilActual(userData);
      setSeguidoresList(userData.Seguidores || []);
      setSiguiendoList(userData.Siguiendo || []);
      setFormData({
        nickName: userData.nickName || '',
        instituto: userData.instituto || '',
        descripcion: userData.descripcion || ''
      });

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

  // FUNCIÓN PARA GUARDAR LOS CAMBIOS DEL PERFIL
  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario?.id) return;
    
    try {
      setGuardandoPerfil(true);
      const dataAEnviar = {
        nickName: formData.nickName,
        instituto: formData.instituto === '' ? undefined : formData.instituto,
        descripcion: formData.descripcion
      };

      const res = await updateUserProfile(usuario.id, dataAEnviar);
      
      setPerfilActual(res.user);
      setModalEdicionAbierto(false);
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(res.user));
      } else if (localStorage.getItem('usuario')) {
        localStorage.setItem('usuario', JSON.stringify(res.user));
      }
      
      alert('Perfil actualizado con éxito');
      window.location.reload(); 
      
    } catch (error: any) {
      console.error(error);
      alert("Error al guardar: " + error.message);
    } finally {
      setGuardandoPerfil(false);
    }
  };
  const handlePerfilFollowToggle = async () => {
    if (!usuario || !usuario.id || !perfilId) return;
    setCargandoAction(true);
    try {
      if (loSiguo) {
        if (window.confirm(`¿Dejar de seguir a ${perfilActual.nickName}?`)) {
          await unfollowUser(perfilId, usuario.id);
          setLoSiguo(false);
          setSeguidoresList(prev => prev.filter(s => s.id !== usuario.id));
        }
      } else {
        await followUser(perfilId, usuario.id);
        setLoSiguo(true);
        if (usuario) setSeguidoresList(prev => [...prev, usuario as any]);
      }
    } catch (error) { console.error(error); } 
    finally { setCargandoAction(false); }
  };

  const handleDejarDeSeguirDesdeLista = async (targetId: number, name: string) => {
    if (!usuario?.id || !window.confirm(`¿Dejar de seguir a ${name}?`)) return;
    try {
      await unfollowUser(targetId, usuario.id);
      setSiguiendoList(prev => prev.filter(u => u.id !== targetId));
    } catch (error) { console.error(error); }
  };

  const handleEliminarSeguidor = async (targetId: number, name: string) => {
    if (!usuario?.id || !window.confirm(`¿Eliminar a ${name} de tus seguidores?`)) return;
    try {
      await removeFollower(targetId, usuario.id);
      setSeguidoresList(prev => prev.filter(u => u.id !== targetId));
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm("¿Eliminar publicación?")) return;
    try {
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) { console.error(error); }
  };

  if (!perfilActual) return <div>Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <header className="perfil-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', paddingBottom: '20px' }}>
        <div className="perfil-avatar">
          {perfilActual.fotoPerfil ? (
            <img src={perfilActual.fotoPerfil} alt={perfilActual.nickName} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <i className="bi bi-person-circle" style={{ fontSize: '100px', color: '#ccc', lineHeight: 1 }}></i>
          )}
        </div>

        <div className="perfil-header-info" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ margin: 0 }}>Perfil de: <span className="nickname-highlight">{perfilActual.nickName}</span></h2>
            {!esMiPerfil && (
              <button onClick={handlePerfilFollowToggle} disabled={cargandoAction} className={`btn-perfil-follow ${loSiguo ? 'btn-siguiendo' : 'btn-seguir'}`}>
                {cargandoAction ? '...' : (loSiguo ? 'Siguiendo' : 'Seguir')}
              </button>
            )}
          </div>
          
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

          {/* BIO DEL USUARIO */}
          <div className="perfil-bio" style={{ marginTop: '15px', color: '#444' }}>
            {perfilActual.instituto && (
              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#0073bc' }}>
                <i className="bi bi-building"></i> {perfilActual.instituto}
              </p>
            )}
            {perfilActual.descripcion && (
              <p style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{perfilActual.descripcion}</p>
            )}
          </div>
        </div>

        {esMiPerfil && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* BOTÓN PARA ABRIR MODAL DE EDICIÓN */}
            <button onClick={() => setModalEdicionAbierto(true)} className="btn-editar-perfil">
              <i className="bi bi-pencil-square"></i> Editar Perfil
            </button>
            <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        )}
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
                  <div className="post-footer-left">
                    <div className="comments-count" title="Comentarios">
                      <i className="bi bi-chat"></i><span>{post.cantidadComentarios}</span>
                    </div>
                    <Link to={`/post/${post.id}`} className="btn-ver-mas">Ver más</Link>
                  </div>
                  {esMiPerfil && (
                    <div className="post-footer-right">
                      <button onClick={() => handleDelete(post.id)} className="btn-eliminar" title="Eliminar"><i className="bi bi-trash"></i></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL DE EDICIÓN DE PERFIL */}
      {modalEdicionAbierto && (
        <div className="modal-overlay" onClick={() => setModalEdicionAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Perfil</h3>
              <button className="btn-close-modal" onClick={() => setModalEdicionAbierto(false)}>&times;</button>
            </div>
            <form onSubmit={handleGuardarPerfil} className="form-edicion">
              
              <div className="form-group">
                <label>Nombre de Usuario</label>
                <input 
                  type="text" 
                  value={formData.nickName} 
                  onChange={(e) => setFormData({...formData, nickName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Instituto UNAHUR</label>
                <select 
                  value={formData.instituto} 
                  onChange={(e) => setFormData({...formData, instituto: e.target.value})}
                >
                  <option value="">Selecciona un instituto...</option>
                  <option value="Tec. e Ingenieria">Tec. e Ingeniería</option>
                  <option value="Biotecnologia">Biotecnología</option>
                  <option value="Educacion">Educación</option>
                  <option value="Salud Comunitaria">Salud Comunitaria</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descripción / Bio</label>
                <textarea 
                  rows={4}
                  value={formData.descripcion} 
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Contanos algo sobre vos..."
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-cancelar" onClick={() => setModalEdicionAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn-guardar" disabled={guardandoPerfil}>
                  {guardandoPerfil ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      {/* RENDERIZADO DEL MODAL (VENTANA EMERGENTE DE SEGUIDORES/SEGUIDOS) */}
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