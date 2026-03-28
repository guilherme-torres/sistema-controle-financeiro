import { useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'


interface ComboboxProps {
    value: string
    onValueChange: (value: string) => void
    placeholder: string
    items: {
        value: string
        label: string
    }[]
}

export function Combobox({
    value,
    onValueChange,
    placeholder,
    items,
}: ComboboxProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between'
                    aria-label='Framework combobox'
                >
                    {value ? items.find(item => item.value === value)?.label : placeholder}
                    <ChevronsUpDownIcon className='opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {items.map(item => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={currentValue => {
                                        onValueChange(currentValue === value ? '' : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {item.label}
                                    <CheckIcon className={cn('ml-auto', value === item.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
