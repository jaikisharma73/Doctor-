import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TopDoctors = () => {
  const navigate = useNavigate();
  const doctors = useSelector((state) => state.userData.doctors);

  return (
    <>
      <section className="w-full px-4 sm:px-6 lg:px-10 my-16">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-2">
            Top Physiotherapists To <span className="text-(--primary)">Book</span>
          </h1>

          <p className="max-w-xl mx-auto mt-4 text-gray-500 text-sm md:text-base">
            Consult with experienced and trusted physiotherapists
          </p>
        </div>

        {/* Doctors Grid */}
        <div
          className="mt-10 grid gap-6 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5"
        >
          {doctors.slice(0, 10).map((item, index) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="group bg-white border border-gray-200 rounded-2xl cursor-pointer
                       hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image */}
              <div className="w-full h-44 bg-blue-50 rounded-t-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 text-center">
                <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                  {item.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {item.speciality}
                </p>

                {/* CTA */}
                <div className="mt-3">
                  <span className="inline-block text-xs text-blue-600 font-medium">
                    Book Appointment →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/doctors")}
            className="px-10 py-2.5 rounded-full font-medium border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            View All Physiotherapists
          </button>
        </div>
      </section>
    </>
  );
};

export default TopDoctors;
