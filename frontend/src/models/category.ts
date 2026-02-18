export type CategoryType = "EXPENSES" | "INCOME"

export interface CategoryCreate {
    name: string
    category_type: CategoryType
    color: string
}

export interface CategoryResponse {
    id: number
    name: string
    category_type: CategoryType
    color: string
}

export interface CategoryUpdate {
    name?: string
    color?: string
}