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

export async function login(email: string, password: string) {
    try {
        const { data } = await api.post("/auth/login", {
            email, password
        })
        return data
    } catch (error) {
        const errorMessage = (error as any).response?.data?.message || "Erro ao fazer login";
        throw new Error(errorMessage)
    }
}

export async function logout() {
    try {
        const { data } = await api.post("/auth/logout")
        return data
    } catch (error) {
        const errorMessage = (error as any).response?.data?.message || "Erro ao fazer logout";
        throw new Error(errorMessage)
    }
}