import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ColorPicker } from "@/components/color-picker"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tag, Trash2, PlusCircle, ArrowRight, Plus, BanknoteArrowDown, BanknoteArrowUp, Library } from "lucide-react"
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
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
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
            setIsCreateSheetOpen(false)
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
            setIsEditSheetOpen(false)
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
            setIsEditSheetOpen(false)
            setSelectedCategory(null)
            toast.success("Categoria deletada com sucesso!")
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const handleOpenCreateSheet = () => {
        setFormData({ name: "", color: "#7b32a8" })
        setIsCreateSheetOpen(true)
    }

    const handleOpenEditSheet = (category: CategoryResponse) => {
        setSelectedCategory(category)
        setFormData({ name: category.name, color: category.color })
        setIsEditSheetOpen(true)
    }

    const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error("Preencha o nome da categoria!")
            return
        }
        createMutation.mutate({ ...formData, category_type: activeTab })
    }

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
                carregando...
            </Layout>
        )
    }

    return (
        <Layout title="Categorias">
            minhas categorias
        </Layout>
    )
}

export default CategoriesPage