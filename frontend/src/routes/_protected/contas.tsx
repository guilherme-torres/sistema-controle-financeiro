import { AccountsPage } from '@/pages/accounts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/contas')({
  component: AccountsPage,
})
