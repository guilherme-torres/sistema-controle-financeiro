import type React from "react";
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { LogOut } from "lucide-react"
import { logout } from "@/api/auth"
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";

export function Layout({ title, children }: { title?: string, children: React.ReactNode }) {
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
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 items-center transition-[width,height] ease-linear
                group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        {title && <h1>{title}</h1>}
                    </div>
                    <Button
                        variant={"destructive"}
                        onClick={() => logoutMutation.mutate()}
                        className="cursor-pointer"
                    >
                        <LogOut />Sair
                    </Button>
                </header>
                <div className="flex flex-col flex-1 p-3">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}