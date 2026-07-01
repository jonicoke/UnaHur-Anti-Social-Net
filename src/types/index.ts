export interface User {
    id: number
    nickName: string
    email: string
    fotoPerfil: string | null
    instituto: string | null
    descripcion: string | null
    Seguidores?: User[]; 
    Siguiendo?: User[];
}

export interface Tag {
    id: number
    name: string
}

export interface PostImage {
    url: string
}

export interface Post {
    id: number
    description: string
    createdAt: string
    UserId: number
    User: User
    Tags: Tag[]
    PostImages: PostImage[]
    comentariosCount?: number
}

export interface Comment {
    id: number
    content: string
    User?: {
        id: number
        nickName: string
        fotoPerfil: string | null
    }
}