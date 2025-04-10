import React from "react";
import { useParams } from "react-router";
import resourceData from "../../data/resource.json";

const ResourceDetail = () => {
  const { id } = useParams();
  const record = resourceData.find((item) => item.id === parseInt(id));

  if (!record) {
    return <div>Record not found</div>;
  }

  return (
    <main className="content detail-box">
      <div className="item-detail">
        <div className="flex justify-start align-middle">
          <span className="material-icons-sharp item-icon">{record.icon}</span>
          <h4 className="extraPaddingAndInline">{record.title}</h4>
        </div>

        <p>{record.description}</p>
      </div>
    </main>
  );
};

export default ResourceDetail;
