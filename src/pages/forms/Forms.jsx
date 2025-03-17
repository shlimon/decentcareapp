import React from 'react';

export const Forms = () => {
    return (
        <main>
            <h3>Participant Forms</h3>
            <div className="content">
                <div className="tile">
                    <div className="ico">
                        <span className="material-icons-sharp ico-color"> blur_on </span>
                    </div>
                    {/* <BlurOnIcon /> */}
                    <div className="description">
                        <h5>Participant Complaint</h5>
                        <p>
                            Share concerns, improve participant experience with easy complaint
                            submission.
                        </p>
                    </div>
                </div>
                <div className="tile">
                    <div className="ico">
                        <span className="material-icons-sharp ico-color"> psychology </span>
                    </div>
                    <div className="description">
                        <h5>Participant Incident</h5>
                        <p>
                            Report incidents swiftly, ensuring participant safety and
                            well-being.
                        </p>
                    </div>
                </div>
                <div className="tile">
                    <div className="ico">
                        <span className="material-icons-sharp ico-color"> waves </span>
                    </div>
                    <div className="description">
                        <h5>Conflict of Interest</h5>
                        <p>
                            Maintain transparency, disclose potential conflicts for ethical
                            decision-making.
                        </p>
                    </div>
                </div>
                <div className="tile">
                    <div className="ico">
                        <span className="material-icons-sharp ico-color"> swap_horiz </span>
                    </div>
                    <div className="description">
                        <h5>Medication Schedule</h5>
                        <p>
                            Track and manage medications effortlessly, ensuring timely and
                            accurate dosages.
                        </p>
                    </div>
                </div>
                <div className="tile">
                    <div className="ico">
                        <span className="material-icons-sharp ico-color"> camera </span>
                    </div>
                    <div className="description">
                        <h5>Media Release</h5>
                        <p>
                            Grant or restrict media usage rights conveniently and efficiently.
                        </p>
                    </div>
                </div>
                <div className="tile">
                    <div className="ico">
                        <span className="material-icons-sharp ico-color"> swap_horiz </span>
                    </div>
                    <div className="description">
                        <h5>Financial Transaction</h5>
                        <p>
                            Securely handle financial matters with our streamlined transaction
                            process.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Forms