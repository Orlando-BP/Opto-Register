import * as React from "react";
import { cn } from "@/lib/utils";
import { Pagination } from "./pagination";
import { Input } from "./input";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, FilterX } from "lucide-react";

type CheckedState = boolean | "indeterminate";

type MultipleSelectionConfig =
    | {
          show?: true;
          checked: CheckedState;
          onCheckedChange: (checked: CheckedState) => void;
          disabled?: boolean;
          ariaLabel?: string;
      }
    | {
          show: false;
      };

export type TableFilterType = "text" | "combobox" | "combobox-search";

export type TableFiltersState = Record<
    string,
    {
        enabled: boolean;
        value: string;
    }
>;

type TableFiltersConfig = {
    enabled?: boolean;
    /** Tiempo (ms) para emitir `onChange` (debounce). */
    debounceMs?: number;
    /** Se llama con el estado debounced de filtros. */
    onChange?: (filters: TableFiltersState) => void;
};

type TableFiltersContextValue = {
    get: (key: string) => { enabled: boolean; value: string };
    setEnabled: (key: string, enabled: boolean) => void;
    setValue: (key: string, value: string) => void;
};

const TableFiltersContext =
    React.createContext<TableFiltersContextValue | null>(null);

type TableLayoutContextValue = {
    hasOverflowX: boolean;
};

const TableLayoutContext = React.createContext<TableLayoutContextValue | null>(
    null,
);

interface TableProps extends React.ComponentProps<"table"> {
    pagination?:
        | {
              /** Deshabilita paginación sin requerir demás props. */
              enabled: false;
              position?: "top" | "bottom" | "both" | "none";
          }
        | {
              /** Por defecto: true cuando se provee `pagination`. */
              enabled?: true;
              currentPage: number;
              totalPages: number;
              pageSize: number;
              totalItems: number;
              onPageChange: (page: number) => void;
              onPageSizeChange: (size: number) => void;
              pageSizeOptions?: number[];
              showItemCount?: boolean;
              itemLabel?: string;
              /** Por defecto: 'both'. Usa 'none' para no renderizar paginación. */
              position?: "top" | "bottom" | "both" | "none";
          };
    filters?: TableFiltersConfig;
}

