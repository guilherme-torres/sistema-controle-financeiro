import { listAccounts } from "@/api/account"
import { listTransactionsSummary } from "@/api/transactions"
import { Layout } from "@/components/layout"
import type { CategoryType } from "@/models/category"
import type { TransactionFilters } from "@/models/transactions"
import { useQuery } from "@tanstack/react-query"
import { useRouteContext } from "@tanstack/react-router"
import { useState } from "react"

export function DashboardPage() {
    const [activeTab, setActiveTab] = useState<CategoryType>("EXPENSES")
    const [filters, setFilters] = useState<TransactionFilters>({
        offset: 0, limit: 10, summary: true, category_type: activeTab
    })

    const { data: accountsData } = useQuery({
        queryKey: ["accounts"],
        queryFn: () => listAccounts()
    })

    const { data: transactionsSummary } = useQuery({
        queryKey: ["transactionsSummary", filters],
        queryFn: () => listTransactionsSummary(filters)
    })

    const { authData } = useRouteContext({ from: "/_protected" })

    return (
        <Layout title="Dashboard">
            <h1>Olá, {authData.name}</h1>
        </Layout>
    )
}