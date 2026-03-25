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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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

export function AccountsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        balance: "",
        color: "#7b32a8",
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
            setFormData({ name: "", balance: "", color: "#7b32a8" })
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
            setFormData({ name: "", balance: "", color: "#7b32a8" })
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
            setIsEditOpen(false)
            setSelectedAccount(null)
            toast.success("Conta deletada com sucesso!")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleOpenCreate = () => {
        setFormData({ name: "", balance: "", color: "#7b32a8" })
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

    const handleCreateSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.balance.trim()) {
            toast.error("Preencha todos os campos!")
            return
        }
        createMutation.mutate(formData)
    }

    const handleEditSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedAccount) return
        if (!formData.name.trim() || !formData.balance.trim()) {
            toast.error("Preencha todos os campos!")
            return
        }
        updateMutation.mutate({ id: selectedAccount.id, data: formData })
    }

    const handleDelete = (accountId: number) => {
        deleteMutation.mutate(accountId)
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
            <div>
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
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                            >
                                                <Trash2 />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Tem certeza que deseja excluir esta conta?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente todas as transações desta conta.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    variant="destructive"
                                                    onClick={() => handleDelete(account.id)}
                                                >
                                                    Excluir
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <form>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Nova conta</DialogTitle>
                            <DialogDescription>
                                Adicione uma nova conta.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" name="name" />
                            </Field>
                            <Field>
                                <Label htmlFor="balance">Saldo</Label>
                                <Input id="balance" name="balance" />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <form>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Editar conta: {selectedAccount?.name}</DialogTitle>
                            <DialogDescription>
                                Edite os dados da conta.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" name="name" defaultValue={selectedAccount?.name} />
                            </Field>
                            <Field>
                                <Label htmlFor="balance">Saldo</Label>
                                <Input id="balance" name="balance" />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </Layout>
    )
}
