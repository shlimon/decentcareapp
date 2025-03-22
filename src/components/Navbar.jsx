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
    <nav className="border border-gray-500 max-w-[400px] fixed bottom-2.5 left-1/2 -translate-x-1/2 !rounded-full bg-white">
      <div className="nav-btn-box">
        {navBars.map((nav) => (
          <div key={nav.id} className="nav-btn">
            <NavLink
              to={nav.to}
              className="flex justify-center items-center -scale-[.8] hover:scale-[.9] duration-300"
            >
              {({ isActive }) => (
                <span
                  className="material-icons-sharp btn"
                  style={{ color: isActive ? "purple" : "#6a7282" }}
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
