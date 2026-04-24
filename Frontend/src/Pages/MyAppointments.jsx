import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "../redux/api/axiosInstance";
import { fetchDoctors } from "../redux/slices/userDataSlice";
import { slotDateFormat, Currency } from "../utils/helpers";

const MyAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.userAuth.token);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH APPOINTMENTS ================= */
  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/user/appointments");

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const cancelAppointment = async (appointmentID) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/user/cancel-appointment",
        { appointmentID },
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        dispatch(fetchDoctors());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  /* ================= INIT ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getUserAppointments();
    }
  }, [token]);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mt-10 pb-4 border-b">
          My Appointments
        </h2>

        {loading ? (
          <p className="text-center mt-12 text-gray-500">
            Loading appointments...
          </p>
        ) : appointments.length === 0 ? (
          <p className="text-center mt-12 text-gray-500">
            No appointments found
          </p>
        ) : (
          <div className="mt-6 space-y-6">
            {appointments.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border shadow-sm p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition"
              >
                {/* DOCTOR IMAGE */}
                <img
                  src={item.docID?.image}
                  alt="Doctor"
                  className="w-28 h-28 rounded-lg object-cover bg-indigo-50"
                />

                {/* DETAILS */}
                <div className="flex-1 text-sm text-gray-600 space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.docID?.name}
                  </h3>
                  <p>{item.docID?.speciality}</p>

                  <p className="mt-2">
                    <span className="font-medium">Date & Time:</span>
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>

                  <p>
                    <span className="font-medium">Fees:</span> {Currency}
                    {item.amount} <span className="text-sm font-semibold text-gray-500">(Pay at Clinic)</span>
                  </p>

                  {/* STATUS BADGE */}
                  <div className="mt-2">
                    {item.cancelled && (
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                        Cancelled
                      </span>
                    )}

                    {!item.cancelled && item.isCompleted && (
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        Completed
                      </span>
                    )}


                  </div>
                </div>

                {/* ACTIONS */}
                {!item.cancelled && !item.isCompleted && (
                  <div className="flex sm:flex-col gap-2 justify-end min-w-40">


                    {!item.cancelled && (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="px-4 py-2 rounded-md border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-white transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyAppointments;
