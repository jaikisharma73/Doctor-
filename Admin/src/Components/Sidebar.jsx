import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const aToken = useSelector((state) => state.adminAuth.aToken);
  const dToken = useSelector((state) => state.doctorAuth.dToken);

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
     ${
       isActive
         ? "bg-indigo-100 text-indigo-600 font-semibold"
         : "text-gray-600 hover:bg-gray-100"
     }`;

  return (
    <>
      <aside
        className="
        w-18 md:w-72
        shrink-0
        bg-white
        border-r
        min-h-screen
      "
      >
        {/* ADMIN LINKS */}
        {aToken && (
          <ul className="flex flex-col gap-2 p-3 text-sm">
            <NavLink to="/admin-dashboard" className={linkStyle}>
              <img src={assets.home_icon} className="w-5" />
              <span className="hidden md:block">Dashboard</span>
            </NavLink>

            <NavLink to="/all-appointments" className={linkStyle}>
              <img src={assets.appointment_icon} className="w-5" />
              <span className="hidden md:block">Appointments</span>
            </NavLink>

            <NavLink to="/add-doctor" className={linkStyle}>
              <img src={assets.add_icon} className="w-5" />
              <span className="hidden md:block">Add Physiotherapist</span>
            </NavLink>

            <NavLink to="/doctor-list" className={linkStyle}>
              <img src={assets.people_icon} className="w-5" />
              <span className="hidden md:block">Physiotherapists List</span>
            </NavLink>
          </ul>
        )}

        {/* PHYSIOTHERAPIST LINKS */}
        {dToken && (
          <ul className="flex flex-col gap-2 p-3 text-sm">
            <NavLink to="/doctor-dashboard" className={linkStyle}>
              <img src={assets.home_icon} className="w-5" />
              <span className="hidden md:block">Dashboard</span>
            </NavLink>

            <NavLink to="/doctor-appointments" className={linkStyle}>
              <img src={assets.appointment_icon} className="w-5" />
              <span className="hidden md:block">Appointments</span>
            </NavLink>

            <NavLink to="/doctor-profile" className={linkStyle}>
              <img src={assets.people_icon} className="w-5" />
              <span className="hidden md:block">Profile</span>
            </NavLink>
          </ul>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
