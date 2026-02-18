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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PlusCircle, Trash2, Tag, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react"
import { toast } from "sonner"
import type { CategoryResponse } from "@/models/category"
import {
    listCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/api/category"

export function CategoriesPage() {
    const [activeTab, setActiveTab] = useState<"EXPENSES" | "INCOME">("EXPENSES")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null)
    const [formData, setFormData] = useState({ name: "", color: "#7b32a8" })
    const queryClient = useQueryClient()

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories", activeTab],
        queryFn: () => listCategories(activeTab),
    })

    const createMutation = useMutation({
        mutationFn: (data: { name: string; color: string; category_type: string }) =>
            createCategory(data as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            setIsCreateDialogOpen(false)
            setFormData({ name: "", color: "#7b32a8" })
            toast.success("Categoria criada com sucesso!")
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name?: string; color?: string } }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            setIsEditDialogOpen(false)
            setSelectedCategory(null)
            setFormData({ name: "", color: "#7b32a8" })
            toast.success("Categoria atualizada com sucesso!")
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            setIsEditDialogOpen(false)
            setSelectedCategory(null)
            toast.success("Categoria deletada com sucesso!")
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const handleOpenCreateDialog = () => {
        setFormData({ name: "", color: "#7b32a8" })
        setIsCreateDialogOpen(true)
    }

    const handleOpenEditDialog = (category: CategoryResponse) => {
        setSelectedCategory(category)
        setFormData({ name: category.name, color: category.color })
        setIsEditDialogOpen(true)
    }

    const handleCreateSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error("Preencha o nome da categoria!")
            return
        }
        createMutation.mutate({ ...formData, category_type: activeTab })
    }

    const handleEditSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedCategory) return
        if (!formData.name.trim()) {
            toast.error("Preencha o nome da categoria!")
            return
        }
        updateMutation.mutate({ id: selectedCategory.id, data: formData })
    }

    const handleDelete = () => {
        if (!selectedCategory) return
        deleteMutation.mutate(selectedCategory.id)
    }

    if (isLoading) {
        return (
            <Layout title="Categorias">
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
        <Layout title="Categorias">
            <div className="w-full space-y-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground px-1">Categorias</h2>
                    <Button onClick={handleOpenCreateDialog}>
                        <PlusCircle />
                        Adicionar categoria
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                    <TabsList className="w-full sm:w-200 bg-background rounded-none border-b p-0">
                        <TabsTrigger value="EXPENSES" className="bg-background data-[state=active]:border-red-600 h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none">
                            <BanknoteArrowUp />SAÍDAS
                        </TabsTrigger>
                        <TabsTrigger value="INCOME" className="bg-background data-[state=active]:border-green-600 h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none">
                            <BanknoteArrowDown />ENTRADAS
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="EXPENSES">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => handleOpenEditDialog(cat)}
                                    className="cursor-pointer rounded-xl border border-border/50 bg-card/50 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:-translate-y-1 p-6"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-foreground/60 text-sm font-medium mb-1">
                                                Categoria
                                            </p>
                                            <h3 className="text-lg font-semibold text-foreground">{cat.name}</h3>
                                        </div>
                                        <div className="p-3 rounded-lg text-white shadow-lg" style={{ backgroundColor: cat.color }}>
                                            <Tag size={20} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {categories.length < 1 &&
                            <div
                                onClick={handleOpenCreateDialog}
                                className="rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors hover:bg-primary/5"
                            >
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Tag className="text-primary" size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-foreground font-semibold mb-1">
                                        Adicionar categoria
                                    </p>
                                    <p className="text-foreground/60 text-sm">
                                        Clique para cadastrar uma nova categoria
                                    </p>
                                </div>
                            </div>
                        }
                    </TabsContent>

                    <TabsContent value="INCOME">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => handleOpenEditDialog(cat)}
                                    className="cursor-pointer rounded-xl border border-border/50 bg-card/50 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:-translate-y-1 p-6"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-foreground/60 text-sm font-medium mb-1">
                                                Categoria
                                            </p>
                                            <h3 className="text-lg font-semibold text-foreground">{cat.name}</h3>
                                        </div>
                                        <div className="p-3 rounded-lg text-white shadow-lg" style={{ backgroundColor: cat.color }}>
                                            <Tag size={20} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {categories.length < 1 &&
                            <div
                                onClick={handleOpenCreateDialog}
                                className="rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors hover:bg-primary/5"
                            >
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Tag className="text-primary" size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-foreground font-semibold mb-1">
                                        Adicionar categoria
                                    </p>
                                    <p className="text-foreground/60 text-sm">
                                        Clique para cadastrar uma nova categoria
                                    </p>
                                </div>
                            </div>
                        }
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-100">
                    <DialogHeader>
                        <DialogTitle>Adicionar Categoria</DialogTitle>
                        <DialogDescription>Crie uma nova categoria</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <ColorPicker value={formData.color} onChange={(color) => setFormData({ ...formData, color })} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Criando..." : "Criar Categoria"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-100">
                    <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                        <DialogDescription>Modifique os dados da categoria ou delete-a</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome</Label>
                            <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <ColorPicker value={formData.color} onChange={(color) => setFormData({ ...formData, color })} />
                        <DialogFooter className="flex gap-2 sm:justify-between">
                            <Button type="button" variant="destructive" disabled={deleteMutation.isPending} onClick={handleDelete} className="mr-auto">
                                <Trash2 size={16} className="mr-2" />
                                {deleteMutation.isPending ? "Deletando..." : "Deletar"}
                            </Button>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={updateMutation.isPending}>
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

export default CategoriesPage