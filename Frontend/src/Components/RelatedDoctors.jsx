import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docID, speciality }) => {
  const navigate = useNavigate();
  const doctors = useSelector((state) => state.userData.doctors);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (doctors.length && speciality) {
      const filtered = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docID,
      );
      setRelated(filtered);
    }
  }, [doctors, speciality, docID]);

  if (!related.length) return null;

  return (
    <>
      <div className="mt-16">
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Related Physiotherapists
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            More physiotherapists you can book from the same speciality
          </p>
        </div>

        {/* Cards */}
        <div
          className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
        >
          {related.slice(0, 8).map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="
              bg-white border rounded-2xl overflow-hidden cursor-pointer
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-300 group
            "
            >
              {/* Image */}
              <div className="bg-indigo-50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                  w-full h-56 object-cover
                  group-hover:scale-105 transition-transform duration-300
                "
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-1">
                <p className="text-lg font-semibold text-gray-800">
                  {item.name}
                </p>

                <p className="text-sm text-gray-500">{item.speciality}</p>

                {/* Availability */}
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.available ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  <p
                    className={`${
                      item.available ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {item.available ? "Available" : "Not Available"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RelatedDoctors;
