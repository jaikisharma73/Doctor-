import React from "react";
import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <>
      <section id="speciality" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Browse by category
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-2">
            Find Your <span className="text-(--primary)">Speciality</span>
          </h2>

          <p className="max-w-xl mx-auto mt-4 text-gray-500 text-sm md:text-base">
            Browse through our wide range of medical specialities and book an
            appointment with trusted physiotherapists instantly.
          </p>
        </div>

        {/* ================= SPECIALITY LIST ================= */}
        <div
          className="
        flex gap-6 overflow-x-auto pb-4
        md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-8 md:overflow-visible
      "
        >
          {specialityData.map((item, index) => (
            <Link
              key={index}
              to={`/doctors/${item.speciality}`}
              onClick={() => scrollTo(0, 0)}
              className="
              min-w-35 md:min-w-0
              bg-white border rounded-2xl
              flex flex-col items-center text-center
              px-6 py-6
              shadow-sm hover:shadow-lg
              transition-all duration-300
              hover:-translate-y-2
              group
            "
            >
              <div
                className="
              w-20 h-20 rounded-full
              bg-indigo-50
              flex items-center justify-center
              mb-4
              group-hover:bg-(--primary)/10
              transition
            "
              >
                <img
                  src={item.image}
                  alt={item.speciality}
                  className="w-12 h-12 object-contain"
                />
              </div>

              <p className="text-sm font-medium text-gray-700 group-hover:text-(--primary)">
                {item.speciality}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default SpecialityMenu;
