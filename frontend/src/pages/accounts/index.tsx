import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/color-picker"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { Wallet, Trash2, PlusCircle } from "lucide-react"
import {
    listAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
} from "@/api/account"
import { toast } from "sonner"
import type { AccountResponse } from "@/models/account"

export function AccountsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        balance: "",
        color: "#7b32a8",
    })
    const queryClient = useQueryClient()

    const { data: accounts = [], isLoading } = useQuery({
        queryKey: ["accounts"],
        queryFn: () => listAccounts(),
    })

    const createMutation = useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
            setIsCreateDialogOpen(false)
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
            setIsEditDialogOpen(false)
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
            setIsEditDialogOpen(false)
            setSelectedAccount(null)
            toast.success("Conta deletada com sucesso!")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleOpenCreateDialog = () => {
        setFormData({ name: "", balance: "", color: "#7b32a8" })
        setIsCreateDialogOpen(true)
    }

    const handleOpenEditDialog = (account: AccountResponse) => {
        setSelectedAccount(account)
        setFormData({
            name: account.name,
            balance: account.balance,
            color: account.color,
        })
        setIsEditDialogOpen(true)
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

    const handleDelete = () => {
        if (!selectedAccount) return
        deleteMutation.mutate(selectedAccount.id)
    }

    const totalBalance = accounts.reduce(
        (sum, acc) => sum + parseFloat(acc.balance),
        0
    )

    if (isLoading) {
        return (
            <Layout title="Contas">
                <div className="w-full space-y-12">
                    <div className="h-32 bg-primary/10 rounded-2xl animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-48 bg-card/50 rounded-xl animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout title="Contas">
            <div className="w-full space-y-12">
                <div className="relative overflow-hidden rounded-2xl bg-primary/10 border border-primary/20 p-8 backdrop-blur-sm">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-foreground/70 text-sm font-medium uppercase tracking-wide">
                                    Saldo Total
                                </p>
                                <p className="text-5xl font-bold from-primary text-primary mt-2">
                                    {formatCurrency(totalBalance.toFixed(2))}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-primary/20">
                            <p className="text-foreground/60 text-sm">
                                {accounts.length} contas ativas
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground px-1">
                            Contas
                        </h2>
                        {accounts.length > 0 &&
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <PlusCircle />
                                Adicionar conta
                            </Button>
                        }
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                onClick={() => handleOpenEditDialog(account)}
                                className="cursor-pointer rounded-xl border border-border/50 bg-card/50 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <p className="text-foreground/60 text-sm font-medium mb-1">
                                                Conta
                                            </p>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {account.name}
                                            </h3>
                                        </div>
                                        <div
                                            className="p-3 rounded-lg text-white shadow-lg"
                                            style={{ backgroundColor: account.color }}
                                        >
                                            <Wallet size={24} />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-foreground/60 text-xs font-medium uppercase mb-1">
                                            Saldo
                                        </p>
                                        <p className="text-3xl font-bold text-foreground">
                                            {formatCurrency(account.balance)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {accounts.length < 1 &&
                    <div
                        onClick={handleOpenCreateDialog}
                        className="rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors hover:bg-primary/5"
                    >
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Wallet className="text-primary" size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-foreground font-semibold mb-1">
                                Adicionar Nova Conta
                            </p>
                            <p className="text-foreground/60 text-sm">
                                Clique para cadastrar uma nova conta
                            </p>
                        </div>
                    </div>
                }
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-100">
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Conta</DialogTitle>
                        <DialogDescription>
                            Preencha os dados abaixo para criar uma nova conta
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Conta</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="balance">Saldo</Label>
                            <Input
                                id="balance"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                value={formData.balance}
                                onChange={(e) =>
                                    setFormData({ ...formData, balance: e.target.value })
                                }
                            />
                        </div>
                        <ColorPicker
                            value={formData.color}
                            onChange={(color) =>
                                setFormData({ ...formData, color })
                            }
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? "Criando..." : "Criar Conta"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-100">
                    <DialogHeader>
                        <DialogTitle>Editar Conta</DialogTitle>
                        <DialogDescription>
                            Modifique os dados da conta ou delete-a
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome da Conta</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-balance">Saldo</Label>
                            <Input
                                id="edit-balance"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                value={formData.balance}
                                onChange={(e) =>
                                    setFormData({ ...formData, balance: e.target.value })
                                }
                            />
                        </div>
                        <ColorPicker
                            value={formData.color}
                            onChange={(color) =>
                                setFormData({ ...formData, color })
                            }
                        />
                        <DialogFooter className="flex gap-2 sm:justify-between">
                            <Button
                                type="button"
                                variant="destructive"
                                disabled={deleteMutation.isPending}
                                onClick={handleDelete}
                                className="mr-auto"
                            >
                                <Trash2 size={16} className="mr-2" />
                                {deleteMutation.isPending ? "Deletando..." : "Deletar"}
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? "Salvando..." : "Salvar"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Layout>
    )
}