function Table({ className, pagination, filters, ...props }: TableProps) {
    const paginationEnabled =
        !!pagination && (pagination as any).enabled !== false;
    const paginationPosition = (pagination as any)?.position ?? "both";
    const showTopPagination =
        paginationEnabled &&
        (paginationPosition === "top" || paginationPosition === "both");
    const showBottomPagination =
        paginationEnabled &&
        (paginationPosition === "bottom" || paginationPosition === "both");

    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    const tableRef = React.useRef<HTMLTableElement>(null);
    const [hasOverflowX, setHasOverflowX] = React.useState(false);

    const checkOverflowX = React.useCallback(() => {
        const el = tableContainerRef.current;
        if (!el) return;
        // +1 para evitar flicker por subpíxeles
        setHasOverflowX(el.scrollWidth > el.clientWidth + 1);
    }, []);

    React.useEffect(() => {
        checkOverflowX();

        const container = tableContainerRef.current;
        const table = tableRef.current;

        if (typeof ResizeObserver === "undefined" || !container) {
            window.addEventListener("resize", checkOverflowX);
            return () => window.removeEventListener("resize", checkOverflowX);
        }

        const ro = new ResizeObserver(() => {
            checkOverflowX();
        });
        ro.observe(container);
        if (table) ro.observe(table);

        window.addEventListener("resize", checkOverflowX);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", checkOverflowX);
        };
    }, [checkOverflowX]);

    const filtersEnabled = !!filters?.enabled;
    const [filtersState, setFiltersState] = React.useState<TableFiltersState>(
        {},
    );

    const getFilter = React.useCallback(
        (key: string) => {
            const current = filtersState[key];
            return {
                enabled: current?.enabled ?? false,
                value: current?.value ?? "",
            };
        },
        [filtersState],
    );

    const setEnabled = React.useCallback((key: string, enabled: boolean) => {
        setFiltersState((prev) => {
            const currentValue = prev[key]?.value ?? "";
            return {
                ...prev,
                [key]: {
                    enabled,
                    value: enabled ? currentValue : "",
                },
            };
        });
    }, []);

    const setValue = React.useCallback((key: string, value: string) => {
        setFiltersState((prev) => ({
            ...prev,
            [key]: {
                enabled: prev[key]?.enabled ?? true,
                value,
            },
        }));
    }, []);

    const onFiltersChange = filters?.onChange;
    const debounceMs = filters?.debounceMs ?? 300;
    React.useEffect(() => {
        if (!filtersEnabled || !onFiltersChange) return;
        const timer = setTimeout(() => {
            onFiltersChange(filtersState);
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [filtersEnabled, onFiltersChange, debounceMs, filtersState]);

    const filtersContextValue = React.useMemo<TableFiltersContextValue>(() => {
        return {
            get: getFilter,
            setEnabled,
            setValue,
        };
    }, [getFilter, setEnabled, setValue]);

    const layoutContextValue = React.useMemo<TableLayoutContextValue>(() => {
        return { hasOverflowX };
    }, [hasOverflowX]);

    const content = (
        <div className="space-y-4">
            {showTopPagination && (
                <>
                    <Pagination
                        currentPage={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).currentPage
                        }
                        totalPages={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).totalPages
                        }
                        pageSize={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).pageSize
                        }
                        totalItems={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).totalItems
                        }
                        onPageChange={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).onPageChange
                        }
                        onPageSizeChange={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).onPageSizeChange
                        }
                        pageSizeOptions={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).pageSizeOptions
                        }
                        showItemCount={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).showItemCount
                        }
                        itemLabel={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).itemLabel
                        }
                    />
                    <div className="border-t border-border" />
                </>
            )}

            <div
                data-slot="table-container"
                ref={tableContainerRef}
                className="relative w-full overflow-x-auto border border-border rounded-md"
            >
                <table
                    data-slot="table"
                    ref={tableRef}
                    className={cn(
                        "w-full caption-bottom text-sm border-collapse",
                        className,
                    )}
                    {...props}
                />
            </div>

            {showBottomPagination && (
                <>
                    <div className="border-t border-border" />
                    <Pagination
                        currentPage={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).currentPage
                        }
                        totalPages={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).totalPages
                        }
                        pageSize={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).pageSize
                        }
                        totalItems={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).totalItems
                        }
                        onPageChange={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).onPageChange
                        }
                        onPageSizeChange={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).onPageSizeChange
                        }
                        pageSizeOptions={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).pageSizeOptions
                        }
                        showItemCount={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).showItemCount
                        }
                        itemLabel={
                            (
                                pagination as Extract<
                                    TableProps["pagination"],
                                    { enabled?: true }
                                >
                            ).itemLabel
                        }
                    />
                </>
            )}
        </div>
    );

    const withLayout = (
        <TableLayoutContext.Provider value={layoutContextValue}>
            {content}
        </TableLayoutContext.Provider>
    );

    if (!filtersEnabled) return withLayout;

    return (
        <TableFiltersContext.Provider value={filtersContextValue}>
            {withLayout}
        </TableFiltersContext.Provider>
    );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
    return (
        <thead
            data-slot="table-header"
            className={cn("[&_tr]:border-b bg-primary/10", className)}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
    return (
        <tbody
            data-slot="table-body"
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn(
                "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
                className,
            )}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                "group h-[49.33px] hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
                className,
            )}
            {...props}
        />
    );
}

interface TableHeadProps extends React.ComponentProps<"th"> {
    /** Renderiza un checkbox estándar para selección múltiple en el header. */
    multipleSelection?: boolean;
    /** Hace sticky (left: 0) la columna de selección. Por defecto: true cuando `multipleSelection` está habilitado. */
    sticky?: boolean;
    /** Fondo para la columna sticky cuando hay overflow X. Si no se provee, usa `bg-primary/10`. */
    stickyBgClassName?: string;
    /** Configuración del checkbox cuando `multipleSelection` está habilitado. */
    selection?: MultipleSelectionConfig;
    /** Habilita UI de filtro en este header (si `Table` tiene `filters.enabled`). */
    filter?: boolean;
    /** Clave estable para leer/escribir el filtro en el estado del Table. */
    filterKey?: string;
    /** Tipo de control a renderizar. */
    type?: TableFilterType;
    /** Opciones para combobox. */
    options?: ComboboxOption[];
    /** Placeholder del control. */
    placeholder?: string;
    /** Alineación del header cuando se usa layout en columna. */
    align?: "left" | "center" | "right";
}

