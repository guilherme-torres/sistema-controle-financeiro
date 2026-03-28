import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/color-picker"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tag, Trash2, PlusCircle, Pencil } from "lucide-react"
import { toast } from "sonner"
import type { CategoryResponse, CategoryType } from "@/models/category"
import {
    listCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/api/category"
import { EmptyData } from "@/components/empty-data"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"

function CategoryList({
    categories,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
}: {
    categories: CategoryResponse[],
    handleOpenEdit: (category: CategoryResponse) => void,
    handleOpenCreate: () => void,
    handleOpenDelete: (category: CategoryResponse) => void
}) {
    return categories.length === 0 ?
        <div className="border-2 border-dashed rounded-md">
            <EmptyData
                icon={<Tag />}
                title="Nenhuma categoria adicionada"
                description="Clique no botão abaixo para adicionar uma nova categoria"
            >
                <Button onClick={handleOpenCreate}>
                    <PlusCircle />
                    Adicionar categoria
                </Button>
            </EmptyData>
        </div>
        :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {categories.map(category => (
                <div key={category.id} className="bg-white p-4 shadow-md rounded-md">
                    <div className="pl-2" style={{
                        borderLeft: `10px solid ${category.color}`
                    }}>
                        <h1 className="text-lg font-bold">{category.name}</h1>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-neutral-50/15"
                            onClick={() => handleOpenEdit(category)}
                        >
                            <Pencil />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleOpenDelete(category)}
                        >
                            <Trash2 />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
}

export function CategoriesPage() {
    const [activeTab, setActiveTab] = useState("EXPENSES")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        color: "#e53935"
    })
    const queryClient = useQueryClient()

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories", activeTab],
        queryFn: () => listCategories(activeTab as CategoryType),
    })

    const createMutation = useMutation({
        mutationFn: (data: { name: string; color: string; category_type: string }) =>
            createCategory(data as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            setIsCreateOpen(false)
            setFormData({ name: "", color: "#e53935" })
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
            setIsEditOpen(false)
            setSelectedCategory(null)
            setFormData({ name: "", color: "#e53935" })
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
            setIsDeleteOpen(false)
            setSelectedCategory(null)
            toast.success("Categoria deletada com sucesso!")
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const handleOpenCreate = () => {
        setFormData({ name: "", color: "#e53935" })
        setIsCreateOpen(true)
    }

    const handleOpenEdit = (category: CategoryResponse) => {
        setSelectedCategory(category)
        setFormData({ name: category.name, color: category.color })
        setIsEditOpen(true)
    }

    const handleCreate = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error("Preencha o nome da categoria!")
            return
        }
        createMutation.mutate({ ...formData, category_type: activeTab })
    }

    const handleEdit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedCategory) return
        if (!formData.name.trim()) {
            toast.error("Preencha o nome da categoria!")
            return
        }
        updateMutation.mutate({ id: selectedCategory.id, data: formData })
    }

    const handleOpenDelete = (category: CategoryResponse) => {
        setSelectedCategory(category)
        setIsDeleteOpen(true)
    }

    const handleDelete = () => {
        if (!selectedCategory) return
        deleteMutation.mutate(selectedCategory.id)
    }

    if (isLoading) {
        return (
            <Layout title="Categorias">
                carregando...
            </Layout>
        )
    }

    return categories && (
        <Layout title="Categorias">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
                <h1 className="font-bold text-2xl">Minhas categorias</h1>
                {categories.length > 0 &&
                    <Button
                        className="w-full mt-3 sm:w-50 sm:mt-0"
                        onClick={handleOpenCreate}
                    >
                        <PlusCircle />
                        Adicionar categoria
                    </Button>}
            </div>

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className='gap-4'>
                <TabsList className='bg-background rounded-none border-b p-0 w-full max-w-md'>
                    <TabsTrigger
                        value="EXPENSES"
                        className='bg-background data-[state=active]:border-destructive dark:data-[state=active]:border-destructive h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none!'
                    >
                        Saídas
                    </TabsTrigger>
                    <TabsTrigger
                        value="INCOME"
                        className='bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none!'
                    >
                        Entradas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="EXPENSES">
                    <CategoryList
                        categories={categories}
                        handleOpenCreate={handleOpenCreate}
                        handleOpenDelete={handleOpenDelete}
                        handleOpenEdit={handleOpenEdit}
                    />
                </TabsContent>

                <TabsContent value="INCOME">
                    <CategoryList
                        categories={categories}
                        handleOpenCreate={handleOpenCreate}
                        handleOpenDelete={handleOpenDelete}
                        handleOpenEdit={handleOpenEdit}
                    />
                </TabsContent>
            </Tabs>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogTrigger asChild>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja excluir esta categoria?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Nova categoria</DialogTitle>
                        <DialogDescription>
                            Adicione uma nova categoria.
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
                        <DialogTitle>Editar categoria: {formData.name}</DialogTitle>
                        <DialogDescription>
                            Edite os dados desta categoria.
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
        </Layout>
    )
}

export default CategoriesPage