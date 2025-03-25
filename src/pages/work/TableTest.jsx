import React, { useMemo } from "react";
import {
   useReactTable,
   getCoreRowModel,
   flexRender,
} from "@tanstack/react-table";
import mData from "../../data/countries.json";

/*
{
    "id": 1,
    "name": "Afghanistan",
    "iso3": "AFG",
    "iso2": "AF",
    "numeric_code": "004",
    "phone_code": "93",
    "capital": "Kabul",
    "currency": "AFN",
    "currency_name": "Afghan afghani",
    "currency_symbol": "؋",
    "tld": ".af",
    "native": "افغانستان",
    "region": "Asia",
    "region_id": "3",
    "subregion": "Southern Asia",
    "subregion_id": "14",
    "nationality": "Afghan",
    "timezones": [
      {
        "zoneName": "Asia/Kabul",
        "gmtOffset": 16200,
        "gmtOffsetName": "UTC+04:30",
        "abbreviation": "AFT",
        "tzName": "Afghanistan Time"
      }
    ],
    "translations": {
      "kr": "아프가니스탄",
      "pt-BR": "Afeganistão",
      "pt": "Afeganistão",
      "nl": "Afghanistan",
      "hr": "Afganistan",
      "fa": "افغانستان",
      "de": "Afghanistan",
      "es": "Afganistán",
      "fr": "Afghanistan",
      "ja": "アフガニスタン",
      "it": "Afghanistan",
      "cn": "阿富汗",
      "tr": "Afganistan"
    },
    "latitude": "33.00000000",
    "longitude": "65.00000000",
    "emoji": "🇦🇫",
    "emojiU": "U+1F1E6 U+1F1EB"
  },
*/

export const TableTest = () => {
   const data = useMemo(() => mData, []);

   /** @type import('@tanstack/react-table').columnDef<any> */
   const columns = [
      {
         header: "ID",
         accessorKey: "id",
         footer: "ID",
      },
      {
         header: "Name",
         accessorKey: "name",
         footer: "Name",
      },
      {
         header: "Short Form",
         accessorKey: "iso3",
         footer: "Short Form",
      },
      {
         header: "Region",
         accessorKey: "region",
         footer: "Region",
      },
   ];

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
   });
   return (
      <div>
         <table>
            <thead>
               {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                     {headerGroup.headers.map((header) => (
                        <th key={header.id}>
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
               {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                     {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                           {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                           )}
                        </td>
                     ))}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};
export default TableTest;
