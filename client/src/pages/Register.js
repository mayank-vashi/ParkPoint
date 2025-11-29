import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../assets/registor_bg.jpg"; // Make sure this path is correct
import { ToastContainer } from "react-toastify";


// ===== SVG ICONS (ALL - Color Visibility Fixed) =====
const PRIMARY_BLUE = "#512B81"; // blue-500

// --- Standard Icons (remain blue) ---
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
const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    style={{ transform: "translateY(2px)" }}
  >
    <path
      d="M19 9L14 14.1599C13.7429 14.4323 13.4329 14.6493 13.089 14.7976C12.7451 14.9459 12.3745 15.0225 12 15.0225C11.6255 15.0225 11.2549 14.9459 10.9109 14.7976C10.567 14.6493 10.2571 14.4323 10 14.1599L5 9"
      stroke={PRIMARY_BLUE}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Field Icons (FIXED: now black) ---
const IconProps = {
  // Use Tailwind classes to set color and stroke
  className: "w-5 h-5 text-black stroke-current",
  strokeWidth: "1.5",
  fill: "none",
  viewBox: "0 0 24 24",
  // 'stroke' attribute removed, will be handled by 'stroke-current' class
};

const UserIcon = () => (
  <svg {...IconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A1.5 1.5 0 0118 21.75H6a1.5 1.5 0 01-1.499-1.632z"
    />
  </svg>
);
const EnvelopeIcon = () => (
  <svg {...IconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);
const HomeIcon = () => (
  <svg {...IconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);
const LockIcon = () => (
  <svg {...IconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

// ===== Reusable InputField =====
const InputField = ({
  id,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
}) => (
  // --- SPACING REDUCED ---
  <div className="relative mb-2">
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>

    {icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        {icon}
      </div>
    )}

    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className={`relative w-full rounded-xl border border-gray-300/50 bg-white/70 
                 py-2.5 px-4 backdrop-blur-sm transition-all duration-300
                 focus:border-blue-500 focus:outline-none
                 ${icon ? "pl-11" : ""}
                 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
                 [&::-webkit-outer-spin-button]:appearance-none`}
    />
  </div>
);

// ===== VehicleDropdown (Icon Removed) =====
const VehicleDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const options = ["Car", "Bike", "Scooter"];

  return (
    // --- SPACING REDUCED ---
    <div className="relative w-full mb-2">
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="flex  cursor-pointer items-center justify-between rounded-xl 
                   border border-gray-300/50 bg-white/70 py-2.5 px-4 backdrop-blur-sm 
                   transition-all duration-300"
      >
        <span className={value ? "text-black" : "text-gray-500"}>
          {value || "Select vehicle type"}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <ChevronDownIcon />
        </motion.div>
      </div>

      {/* Menu (Unchanged) */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-[calc(100%_+_0.25rem)] left-0 z-20 mt-1 w-full 
                     overflow-hidden rounded-xl bg-white/95 shadow-2xl backdrop-blur-sm"
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="m-0.5 cursor-pointer rounded-lg py-2 px-4 text-black 
                         transition-all duration-300
                         hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 hover:text-white"
            >
              {opt}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// ===== MAIN REGISTER COMPONENT (SCROLL FIX APPLIED) =====
export default function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const handleValueChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match!");
    }
    if (form.phone.length !== 10) {
      return setError("Phone number must be 10 digits");
    }
    if (!form.vehicleType) {
      return setError("Please select a vehicle type");
    }

    setLoading(true);
    const { confirmPassword, ...postData } = form;

    try {
      const res = await fetch(`${process.env.REACT_APP_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/login");
        // toast.success("Registration successful!");
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Error connecting to the server. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      // --- FIX 1: Locked main div to screen height, no overflow ---
      className="flex h-screen w-full items-center justify-center overflow-hidden
                 bg-cover bg-center p-4"
    >
      <div className="absolute inset-0 bg-purple-900 bg-opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
        transition={{ duration: 0.5 }}
        // --- FIX 2: Reduced padding and kept scroll fallback ---
        className="relative z-10 w-full max-w-md rounded-3xl bg-white/80 p-6
                   shadow-2xl backdrop-blur-lg md:p-8 max-h-[95vh] overflow-y-auto"
      >
        {/* Header --- SPACING REDUCED --- */}
        <div className="mb-4 flex flex-col items-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              boxShadow: [
                "0px 0px 10px #8062a5ff",
                "0px 0px 25px #512B81",
                "0px 0px 10px #8062a5ff",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-3 inline-flex items-center justify-center rounded-2xl
                       bg-gradient-to-tr from-[#512B81] to-[#8062a5ff] p-3"
          >
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"></path>
              <circle cx="6.5" cy="16.5" r="2.5"></circle>
              <circle cx="16.5" cy="16.5" r="2.5"></circle>
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-[#512B81]">Create Account</h2>
          <p className="text-sm text-gray-600">
            Sign up to manage your parking spaces
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded-xl bg-red-500/20 p-3 text-center text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* --- FORM (Passing icon props) --- */}
        <form onSubmit={handleRegister}>
          <div className="mb-6">
            <InputField
              id="name"
              placeholder="Name"
              value={form.name}
              onChange={handleInputChange}
              icon={<UserIcon />}
            />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-4">
            <InputField
              id="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              icon={<EnvelopeIcon />}
            />
            <InputField
              id="address"
              placeholder="Address"
              value={form.address}
              onChange={handleInputChange}
              icon={<HomeIcon />}
            />
            {/* Icons removed as per your last snippet */}
            <InputField
              id="vehicleNumber"
              placeholder="Vehicle Number"
              value={form.vehicleNumber}
              onChange={handleInputChange}
            />

            <VehicleDropdown
              value={form.vehicleType}
              onChange={(value) => handleValueChange("vehicleType", value)}
            />

            <InputField
              id="vehicleModel"
              placeholder="Vehicle Model"
              value={form.vehicleModel}
              onChange={handleInputChange}
            />

            <InputField
              id="phone"
              placeholder="Phone Number"
              type="number"
              value={form.phone}
              onChange={handleInputChange}
            />
            {/* --- Password Grid --- SPACING REDUCED --- */}

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <LockIcon />
              </div>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
                required
                className="relative w-full rounded-xl border border-gray-300/50 bg-white/70 
                           py-2.5 px-4 pl-11 pr-10 backdrop-blur-sm
                           focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 z-10 cursor-pointer
                           border-none bg-transparent"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>

              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <LockIcon />
              </div>

              <input
                id="confirmPassword"
                type={showCnfPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleInputChange}
                required
                className="relative w-full rounded-xl border border-gray-300/50 bg-white/70 
                py-2.5 px-4 pl-11 backdrop-blur-sm 
                focus:border-blue-500 focus:outline-none"
              />
               <button
                type="button"
                aria-label={showCnfPassword ? "Hide password" : "Show password"}
                onClick={() => setShowCnfPassword(!showCnfPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 z-10 cursor-pointer
                           border-none bg-transparent"
              >
                {showCnfPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              scale: 1.03,
              boxShadow: `0 0 20px #9d85bbff`,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full cursor-pointer rounded-xl border-none bg-gradient-to-r 
                       from-[#512B81] to-[#8062a5ff] p-3 font-bold text-white
                       disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </motion.button>
        </form>

        {/* --- SPACING REDUCED --- */}
        <p className="mt-3 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#512B81]">
            Login
          </Link>
        </p>
      </motion.div>
      <ToastContainer position="bottom-left" autoClose={4000} />
    </div>
  );
}
