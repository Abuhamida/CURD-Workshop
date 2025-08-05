import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ToDoImage from "../../assets/images/undraw_to-do-list_o3jf.svg";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    fullName: "",
    address: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!formData.username) {
      toast.error("Username is required");
      return;
    }

    setIsLoading(true);

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw authError;
      }

      // Then update the user profile in the users table
      const { error: profileError } = await supabase.from("users").upsert({
        id: authData.user.id,
        username: formData.username,
        full_name: formData.fullName,
        address: formData.address,
        phone: formData.phone,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        throw profileError;
      }

      toast.success(
        "Signup successful! Please check your email for confirmation."
      );
      navigate("/login");
    } catch (error) {
      toast.error("Signup failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e0f2fe] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Panel */}
        <div className="bg-[#0f172a] text-white p-10 flex flex-col justify-center items-start space-y-4">
          <h2 className="text-4xl font-bold">Welcome!</h2>
          <p className="text-lg text-gray-300">
            Sign up to access your dashboard and explore our features.
          </p>
          <img src={ToDoImage} alt="Signup illustration" className="w-full mt-4 max-h-72" />
        </div>

        {/* Right Panel - Form */}
        <div className="p-10">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create Your Account
          </h3>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <FormField
                id="email"
                label="Email*"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />

              {/* Username */}
              <FormField
                id="username"
                label="Username*"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Unique username"
              />

              {/* Full Name */}
              <FormField
                id="fullName"
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
              />

              {/* Address */}
              <FormField
                id="address"
                label="Address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address"
              />

              {/* Password */}
              <FormField
                id="password"
                label="Password*"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
              />

              {/* Confirm Password */}
              <FormField
                id="confirmPassword"
                label="Confirm Password*"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
              />

              {/* Phone */}
              <FormField
                id="phone"
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+20XXXXXXXX"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-lg rounded-xl font-semibold text-white transition-all ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </button>

            <p className="text-center text-sm text-gray-600 pt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const FormField = ({ id, label, type, value, onChange, placeholder }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={label.includes("*")}
      minLength={id.includes("password") ? 6 : undefined}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
    />
  </div>
);
