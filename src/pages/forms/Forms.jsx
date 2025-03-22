import React from "react";
import { Link } from "react-router";
import { getAllData } from "../../utils/dataLoad";

export const Forms = () => {
  const formData = getAllData();
  return (
    <main>
      <h3>Participant Forms</h3>
      <div className="content">
        {formData.map((data) => (
          <Link
            to={`/forms/${data.id}`}
            className="tile form_link"
            key={data.id}
          >
            <div className="">
              <div className="ico">
                <span className="material-icons-sharp ico-color">
                  {data.icon}
                </span>
              </div>
              <span className="form_cover"></span>
              <div className="description">
                <h4 className="item-heading">{data.title}</h4>
                <p>{data.description}</p>
              </div>
            </div>
          </Link>
        ))}
        <Link to={`/tanstack-table`} className="tile form_link">
          <div className="">
            <div className="ico">
              <span className="material-icons-sharp ico-color">psychology</span>
            </div>
            <span className="form_cover"></span>
            <div className="description">
              <h4 className="item-heading">Tanstack Table</h4>
              <p>This is a new practice tanstack table by shahrear.</p>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default React.memo(Forms);
