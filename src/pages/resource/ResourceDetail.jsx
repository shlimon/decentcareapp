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
      <main className="content detail-box">
         <div className="item-detail">
            <div className="flex justify-start align-middle">
               <span className="material-icons-sharp item-icon">
                  {record.icon}
               </span>
               <h4 className="extraPaddingandInline">{record.title}</h4>
            </div>

            <p>{record.description}</p>
         </div>
      </main>
   );
};

export default ResourceDetail;
