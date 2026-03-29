import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type TablePaginationProps = {
    pageIndex: number
    pageCount: number
    pageSize: number
    rowCount: number
    onPageChange: (pageIndex: number) => void
    onPageSizeChange: (pageSize: number) => void
}

export function TablePagination({
    pageIndex,
    pageCount,
    pageSize,
    rowCount,
    onPageChange,
    onPageSizeChange,
}: TablePaginationProps) {

    const start = rowCount === 0 ? 0 : pageIndex * pageSize + 1
    const end = Math.min(rowCount, (pageIndex + 1) * pageSize)

    const visiblePages = Array.from({ length: pageCount }, (_, index) => index)
    const maxVisible = 5
    let pages = visiblePages

    if (pageCount > maxVisible) {
        const half = Math.floor(maxVisible / 2)
        let startIndex = Math.max(0, pageIndex - half)
        let endIndex = startIndex + maxVisible

        if (endIndex > pageCount) {
            endIndex = pageCount
            startIndex = pageCount - maxVisible
        }

        pages = visiblePages.slice(startIndex, endIndex)
    }

    return (
        <div className='flex w-full flex-wrap items-center justify-between gap-6 max-sm:justify-center'>
            <div className='flex shrink-0 items-center gap-3'>
                <Label>Linhas por página</Label>
                <Select
                    value={String(pageSize)}
                    onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                    <SelectTrigger className='w-fit whitespace-nowrap'>
                        <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent className='[&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto'>
                        <SelectItem value='5'>5</SelectItem>
                        <SelectItem value='10'>10</SelectItem>
                        <SelectItem value='25'>25</SelectItem>
                        <SelectItem value='50'>50</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='text-muted-foreground flex grow items-center justify-end whitespace-nowrap max-sm:justify-center'>
                <p className='text-muted-foreground text-sm whitespace-nowrap' aria-live='polite'>
                    Mostrando <span className='text-foreground'>{start}</span> a <span className='text-foreground'>{end}</span> de{' '}
                    <span className='text-foreground'>{rowCount}</span> registros
                </p>
            </div>
            <Pagination className='w-fit max-sm:mx-0'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink
                            href='#'
                            aria-label='Ir para a primeira página'
                            size='icon'
                            className='rounded-full'
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(0)
                            }}
                            aria-disabled={pageIndex === 0}
                        >
                            <ChevronFirstIcon className='size-4' />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            href='#'
                            aria-label='Ir para a página anterior'
                            size='icon'
                            className='rounded-full'
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(Math.max(0, pageIndex - 1))
                            }}
                            aria-disabled={pageIndex === 0}
                        >
                            <ChevronLeftIcon className='size-4' />
                        </PaginationLink>
                    </PaginationItem>
                    {pages.map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href='#'
                                isActive={page === pageIndex}
                                className='rounded-full'
                                onClick={(e) => {
                                    e.preventDefault()
                                    onPageChange(page)
                                }}
                            >
                                {page + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {pageCount > pages.length && (
                        <PaginationItem>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <PaginationEllipsis />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Mais páginas</p>
                                </TooltipContent>
                            </Tooltip>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationLink
                            href='#'
                            aria-label='Ir para a próxima página'
                            size='icon'
                            className='rounded-full'
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(Math.min(pageCount - 1, pageIndex + 1))
                            }}
                            aria-disabled={pageIndex >= pageCount - 1}
                        >
                            <ChevronRightIcon className='size-4' />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            href='#'
                            aria-label='Ir para a última página'
                            size='icon'
                            className='rounded-full'
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(pageCount - 1)
                            }}
                            aria-disabled={pageIndex >= pageCount - 1}
                        >
                            <ChevronLastIcon className='size-4' />
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
