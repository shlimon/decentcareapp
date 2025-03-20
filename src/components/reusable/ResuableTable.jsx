import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo } from "react";
import { LiaGreaterThanSolid, LiaLessThanSolid } from "react-icons/lia";

const PaginationButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-1 text-indigo-700 border border-gray-100 px-2 rounded-md"
  >
    <LiaGreaterThanSolid size={20} />
  </button>
);

const PageSizeSelector = ({ value, onChange }) => {
  const pageSizes = useMemo(() => [10, 20, 30, 50], []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border p-1 rounded w-24 sm:w-32 h-8 border-slate-100 text-slate-600"
    >
      {pageSizes.map((pageSize) => (
        <option key={pageSize} value={pageSize}>
          Show {pageSize}
        </option>
      ))}
    </select>
  );
};

const ReusableTable = ({
  tableData = [],
  columns,
  enablePagination = true,
  rowClassName,
}) => {
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
    initialState: enablePagination
      ? {
          pagination: {
            pageSize: 10,
          },
        }
      : undefined,
  });

  return (
    <div className="overflow-x-auto">
      <table className="border rounded-lg w-full text-left text-slate-600 min-w-[650px]">
        <thead className="bg-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="capitalize px-3.5 py-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => {
            // Combine the default zebra striping with custom styling
            const defaultClass = i % 2 === 0 ? "bg-white" : "bg-slate-50";
            // Apply custom row styling if provided
            const customClass = rowClassName ? rowClassName(row.original) : "";

            return (
              <tr
                key={row.id}
                className={`${customClass ? customClass : defaultClass}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-1 lg:px-3.5 py-1 md:py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {enablePagination && (
        <div className="flex items-start sm:items-center justify-end mt-2 gap-2 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 text-indigo-700 border border-gray-100 px-2 rounded-md"
            >
              <LiaLessThanSolid size={20} />
            </button>
            <span className="flex text-slate-600 items-center gap-1">
              <p>Page</p>
              <strong>
                {table.getState().pagination?.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <PaginationButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <PageSizeSelector
              value={table.getState().pagination?.pageSize}
              onChange={(size) => table.setPageSize(size)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ReusableTable);
