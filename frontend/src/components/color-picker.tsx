import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
]

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    const [showCustomPicker, setShowCustomPicker] = useState(false)

    return (
        <div className="space-y-3">
            <Label>Cor</Label>
            <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color}
                        onClick={(e) => {
                            e.preventDefault()
                            onChange(color)
                        }}
                        className={`w-full h-10 rounded-lg transition-all border-2 ${value === color
                                ? "border-foreground scale-110"
                                : "border-transparent hover:scale-105"
                            }`}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
            <div className="flex gap-2 items-center">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-muted-foreground">ou</span>
                <div className="flex-1 h-px bg-border"></div>
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    setShowCustomPicker(!showCustomPicker)
                }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
            >
                {showCustomPicker ? "Fechar" : "Cor Personalizada"}
            </button>
            {showCustomPicker && (
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-16 h-10 rounded-lg cursor-pointer border border-border"
                    />
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                    />
                </div>
            )}
        </div>
    )
}
