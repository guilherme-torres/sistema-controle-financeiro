import { CategoriesPage } from '@/pages/categories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/categorias')({
  component: CategoriesPage,
})
