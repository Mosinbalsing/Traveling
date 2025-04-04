import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { authAPI, bookingAPI } from "@/config/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Modify useEffect to check for valid login session
  useEffect(() => {
    // Clear any stored data on component mount
    localStorage.removeItem("adminPhone");
    setShowOtpInput(false);
    setPhoneNumber("");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }

      console.log("Sending login request with:", { email, password });

      const response = await authAPI.adminLogin({ 
        email: email.trim(),
        password: password.trim() 
      });

      console.log("Admin login response:", response);

      if (response && response.success) {
        const token = response.token || response.data?.token || response.data?.accessToken;
        
        if (token) {
          localStorage.setItem("adminToken", token);
          
          // Store admin email
          const adminEmail = response.data?.email || response.email;
          if (!adminEmail) {
            throw new Error("Admin email not found in response");
          }
          localStorage.setItem("adminEmail", adminEmail);
          
          console.log("Admin email stored:", adminEmail);
        } else {
          console.error("No token found in response:", response);
          throw new Error("No authentication token received");
        }

        // Get phone number from admin data
        const adminPhone = response.data?.mobile || response.data?.phoneNumber;
        if (!adminPhone) {
          console.error("No phone number found in response:", response);
          throw new Error("Admin phone number not found");
        }

        // Store phone number in state only (not in localStorage)
        setPhoneNumber(adminPhone);

        // Send OTP using existing function
        const otpResponse = await bookingAPI.sendOTP({
          phoneNumber: adminPhone,
          userName: response.data?.name || "Admin"
        });

        console.log("OTP Send Response:", otpResponse);

        if (otpResponse.success) {
          toast.success("OTP sent to your mobile number");
          setShowOtpInput(true);
        } else {
          throw new Error("Failed to send OTP");
        }
      } else {
        console.error("Login failed response:", response);
        throw new Error(response?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error Details:", error);
      console.error("Full error object:", error);
      toast.error(error?.message || "Login failed. Please check your credentials.");
      // Clear any stored data on error
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdminAuthenticated");
      localStorage.removeItem("adminLoggedIn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!otp) {
        toast.error("Please enter OTP");
        return;
      }

      if (!phoneNumber) {
        throw new Error("Please login first to get OTP");
      }

      const verificationData = {
        phoneNumber: phoneNumber,
        otp: otp.trim()
      };
      console.log("Sending verification data:", verificationData);

      // Use regular OTP verification endpoint
      const response = await bookingAPI.verifyOTP(verificationData);
      console.log("OTP verification response:", response);

      if (response && response.success) {
        // Verify token exists before proceeding
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        console.log("Token verified before navigation:", token);

        // First set all authentication data
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("adminLoggedIn", "true");
        
        // Clear form data
        setOtp("");
        setPhoneNumber("");
        setShowOtpInput(false);
        
        // Show success message
        toast.success("Login successful!");

        // Navigate to dashboard using navigate instead of window.location
        navigate("/admin/dashboard", { replace: true });
        return;
      } else {
        throw new Error(response?.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(error?.message || "OTP verification failed");
      setOtp("");
      // Clear auth data on error
      localStorage.removeItem("isAdminAuthenticated");
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminToken");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to handle going back to login
  const handleBackToLogin = () => {
    setShowOtpInput(false);
    setOtp("");
    setPhoneNumber("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        
        {!showOtpInput ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2">Logging in...</span>
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 mb-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2">Verifying...</span>
                </span>
              ) : (
                "Verify OTP"
              )}
            </Button>

            {/* Add back button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleBackToLogin}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
} 