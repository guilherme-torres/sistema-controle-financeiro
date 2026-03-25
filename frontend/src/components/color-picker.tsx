import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef } from "react"

interface ColorPickerProps {
    value: string
    onChange: (color: string) => void
}

const PRESET_COLORS = [
    "#e53935",
    "#6c63ff",
    "#00acc1",
    "#8e24aa",
    "#ffa726",
    "#29b6f6",
    "#66bb6a",
]

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    const colorInputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-3">
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                onChange(color)
                            }}
                            className={`w-8 h-8 rounded-full ${value === color && "ring-2 ring-offset-2 ring-foreground"
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                            aria-label={`Selecionar cor ${color}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-3 items-center">
                <button
                    type="button"
                    onClick={() => colorInputRef.current?.click()}
                    className={`w-9 h-8 rounded-full ${!PRESET_COLORS.includes(value)
                            && "ring-2 ring-offset-2 ring-foreground"}`}
                    style={{ backgroundColor: value }}
                    title="Cor Personalizada"
                    aria-label="Escolher cor personalizada"
                />

                <input
                    ref={colorInputRef}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="sr-only"
                />

                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="h-8 font-mono text-xs uppercase"
                    maxLength={7}
                />
            </div>
        </div>
    )
}