import React from "react";
import { Link, useParams } from "react-router";
import { findOneData } from "../../utils/dataLoad";
import formsCss from "./formDetails.module.css";

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
    <div className={formsCss.container}>
      <div className={formsCss.wrapper}>
        <h5 className={formsCss.title}>{singleFormData.title}</h5>
        <p className={formsCss.description}>{singleFormData.description}</p>
      </div>
    </div>
  );
};
