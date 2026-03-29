import { listAccounts } from "@/api/account"
import { listCategories } from "@/api/category"
import type { CategoryType } from "@/models/category"
import { useQuery } from "@tanstack/react-query"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FunnelX } from "lucide-react"
import { type TransactionFilters, OrderByOptions } from "@/models/transactions"
import { ComboboxMultiSelect } from "@/components/combobox-multi-select"

type DataTableToolbarProps = {
    filters: TransactionFilters
    onFiltersChange: (filters: TransactionFilters) => void
}

export function DataTableToolbar({
    filters,
    onFiltersChange,
}: DataTableToolbarProps) {
    const selectedCategoryType = filters.category_type ?? undefined
    const selectedDate = filters.date ? new Date(`${filters.date}T00:00:00`) : undefined

    const { data: accountsData } = useQuery({
        queryKey: ["accounts"],
        queryFn: () => listAccounts(),
    })

    const { data: categories = [] } = useQuery({
        queryKey: ["categories", selectedCategoryType],
        queryFn: () => listCategories(selectedCategoryType),
    })

    const applyFilter = (next: Partial<TransactionFilters>) => {
        onFiltersChange({
            ...filters,
            ...next,
            offset: 0,
        })
    }

    const clearFilters = () => {
        onFiltersChange({
            limit: 10,
            offset: 0,
            order_by: OrderByOptions.date_desc,
        })
    }

    return (
        <div className="space-y-4 p-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <div className="space-y-3">
                    <Label>Tipo</Label>
                    <Select
                        value={filters.category_type ?? "ALL"}
                        onValueChange={(value) => {
                            const categoryType = value === "ALL" ? undefined : value as CategoryType
                            applyFilter({ category_type: categoryType, category_id: undefined })
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tipo</SelectLabel>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="EXPENSES">Saída</SelectItem>
                                <SelectItem value="INCOME">Entrada</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-3">
                    <Label>Categoria</Label>
                    <ComboboxMultiSelect
                        placeholder="Selecione categorias"
                        items={categories.map((cat) => ({ value: String(cat.id), label: cat.name }))}
                        value={Array.isArray(filters.category_id) ? filters.category_id.map(String) : (filters.category_id ? [String(filters.category_id)] : [])}
                        onValueChange={(values) =>
                            applyFilter({ category_id: values.length > 0 ? values.map(Number) : undefined })
                        }
                    />
                </div>

                <div className="space-y-3">
                    <Label>Conta</Label>
                    <Select
                        value={filters.account_id ? String(filters.account_id) : "ALL"}
                        onValueChange={(value) => {
                            const accountID = value === "ALL" ? undefined : value
                            applyFilter({ account_id: accountID ? Number(value) : undefined })
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Contas</SelectLabel>
                                <SelectItem value="ALL">Todas</SelectItem>
                                {accountsData?.accounts.map((account) => (
                                    <SelectItem key={account.id} value={String(account.id)}>
                                        {account.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label>Data</Label>
                    <DatePicker
                        date={selectedDate}
                        setDate={(dateValue) => {
                            applyFilter({ date: dateValue ? dateValue.toISOString().split("T")[0] : undefined })
                        }}
                    />
                </div>
            </div>

            <Button
                variant="outline"
                onClick={clearFilters}
            >
                <FunnelX />Limpar filtros
            </Button>
        </div>
    )
}