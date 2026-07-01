import type { Post } from '../types'
import type {User} from "../types"

export const BASE_URL = "http://localhost:3001";

export async function getPosts(): Promise<Post[]> {
    const res = await fetch(`${BASE_URL}/posts`)
    const data = await res.json()
    return data
}
export async function getPostImages(postId: number) {
    const res = await fetch(`${BASE_URL}/postimages/post/${postId}`)
    return res.json()
}
export async function getPostsByUser(userId: number) {
  const res = await fetch(`${BASE_URL}/posts?userId=${userId}`);
  return res.json();
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`)
  return res.json()
}

export async function getUserById(userId: number) {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  if (!res.ok) {
    throw new Error("No se pudo cargar el perfil del usuario");
  }
  return res.json();
}

export async function createUser(data: { nickName: string; email: string; password: string }): Promise<User>{
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'No se pudo crear el usuario')
  }

  return res.json()
}

export async function getPostById(postId: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${postId}`);

  if (!res.ok) {
    throw new Error("No se pudo cargar la publicación");
  }

  return res.json();
}

export async function getCommentsByPost(postId: number) {
  const res = await fetch(`${BASE_URL}/comments/post/${postId}`);

  if (!res.ok) {
    throw new Error("No se pudieron cargar los comentarios");
  }

  return res.json();
}
export async function deletePost(postId: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'No se pudo eliminar la publicación');
  }

  return res.json();
}

export async function createComment(data: {
  content: string;
  userId: number;
  postId: number;
}) {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "No se pudo crear el comentario");
  }

  return res.json();
}

export async function followUser(usuarioASeguirId: number, miUsuarioId: number) {
  const res = await fetch(`${BASE_URL}/users/${usuarioASeguirId}/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: miUsuarioId }) 
  });

  if (!res.ok) {
    throw new Error('Error al seguir al usuario');
  }
  return res.json();
}

export async function unfollowUser(usuarioDejarDeSeguirId: number, miUsuarioId: number) {
  const res = await fetch(`${BASE_URL}/users/${usuarioDejarDeSeguirId}/follow`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: miUsuarioId })
  });

  if (!res.ok) {
    throw new Error('Error al dejar de seguir');
  }
  return res.json();
}

export async function removeFollower(followerId: number, miUsuarioId: number) {
  const res = await fetch(`${BASE_URL}/users/${followerId}/follower`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: miUsuarioId })
  });

  if (!res.ok) {
    throw new Error('Error al eliminar seguidor');
  }
  return res.json();
}

export async function updateUserProfile(userId: number, data: { nickName?: string; instituto?: string; descripcion?: string }) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al actualizar el perfil');
  }

  return res.json();
}