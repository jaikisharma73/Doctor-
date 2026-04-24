import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { adminLogout } from "../redux/slices/adminAuthSlice";
import { doctorLogout } from "../redux/slices/doctorAuthSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const aToken = useSelector((state) => state.adminAuth.aToken);
  const dToken = useSelector((state) => state.doctorAuth.dToken);

  const logout = () => {
    navigate("/");
    if (aToken) dispatch(adminLogout());
    if (dToken) dispatch(doctorLogout());
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-8 py-3">
          {/* LEFT : Logo + Role */}
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl md:text-3xl font-bold text-black cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              Kaushik Ortho
            </h1>

            <span
              className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
              ${
                aToken
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }
            `}
            >
              {aToken ? "Admin Panel" : "Doctor Panel"}
            </span>
          </div>

          {/* RIGHT : Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-(--primary) hover:brightness-110 active:scale-95 transition-all
                     text-white text-sm font-medium px-6 sm:px-8 py-2 rounded-full shadow-md"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
