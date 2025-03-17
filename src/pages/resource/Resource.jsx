import React from "react";
import recourceData from "./resource.json";

export const Resource = () => {
   return (
      <main>
         <h3>Resources</h3>
         {/* <div className="resource-grid">
                <div className="resource-box">
                    <span className="material-icons-sharp item-icon"> bookmarks </span>
                    <h4 className="item-heading">Staff Handbook</h4>
                    <p className="item-des">
                        Access essential guidelines and company policies in our Staff
                        Handbook for clear, informed decision-making
                    </p>
                </div>
                <div className="resource-box">
                    <span className="material-icons-sharp item-icon"> contacts </span>
                    <h4 className="item-heading">Contacts</h4>
                    <p className="item-des">
                        Stay connected with colleagues and departments using our Company
                        Contacts directory for seamless communication.
                    </p>
                </div>
                <div className="resource-box">
                    <span className="material-icons-sharp item-icon"> account_tree </span>
                    <h4 className="item-heading">Organisational Structure</h4>
                    <p className="item-des">
                        Understand our company's hierarchy and departments through the
                        Organizational Structure chart for better collaboration.
                    </p>
                </div>
                <div className="resource-box">
                    <span className="material-icons-sharp item-icon"> policy </span>
                    <h4 className="item-heading">Policy & Procedure</h4>
                    <p className="item-des">
                        Get insights into company protocols and procedures in our Policy and
                        Procedure section for informed actions.
                    </p>
                </div>
                <div className="resource-box">
                    <span className="material-icons-sharp item-icon"> lightbulb </span>
                    <h4 className="item-heading">Participant Engagement</h4>
                    <p className="item-des">
                        Unlock successful participant interactions with expert tips and
                        engaging activities in our Participant Engagement Hub.
                    </p>
                </div>
            </div> */}
         <div className="resource-grid">
            {recourceData.map((rec) => {
               return (
                  <div className="resource-box">
                     <span className="material-icons-sharp item-icon">
                        {rec.icon}
                     </span>
                     <h4 className="item-heading">{rec.title}</h4>
                     <p className="item-des">{rec.description}</p>
                  </div>
               );
            })}
         </div>
      </main>
   );
};

export default Resource;
