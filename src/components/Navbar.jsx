import React from 'react'
import { Link } from 'react-router'

export default function Navbar() {
    return (
        <nav>
            <div className="nav-btn-box">
                <div className="nav-btn" id="home">
                    <Link to={"/"}><span className="material-icons-sharp btn"> dashboard </span></Link>
                </div>
                <div className="nav-btn" id="forms" >
                    <Link to={"/forms"}><span className="material-icons-sharp btn"> assignment </span></Link>
                </div>
                <div className="nav-btn" id="work" >
                    <Link to={"/work"}><span className="material-icons-sharp btn"> business_center </span></Link>
                </div>
                <div className="nav-btn" id="Announce">
                    <Link to={"/announce"}><span className="material-icons-sharp btn"> campaign </span></Link>
                </div>
                <div className="nav-btn" id="resource">
                    <Link to={"/resource"}><span className="material-icons-sharp btn"> hub </span></Link>
                </div>

            </div>
        </nav>
    )
}
