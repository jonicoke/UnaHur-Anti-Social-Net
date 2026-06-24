export interface User {
    id: number
    nickName: string
}

export interface Tag {
    id: number
    name: string
}

export interface Post {
    id: number
    description: string
    userId: number
    tags: Tag[]
}