import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorProfile,
  updateDoctorProfile,
} from "../../redux/slices/doctorDataSlice";
import { Currency } from "../../utils/helpers";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const dToken = useSelector((s) => s.doctorAuth.dToken);
  const { profileData } = useSelector((s) => s.doctorData);

  const [isEdit, setIsEdit] = useState(false);
  const [localProfile, setLocalProfile] = useState(null);

  useEffect(() => {
    if (dToken) dispatch(fetchDoctorProfile());
  }, [dToken, dispatch]);

  useEffect(() => {
    if (profileData) setLocalProfile(profileData);
  }, [profileData]);

  if (!localProfile) return null;

  const saveProfile = () => {
    const payload = {
      name: localProfile.name,
      degree: localProfile.degree,
      speciality: localProfile.speciality,
      about: localProfile.about,
      address: localProfile.address,
      fees: localProfile.fees,
      available: localProfile.available,
    };

    dispatch(updateDoctorProfile(payload)).then((res) => {
      if (!res.error) {
        toast.success("Profile updated successfully");
        setIsEdit(false);
        dispatch(fetchDoctorProfile());
      }
    });
  };

  return (
    <>
      <div className="m-5 max-w-5xl">
        {/* ===== PROFILE CARD ===== */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-linear-to-r from-indigo-500 to-blue-500">
            <img
              src={localProfile.image}
              alt="Doctor"
              className="w-28 h-28 rounded-full object-cover border-4 border-white"
            />

            <div className="text-white text-center sm:text-left">
              {isEdit ? (
                <input
                  type="text"
                  value={localProfile.name}
                  onChange={(e) =>
                    setLocalProfile((p) => ({ ...p, name: e.target.value }))
                  }
                  className="text-2xl font-semibold bg-white/20 text-white placeholder-white/70 outline-none border-b border-white/50 px-1 py-0.5 mt-2"
                />
              ) : (
                <h2 className="text-2xl font-semibold">{localProfile.name}</h2>
              )}

              {isEdit ? (
                <div className="flex gap-2 items-center mt-2">
                  <input
                    type="text"
                    value={localProfile.degree}
                    onChange={(e) =>
                      setLocalProfile((p) => ({ ...p, degree: e.target.value }))
                    }
                    className="text-sm bg-white/20 text-white placeholder-white/70 outline-none border-b border-white/50 px-1 py-0.5 w-24"
                  />
                  <span>•</span>
                  <select
                    value={localProfile.speciality}
                    onChange={(e) =>
                      setLocalProfile((p) => ({ ...p, speciality: e.target.value }))
                    }
                    className="text-sm bg-white/20 text-white placeholder-white/70 outline-none border-b border-white/50 px-1 py-0.5"
                  >
                    <option className="text-black">Orthopedic Physiotherapy</option>
                    <option className="text-black">Sports Physiotherapy</option>
                    <option className="text-black">Geriatric Physiotherapy</option>
                    <option className="text-black">Pediatric Physiotherapy</option>
                    <option className="text-black">Neurological Physiotherapy</option>
                    <option className="text-black">Cardiopulmonary Physiotherapy</option>
                  </select>
                </div>
              ) : (
                <p className="text-sm opacity-90 mt-1">
                  {localProfile.degree} • {localProfile.speciality}
                </p>
              )}

              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full text-xs font-medium ${
                  localProfile.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {localProfile.available ? "Available" : "Not Available"}
              </span>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-6">
            {/* ABOUT */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                About Physiotherapist
              </p>
              {isEdit ? (
                <textarea
                  value={localProfile.about}
                  onChange={(e) =>
                    setLocalProfile((p) => ({ ...p, about: e.target.value }))
                  }
                  className="w-full border rounded-md px-3 py-2 text-gray-700 min-h-[100px] mt-2 outline-none"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed mt-2">
                  {localProfile.about}
                </p>
              )}
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FEES */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Appointment Fee
                </p>
                {isEdit ? (
                  <input
                    type="number"
                    value={localProfile.fees}
                    onChange={(e) =>
                      setLocalProfile((p) => ({
                        ...p,
                        fees: e.target.value,
                      }))
                    }
                    className="w-full border rounded-md px-3 py-2"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-800">
                    {Currency} {localProfile.fees}
                  </p>
                )}
              </div>

              {/* AVAILABILITY */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Availability
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localProfile.available}
                    disabled={!isEdit}
                    onChange={() =>
                      setLocalProfile((p) => ({
                        ...p,
                        available: !p.available,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Accepting Appointments</span>
                </label>
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                Clinic Address
              </p>

              <div className="space-y-2">
                <input
                  disabled={!isEdit}
                  value={localProfile.address.line1}
                  onChange={(e) =>
                    setLocalProfile((p) => ({
                      ...p,
                      address: { ...p.address, line1: e.target.value },
                    }))
                  }
                  className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100"
                />

                <input
                  disabled={!isEdit}
                  value={localProfile.address.line2}
                  onChange={(e) =>
                    setLocalProfile((p) => ({
                      ...p,
                      address: { ...p.address, line2: e.target.value },
                    }))
                  }
                  className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex justify-end">
              {isEdit ? (
                <button
                  onClick={saveProfile}
                  className="px-6 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-6 py-2 rounded-full border border-indigo-600 text-indigo-600 text-sm hover:bg-indigo-50 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfile;
