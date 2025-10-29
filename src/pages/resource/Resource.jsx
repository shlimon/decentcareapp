import React from 'react';
import { Link } from 'react-router';
import resourceData from '../../data/resource.json';

export const Resource = () => {
   return (
      <main className="resource-main">
         <h3>Resources</h3>
         <div className="resource-grid">
            {resourceData.map((rec) => {
               return (
                  <div className="resource-box" key={rec.id}>
                     <Link
                        to={`/resource/${rec.id}`}
                        key={rec.id}
                        className="no-underline"
                     >
                        <div>
                           <span className="material-icons-sharp item-icon">
                              {rec.icon}
                           </span>
                           <h4 className="item-heading">{rec.title}</h4>
                           <p className="item-des">{rec.description}</p>
                        </div>
                     </Link>
                  </div>
               );
            })}
         </div>
      </main>
   );
};

export default Resource;
