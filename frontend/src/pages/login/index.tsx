import { login } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const loginMutation = useMutation({
        mutationFn: () => login(email, password),
        onSuccess: () => {
            navigate({ to: "/" })
        },
        onError: (error) => {
            console.error("Falha no login:", error)
            toast.error(error.message)
        }
    })

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        loginMutation.mutate()
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Entrar</CardTitle>
                    <CardAction>
                        <Link to="/register" className="hover:underline">
                            Criar conta
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} id="login-form">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        form="login-form"
                        className="w-full"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}