import React from "react";
import ReusableTable from "../../components/reusable/ReusableTable";
import useFetchUsers from "../../hooks/fetchUsers";

/* 
"userId": 1,
"id": 1,
"title": "delectus aut autem",
"completed": false
*/

const Table = () => {
  const { loading, data, error } = useFetchUsers();

  const columns = [
    {
      header: "Id",
      accessorKey: "id",
    },
    {
      header: "User ID",
      accessorKey: "userId",
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Post",
      accessorKey: "body",
      cell: (text) => (
        <span className="line-clamp-1">{text.row.original.body}</span>
      ),
    },
  ];

  return (
    <section className="container mx-auto">
      <h2 className="text-center text-2xl font-bold my-5">Tanstack Table</h2>
      <div>
        <ReusableTable tableData={data} columns={columns} />
      </div>
    </section>
  );
};

export default Table;
