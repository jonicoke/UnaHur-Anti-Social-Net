export interface User {
  id: number
  nickName: string
  email: string
}

export interface Tag {
    id: number
    name: string
}

export interface Post {
    id: number
    description: string
    UserId: number
    User: User
    Tags: Tag[]
}