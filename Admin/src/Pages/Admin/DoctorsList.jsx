import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllDoctors,
  changeAvailability,
} from "../../redux/slices/adminDataSlice";

const DoctorsList = () => {
  const dispatch = useDispatch();
  const aToken = useSelector((s) => s.adminAuth.aToken);
  const { doctors } = useSelector((s) => s.adminData);

  useEffect(() => {
    if (aToken) dispatch(fetchAllDoctors());
  }, [aToken, dispatch]);

  const toggleAvailability = (id) => {
    dispatch(changeAvailability(id)).then(() => dispatch(fetchAllDoctors()));
  };

  return (
    <>
      <div className="m-5">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Physiotherapists Management
          </h1>
          <p className="text-sm text-gray-500">
            View and manage all registered physiotherapists
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-h-[80vh] overflow-y-auto pr-2">
          {doctors.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Doctor Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover bg-indigo-50"
                />

                {/* Status Badge */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${
                    item.available
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-lg font-semibold text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500 mb-4">{item.speciality}</p>

                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability</span>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.available}
                      onChange={() => toggleAvailability(item._id)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-(--primary) transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DoctorsList;
