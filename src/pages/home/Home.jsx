import React from 'react'

export default function Home() {
    return (
        <main>
            <div className="user">
                <div className="name">
                    <h1 id="name"></h1>
                </div>
            </div>

            <div className="weather">
                <div className="temperature">
                    <p id="current-temp"><i>Current temperature:</i>10.2</p>
                    <p id="max-temp"><i>Max temperature:</i>10.2</p>
                    <p id="weather-des"><i>Cloud Overcast</i></p>
                </div>
                <div className="ico-container">
                    <img id="weather-icon" src="" alt="weather ico" />
                </div>
            </div>

            <div className="announce">
                <div className="title">
                    <h3>Announcements</h3>
                </div>
                <div className="announcement">
                    <p>
                        Exciting news! Introducing our new Announcement Tab 📢—the go-to
                        place for all company updates and important announcements
                    </p>
                </div>
            </div>
        </main>
    )
}
