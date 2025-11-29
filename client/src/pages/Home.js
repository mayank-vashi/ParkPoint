// import React from 'react'

// const Home = () => {
//   return (
//     <div>
//       this is home page
//     </div>
//   )
// }

// export default Home


import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();

  const handleBook = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) navigate("/login");
    else navigate("/dashboard");
  };

  return (
    <div className="overflow-x-hidden font-sans text-gray-800 m-0 p-0">
      {/* 🔹 Hero Section */}
      <section
        id="home"
        className="relative bg-cover bg-center bg-no-repeat min-h-screen flex flex-col justify-center items-start w-screen"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
          <div className="absolute inset-0 bg-purple-900 bg-opacity-50"></div>


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-2xl text-white px-8 md:px-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
            Discover seamless parking with{" "}
            <span className="text-teal-300">ParkPoint</span>
          </h1>
          <p className="text-xl mb-8 font-medium text-gray-100 drop-shadow-md">
            Find and book your perfect parking spot in seconds, hassle-free.
          </p>
          <motion.button
            onClick={handleBook}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#512B81] to-[#8062a5ff] transition-all px-8 py-3 rounded-lg shadow-lg font-semibold"
          >
            Get Started
          </motion.button>
        </motion.div>
      </section>

      {/* 🔹 Why Choose Us Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-white to-purple-50 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-10 text-[#512B81]"
        >
          Why Choose <span className="text-[#512B81]">ParkPoint?</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[
            {
              icon: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
              title: "Easy Booking",
              desc: "Book a parking spot instantly with just a few taps.",
            },
            {
              icon: "https://cdn-icons-png.flaticon.com/512/10305/10305589.png",
              title: "Secure Payments",
              desc: "Safe and secure payment options for your peace of mind.",
            },
            {
              icon: "https://cdn-icons-png.flaticon.com/512/1042/1042339.png",
              title: "Real-Time Availability",
              desc: "Get live updates on available parking spots near you.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl border border-purple-100"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-16 mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold text-[#512B81] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔹 Pricing Section */}
      <section
        id="pricing"
        className="py-20 text-center bg-gradient-to-b from-purple-50 to-white w-full"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4 text-[#512B81]"
        >
          Our Pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-gray-700 mb-8"
        >
          ₹10 per hour — Simple & Transparent Pricing
        </motion.p>

        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src="https://cdn-icons-png.flaticon.com/512/942/942751.png"
          alt="Parking icon"
          className="w-24 mx-auto mb-6 opacity-90"
        />

        <motion.button
          onClick={handleBook}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-[#35155D] to-[#512B81] text-white px-10 py-3 rounded-xl transition-all duration-300 shadow-lg"
        >
          Book a Slot
        </motion.button>
      </section>

      {/* 🔹 FAQ Section */}
      <section
        id="faq"
        className="py-20 bg-gradient-to-b from-white to-purple-50 w-full"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-[#512B81] flex items-center justify-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/471/471662.png"
            alt="FAQ"
            className="w-8 h-8"
          />
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto px-6">
          {[
            {
              q: "How do I book a slot?",
              a: "Click 'Book Slot', choose time and duration, and confirm your booking.",
            },
            {
              q: "Can I cancel my booking?",
              a: "Yes, you can cancel anytime before your slot time starts.",
            },
            { q: "What is the cost per hour?", a: "The cost is ₹10/hour." },
            {
              q: "Do I need to register before booking?",
              a: "Yes, you need to log in before you can book a parking slot.",
            },
          ].map((item, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="mb-4 border border-purple-200 rounded-lg bg-white p-5 shadow-md hover:shadow-lg hover:border-purple-400 transition-all duration-300"
            >
              <summary className="font-semibold text-purple-700 cursor-pointer flex items-center">
                <span className="mr-2">💬</span>
                {item.q}
              </summary>
              <p className="mt-2 text-gray-700 pl-6">{item.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="bg-gradient-to-r from-[#35155D] to-[#512B81] text-white py-8 text-center w-screen shadow-inner">
        <p className="text-lg font-semibold">
          © 2025 ParkPoint. All rights reserved.
        </p>
      </footer>
    </div>
  );
}