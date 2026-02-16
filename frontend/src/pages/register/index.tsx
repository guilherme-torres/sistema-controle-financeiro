import { createUser } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const registerMutation = useMutation({
        mutationFn: () => createUser({ name, email, password }),
        onSuccess: () => {
            toast.success("Cadastro realizado com sucesso! Faça seu login.")
            navigate({ to: "/login" })
        },
        onError: (error) => {
            console.error("Falha ao criar usuário:", error)
            toast.error(error.message)
        }
    })

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        registerMutation.mutate()
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Criar conta</CardTitle>
                    <CardAction>
                        <Link to="/login" className="hover:underline">
                            Entrar
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} id="register-form">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
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
                        form="register-form"
                        className="w-full"
                        disabled={false}
                    >
                        Criar conta
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}