import { createTransaction, listTransactions } from "@/api/transactions"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CategoryType } from "@/models/category"
import { OrderByOptions, type TransactionFilters, type TransactionFormData } from "@/models/transactions"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { listCategories } from "@/api/category"
import { Combobox } from "@/components/combobox"
import { DatePicker } from "@/components/date-picker"
import { listAccounts } from "@/api/account"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "./components/data-table/data-table"
import { columns } from "./components/data-table/columns"

export function TransactionsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [transactionType, setTransactionType] = useState("EXPENSES")
    const [filters, setFilters] = useState<TransactionFilters>({
        limit: 10,
        offset: 0,
        order_by: OrderByOptions.date_desc,
    })
    const [formData, setFormData] = useState<TransactionFormData>({
        amount: "",
        category_id: "",
        account_id: "",
        date: new Date(),
        comment: undefined,
    })

    const queryClient = useQueryClient()

    const { data: transactions = { total: 0, limit: 0, offset: 0, data: [] }, isLoading } = useQuery({
        queryKey: ["transactions", filters],
        queryFn: () => listTransactions(filters),
    })

    const { data: categories = [] } = useQuery({
        queryKey: ["categories", transactionType],
        queryFn: () => listCategories(transactionType as CategoryType),
    })

    const { data: accountsData } = useQuery({
        queryKey: ["accounts"],
        queryFn: () => listAccounts(),
    })

    const createMutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            setIsCreateOpen(false)
            setFormData({
                amount: "",
                category_id: "",
                account_id: "",
                date: new Date(),
                comment: undefined,
            })
            toast.success("Transação criada com sucesso!")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleOpenCreate = () => {
        setFormData({
            amount: "",
            category_id: "",
            account_id: "",
            date: new Date(),
            comment: undefined,
        })
        setIsCreateOpen(true)
    }

    const handleCreate = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.amount || !formData.category_id || !formData.account_id || !formData.date) {
            toast.error("Preencha todos os campos obrigatórios!")
            return
        }
        const createData = {
            amount: formData.amount,
            category_id: Number(formData.category_id),
            account_id: Number(formData.account_id),
            date: formData.date.toISOString().split("T")[0],
            comment: formData.comment ?
                formData.comment.trim() ? formData.comment.trim() : undefined
                : undefined
        }
        createMutation.mutate(createData)
    }

    const handleSortChange = (columnKey: "date" | "amount") => {
        setFilters((prev) => {
            let newOrderBy = prev.order_by

            if (columnKey === "date") {
                newOrderBy = prev.order_by === OrderByOptions.date_desc
                    ? OrderByOptions.date_asc
                    : OrderByOptions.date_desc
            }
            else if (columnKey === "amount") {
                newOrderBy = prev.order_by === OrderByOptions.amount_desc
                    ? OrderByOptions.amount_asc
                    : OrderByOptions.amount_desc
            }

            return { ...prev, order_by: newOrderBy }
        })
    }

    if (isLoading) {
        return (
            <Layout title="Categorias">
                carregando...
            </Layout>
        )
    }

    return (
        <Layout title="Transações">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
                <h1 className="font-bold text-2xl">Minhas transações</h1>
                {transactions.total > 0 &&
                    <Button
                        className="w-full mt-3 sm:w-50 sm:mt-0"
                        onClick={handleOpenCreate}
                    >
                        <PlusCircle />
                        Adicionar transação
                    </Button>}
            </div>

            <DataTable
                columns={columns}
                data={transactions.data}
                pageIndex={Math.floor(filters.offset / filters.limit)}
                pageSize={filters.limit}
                total={transactions.total}
                onPageChange={(pageIndex) =>
                    setFilters((prev) => ({
                        ...prev,
                        offset: pageIndex * prev.limit,
                    }))
                }
                onPageSizeChange={(pageSize) =>
                    setFilters((prev) => ({
                        ...prev,
                        limit: pageSize,
                        offset: 0,
                    }))
                }
                filters={filters}
                onFiltersChange={(next) => {
                    setFilters(next)
                }}
                meta={{
                    currentOrder: filters.order_by,
                    onSort: handleSortChange
                }}
            />

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Nova transação</DialogTitle>
                        <DialogDescription>
                            Adicione uma nova transação.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <div className="w-full max-w-sm space-y-2">
                                    <Label htmlFor="transaction-type">Tipo</Label>
                                    <Select defaultValue="EXPENSES" value={transactionType} onValueChange={setTransactionType}>
                                        <SelectTrigger id="transaction-type" className="w-full">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectGroup>
                                                <SelectLabel>Tipos</SelectLabel>
                                                <SelectItem value="EXPENSES">Saída</SelectItem>
                                                <SelectItem value="INCOME">Entrada</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Field>

                            <Field>
                                <div className="w-full max-w-sm space-y-2">
                                    <Label htmlFor="account">Conta</Label>
                                    <Select
                                        value={formData.account_id}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            account_id: value
                                        })}
                                    >
                                        <SelectTrigger id="account" className="w-full">
                                            <SelectValue placeholder="Selecione o conta" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectGroup>
                                                <SelectLabel>Contas</SelectLabel>
                                                {accountsData ?
                                                    accountsData.accounts.map(({ id, name }) => (
                                                        <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                                                    ))
                                                    :
                                                    <span>Erro ao buscar contas</span>
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Field>

                            <Field>
                                <div className="w-full max-w-sm space-y-2">
                                    <Label htmlFor="amount">Valor</Label>
                                    <div className="relative">
                                        <span
                                            className="absolute left-3 top-1 text-muted-foreground font-medium select-none pointer-events-none"
                                            aria-hidden="true"
                                        >
                                            R$
                                        </span>
                                        <Input
                                            className="bg-background pl-9"
                                            id="amount"
                                            name="amount"
                                            min="0"
                                            placeholder="0.00"
                                            step="0.01"
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                amount: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </Field>

                            <Field>
                                <div className="w-full max-w-sm space-y-2">
                                    <Label>Categoria</Label>
                                    <Combobox
                                        value={formData.category_id}
                                        onValueChange={(value) => {
                                            setFormData({
                                                ...formData,
                                                category_id: value
                                            })
                                        }}
                                        items={categories.map(({ id, name }) => (
                                            { value: String(id), label: name }
                                        ))}
                                        placeholder="Selecione uma categoria"
                                    />
                                </div>
                            </Field>

                            <Field>
                                <div className="w-full max-w-sm space-y-2">
                                    <Label htmlFor="date">Data</Label>
                                    <DatePicker
                                        id="date"
                                        date={formData.date}
                                        setDate={date => setFormData({
                                            ...formData,
                                            date: date
                                        })}
                                    />
                                </div>
                            </Field>

                            <Field>
                                <Label htmlFor="comment">Comentário (opcional)</Label>
                                <Textarea
                                    value={formData.comment}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        comment: e.target.value
                                    })}
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Layout>
    )
}