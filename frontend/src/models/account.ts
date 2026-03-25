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

export interface AccountResponseWithTotal {
    total: string
    accounts: AccountResponse[]
}

export interface AccountUpdate {
    name?: string
    balance?: string
    color?: string
}