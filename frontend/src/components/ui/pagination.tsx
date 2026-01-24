import { Button }  from "@/components/ui/Button"
import { Combobox } from "@/components/ui/combobox"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react" 

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
  showItemCount?: boolean
  startItem?: number
  endItem?: number
  itemLabel?: string
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
  showItemCount = true,
  startItem,
  endItem,
  itemLabel = "registros",
}: PaginationProps) {
  const calculatedStartItem = startItem ?? (totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1)
  const calculatedEndItem = endItem ?? Math.min(totalItems, currentPage * pageSize)

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      {showItemCount && (
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{calculatedStartItem}</span> -{" "}
          <span className="font-semibold text-foreground">{calculatedEndItem}</span> de{" "}
          <span className="font-semibold text-foreground">{totalItems}</span> {itemLabel}
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Mostrar</label>
          <Combobox
            className="w-20 border-primary"
            options={pageSizeOptions.map((size) => ({ value: String(size), label: String(size) }))}
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
            placeholder="Tamaño"
            hideSearch
          />
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {currentPage} / {totalPages}
          </div>
          <Button
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
