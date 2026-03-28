import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency } from "@/lib/utils"
import type { TransactionResponse } from "@/models/transactions"
import type { ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"

export const columns: ColumnDef<TransactionResponse>[] = [
    {
        header: () => <span className="font-bold">Valor</span>,
        accessorKey: "amount",
        cell: ({ row }) => <span>{formatCurrency(row.getValue("amount"))}</span>
    },
    {
        header: () => <span className="font-bold">Tipo</span>,
        accessorKey: 'category_type',
        cell: ({ row }) => {
            const categoryType = row.getValue('category_type') as string

            const styles = {
                INCOME:
                    'bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5',
                EXPENSES:
                    'bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive',
            }[categoryType]

            return (
                <Badge className={(cn('border-none focus-visible:outline-none'), styles)}>
                    {{ INCOME: "entrada", EXPENSES: "saída" }[categoryType]}
                </Badge>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: () => <span className="font-bold">Data</span>,
        accessorKey: "date",
        cell: ({ row }) => <span>{format(parseISO(row.getValue("date")), "dd/MM/yyyy")}</span>
    },
    {
        header: () => <span className="font-bold">Categoria</span>,
        accessorKey: "category.name"
    },
    {
        header: () => <span className="font-bold">Conta</span>,
        accessorKey: "account.name"
    },
    {
        header: () => <span className="font-bold">Comentário</span>,
        accessorKey: "comment",
        cell: ({ row }) => {
            const MAX_SIZE = 30
            let comment = row.getValue("comment") as string
            if (comment && comment.length > MAX_SIZE) {
                comment = comment.slice(0, MAX_SIZE) + "..."
            }
            return <span>{comment}</span>
        }
    },
]