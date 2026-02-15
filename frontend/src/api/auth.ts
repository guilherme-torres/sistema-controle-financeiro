import { api } from "@/lib/api";

export async function getAuthenticatedUser() {
    try {
        const response = await api.get("/auth/me")
        return response.data
    } catch (error) {
        if (error.response?.status === 401) {
            console.log("Sessão inválida ou expirada")
            return null
        }
        console.error("Erro na autenticação:", error.message)
        return null
    }
}