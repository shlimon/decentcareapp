import React from "react";
import countriesData from "../../data/countries.json";
import { Columns } from "./columns";

import { useMemo } from "react";
import { useReactTable } from "@tanstack/react-table";

export const TestForData = () => {
   const columns = useMemo(() => Columns, []);
   const data = useMemo(() => countriesData, []);
   const tableInstance = useReactTable({
      columns,
      data,
   });

   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      tableInstance;

   return (
      <div>
         <table {...getTableProps()}>
            <thead>
               {headerGroups.map((headerGroups) => (
                  <tr {...headerGroups.getHeaderGroupProps()}>
                     {headerGroups.headers.map((columns) => (
                        <th {...columns.getHeaderProps()}>
                           {columns.render("Header")}
                        </th>
                     ))}
                  </tr>
               ))}
            </thead>
            <tbody {...getTableBodyProps()}>
               {rows.map((row) => {
                  prepareRow(row);
                  return (
                     <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                           return (
                              <td {...cell.getCellProps()}>
                                 {cell.render("cell")}
                              </td>
                           );
                        })}
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
   );
};
export default TestForData;
