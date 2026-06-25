import type { Post } from '../types'
import type {User} from "../types"

const BASE_URL = 'http://localhost:3001'

export async function getPosts(): Promise<Post[]> {
    const res = await fetch(`${BASE_URL}/posts`)
    const data = await res.json()
    return data
}

// Usuarios
export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`)
  return res.json()
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