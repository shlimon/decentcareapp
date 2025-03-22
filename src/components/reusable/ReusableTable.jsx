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
    className="p-1 text-indigo-700 border border-gray-100 px-2 rounded-md cursor-pointer"
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
    <div className="overflow-y-auto lg:overflow-x-auto">
      <table className="hidden lg:block border rounded-lg w-full text-left text-slate-600 min-w-[650px]">
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
        <tbody className="">
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

      <div className="lg:hidden grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-5 sm:mx-0">
        {table.getRowModel().rows.map((row, i) => (
          <div
            className="p-3 border border-slate-300 rounded-lg flex flex-col gap-2.5"
            key={i}
          >
            <div className="h-full w-full">
              <img
                src="https://cdn.pixabay.com/photo/2021/09/06/20/12/cat-6602447_960_720.jpg"
                alt="This is a cat image"
                className="rounded w-full"
              />
            </div>
            <div className="">
              <div className="text-start">
                <h3 className="line-clamp-1 text-start! p-0!">
                  {row.original.title}
                </h3>
              </div>
              <hr className="hidden sm:block text-gray-300 my-2" />
              <div>
                <div className="flex justify-between items-center *:text-sm *:my-2">
                  <p>
                    <span className="mb-1">User ID: </span>
                    <span>{row.original.userId}</span>
                  </p>
                  <p>
                    <span className="mb-1">Post ID: </span>
                    <span>{row.original.id}</span>
                  </p>
                </div>

                <p className="text-justify text-sm p-0 line-clamp-4">
                  {row.original.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {enablePagination && (
        <div className="flex items-start sm:items-center justify-end mt-2 gap-2 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 text-indigo-700 border border-gray-100 px-2 rounded-md cursor-pointer"
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
