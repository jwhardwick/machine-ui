'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';
import { Button } from './button.tsx';
import { Checkbox } from './checkbox.tsx';
import { Input } from './input.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table.tsx';

export type { ColumnDef };

/** A sortable column header. Use it in a column's `header`. */
export function DataTableColumnHeader<TData>({ column, title }: { column: Column<TData>; title: string }) {
  if (!column.getCanSort()) return <span>{title}</span>;
  const sorted = column.getIsSorted();
  return (
    <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground" onClick={() => column.toggleSorting(sorted === 'asc')}>
      {title}
      {sorted === 'asc' ? <ArrowUpIcon aria-hidden /> : sorted === 'desc' ? <ArrowDownIcon aria-hidden /> : <ArrowUpDownIcon aria-hidden />}
      <span className="sr-only">{sorted ? `sorted ${sorted === 'asc' ? 'ascending' : 'descending'}` : 'sortable'}</span>
    </Button>
  );
}

/** A selection checkbox column, ready to prepend to your columns. */
export function selectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
    ),
    enableSorting: false,
  };
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  /** Column id to filter with the search field. Omit to hide the field. */
  filterColumn?: string;
  filterPlaceholder?: string;
  pageSize?: number;
  toolbar?: ReactNode;
  className?: string;
}

/** A table with sorting, filtering, row selection and pagination. */
export function DataTable<TData>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = 'Filter…',
  pageSize = 8,
  toolbar,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection, columnFilters },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const selected = table.getFilteredSelectedRowModel().rows.length;
  const total = table.getFilteredRowModel().rows.length;

  return (
    <div data-slot="data-table" className={cn('grid w-full gap-3', className)}>
      {(filterColumn || toolbar) && (
        <div className="flex flex-wrap items-center gap-2">
          {filterColumn && (
            <Input
              aria-label={filterPlaceholder}
              placeholder={filterPlaceholder}
              value={(table.getColumn(filterColumn)?.getFilterValue() as string | undefined) ?? ''}
              onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
              className="max-w-xs"
            />
          )}
          {toolbar}
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : undefined
                    }
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span aria-live="polite">
          {selected} of {total} selected
        </span>
        <div className="flex items-center gap-2">
          <span className="tabular-nums">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