function TableHead({
    className,
    multipleSelection,
    sticky,
    stickyBgClassName,
    selection,
    filter,
    filterKey,
    type = "text",
    options,
    placeholder,
    align,
    children,
    ...props
}: TableHeadProps) {
    const filtersContext = React.useContext(TableFiltersContext);
    const layoutContext = React.useContext(TableLayoutContext);
    void layoutContext;

    const inferredAlign: "left" | "center" | "right" = React.useMemo(() => {
        if (align) return align;
        if (className?.includes("text-right")) return "right";
        if (className?.includes("text-center")) return "center";
        return "left";
    }, [align, className]);

    const key = filter ? filterKey : undefined;
    const hasFilters = !!filtersContext && !!key;

    if (multipleSelection) {
        const showCheckbox = !!selection && selection.show !== false;
        const isSticky = sticky !== false;

        const selectionColumnClasses =
            "w-[72px] min-w-[72px] border-r border-border";
        const stickyBg = stickyBgClassName ?? "bg-primary/10";

        return (
            <th
                data-slot="table-head"
                className={cn(
                    "relative text-foreground px-2 py-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-2 *:[[role=checkbox]]:translate-y-0.5",
                    selectionColumnClasses,
                    isSticky && "sticky left-0 z-30",
                    isSticky && "bg-background",
                    className,
                )}
                {...props}
            >
                {isSticky && (
                    <span
                        aria-hidden
                        className={cn(
                            "pointer-events-none absolute inset-0 z-0",
                            stickyBg,
                        )}
                    />
                )}
                <div className="relative z-10 flex items-center gap-2">
                    {showCheckbox ? (
                        <Checkbox
                            className="border-primary"
                            checked={
                                (
                                    selection as Extract<
                                        MultipleSelectionConfig,
                                        { show?: true }
                                    >
                                ).checked
                            }
                            onCheckedChange={
                                (
                                    selection as Extract<
                                        MultipleSelectionConfig,
                                        { show?: true }
                                    >
                                ).onCheckedChange
                            }
                            disabled={
                                (
                                    selection as Extract<
                                        MultipleSelectionConfig,
                                        { show?: true }
                                    >
                                ).disabled
                            }
                            aria-label={
                                (
                                    selection as Extract<
                                        MultipleSelectionConfig,
                                        { show?: true }
                                    >
                                ).ariaLabel ?? "Seleccionar"
                            }
                        />
                    ) : (
                        <span aria-hidden className="inline-block size-4" />
                    )}
                    {children}
                </div>
            </th>
        );
    }

    if (!filter || !hasFilters) {
        return (
            <th
                data-slot="table-head"
                className={cn(
                    "text-foreground px-2 py-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
                    className,
                )}
                {...props}
            >
                {children}
            </th>
        );
    }

    const current = filtersContext.get(key);
    const headerLabelText = typeof children === "string" ? children : undefined;

    const control =
        type === "text" ? (
            <Input
                placeholder={placeholder}
                value={current.value}
                onChange={(e) => filtersContext.setValue(key, e.target.value)}
                className="h-8 text-xs"
            />
        ) : (
            <Combobox
                options={options ?? []}
                value={current.value}
                onValueChange={(value) => filtersContext.setValue(key, value)}
                placeholder={placeholder}
                hideSearch={type === "combobox"}
            />
        );

    return (
        <th
            data-slot="table-head"
            className={cn(
                "text-foreground px-2 py-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
                className,
            )}
            {...props}
        >
            <TableColumnHeader
                label={children}
                align={inferredAlign}
                filter={{
                    enabled: current.enabled,
                    onToggle: () =>
                        filtersContext.setEnabled(key, !current.enabled),
                    control,
                    ariaLabel: headerLabelText
                        ? current.enabled
                            ? `Quitar filtro de ${headerLabelText}`
                            : `Activar filtro de ${headerLabelText}`
                        : undefined,
                }}
            />
        </th>
    );
}

type TableColumnFilterConfig = {
    enabled: boolean;
    onToggle: () => void;
    /** Render del control debajo del título (Input/Combobox/custom). */
    control?: React.ReactNode;
    /** Aria label opcional para accesibilidad. */
    ariaLabel?: string;
};

interface TableColumnHeaderProps extends React.ComponentProps<"div"> {
    label: React.ReactNode;
    /** Configuración opcional del filtro por columna. */
    filter?: TableColumnFilterConfig;
    /** Alineación del header cuando se usa layout en columna. */
    align?: "left" | "center" | "right";
}

