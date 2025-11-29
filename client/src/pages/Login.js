import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bgImage from "../assets/login_bg.jpg"; // Assuming you have this image
import { ToastContainer,toast } from "react-toastify";


const PRIMARY_BLUE = "#512B81"; // blue-500
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke={PRIMARY_BLUE}
    width="18"
    height="18"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke={PRIMARY_BLUE}
    width="18"
    height="18"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.944-9.544-7a10.05 10.05 0 011.658-3.042m3.042-2.58A9.958 9.958 0 0112 5c4.478 0 8.27 2.944 9.544 7a9.957 9.957 0 01-1.332 2.416M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3l18 18"
    />
  </svg>
);
const IconProps = {
  // Use Tailwind classes to set color and stroke
  className: "w-5 h-5 text-black stroke-current",
  strokeWidth: "1.5",
  fill: "none",
  viewBox: "0 0 24 24",
  // 'stroke' attribute removed, will be handled by 'stroke-current' class
};
const LockIcon = () => (
  <svg {...IconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate backend call
    setTimeout(() => setLoading(false), 1000);

    try {
      // console.log(process.env.REACT_APP_API);
      const res = await fetch(`${process.env.REACT_APP_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user.name));
        // console.log("Login successful:", data.user.name);
        if (data.user.role === "user")
          navigate("/user"); // For now, redirect all to /user
        else navigate("/admin"); // Redirect admin to /admin dashboard
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Error connecting to server");
      console.error(err);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blue overlay */}
      <div className="absolute inset-0 bg-purple-900 bg-opacity-50"></div>

      {/* Motion card with hover lift */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-[380px]"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          {/* Motion div for the blue box with continuous hover effect */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              boxShadow: [
                "0px 0px 10px #8062a5ff",
                "0px 0px 25px #512B81",
                "0px 0px 10px #8062a5ff",
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
            className="bg-gradient-to-tr from-[#512B81] to-[#8062a5ff] p-3 rounded-2xl mb-3 inline-flex items-center justify-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
            >
              <path
                d="M3 8L5.72187 10.2682C5.90158 10.418 6.12811 10.5 6.36205 10.5H17.6379C17.8719 10.5 18.0984 10.418 18.2781 10.2682L21 8M6.5 14H6.51M17.5 14H17.51M8.16065 4.5H15.8394C16.5571 4.5 17.2198 4.88457 17.5758 5.50772L20.473 10.5777C20.8183 11.1821 21 11.8661 21 12.5623V18.5C21 19.0523 20.5523 19.5 20 19.5H19C18.4477 19.5 18 19.0523 18 18.5V17.5H6V18.5C6 19.0523 5.55228 19.5 5 19.5H4C3.44772 19.5 3 19.0523 3 18.5V12.5623C3 11.8661 3.18166 11.1821 3.52703 10.5777L6.42416 5.50772C6.78024 4.88457 7.44293 4.5 8.16065 4.5ZM7 14C7 14.2761 6.77614 14.5 6.5 14.5C6.22386 14.5 6 14.2761 6 14C6 13.7239 6.22386 13.5 6.5 13.5C6.77614 13.5 7 13.7239 7 14ZM18 14C18 14.2761 17.7761 14.5 17.5 14.5C17.2239 14.5 17 14.2761 17 14C17 13.7239 17.2239 13.5 17.5 13.5C17.7761 13.5 18 13.7239 18 14Z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <h2 className="text-2xl font-bold text-[#512B81]">Welcome Back</h2>
          <p className="text-gray-600 text-sm">
            Sign in to manage your parking spaces
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative transition-transform duration-200 focus-within:scale-105">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                />
              </div>
            </motion.div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative transition-transform duration-200 focus-within:scale-105">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <LockIcon />
              </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-2.5 text-sm text-gray-500 px-2 py-1 rounded-md"
                >
                  {showPassword ? <EyeIcon/> : <EyeOffIcon/>}
                </button>
              </div>
            </motion.div>
          </div>

          

          {/* Sign In Button with glow on hover */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 20px #9d85bbff",
            }}
            transition={{ duration: 0.3 }}
            className={`w-full bg-gradient-to-r from-[#512B81] to-[#8062a5ff] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          <p className="text-center text-sm text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#512B81] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
      <ToastContainer position="bottom-left" autoClose={4000} />
      
    </div>
  );
}
