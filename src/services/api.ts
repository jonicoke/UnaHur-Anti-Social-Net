import type { Post } from '../types'

const BASE_URL = 'http://localhost:3001'

export async function getPosts(): Promise<Post[]> {
    const res = await fetch(`${BASE_URL}/posts`)
    const data = await res.json()
    return data
}

