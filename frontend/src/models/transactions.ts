import type { AccountResponse } from "./account"
import type { CategoryResponse, CategoryType } from "./category"

export interface TransactionSummaryResponse {
    category_id: number
    category_name: string
    category_type: CategoryType
    category_color: string
    total_amount: number
    percentage: number
}

export interface TransactionSummaryResponseWithTotal {
    total: number
    summary: TransactionSummaryResponse[]
}

enum OrderByOptions {
    date_asc = "date:asc",
    date_desc = "date:desc",
    amount_asc = "amount:asc",
    amount_desc = "amount:desc"
}

export interface TransactionFilters {
    offset: number
    limit: number
    category_type?: CategoryType
    category_id?: number
    account_id?: number
    order_by?: OrderByOptions
    date?: string
    start_date?: string
    end_date?: string
    month?: number
    year?: number
    summary?: boolean
}

export interface TransactionResponse {
    id: number
    amount: string
    category_id: number
    account_id: number
    date: string
    comment: string
    category_type: CategoryType
    category: CategoryResponse
    account: AccountResponse
}

export interface TransactionCreate {
    amount: string
    category_id: number
    account_id: number
    date: string
    comment?: string
}

export interface TransactionUpdate {
    amount?: string
    category_id?: number
    account_id?: number
    date?: string
    comment?: string
}
