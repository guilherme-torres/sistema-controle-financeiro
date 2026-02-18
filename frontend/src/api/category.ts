import { api } from "@/lib/api";
import type { CategoryCreate, CategoryResponse, CategoryType, CategoryUpdate } from "@/models/category";

export async function createCategory(data: CategoryCreate) {
    try {
        const response = await api.post<CategoryResponse>("/categories/", data)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar categoria";
        throw new Error(errorMessage)
    }
}

export async function getCategory(id: number) {
    try {
        const response = await api.get<CategoryResponse>(`/categories/${id}`)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao buscar categoria";
        throw new Error(errorMessage)
    }
}

export async function listCategories(category_type?: CategoryType, offset: number = 0, limit: number = 10) {
    try {
        const response = await api.get<CategoryResponse[]>(`/categories/`, {
            params: { limit, offset, category_type }
        })
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao listar categorias";
        throw new Error(errorMessage)
    }
}

export async function updateCategory(id: number, data: CategoryUpdate) {
    try {
        const response = await api.patch<CategoryResponse>(`/categories/${id}`, data)
        return response.data
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao atualizar categoria";
        throw new Error(errorMessage)
    }
}

export async function deleteCategory(id: number) {
    try {
        await api.delete(`/categories/${id}`)
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao deletar categoria";
        throw new Error(errorMessage)
    }
}