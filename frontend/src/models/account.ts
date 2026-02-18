export interface AccountCreate {
    name: string
    balance: string
    color: string
}

export interface AccountResponse {
    id: number
    name: string
    balance: string
    color: string
}

export interface AccountUpdate {
    name?: string
    balance?: string
    color?: string
}