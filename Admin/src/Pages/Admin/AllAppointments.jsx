import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAppointments,
  cancelAppointmentAdmin,
  deleteAppointmentAdmin,
} from "../../redux/slices/adminDataSlice";
import { assets } from "../../assets/assets";
import { calculateAge, slotDateFormat, Currency } from "../../utils/helpers";

const AllAppointments = () => {
  const dispatch = useDispatch();
  const aToken = useSelector((s) => s.adminAuth.aToken);
  const { appointments } = useSelector((s) => s.adminData);

  useEffect(() => {
    if (aToken) dispatch(fetchAllAppointments());
  }, [aToken, dispatch]);

  const cancelHandler = (id) => {
    dispatch(cancelAppointmentAdmin(id)).then(() =>
      dispatch(fetchAllAppointments()),
    );
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this appointment?")) {
      dispatch(deleteAppointmentAdmin(id)).then(() =>
        dispatch(fetchAllAppointments()),
      );
    }
  };

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">
            All Appointments
          </h1>
          <span className="text-sm text-gray-500">
            Total: {appointments.length}
          </span>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden sm:block bg-white rounded-2xl border shadow-sm overflow-hidden">
          {/* Table Head */}
          <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1.5fr_1fr] px-6 py-4 border-b bg-gray-50 text-xs font-semibold text-gray-500 tracking-wide">
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Doctor</p>
            <p className="text-center">Fees</p>
            <p className="text-center">Action</p>
          </div>

          <div className="max-h-[70vh] overflow-y-auto divide-y">
            {appointments.map((item, index) => (
              <div
                key={item._id}
                className="grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1.5fr_1fr] items-center px-6 py-4 text-sm hover:bg-gray-50 transition"
              >
                <p className="text-gray-500">{index + 1}</p>

                {/* Patient */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.userID?.image || assets.profile_pic}
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                  <p className="text-gray-800 font-medium">
                    {item.userID?.name}
                  </p>
                </div>

                <p className="text-gray-600">
                  {calculateAge(item.userID?.dob)}
                </p>

                <p className="text-gray-600">
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                {/* Doctor */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.docID?.image || assets.profile_pic}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <p className="text-gray-800 font-medium">
                    {item.docID?.name}
                  </p>
                </div>

                {/* Fees */}
                <p className="text-center font-semibold text-gray-800">
                  {Currency} {item.amount}
                </p>

                {/* Action */}
                <div className="flex justify-center items-center gap-3">
                  {item.cancelled ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => cancelHandler(item._id)}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-50 hover:bg-yellow-100 transition"
                      title="Cancel Appointment"
                    >
                      <img src={assets.cancel_icon} className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteHandler(item._id)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 transition"
                    title="Delete Appointment"
                  >
                    <span className="text-red-500 font-bold">X</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="sm:hidden space-y-4">
          {appointments.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border shadow-sm p-4 space-y-3"
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.userID?.image || assets.profile_pic}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.userID?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Age: {calculateAge(item.userID?.dob)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.cancelled ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-500">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600">
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => cancelHandler(item._id)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-50 hover:bg-yellow-100 transition"
                      title="Cancel Appointment"
                    >
                      <img src={assets.cancel_icon} className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteHandler(item._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 transition"
                    title="Delete Appointment"
                  >
                    <span className="text-red-500 font-bold">X</span>
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>

                <div className="flex items-center gap-2">
                  <img
                    src={item.docID?.image || assets.profile_pic}
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                  <p className="font-medium text-gray-800">
                    {item.docID?.name}
                  </p>
                </div>

                <p className="font-semibold text-gray-800">
                  Fees: {Currency} {item.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AllAppointments;
