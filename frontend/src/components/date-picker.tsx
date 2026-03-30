import { useState } from 'react'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    id?: string
    className?: string
}

export function DatePicker({
    date, setDate, id, className
}: DatePickerProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='outline' id={id} className={cn('w-full justify-between font-normal', className)}>
                    <span className='flex items-center'>
                        <CalendarIcon className='mr-2' />
                        {date ? format(date, "P", { locale: ptBR }) : 'Selecione uma data'}
                    </span>
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
                <Calendar
                    mode='single'
                    selected={date}
                    onSelect={date => {
                        setDate(date)
                        setOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
