import { Layout } from "@/components/layout"
import { useRouteContext } from "@tanstack/react-router"

export function DashboardPage() {
    const { authData } = useRouteContext({ from: "/_protected" })

    return (
        <Layout title="Dashboard">
            <h1>Olá, {authData.name}</h1>
        </Layout>
    )
}