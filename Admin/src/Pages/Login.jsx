import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { adminLogin } from "../redux/slices/adminAuthSlice";
import { doctorLogin } from "../redux/slices/doctorAuthSlice";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    if (state === "Admin") {
      dispatch(adminLogin({ email, password }));
    } else {
      dispatch(doctorLogin({ email, password }));
    }
  };

  return (
    <>
      <section className="min-h-[90vh] flex items-center justify-center px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm sm:max-w-md bg-white border rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              <span className="text-(--primary)">{state === "Admin" ? "Admin" : "Physiotherapist"}</span> Login
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Secure access to your dashboard
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full px-4 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-(--primary)"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              className="w-full px-4 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-(--primary)"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-(--primary) text-white py-2.5 rounded-lg
          font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            Login
          </button>

          {/* Switch */}
          <div className="text-center text-sm mt-5 text-gray-600">
            {state === "Admin" ? (
              <>
                Physiotherapist Login?
                <span
                  onClick={() => setState("Doctor")}
                  className="text-(--primary) font-medium cursor-pointer hover:underline"
                >
                  Click here
                </span>
              </>
            ) : (
              <>
                Admin Login?
                <span
                  onClick={() => setState("Admin")}
                  className="text-(--primary) font-medium cursor-pointer hover:underline"
                >
                  Click here
                </span>
              </>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
