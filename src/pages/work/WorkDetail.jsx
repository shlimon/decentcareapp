import React from "react";
import { useParams } from "react-router";
import workData from "./work.json";

const WorkDetail = () => {
   const { id } = useParams();
   const record = workData.find((item) => item.id === parseInt(id));

   if (!record) {
      return <div>Record not found</div>;
   }

   return (
      <main className="content detail-box">
         <h3>{record.title}</h3>
         <div className="item-detail">
            <span className="material-icons-sharp item-icon">
               {record.icon}
            </span>
            <h4 className="extraPaddingandInline">{record.title}</h4>
            <p>{record.description}</p>
         </div>
      </main>
   );
};

export default WorkDetail;
