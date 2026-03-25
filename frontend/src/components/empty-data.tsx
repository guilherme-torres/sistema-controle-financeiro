import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import type React from "react"

export function EmptyData({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode,
    title: string,
    description: string,
    children?: React.ReactNode
}) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">{icon}</EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                {children}
            </EmptyContent>
        </Empty>
    )
}
