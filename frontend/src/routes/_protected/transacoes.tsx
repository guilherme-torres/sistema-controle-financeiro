import { TransactionsPage } from '@/pages/transactions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/transacoes')({
  component: TransactionsPage,
})
