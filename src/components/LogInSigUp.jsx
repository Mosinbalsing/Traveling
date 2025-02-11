import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import bg from "../assets/images/Cars/carbg.png";
import { Check, Eye, EyeOff, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authAPI } from '@/config/api';

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[!-/:-@[-`{-~]/, text: "At least 1 special characters" },
];
const STRENGTH_CONFIG = {
  colors: {
    0: "bg-border",
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-amber-500",
    4: "bg-amber-700",
    5: "bg-emerald-500",
  },
  texts: {
    0: "Enter a password",
    1: "Weak password",
    2: "Medium password!",
    3: "Strong password!!",
    4: "Very Strong password!!!",
  },
};

// Create axios instance with default config
const api = axios.create({
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function SlidingAuthForm() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormValues({
      username: "",
      name: "",
      email: "",
      mobile: "",
      password: "",
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!isLogin && !/^\w{3,}$/.test(formValues.username)) {
      newErrors.username =
        "Username must be at least 3 characters and contain only letters, numbers, or underscores.";
    }

    if (!isLogin && !/^[a-zA-Z\s]+$/.test(formValues.name)) {
      newErrors.name = "Name can only contain letters and spaces.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!/^\d{10}$/.test(formValues.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formValues.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); // Start loading
      setTimeout(() => {
        setLoading(false); // Stop loading after 2 seconds (simulate API call)
        alert("Form submitted successfully!");
      }, 2000);
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const calculateStrength = useMemo(() => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(formValues.password),
      text: req.text,
    }));
    return {
      score: requirements.filter((req) => req.met).length,
      requirements,
    };
  }, [formValues.password]);

  // Update login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await authAPI.login(formValues.email, formValues.password);
      
      if (response.success) {
        localStorage.setItem("token", response.token);
        toast.success("Login Successful");
        navigate("/profile");
        setFormValues({
          username: "",
          name: "",
          email: "",
          mobile: "",
          password: "",
        });
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error('Login Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Unable to connect to server");
      } else {
        toast.error("Login failed - Please try again");
      }
    }
  };

  // Update signup handler similarly
  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      const response = await authAPI.signup(formValues);
      
      if (response.success) {
        toast.success("User Created Successfully");
        toggleForm();
        setFormValues({
          username: "",
          name: "",
          email: "",
          mobile: "",
          password: "",
        });
      } else {
        toast.error(response.message || "Signup failed");
      }
    } catch (error) {
      console.error('Signup Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Unable to connect to server");
      } else {
        toast.error("Signup failed - Please try again");
      }
    }
  };

  return (
    <div className="sm:w-full flex justify-center sm:h-[1120px]">
      <div className="relative w-full sm:w-full max-w-screen min-h-screen bg-gray-100 flex ">
        {/* Sliding Illustration - Hidden on Mobile and Tablet */}
        {!isMobile && (
          <motion.div
            className={`absolute w-full md:w-1/2 h-full bg-orange-500 sm:flex hidden items-center justify-center 
                ${
                  isLogin ? "sm:rounded-r-[50%]" : "sm:rounded-l-[50%]"
                } hidden md:flex`}
            initial={{ x: 0 }}
            animate={{ x: isLogin ? 0 : "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Illustration instead of an image */}
            <motion.div
              className={`w-3/4 h-3/4 sm:flex flex-col items-center justify-center  text-white text-2xl font-bold ${
                isLogin ? "sm:rounded-r-lg" : "sm:rounded-l-lg"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isLogin ? "Welcome Back!" : "Join Us!"}
                  <p className="text-sm mt-2">
                    {isLogin
                      ? "Your journey continues here."
                      : "Start your adventure with us."}
                  </p>
                </motion.div>
              </AnimatePresence>
              <img
                src={bg}
                alt="car illustration"
                className={`mt-4 rounded-lg ${!isLogin ? "scale-x-[-1]" : ""}`}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Form Section - Full Width on Mobile and Tablet */}
        <motion.div
          className="relative w-full md:w-1/2 flex items-center justify-center p-8 space-y-2"
          initial={{ x: 0 }}
          animate={{ x: isMobile ? 0 : isLogin ? "100%" : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Card className="w-full max-w-md shadow-lg rounded-lg p-6 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? "Login" : "Sign Up"}
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                {isLogin
                  ? "Enter your credentials to access your account."
                  : "Create an account to get started."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.form
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                  onSubmit={handleSubmit}
                >
                  {!isLogin && (
                    <>
                      <div className="w-full sm:w-80 max-w-md mx-auto">
                        <Label htmlFor="username">Username</Label>
                        <input
                          className="w-full p-2 border-2 rounded-md bg-background outline-none focus-within:border-blue-700 transition"
                          value={formValues.username}
                          id="username"
                          name="username"
                          type="text"
                          placeholder="Username"
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm">
                            {errors.username}
                          </p>
                        )}
                      </div>
                      <div className="w-full sm:w-80 max-w-md mx-auto">
                        <Label htmlFor="name">Name</Label>
                        <input
                          className="w-full p-2 border-2 rounded-md bg-background outline-none focus-within:border-blue-700 transition"
                          value={formValues.name}
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Full Name"
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="w-full sm:w-80 max-w-md mx-auto">
                    <Label htmlFor="email">Email</Label>
                    <input
                      className="w-full p-2 border-2 rounded-md bg-background outline-none focus-within:border-blue-700 transition"
                      value={formValues.email}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="w-full sm:w-80 max-w-md mx-auto">
                      <Label htmlFor="mobile">Mobile</Label>
                      <input
                        className="w-full p-2 border-2 rounded-md bg-background outline-none focus-within:border-blue-700 transition"
                        value={formValues.mobile}
                        id="mobile"
                        name="mobile"
                        type="text"
                        maxLength={10}
                        placeholder="10-digit number"
                        onChange={handleChange}
                        disabled={loading}
                      />
                      {errors.mobile && (
                        <p className="text-red-500 text-sm">{errors.mobile}</p>
                      )}
                    </div>
                  )}

                  <div className="w-full sm:w-80 max-w-md mx-auto">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        value={formValues.password}
                        onChange={handleChange}
                        placeholder="Password"
                        aria-invalid={calculateStrength.score < 4}
                        aria-describedby="password-strength"
                        className="w-full p-2 border-2 rounded-md bg-background outline-none focus-within:border-blue-700 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setIsVisible((prev) => !prev)}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 outline-none flex items-center justify-center w-9 text-muted-foreground/80 hover:text-foreground"
                      >
                        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className="flex gap-2 w-full justify-between mt-2">
                      <span
                        className={`${
                          calculateStrength.score >= 1
                            ? "bg-green-200"
                            : "bg-border"
                        }  p-1 rounded-full w-full`}
                      ></span>
                      <span
                        className={`${
                          calculateStrength.score >= 2
                            ? "bg-green-300"
                            : "bg-border"
                        }  p-1 rounded-full w-full`}
                      ></span>
                      <span
                        className={`${
                          calculateStrength.score >= 3
                            ? "bg-green-400"
                            : "bg-border"
                        }  p-1 rounded-full w-full`}
                      ></span>
                      <span
                        className={`${
                          calculateStrength.score >= 4
                            ? "bg-green-500"
                            : "bg-border"
                        }  p-1 rounded-full w-full`}
                      ></span>
                      <span
                        className={`${
                          calculateStrength.score >= 5
                            ? "bg-green-600"
                            : "bg-border"
                        }  p-1 rounded-full w-full`}
                      ></span>
                    </div>

                    <p
                      id="password-strength"
                      className="my-2 text-sm font-medium flex justify-between"
                    >
                      <span>Must contain:</span>
                      <span>
                        {
                          STRENGTH_CONFIG.texts[
                            Math.min(calculateStrength.score, 4)
                          ]
                        }
                      </span>
                    </p>

                    <ul
                      className="space-y-1.5"
                      aria-label="Password requirements"
                    >
                      {calculateStrength.requirements.map((req, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          {req.met ? (
                            <Check size={16} className="text-emerald-500" />
                          ) : (
                            <X size={16} className="text-muted-foreground/80" />
                          )}
                          <span
                            className={`text-xs ${
                              req.met
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {req.text}
                            <span className="sr-only">
                              {req.met
                                ? " - Requirement met"
                                : " - Requirement not met"}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Submit Button with Loader */}

                  {isLogin ? (
                    <Button
                      type="submit"
                      className="w-full py-3 mt-4 bg-[#ff8201] text-white rounded-lg hover:bg-[#e67700] transition"
                      disabled={loading}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full py-3 mt-4 bg-[#ff8201] text-white rounded-lg hover:bg-[#e67700] transition"
                      disabled={loading}
                      onClick={handleSignup}
                    >
                      Sign Up
                    </Button>
                  )}
                </motion.form>
              </AnimatePresence>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                onClick={toggleForm}
                className="w-full text-[#ff8201] font-bold"
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
