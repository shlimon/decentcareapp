import React from "react";
import { useParams } from "react-router";
import recourceData from "./resource.json";

const ResourceDetail = () => {
   const { id } = useParams();
   const record = recourceData.find((item) => item.id === parseInt(id));

   if (!record) {
      return <div>Record not found</div>;
   }

   return (
      <main>
         <h3>{record.title}</h3>
         <div className="item-detail">
            <span className="material-icons-sharp item-icon">
               {record.icon}
            </span>
            <p>{record.description}</p>
         </div>
      </main>
   );
};

export default ResourceDetail;
