import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this at the top

import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const AuthForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const API_BASE_URL = "http://localhost:3000/api/auth";

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Validation
    if (!loginData.email || !loginData.password) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      setLoading(false);
      return;
    }

    if (!validateEmail(loginData.email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setMessage({
          text: "Login successful! Token received.",
          type: "success",
        });

        setLoginData({ email: "", password: "" });

        console.log("User logged in successfully, token:", data.token);

        navigate("/dashboard"); // Navigate after successful login
      } else {
        setMessage({ text: data.message || "Login failed", type: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        text: "Network error. Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Validation
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      setLoading(false);
      return;
    }

    if (!validateEmail(registerData.email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      setLoading(false);
      return;
    }

    if (!validatePassword(registerData.password)) {
      setMessage({
        text: "Password must be at least 6 characters long",
        type: "error",
      });
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          text: "Registration successful! You can now login.",
          type: "success",
        });

        // Reset form and switch to login
        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setIsLogin(true);
          setMessage({ text: "", type: "" });
        }, 2000);
      } else {
        setMessage({
          text: data.message || "Registration failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({
        text: "Network error. Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter" && !loading) {
      action();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage({ text: "", type: "" });
    setLoginData({ email: "", password: "" });
    setRegisterData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      <div
        className="w-screen h-screen bg-cover bg-center font-Poppins bg-no-repeat"
        style={{ backgroundImage: "url('book.png')" }}
      >
        <div className="min-h-screen bg-transparent flex">
          {/* Left Side - Form */}
          <div className="flex-1 flex items-center justify-center p-8  ">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center -mt-16 ml-7">
                <h1 className="text-4xl  -mt-12 text-black font-bold  bg-gradient-to-r from-white to-gray-300 bg-clip-text ">
                  {isLogin ? "Welcome Back" : "Join Us Today"}
                </h1>
                <p className="text-black text-lg">
                  {isLogin
                    ? "Sign in to continue your journey"
                    : "Create your account to get started"}
                </p>
              </div>

              {/* Message Display */}
              {message.text && (
                <div
                  className={`mb-6 ml-10 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm ${
                    message.type === "success"
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-600"
                      : "bg-red-500/20 border border-red-500/30 text-red-600"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              {/* Forms */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 ml-9 mt-7 border border-black/10 shadow-2xl">
                {isLogin ? (
                  /* Login Form */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBF78] focus:border-transparent transition-all hover:bg-white/15"
                          placeholder="Enter your email"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-3">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                          className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBF78] focus:border-transparent transition-all hover:bg-white/15"
                          placeholder="Enter your password"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900 transition-colors"
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full bg-[#945d22] text-white py-4 px-6 rounded-xl font-semibold hover:text-gray-50  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg transform hover:scale-[1.02]"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5" />
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* Register Form */
                  <div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700  ">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                        <input
                          type="text"
                          name="username"
                          value={registerData.username}
                          onChange={handleRegisterChange}
                          onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBF78] focus:border-transparent transition-all hover:bg-white/15"
                          placeholder="Choose a username"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBF78] focus:border-transparent transition-all hover:bg-white/15"
                          placeholder="Enter your email"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                          className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBF78] focus:border-transparent transition-all hover:bg-white/15"
                          placeholder="Create a password"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-white transition-colors"
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-3">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBF78] focus:border-transparent transition-all hover:bg-white/15"
                          placeholder="Confirm your password"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleRegister}
                      disabled={loading}
                      className="w-full bg-[#945d22] mt-2  text-white py-4 px-6 rounded-xl font-semibold  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg transform hover:scale-[1.02]"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Toggle Mode */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-2">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </p>
                  <button
                    onClick={toggleMode}
                    className="text-gray-500  font-semibold transition-colors hover:underline"
                    disabled={loading}
                  >
                    {isLogin ? "Sign up here" : "Sign in here"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:flex flex-1 relative overflow-hidden">
            <div className="absolute inset-0 z-10"></div>
            <div
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isLogin ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            >
              <div className="w-full h-full bg-transparent flex items-center justify-center relative overflow-hidden">
                <div className="z-20 text-center mt-10 px-2 -ml-9">
                  <p className="text-black px-28  text-4xl font-bold">
                    Explore wide range of books in and around you
                  </p>
                  <img
                    src="login1.png"
                    alt="Login Illustration"
                    className="w-100 h-100 mx-auto object-cover"
                  />

                  <div className="w-full flex flex-col -ml-4 items-center py-12 px-36 bg-transparent">
                    <div className="relative flex items-center justify-between w-full max-w-4xl px-3">
                      <div className="absolute  left-6 right-6 h-1 bg-[#bbbbbb] z-0 transform -translate-y-1/2"></div>

                      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                        <div className="w-20 h-20 rounded-full bg-[#945d22] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium mt-2">
                          Login
                        </span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                        <div className="w-20 h-20 rounded-full bg-[#945d22] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium mt-2">
                          Buy / Sell
                        </span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                        <div className="w-20 h-20 rounded-full bg-[#945d22] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium mt-2">
                          Earn Coins
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Image */}
            <div
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                !isLogin ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            >
              <div className="z-20 text-center mt-10 px-2 -ml-9">
                <p className="text-black px-28  text-4xl font-bold">
                  Give a book. Get a book. Empower a learner.
                </p>
                <img
                  src="login2.png"
                  alt="Login Illustration"
                  className="w-100 h-100 mx-auto object-cover"
                />

                <div className="w-full flex flex-col -ml-4 items-center py-2 px-36 bg-transparent">
                  <div className="relative flex items-center justify-between w-full max-w-4xl px-3">
                    <div className="absolute  left-6 right-6 h-1 bg-[#bbbbbb] z-0 transform -translate-y-1/2"></div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-[#945d22] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium mt-2">
                        SignUp
                      </span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-[#945d22] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium mt-2">
                        Buy / Sell
                      </span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                      <div className="w-20 h-20 rounded-full bg-[#945d22] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium mt-2">
                        Earn Coins
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
