import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from '@/config/api';


const BookingDialog = ({ onClose }) => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(null);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Function to check if the mobile number exists
  const checkMobileNumber = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/check-number`, { mobile });

      if (response.data.exists) {
        setIsExistingUser(true);
        await sendOtp(response.data.user.username);
      } else {
        setIsExistingUser(false);
      }
    } catch (error) {
      console.error("Error checking mobile:", error);
      toast.error("Failed to check mobile number.");
    } finally {
      setLoading(false);
    }
  };

  // Function to send OTP
  const sendOtp = async (username) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
        phoneNumber: mobile,
        userName: username || name,
      });

      if (response.data.success) {
        toast.success("OTP sent successfully!");
        setIsOtpDialogOpen(true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Function to verify OTP and confirm booking
  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
      const verifyResponse = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        phoneNumber: mobile,
        otp: otp,
      });

      if (!verifyResponse.data.success) {
        throw new Error(verifyResponse.data.message || "OTP verification failed");
      }

      // Booking data
      const bookingData = {
        userId: verifyResponse.data.userId || "guest",
        mobile,
        name,
        email,
        status: "confirmed",
      };

      const bookingResponse = await axios.post(`${BASE_URL}/api/auth/create`, bookingData);

      if (bookingResponse.data.success) {
        toast.success("Booking confirmed!");
        setIsOtpDialogOpen(false);
        setTimeout(() => {
          onClose(); // Close the dialog
        }, 1000);
      } else {
        throw new Error(bookingResponse.data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="dialog">
      <h2>Book a Taxi</h2>

      {/* Mobile Number Input */}
      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={checkMobileNumber} disabled={loading}>
        {loading ? "Checking..." : "Next"}
      </button>

      {/* Show Name & Email Inputs for New Users */}
      {isExistingUser === false && (
        <>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => sendOtp(name)}>Send OTP</button>
        </>
      )}

      {/* OTP Input for Verification */}
      {isOtpDialogOpen && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp} disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Confirm Booking"}
          </button>
        </>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default BookingDialog;
