import React from 'react'

export const Work = () => {
    return (
        <main>
            <h3>Work Place Services</h3>
            <div className="grid-container">
                <div className="item">
                    <span className="material-icons-sharp item-icon">
                        wifi_tethering_error
                    </span>
                    <h4 className="item-heading">WHS (Workplace Health & Safety):</h4>
                    <p className="item-des">
                        Ensure safety with workplace health and safety forms. Report
                        incidents and maintain a secure work environment
                    </p>
                </div>
                <div className="item">
                    <span className="material-icons-sharp item-icon"> workspaces </span>
                    <h4 className="item-heading">Complaint Form</h4>
                    <p className="item-des">
                        Voice concerns easily. Submit complaints and feedback to help us
                        improve your work experience
                    </p>
                </div>

                <div className="item">
                    <span className="material-icons-sharp item-icon"> toll </span>
                    <h4 className="item-heading">Leave Request</h4>
                    <p className="item-des">
                        Request time off seamlessly. Submit leave requests for a
                        well-deserved break or planned absence
                    </p>
                </div>
                <div className="item">
                    <span className="material-icons-sharp item-icon"> restore </span>
                    <h4 className="item-heading">Time Availability</h4>
                    <p className="item-des">
                        Manage your time efficiently. Keep your availability up-to-date to
                        streamline scheduling and planning
                    </p>
                </div>
                <div className="item">
                    <span className="material-icons-sharp item-icon"> drive_eta </span>
                    <h4 className="item-heading">Travel Log</h4>
                    <p className="item-des">
                        Log your journeys effortlessly. Track and manage your participant
                        travels with our intuitive travel log
                    </p>
                </div>
                <div className="item">
                    <span className="material-icons-sharp item-icon"> model_training </span>
                    <h4 className="item-heading">Training Form</h4>
                    <p className="item-des">
                        Enhance your skills. Register for training sessions and stay updated
                        with our educational opportunities or request for a specific
                        training.
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Work