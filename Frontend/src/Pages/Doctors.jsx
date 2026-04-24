import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();

  const doctors = useSelector((state) => state.userData.doctors);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const filters = [
    "Orthopedic Physiotherapy",
    "Sports Physiotherapy",
    "Geriatric Physiotherapy",
    "Pediatric Physiotherapy",
    "Neurological Physiotherapy",
    "Cardiopulmonary Physiotherapy",
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Physiotherapists
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse through our verified specialists
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="sm:hidden mb-4 w-full py-2 rounded-lg border text-sm font-medium transition
        bg-white shadow-sm active:scale-[0.98]"
        >
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Filters */}
          <aside
            className={`sm:w-64 w-full bg-white rounded-xl border shadow-sm h-fit self-start
          ${showFilter ? "block" : "hidden sm:block"}`}
          >
            <div className="p-4 border-b">
              <p className="font-semibold text-gray-800 text-sm">
                Specialities
              </p>
            </div>

            <div className="p-4 space-y-2">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    speciality === item
                      ? navigate("/doctors")
                      : navigate(`/doctors/${item}`)
                  }
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                ${
                  speciality === item
                    ? "bg-indigo-600 text-white shadow"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </aside>

          {/* Doctors Grid */}
          <section className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterDoc.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="group bg-white rounded-2xl border shadow-sm cursor-pointer
                hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="bg-blue-50 rounded-t-2xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-44 object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.available ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <span
                        className={`font-medium ${
                          item.available ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {item.available ? "Available" : "Not Available"}
                      </span>
                    </div>

                    <p className="text-gray-900 font-semibold text-lg">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600">{item.speciality}</p>
                  </div>
                </div>
              ))}
            </div>

            {filterDoc.length === 0 && (
              <p className="text-center text-gray-500 mt-10">
                No physiotherapists found
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Doctors;
