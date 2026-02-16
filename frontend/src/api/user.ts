import { api } from "@/lib/api";
import type { UserCreate } from "@/models/user";

export async function createUser(data: UserCreate) {
    try {
        await api.post("/users/", data)
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao criar usuário";
        throw new Error(errorMessage)
    }
}

export async function deleteUser(id: number) {
    try {
        await api.delete(`/users/${id}`)
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao excluir conta";
        throw new Error(errorMessage)
    }
}