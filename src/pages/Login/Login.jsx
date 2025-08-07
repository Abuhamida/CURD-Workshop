import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/images/login.svg";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/"); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] to-[#f1f5f9] flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden bg-white shadow-2xl rounded-3xl md:grid-cols-2">

        {/* Left Panel */}
        <div className="bg-[#0f172a] text-white p-10 flex flex-col justify-center items-start space-y-4">
          <h2 className="text-4xl font-bold">Welcome Back</h2>
          <p className="text-lg text-gray-300">Login to access your dashboard and continue your work.</p>
          <img src={loginImage} alt="Login illustration" className="w-full mt-4 max-h-56" />
        </div>

        {/* Right Panel */}
        <div className="p-10">
          <h3 className="mb-6 text-3xl font-bold text-center text-gray-800">Login</h3>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="text-sm text-center text-red-500">{error}</div>}

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-lg rounded-xl font-semibold text-white transition-all ${
                isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="pt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