function TableColumnHeader({
    label,
    filter,
    align = "left",
    className,
    ...props
}: TableColumnHeaderProps) {
    const justifyClass =
        align === "right"
            ? "justify-end"
            : align === "center"
              ? "justify-center"
              : "justify-start";

    return (
        <div
            data-slot="table-column-header"
            className={cn("flex flex-col gap-2", className)}
            {...props}
        >
            <div className={cn("flex items-center gap-2", justifyClass)}>
                <span>{label}</span>
                {filter && (
                    <button
                        type="button"
                        onClick={filter.onToggle}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-transparent text-muted-foreground hover:bg-muted/50"
                        aria-label={
                            filter.ariaLabel ??
                            (filter.enabled
                                ? "Quitar filtro"
                                : "Activar filtro")
                        }
                    >
                        {filter.enabled ? (
                            <FilterX className="h-4 w-4" />
                        ) : (
                            <Filter className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>

            {filter?.enabled && filter.control}
        </div>
    );
}

interface TableCellProps extends React.ComponentProps<"td"> {
    /** Renderiza un checkbox estándar para selección múltiple en la celda. */
    multipleSelection?: boolean;
    /** Hace sticky (left: 0) la columna de selección. Por defecto: true cuando `multipleSelection` está habilitado. */
    sticky?: boolean;
    /** Fondo para la columna sticky cuando hay overflow X. Si no se provee, usa `bg-inherit`. */
    stickyBgClassName?: string;
    /** Dibuja una barra izquierda (overlay) encima del fondo, sin crear gap. */
    leftAccentClassName?: string;
    /** Configuración del checkbox cuando `multipleSelection` está habilitado. */
    selection?: MultipleSelectionConfig;
}

function TableCell({
    className,
    multipleSelection,
    sticky,
    stickyBgClassName,
    leftAccentClassName,
    selection,
    children,
    ...props
}: TableCellProps) {
    const layoutContext = React.useContext(TableLayoutContext);
    const hasOverflowX = layoutContext?.hasOverflowX ?? false;

    if (multipleSelection) {
        const showCheckbox = !!selection && selection.show !== false;
        const isSticky = sticky !== false;

        const selectionColumnClasses =
            "w-[72px] min-w-[72px] border-r border-border";
        const shouldRenderStickyBg = isSticky && hasOverflowX;
        const stickyOverlayBg = stickyBgClassName;

        return (
            <td
                data-slot="table-cell"
                className={cn(
                    "relative h-[49.33px] box-border p-2 align-middle whitespace-nowrap overflow-hidden tabular-nums [&:has([role=checkbox])]:pr-2 *:[[role=checkbox]]:translate-y-0.5",
                    selectionColumnClasses,
                    isSticky && "sticky left-0 z-20",
                    shouldRenderStickyBg && "bg-background",
                    className,
                )}
                {...props}
            >
                {shouldRenderStickyBg && stickyOverlayBg && (
                    <span
                        aria-hidden
                        className={cn(
                            "pointer-events-none absolute inset-0 z-0",
                            stickyOverlayBg,
                        )}
                    />
                )}

                {leftAccentClassName && (
                    <span
                        aria-hidden
                        className={cn(
                            "pointer-events-none absolute inset-y-0 left-0 z-20 w-1",
                            leftAccentClassName,
                        )}
                    />
                )}

                <div className="relative z-10 flex h-full items-center gap-2 overflow-hidden">
                    {showCheckbox ? (
                        <Checkbox
                            className="border-primary"
                            checked={
                                (
                                    selection as Extract<
                                        MultipleSelectionConfig,
                                        { show?: true }
                                    >
                                ).checked
                            }
                            onCheckedChange={
                                (
                                    selection as Extract<
                                        MultipleSelectionConfig,
                                        { show?: true }
                                    >
                                ).onCheckedChange
                            }
                            disabled={
                                (
                                    selection as Extract<
                                        MultipleSelectionConfig,
                                        { show?: true }
                                    >
                                ).disabled
                            }
                            aria-label={
                                (
                                    selection as Extract<
                                        MultipleSelectionConfig,
                                        { show?: true }
                                    >
                                ).ariaLabel ?? "Seleccionar"
                            }
                        />
                    ) : (
                        <span aria-hidden className="inline-block size-4" />
                    )}
                    {children}
                </div>
            </td>
        );
    }

    if (leftAccentClassName) {
        return (
            <td
                data-slot="table-cell"
                className={cn(
                    "relative h-[49.33px] box-border p-2 align-middle whitespace-nowrap overflow-hidden [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
                    className,
                )}
                {...props}
            >
                <span
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute inset-y-0 left-0 z-20 w-1",
                        leftAccentClassName,
                    )}
                />
                <div className="relative z-10">{children}</div>
            </td>
        );
    }

    return (
        <td
            data-slot="table-cell"
            className={cn(
                "h-[49.33px] box-border p-2 align-middle whitespace-nowrap overflow-hidden [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
                className,
            )}
            {...props}
        >
            {children}
        </td>
    );
}

function TableCaption({
    className,
    ...props
}: React.ComponentProps<"caption">) {
    return (
        <caption
            data-slot="table-caption"
            className={cn("text-muted-foreground mt-4 text-sm", className)}
            {...props}
        />
    );
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    TableColumnHeader,
};
