import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { ColorPicker } from "@/components/color-picker"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { Wallet, Trash2, PlusCircle, Pencil } from "lucide-react"
import {
    listAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
} from "@/api/account"
import { toast } from "sonner"
import type { AccountResponse } from "@/models/account"
import { EmptyData } from "@/components/empty-data"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DeleteDialog } from "@/components/delete-dialog"

export function AccountsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        balance: "",
        color: "#e53935",
    })
    const queryClient = useQueryClient()

    const { data: accountsData, isLoading } = useQuery({
        queryKey: ["accounts"],
        queryFn: () => listAccounts(),
    })

    const createMutation = useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
            setIsCreateOpen(false)
            setFormData({ name: "", balance: "", color: "#e53935" })
            toast.success("Conta criada com sucesso!")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: typeof formData }) =>
            updateAccount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
            setIsEditOpen(false)
            setSelectedAccount(null)
            setFormData({ name: "", balance: "", color: "#e53935" })
            toast.success("Conta atualizada com sucesso!")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
            setIsDeleteOpen(false)
            setSelectedAccount(null)
            toast.success("Conta deletada com sucesso!")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleOpenCreate = () => {
        setFormData({ name: "", balance: "", color: "#e53935" })
        setIsCreateOpen(true)
    }

    const handleOpenEdit = (account: AccountResponse) => {
        setSelectedAccount(account)
        setFormData({
            name: account.name,
            balance: account.balance,
            color: account.color,
        })
        setIsEditOpen(true)
    }

    const handleCreate = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.balance.trim()) {
            toast.error("Preencha todos os campos!")
            return
        }
        createMutation.mutate(formData)
    }

    const handleEdit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedAccount) return
        if (!formData.name.trim() || !formData.balance.trim()) {
            toast.error("Preencha todos os campos!")
            return
        }
        updateMutation.mutate({ id: selectedAccount.id, data: formData })
    }

    const handleOpenDelete = (account: AccountResponse) => {
        setSelectedAccount(account)
        setIsDeleteOpen(true)
    }

    const handleDelete = () => {
        if (!selectedAccount) return
        deleteMutation.mutate(selectedAccount.id)
    }

    if (isLoading) {
        return (
            <Layout title="Contas">
                carregando...
            </Layout>
        )
    }

    return accountsData && (
        <Layout title="Contas">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
                <div>
                    <h1 className="font-bold text-2xl">Minhas contas</h1>
                    <span>Total: {formatCurrency(accountsData.total)}</span>
                </div>
                {accountsData.accounts.length > 0 &&
                    <Button
                        className="w-full mt-3 sm:w-50 sm:mt-0"
                        onClick={handleOpenCreate}
                    >
                        <PlusCircle />
                        Adicionar conta
                    </Button>}
            </div>

            {accountsData.accounts.length === 0 ?
                <div className="border-2 border-dashed rounded-md">
                    <EmptyData
                        icon={<Wallet />}
                        title="Nenhuma conta cadastrada"
                        description="Clique no botão abaixo para cadastrar uma nova conta"
                    >
                        <Button onClick={handleOpenCreate}>
                            <PlusCircle />
                            Adicionar conta
                        </Button>
                    </EmptyData>
                </div>
                :
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {accountsData.accounts.map(account => (
                        <div key={account.id} className="bg-white p-4 shadow-md rounded-md">
                            <div className="pl-2" style={{
                                borderLeft: `10px solid ${account.color}`
                            }}>
                                <h1 className="text-lg font-bold">{account.name}</h1>
                                <span className="text-sm">{formatCurrency(account.balance)}</span>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="hover:bg-neutral-50/15"
                                    onClick={() => handleOpenEdit(account)}
                                >
                                    <Pencil />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleOpenDelete(account)}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            }

            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Tem certeza que deseja excluir esta conta?"
                description="Esta ação não pode ser desfeita. Isso excluirá permanentemente todas as transações desta conta."
                handleDelete={handleDelete}
            />

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Nova conta</DialogTitle>
                        <DialogDescription>
                            Adicione uma nova conta.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })}
                                />
                            </Field>
                            <Field>
                                <div className="w-full max-w-sm space-y-2">
                                    <Label htmlFor="amount">Saldo</Label>
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
                                            value={formData.balance}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                balance: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </Field>
                            <Field>
                                <ColorPicker
                                    value={formData.color}
                                    onChange={(color) => setFormData({
                                        ...formData,
                                        color
                                    })} />
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

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Editar conta: {formData.name}</DialogTitle>
                        <DialogDescription>
                            Edite os dados desta conta.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })}
                                />
                            </Field>
                            <Field>
                                <div className="w-full max-w-sm space-y-2">
                                    <Label htmlFor="amount">Saldo</Label>
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
                                            value={formData.balance}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                balance: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </Field>
                            <Field>
                                <ColorPicker
                                    value={formData.color as string}
                                    onChange={(color) => setFormData({
                                        ...formData,
                                        color
                                    })} />
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
