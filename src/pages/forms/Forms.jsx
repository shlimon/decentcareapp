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
                <h5>{data.title}</h5>
                <p>{data.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default React.memo(Forms);
