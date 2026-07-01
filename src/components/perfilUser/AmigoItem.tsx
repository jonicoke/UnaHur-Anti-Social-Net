import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserById } from '../../services/api';

export const AmigoItem: React.FC<{ user: any }> = ({ user }) => {
  const [foto, setFoto] = useState(user.fotoPerfil);

  useEffect(() => {
    if (!user.fotoPerfil) {
      getUserById(user.id).then(data => {
        if (data.fotoPerfil) setFoto(data.fotoPerfil);
      }).catch(err => console.error("No se pudo traer la foto:", err));
    }
  }, [user.id, user.fotoPerfil]);

  return (
    <Link to={`/profile/${user.id}`} className="amigo-item">
      {foto ? (
        <img src={foto} alt={user.nickName} />
      ) : (
        <i className="bi bi-person-circle"></i>
      )}
      <span>{user.nickName}</span>
    </Link>
  );
};

export default AmigoItem;