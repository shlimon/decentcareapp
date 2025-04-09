import React from "react";
import { Link, useParams } from "react-router";
import { findOneData } from "../../utils/dataLoad";

export const FormsDetails = () => {
  const params = useParams();

  const singleFormData = findOneData(parseInt(params.formsId));

  if (!singleFormData || singleFormData.id === undefined) {
    return (
      <div>
        <h1>Resource not found</h1>
        <Link to={"/"}>Go Home</Link>
      </div>
    );
  }

  return (
    <div className={`content detail-box`}>
      <div className={`details_wrapper`}>
        <div className={`details_title_wrapper`}>
          <span className="material-icons-sharp ico-color">
            {singleFormData.icon}
          </span>
          <h5 className={`details_title`}>{singleFormData.title}</h5>
        </div>
        <p className={`details_description`}>{singleFormData.description}</p>
      </div>
    </div>
  );
};
