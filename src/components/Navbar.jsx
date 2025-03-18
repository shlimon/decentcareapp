import React from "react";
import { NavLink } from "react-router";

const navBars = [
  { id: 1, icon: "dashboard", to: "/" },
  { id: 2, icon: "assignment", to: "/forms" },
  { id: 3, icon: "business_center", to: "/work" },
  { id: 4, icon: "campaign", to: "/announce" },
  { id: 5, icon: "hub", to: "/resource" },
];

export default function Navbar() {
  return (
    <nav>
      <div className="nav-btn-box">
        {navBars.map((nav) => (
          <div key={nav.id} className="nav-btn">
            <NavLink to={nav.to}>
              {({ isActive }) => (
                <span
                  className="material-icons-sharp btn"
                  style={{ color: isActive ? "purple" : "" }}
                >
                  {nav.icon}
                </span>
              )}
            </NavLink>
          </div>
        ))}
      </div>
    </nav>
  );
}
