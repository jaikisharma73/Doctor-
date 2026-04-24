import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axiosInstance from "../../redux/api/axiosInstance";
import { toast } from "react-toastify";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) return toast.error("Please upload physiotherapist image");

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 }),
      );

      const { data } = await axiosInstance.post(
        "/api/admin/add-doctor",
        formData,
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setDegree("");
        setAbout("");
        setFees("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <section className="p-4 sm:p-6 lg:p-8 w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Add Physiotherapist</h1>
          <p className="text-sm text-gray-500">
            Fill in physiotherapist details to add them to the platform
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl border shadow-sm max-w-5xl"
        >
          <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
            {/* Upload Image */}
            <div className="flex items-center gap-6">
              <label htmlFor="doc-img" className="cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      docImg ? URL.createObjectURL(docImg) : assets.upload_area
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
              </label>
              <input
                id="doc-img"
                type="file"
                hidden
                onChange={(e) => setDocImg(e.target.files[0])}
              />
              <div>
                <p className="font-medium text-gray-700">Physiotherapist Photo</p>
                <p className="text-xs text-gray-500">
                  Upload a clear profile picture
                </p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                <input
                  className="input"
                  placeholder="Physiotherapist Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  className="input"
                  placeholder="Physiotherapist Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />

                <input
                  className="input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />

                <select
                  className="input"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <option key={i} value={`${i + 1} Year`}>
                      {i + 1} Year Experience
                    </option>
                  ))}
                </select>

                <input
                  className="input"
                  placeholder="Consultation Fees"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  type="number"
                  required
                />
              </div>

              {/* Right */}
              <div className="space-y-4">
                <select
                  className="input"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                >
                  <option>General physician</option>
                  <option>Gynecologist</option>
                  <option>Dermatologist</option>
                  <option>Pediatricians</option>
                  <option>Neurologist</option>
                  <option>Gastroenterologist</option>
                </select>

                <input
                  className="input"
                  placeholder="Degree / Education"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                />

                <input
                  className="input"
                  placeholder="Address Line 1"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  required
                />

                <input
                  className="input"
                  placeholder="Address Line 2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* About */}
            <div>
              <textarea
                className="input resize-none"
                rows={5}
                placeholder="About Physiotherapist (Experience, achievements, background)"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
            </div>

            {/* Action */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className="bg-(--primary) text-white px-10 py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                Add Physiotherapist
              </button>
            </div>
          </div>
        </form>

        {/* Tailwind input utility */}
        <style>
          {`
          .input {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.6rem 0.8rem;
            font-size: 0.875rem;
            outline: none;
          }
          .input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 1px var(--primary);
          }
        `}
        </style>
      </section>
    </>
  );
};

export default AddDoctor;
