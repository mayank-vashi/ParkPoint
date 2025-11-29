// import { NavLink, useNavigate } from "react-router-dom";

// const FrontHeader = () => {
//   return (
//     <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
//       <h1 className="text-xl font-bold">🚗 Parking Management System</h1>
//       <nav className="space-x-4">
//         <NavLink to="/" className={({ isActive }) =>`px-4 py-2 rounded ${isActive ? "pb-6 bg-white text-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-500"}`}>Home</NavLink>
//         <NavLink to="/register" className={({ isActive }) =>`px-4 py-2 rounded ${isActive ? "pb-6 bg-white text-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-500"}`}>Register</NavLink>
//         <NavLink to="/login" className={({ isActive }) =>`px-4 py-2 rounded ${isActive ? "pb-6 bg-white text-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-500"}`}>Login</NavLink>
//       </nav>
//     </header>
//   )
// }

// export default FrontHeader

import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const FrontHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseStyle =
    "px-4 py-2 rounded-md font-medium transition-all duration-300 ease-in-out";
  const activeStyle =
    "bg-gradient-to-r from-[#512B81] to-[#8062a5ff] text-white font-semibold shadow-md scale-105 border-b-4 border-[#512B81]";
  const inactiveStyleScrolled =
    "text-[#512B81] hover:text-[#4F46E5] hover:scale-105 hover:shadow-md"; // dark indigo for visibility
  const inactiveStyleTop =
    "text-white hover:text-teal-300 hover:scale-105 hover:shadow-md";

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 
        ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"} 
        p-4 flex justify-between items-center
        transition-all duration-500 ease-in-out
      `}
    >
      <h1
        className={`text-[30px] font-bold drop-shadow-lg transition-colors duration-300 ${
          scrolled ? "text-[#35155D]" : "text-white"
        }`}
      >
        <svg className="transition-colors duration-300 inline-block mr-2 pb-2" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke={scrolled ? "#35155D" : "#ffffff"}>
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 14.803v6.447c0 .414.336.75.75.75h1.614a.75.75 0 0 0 .74-.627L5.5 19h13l.395 2.373a.75.75 0 0 0 .74.627h1.615a.75.75 0 0 0 .75-.75v-6.447a5.954 5.954 0 0 0-1-3.303l-.78-1.17a1.994 1.994 0 0 1-.178-.33h.994a.75.75 0 0 0 .671-.415l.25-.5A.75.75 0 0 0 21.287 8H19.6l-.31-1.546a2.5 2.5 0 0 0-1.885-1.944C15.943 4.17 14.141 4 12 4c-2.142 0-3.943.17-5.405.51a2.5 2.5 0 0 0-1.886 1.944L4.399 8H2.714a.75.75 0 0 0-.67 1.085l.25.5a.75.75 0 0 0 .67.415h.995a1.999 1.999 0 0 1-.178.33L3 11.5c-.652.978-1 2.127-1 3.303zm15.961-4.799a4 4 0 0 0 .34.997H5.699c.157-.315.271-.65.34-.997l.632-3.157a.5.5 0 0 1 .377-.39C8.346 6.157 10 6 12 6c2 0 3.654.156 4.952.458a.5.5 0 0 1 .378.389l.631 3.157zM5.5 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM20 14.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill={scrolled ? "#35155D" : "#ffffff"}></path></g>
        </svg> 
        ParkPoint
        
      </h1>

      <nav className="space-x-4 flex items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? activeStyle
                : scrolled
                ? inactiveStyleScrolled
                : inactiveStyleTop
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/register"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? activeStyle
                : scrolled
                ? inactiveStyleScrolled
                : inactiveStyleTop
            }`
          }
        >
          Register
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
                ? activeStyle
                : scrolled
                ? inactiveStyleScrolled
                : inactiveStyleTop
            }`
          }
        >
          Login
        </NavLink>
      </nav>
    </header>
  );
};

export default FrontHeader;