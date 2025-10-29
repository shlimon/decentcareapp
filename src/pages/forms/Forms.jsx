import React from 'react';
import { Link } from 'react-router';
import { getAllData } from '../../utils/dataLoad';

export const Forms = () => {
  const formData = getAllData();
  return (
    <main className="forms-main">
      <h3>Participant Forms</h3>
      <div className="content">
        {formData.map((data) => (
          <Link to={data.link} className="tile form_link" key={data.id}>
            <div className="item-box">
              <div className="ico">
                <span className="material-icons-sharp ico-color">
                  {data.icon}
                </span>
              </div>
              {/* <span className="form_cover"></span> */}
              <div className="description pb-1">
                <h4 className="item-heading">{data.title}</h4>
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
