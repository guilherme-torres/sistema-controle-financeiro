"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TablePagination } from "./pagination"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageIndex: number
    pageSize: number
    total: number
    onPageChange: (pageIndex: number) => void
    onPageSizeChange: (pageSize: number) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageIndex,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        manualPagination: true,
        pageCount: Math.ceil(total / pageSize),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-muted/50">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Nenhum resultado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="p-4">
                <TablePagination
                    pageIndex={table.getState().pagination.pageIndex}
                    pageCount={table.getPageCount()}
                    pageSize={table.getState().pagination.pageSize}
                    rowCount={total}
                    onPageChange={(pageIndex) => onPageChange(pageIndex)}
                    onPageSizeChange={(pageSize) => onPageSizeChange(pageSize)}
                />
            </div>
        </div>
    )
}