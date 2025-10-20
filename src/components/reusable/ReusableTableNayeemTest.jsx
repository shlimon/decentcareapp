import {
   flexRender,
   getCoreRowModel,
   getPaginationRowModel,
   useReactTable,
} from "@tanstack/react-table";
import React, { useMemo } from "react";
import { LiaGreaterThanSolid, LiaLessThanSolid } from "react-icons/lia";
import countryData from "../../data/countries.json";

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

//table made by me
export const ReusableTableNayeemTest = ({
   enablePagination = true,
   rowClassName,
}) => {
   const data = useMemo(() => countryData, []);

   /** @type import('@tanstack/react-table').columnDef<any> */
   const columns = [
      {
         header: "ID",
         accessorKey: "id",
         footer: "ID",
      },
      {
         header: "Short Form",
         accessorKey: "iso3",
         footer: "Short Form",
      },

      {
         header: "Country Name",
         accessorKey: "name",
         footer: "Name",
      },

      {
         header: "Capital Name",
         accessorKey: "capital",
         footer: "capital Name",
      },
      {
         header: "Region",
         accessorKey: "region",
         footer: "Region",
      },
      {
         header: "Sub Region",
         accessorKey: "subregion",
         footer: "Sub Region",
      },
      {
         header: "Currency Name",
         accessorKey: "currency_name",
         footer: "Currency Name",
      },
      {
         header: "Phone Code",
         accessorKey: "phone_code",
         footer: "Phone Code",
      },
   ];

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      ...(enablePagination && {
         getPaginationRowModel: getPaginationRowModel(),
      }),
      initialState: enablePagination
         ? {
              pagination: {
                 pageSize: 10,
              },
           }
         : undefined,
   });

   return (
      <div className="container mx-auto">
         <div className="overflow-y-auto lg:overflow-x-auto w-full">
            <table className="hidden lg:block rounded-lg text-left text-slate-600 min-w-[650px] !w-fit mx-auto">
               <thead className="bg-slate-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                     <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                           <th
                              key={header.id}
                              className="capitalize px-3.5 py-2"
                           >
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
                     const defaultClass =
                        i % 2 === 0 ? "bg-white" : "bg-slate-50";
                     // Apply custom row styling if provided
                     const customClass = rowClassName
                        ? rowClassName(row.original)
                        : "";

                     return (
                        <tr
                           key={row.id}
                           className={`${
                              customClass ? customClass : defaultClass
                           }`}
                        >
                           {row.getVisibleCells().map((cell) => (
                              <td
                                 key={cell.id}
                                 className="px-1 lg:px-3.5 py-1 md:py-3"
                              >
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                 )}
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
                     <div className="">
                        <div className="text-start">
                           <h3 className="line-clamp-1 text-start! p-0!">
                              {row.original.name}
                           </h3>
                        </div>
                        <hr className="hidden sm:block text-gray-300 my-2" />
                        <div>
                           <div className="flex justify-between items-center *:text-sm *:my-2">
                              <p>
                                 <span className="mb-1">Number: </span>
                                 <span>{row.original.id}</span>
                              </p>
                              <p>
                                 <span className="mb-1">Short form: </span>
                                 <span>{row.original.iso3}</span>
                              </p>
                           </div>

                           <p className="text-justify text-sm p-0 line-clamp-4">
                              Capital :{row.original.capital}
                           </p>
                           <p className="text-justify text-sm p-0 line-clamp-4">
                              Currency:
                              {row.original.currency_name}
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
      </div>
   );
};
