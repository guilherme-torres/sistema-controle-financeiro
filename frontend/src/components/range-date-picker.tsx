import { ChevronDownIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerRangeProps {
    range?: DateRange
    setRange: (date?: DateRange) => void
    id?: string
    className?: string
}

export function DatePickerRange({
    range, setRange, id, className
}: DatePickerRangeProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline' id={id} className={cn('w-full justify-between font-normal', className)}>
                    {range?.from && range?.to
                        ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                        : 'Selecione um intervalo'}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
                <Calendar
                    mode='range'
                    selected={range}
                    onSelect={range => {
                        setRange(range)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
