import { listAccounts } from "@/api/account"
import { listCategories } from "@/api/category"
import type { CategoryType } from "@/models/category"
import { useQuery } from "@tanstack/react-query"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DatePicker } from "@/components/date-picker"
import { Button } from "@/components/ui/button"
import { FileIcon, FileSpreadsheet, Sheet, X } from "lucide-react"
import { type DateRange } from 'react-day-picker'
import { type TransactionFilters, OrderByOptions } from "@/models/transactions"
import { ComboboxMultiSelect } from "@/components/combobox-multi-select"
import { DatePickerRange } from "@/components/range-date-picker"

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
    const selectedRange: DateRange = {
        from: filters.start_date ? new Date(`${filters.start_date}T00:00:00`) : undefined,
        to: filters.end_date ? new Date(`${filters.end_date}T00:00:00`) : undefined,
    }

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
        <div className="flex flex-col gap-4 p-4 border-b bg-card/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-3 items-end">

                <div className="col-span-1 lg:col-span-2 space-y-1.5 w-full">
                    <span className="text-xs font-medium text-muted-foreground ml-1">Tipo</span>
                    <Select
                        value={filters.category_type ?? "ALL"}
                        onValueChange={(value) => {
                            const categoryType = value === "ALL" ? undefined : value as CategoryType
                            applyFilter({ category_type: categoryType, category_id: undefined })
                        }}
                    >
                        <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todos os tipos</SelectItem>
                            <SelectItem value="EXPENSES">Saída</SelectItem>
                            <SelectItem value="INCOME">Entrada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-1 lg:col-span-3 space-y-1.5 w-full">
                    <span className="text-xs font-medium text-muted-foreground ml-1">Categorias</span>
                    <ComboboxMultiSelect
                        placeholder="Filtrar categorias..."
                        items={categories.map((cat) => ({ value: String(cat.id), label: cat.name }))}
                        value={Array.isArray(filters.category_id) ? filters.category_id.map(String) : (filters.category_id ? [String(filters.category_id)] : [])}
                        onValueChange={(values) =>
                            applyFilter({ category_id: values.length > 0 ? values.map(Number) : undefined })
                        }
                    />
                </div>

                <div className="col-span-1 lg:col-span-2 space-y-1.5 w-full">
                    <span className="text-xs font-medium text-muted-foreground ml-1">Conta</span>
                    <Select
                        value={filters.account_id ? String(filters.account_id) : "ALL"}
                        onValueChange={(value) => {
                            const accountID = value === "ALL" ? undefined : value
                            applyFilter({ account_id: accountID ? Number(value) : undefined })
                        }}
                    >
                        <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todas as contas</SelectItem>
                            {accountsData?.accounts.map((account) => (
                                <SelectItem key={account.id} value={String(account.id)}>
                                    {account.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-5 flex flex-col space-y-1.5 w-full">
                    <span className="text-xs font-medium text-muted-foreground ml-1">Período</span>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <div className="w-full sm:w-1/2">
                            <DatePicker
                                date={selectedDate}
                                setDate={(dateValue) => {
                                    applyFilter({
                                        date: dateValue ? dateValue.toISOString().split("T")[0] : undefined,
                                        start_date: undefined, end_date: undefined,
                                    })
                                }}
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <DatePickerRange
                                range={selectedRange}
                                setRange={(rangeValue) => {
                                    applyFilter({
                                        start_date: rangeValue?.from ? rangeValue.from.toISOString().split("T")[0] : undefined,
                                        end_date: rangeValue?.to ? rangeValue.to.toISOString().split("T")[0] : undefined,
                                        date: undefined,
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/40">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 text-muted-foreground hover:bg-transparent hover:text-destructive w-full sm:w-auto justify-center"
                >
                    <X className="w-4 h-4 mr-2" />
                    Limpar filtros
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-full sm:w-auto justify-center">
                            <Sheet className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80">
                        <div className="space-y-1.5 mb-4">
                            <h4 className="font-medium text-sm leading-none">Exportar transações</h4>
                            <p className="text-xs text-muted-foreground">
                                Baixe os dados com os filtros atuais aplicados.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start font-normal hover:bg-foreground/5 hover:text-foreground"
                                onClick={() => {
                                    console.log("Exportando CSV...")
                                }}
                            >
                                <FileSpreadsheet />
                                Arquivo CSV
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start font-normal hover:bg-foreground/5 hover:text-foreground"
                                onClick={() => {
                                    console.log("Exportando PDF...")
                                }}
                            >
                                <FileIcon className="text-red-600/80" />
                                Documento PDF
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}