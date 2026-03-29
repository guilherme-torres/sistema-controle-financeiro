import { listAccounts } from "@/api/account";
import { listCategories } from "@/api/category";
import { deleteTransaction, updateTransaction } from "@/api/transactions";
import { Combobox } from "@/components/combobox";
import { DatePicker } from "@/components/date-picker";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryType } from "@/models/category";
import type { TransactionFormData, TransactionResponse, TransactionUpdate } from "@/models/transactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function RowActions<TData>({ row }: { row: Row<TData> }) {
    const transaction = row.original as TransactionResponse

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [formData, setFormData] = useState<TransactionFormData>({
        amount: transaction.amount,
        category_id: String(transaction.category_id),
        account_id: String(transaction.account_id),
        date: new Date(`${transaction.date}T00:00:00`),
        comment: transaction.comment ?? "",
    })
    const [transactionType, setTransactionType] = useState(transaction.category_type)

    const queryClient = useQueryClient()

    const { data: categories = [] } = useQuery({
        queryKey: ["categories", transactionType],
        queryFn: () => listCategories(transactionType),
    })

    const { data: accountsData } = useQuery({
        queryKey: ["accounts"],
        queryFn: () => listAccounts(),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            setIsDeleteOpen(false)
            toast.success("Transação deletada com sucesso!")
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: TransactionUpdate }) =>
            updateTransaction(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            setIsEditOpen(false)
            setFormData({
                amount: data.amount,
                category_id: String(data.category_id),
                account_id: String(data.account_id),
                date: new Date(`${data.date}T00:00:00`),
                comment: data.comment,
            })
            toast.success("Transação atualizada com sucesso!")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    function handleDelete() {
        deleteMutation.mutate(transaction.id)
    }

    function handleUpdate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!formData.amount || !formData.category_id || !formData.account_id || !formData.date) {
            toast.error("Preencha todos os campos obrigatórios!")
            return
        }
        const data = {
            amount: formData.amount,
            category_id: Number(formData.category_id),
            account_id: Number(formData.account_id),
            date: formData.date.toISOString().split("T")[0],
            comment: formData.comment ?
                formData.comment.trim() ? formData.comment.trim() : undefined
                : undefined
        }
        updateMutation.mutate({ id: transaction.id, data })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteOpen(true)}
                        variant="destructive"
                    >
                        Deletar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Tem certeza que deseja excluir esta transação?"
                description="Esta ação não pode ser desfeita."
                handleDelete={handleDelete}
            />

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Editar transação</DialogTitle>
                        <DialogDescription>
                            Edite os dados desta transação.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <div className="w-full max-w-sm space-y-2">
                                    <Label htmlFor="transaction-type">Tipo</Label>
                                    <Select
                                        value={transactionType}
                                        onValueChange={(value) => setTransactionType(value as CategoryType)}
                                    >
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
        </>
    )
}