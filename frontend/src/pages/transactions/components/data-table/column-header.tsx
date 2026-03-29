import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { OrderByOptions } from "@/models/transactions"

interface ColumnHeaderProps {
    title: string
    columnKey: "date" | "amount"
    currentOrder: OrderByOptions
    onSort: (key: "date" | "amount") => void
}

export function ColumnHeader({ title, columnKey, currentOrder, onSort }: ColumnHeaderProps) {
    const isActive = currentOrder.startsWith(columnKey)
    const isDesc = currentOrder.endsWith("desc")

    return (
        <Button
            variant="ghost"
            onClick={() => onSort(columnKey)}
        >
            <span className="font-bold">{title}</span>
            {isActive ? (
                isDesc ? (
                    <ArrowDown />
                ) : (
                    <ArrowUp />
                )
            ) : (
                <ArrowUpDown className="text-muted-foreground/50" />
            )}
        </Button>
    )
}