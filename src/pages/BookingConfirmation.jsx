import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import axios from "axios";
import { CarContext } from '../context/CarContext';

export default function BookingConfirmation({ userData }) {
  const { carDetails } = useContext(CarContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!bookingDetails) {
    return <p>No booking details available</p>;
  }
  console.log("userData", userData.user);
  console.log("bookingDetails", bookingDetails);
  

  const handleGetOtp = async () => {
    // Simulate OTP generation
    toast.success("OTP sent to your registered mobile number");
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/confirm-booking', {
        ...bookingDetails,
        otp
      });

      if (response.data.success) {
        toast.success("Booking confirmed!");
        navigate('/booking-success');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Booking Error:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Confirm Your Booking</h2>
      <div className="mt-4">
        <p><strong>Name:</strong> {userData?.user?.name}</p>
        <p><strong>Email:</strong> {userData?.user?.email}</p>
        <p><strong>Mobile Number:</strong> {userData?.user?.mobile}</p>
        <p><strong>Pickup Location:</strong> {bookingDetails.pickUpLocation}</p>
        <p><strong>Drop Location:</strong> {bookingDetails.dropOffLocation}</p>
        <p><strong>Date:</strong> {bookingDetails.departureDate}</p>
        <p><strong>Travel Type:</strong> {bookingDetails.travelType}</p>
        <p><strong>Number of People:</strong> {bookingDetails.peopleCount}</p>
        <p><strong>Car:</strong> {carDetails.carName}</p>
        <p><strong>Price:</strong> ₹{bookingDetails.price}</p>
        <div className="mt-4">
          <img src={carDetails.carImage} alt={carDetails.carName} className="w-full h-auto" />
          <h3 className="text-lg font-bold mt-2">Car Features:</h3>
          <ul className="list-disc pl-5">
            {carDetails.carFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={handleGetOtp}>Get OTP</Button>
      </div>
      <div className="mt-4">
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Button onClick={handleConfirmBooking} disabled={loading}>
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
} 