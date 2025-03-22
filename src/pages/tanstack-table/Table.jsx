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
      header: "Sl No.",
      accessorKey: "id",
      cell: (slNo) => (
        <span className="w-[50px] block">{slNo.row.original.id}</span>
      ),
    },
    {
      header: "Image",
      cell: () => (
        <div className="h-20 w-20 flex justify-center items-center">
          <img
            src="https://cdn.pixabay.com/photo/2021/09/06/20/12/cat-6602447_960_720.jpg"
            alt="This is a cat image"
            className="rounded w-full"
          />
        </div>
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: (text) => (
        <span className="font-bold capitalize">{text.row.original.title}</span>
      ),
    },
    {
      header: "Post",
      accessorKey: "body",
      cell: (text) => (
        <span className="line-clamp-1 capitalize">
          {text.row.original.body}
        </span>
      ),
    },
  ];

  return (
    <section className="container mx-auto">
      <h2 className="text-center text-2xl font-bold my-5">Tanstack Table</h2>
      <div className="mb-16">
        <ReusableTable tableData={data} columns={columns} />
      </div>
    </section>
  );
};

export default Table;
