import React from "react";
import { Link } from "react-router";
import workData from "../../data/work.json";

export const Work = () => {
  return (
    <main>
      <h3>Work Place Services</h3>
      <div className="grid-container">
        {workData.map((record) => {
          return (
            <div className="item" key={record.id}>
              <Link
                to={`/work/${record.id}`}
                key={record.id}
                className="no-underline"
              >
                <div>
                  <span className="material-icons-sharp item-icon">
                    {record.icon}
                  </span>
                  <h4 className="item-heading">{record.title}</h4>
                  <p className="item-des">{record.description}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Work;
