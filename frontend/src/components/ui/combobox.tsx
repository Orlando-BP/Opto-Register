"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface ComboboxOption {
  value: string | number
  label: string
  keywords?: string[]
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | number
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  loading?: boolean
  disabled?: boolean
  disabledMessage?: string
  className?: string
  hideSearch?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar opción...",
  searchPlaceholder = "Buscar...",
  emptyText = "No se encontraron resultados.",
  loading = false,
  disabled = false,
  disabledMessage,
  className,
  hideSearch = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = React.useMemo(
    () => options.find((option) => String(option.value) === String(value)),
    [options, value]
  )

  const buttonContent = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        "w-full justify-between h-9 border-primary bg-white shadow-xs",
        "hover:bg-white hover:text-muted-foreground/60 hover:border-blue-500",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando...
        </span>
      ) : (
        <>
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </>
      )}
    </Button>
  )

  if (disabled && disabledMessage) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <div>{buttonContent}</div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-62.5">
            <p className="text-sm">{disabledMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{buttonContent}</PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command className="max-h-75">
          {!hideSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList
            className="max-h-60 overflow-y-auto"
            onWheel={(e: React.WheelEvent) => {
              // Ensure mouse wheel scrolls the command list inside the popover
              const target = e.currentTarget as HTMLElement
              target.scrollBy({ top: e.deltaY })
            }}
          >
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  value={`${option.value}-${option.label}`}
                  keywords={[...(option.keywords || []), option.label]}
                  onSelect={() => {
                    onValueChange?.(String(option.value))
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      String(value) === String(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}