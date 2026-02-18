import { api } from "@/lib/api";
import type { AccountCreate, AccountResponse, AccountUpdate } from "@/models/account";

export async function createAccount(data: AccountCreate) {
    try {
        const response = await api.post<AccountResponse>("/accounts/", data)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar conta";
        throw new Error(errorMessage)
    }
}

export async function getAccount(id: number) {
    try {
        const response = await api.get<AccountResponse>(`/accounts/${id}`)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao buscar conta";
        throw new Error(errorMessage)
    }
}

export async function listAccounts(offset: number = 0, limit: number = 10) {
    try {
        const response = await api.get<AccountResponse[]>(`/accounts/`, {
            params: { limit, offset }
        })
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao listar contas";
        throw new Error(errorMessage)
    }
}

export async function updateAccount(id: number, data: AccountUpdate) {
    try {
        const response = await api.patch<AccountResponse>(`/accounts/${id}`, data)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao atualizar conta";
        throw new Error(errorMessage)
    }
}

export async function deleteAccount(id: number) {
    try {
        await api.delete(`/accounts/${id}`)
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao deletar conta";
        throw new Error(errorMessage)
    }
}