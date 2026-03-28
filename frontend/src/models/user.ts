export interface UserCreate {
    name: string
    email: string
    password: string
}

export type UserSession = {
    user_id: number
    name: string
}