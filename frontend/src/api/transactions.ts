import { api } from "@/lib/api";
import type { TransactionCreate, TransactionFilters, TransactionResponse, TransactionSummaryResponseWithTotal, TransactionUpdate } from "@/models/transactions";

export async function listTransactionsSummary(filters: TransactionFilters) {
    try {
        const response = await api.get<TransactionSummaryResponseWithTotal>(`/transactions/`, {
            params: { ...filters }
        })
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao listar transações";
        throw new Error(errorMessage)
    }
}

export async function listTransactions(filters: TransactionFilters) {
    try {
        const response = await api.get<TransactionResponse[]>(`/transactions/`, {
            params: { ...filters }
        })
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao listar transações";
        throw new Error(errorMessage)
    }
}

export async function createTransaction(transaction: TransactionCreate) {
    try {
        const response = await api.post<TransactionResponse>(`/transactions/`, {
            ...transaction
        })
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao criar transação";
        throw new Error(errorMessage)
    }
}

export async function updateTransaction(id: number, transaction: TransactionUpdate) {
    try {
        const response = await api.patch<TransactionResponse>(`/transactions/${id}`, {
            ...transaction
        })
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao atualizar transação";
        throw new Error(errorMessage)
    }
}

export async function deleteTransaction(id: number) {
    try {
        const response = await api.delete(`/transactions/${id}`)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao deletar transação";
        throw new Error(errorMessage)
    }
}

export async function getTransaction(id: number) {
    try {
        const response = await api.get<TransactionResponse>(`/transactions/${id}`)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao buscar transação";
        throw new Error(errorMessage)
    }
}