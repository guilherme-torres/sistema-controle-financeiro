import { getAuthenticatedUser } from '@/api/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    console.log("verificando se usuário está autenticado...")
    const authData = await getAuthenticatedUser()
    console.log("auth data:", authData)
    if (!authData) {
        throw redirect({ to: '/login' });
    }
  },
  component: () => <Outlet />,
})
