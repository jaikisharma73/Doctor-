import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* ================= HERO TITLE ================= */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest text-gray-400 uppercase">
            Who we are
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-2">
            About <span className="text-(--primary)">Prescripto</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 mt-4 text-sm md:text-base">
            Simplifying healthcare access with modern technology and a
            patient-first approach.
          </p>
        </div>

        {/* ================= ABOUT CONTENT ================= */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <img
            src={assets.about_image}
            alt="About Prescripto"
            className="w-full rounded-2xl shadow-sm"
          />

          <div className="flex flex-col gap-5 text-gray-600 text-sm md:text-base leading-relaxed">
            <p>
              <span className="font-medium text-gray-800">Prescripto</span> is
              your trusted partner in managing healthcare needs efficiently. We
              help patients connect with qualified physiotherapists, book appointments,
              and manage health records — all in one secure platform.
            </p>

            <p>
              We understand how valuable your time is. That’s why our platform
              is built to remove unnecessary complexity from healthcare access
              and provide a smooth, reliable experience for everyone.
            </p>

            <div className="bg-gray-50 border-l-4 border-(--primary) p-4 rounded-md">
              <p className="font-semibold text-gray-800 mb-1">Our Vision</p>
              <p>
                To bridge the gap between patients and healthcare providers and
                make quality healthcare accessible, transparent, and efficient.
              </p>
            </div>
          </div>
        </div>

        {/* ================= WHY CHOOSE US ================= */}
        <div className="text-center mb-10">
          <p className="text-sm tracking-widest text-gray-400 uppercase">
            Our strengths
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-2">
            Why Choose <span className="text-(--primary)">Us</span>
          </h2>
        </div>

        {/* ================= FEATURES ================= */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {/* Card 1 */}
          <div className="group border rounded-2xl p-8 text-center hover:bg-(--primary) hover:text-white transition-all duration-300">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-white mb-5">
              🚀
            </div>
            <h3 className="font-semibold text-lg mb-2">Efficiency</h3>
            <p className="text-sm opacity-80">
              Quick and streamlined appointment scheduling designed to fit your
              busy lifestyle.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group border rounded-2xl p-8 text-center hover:bg-(--primary) hover:text-white transition-all duration-300">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-white mb-5">
              🏥
            </div>
            <h3 className="font-semibold text-lg mb-2">Convenience</h3>
            <p className="text-sm opacity-80">
              Easy access to trusted physiotherapists and specialists near you, anytime.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group border rounded-2xl p-8 text-center hover:bg-(--primary) hover:text-white transition-all duration-300">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-white mb-5">
              ❤️
            </div>
            <h3 className="font-semibold text-lg mb-2">Personalization</h3>
            <p className="text-sm opacity-80">
              Personalized recommendations, reminders, and care tailored just
              for you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
