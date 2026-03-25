import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { PlusCircle, Search, Trash2, ArrowRight, Tag, Wallet, CopyPlus, History } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import {
    listTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from "@/api/transactions"
import { listAccounts } from "@/api/account"
import { listCategories } from "@/api/category"
import type { TransactionResponse } from "@/models/transactions"

export function TransactionsPage() {
    return (
        <Layout title="Transações">
            minhas transações
        </Layout>
    )
}