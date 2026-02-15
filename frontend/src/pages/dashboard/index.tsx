import { logout } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

export function DashboardPage() {
    const navigate = useNavigate()

    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            navigate({ to: "/login" })
        },
        onError: (error) => {
            console.error("Falha no logout:", error)
            toast.error(error.message)
        }
    })

    return (
        <div>
            <h1>Dashboard</h1>
            <Button
                variant={"destructive"}
                onClick={() => logoutMutation.mutate()}
            >Sair</Button>
        </div>
    )
}