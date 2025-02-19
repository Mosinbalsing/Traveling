import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import loder from "@/assets/loaders/preloader.gif";
import { BASE_URL } from '@/config/api';

export default function BookingConfirmation() {

  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { carDetails } = location.state || {};
  const [loadingConfirmation, setLoadingConfirmation] = useState(false);
  const [pickupTime, setPickupTime] = useState(carDetails?.data?.pickupTime || "09:00");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupPincode, setPickupPincode] = useState("");
  const [pickupCity, setPickupCity] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`${BASE_URL}/api/auth/getuserdata`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!carDetails || !userData) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white z-50"><img src={loder} alt="Loading..." /></div>;
  }

  const validateForm = () => {
    const errors = {};

    if (!userData?.user?.username) errors.username = "Username is required";
    if (!userData?.user?.mobile) errors.mobile = "Mobile number is required";
    if (!userData?.user?.email) errors.email = "Email is required";
    if (!pickupAddress) errors.pickupAddress = "Pickup address is required";
    if (!pickupPincode) errors.pickupPincode = "Pincode is required";
    if (!pickupCity) errors.pickupCity = "City is required";
    if (!carDetails?.data?.pickUpLocation) errors.pickUpLocation = "Pickup location is required";
    if (!carDetails?.data?.dropOffLocation) errors.dropOffLocation = "Drop location is required";
    if (!carDetails?.data?.travelType) errors.travelType = "Travel type is required";
    if (!carDetails?.data?.departureDate) errors.departureDate = "Travel date is required";
    if (!carDetails?.data?.peopleCount) errors.peopleCount = "Number of passengers is required";
    if (!pickupTime) errors.pickupTime = "Pickup time is required";

    return errors;
  };

  const handleConfirmBooking = async () => {
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoadingConfirmation(true);
      // First send OTP
      const sendOtpResponse = await axios.post('https://noble-liberation-production.up.railway.app/api/auth/send-otp', {
        phoneNumber: userData.user.mobile,
        userName: userData.user.username
      });

      if (sendOtpResponse.data.success) {
        toast.success("OTP sent successfully!");
        setIsOtpDialogOpen(true);
      } else {
        throw new Error(sendOtpResponse.data.message);
      }
    } catch (error) {
      console.error('OTP Error:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoadingConfirmation(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
      // First verify OTP
      const verifyResponse = await axios.post('https://noble-liberation-production.up.railway.app/api/auth/verify-otp', {
        phoneNumber: userData.user.mobile,
        otp: otp
      });

      if (!verifyResponse.data.success) {
        throw new Error(verifyResponse.data.message || 'OTP verification failed');
      }

      // If OTP is verified, create booking
      const bookingData = {
        userId: userData.user._id || userData.user.id,
        TaxiID: carDetails._id || 1,
        bookingDate: new Date().toISOString(),
        PickupLocation: carDetails.data.pickUpLocation,
        pickupAddress: pickupAddress,
        pickupCity: pickupCity,
        pickupPincode: pickupPincode,
        DropLocation: carDetails.data.dropOffLocation,
        travelDate: carDetails.data.departureDate,
        pickupTime: pickupTime,
        vehicleType: carDetails.carName,
        numberOfPassengers: carDetails.data.peopleCount,
        status: "confirmed",
        price: carDetails.price
      };

      const bookingResponse = await axios.post('https://noble-liberation-production.up.railway.app/api/auth/create', bookingData);

      if (bookingResponse.data.success) {
        toast.success("Booking confirmed!");
        const bookingDetails = {
          ...bookingData,
          _id: bookingResponse.data._id || 'BOOKING-' + new Date().getTime(),
          createdAt: bookingResponse.data.createdAt || new Date().toISOString()
        };

        setIsOtpDialogOpen(false);
        setTimeout(() => {
          navigate('/booking-success', {
            state: {
              bookingDetails: bookingDetails
            }
          });
        }, 1000);
      } else {
        throw new Error(bookingResponse.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTimeWithAMPM = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-[1100px] w-full">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2" data-aos="fade-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </Button>
            <h2 className="text-2xl font-bold" data-aos="fade-down">
              Confirm Your Booking
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Details Column */}
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6" data-aos="fade-right">
              <div className="space-y-4 lg:space-y-6">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img src={carDetails.carImage} alt={carDetails.carName} className="w-full h-full object-cover" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="100">
                    <h3 className="font-semibold text-sm lg:text-base">Car Name</h3>
                    <p className="text-sm lg:text-base">{carDetails.carName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="200">
                    <h3 className="font-semibold text-sm lg:text-base">Price</h3>
                    <p className="text-sm lg:text-base">₹{carDetails.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="300">
                    <h3 className="font-semibold text-sm lg:text-base">Pickup Location</h3>
                    <p className="text-sm mt-1">{carDetails.data.pickUpLocation}</p>
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="400">
                    <h3 className="font-semibold text-sm lg:text-base">Drop Location</h3>
                    <p className="text-sm mt-1">{carDetails.data.dropOffLocation}</p>
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="500">
                    <h3 className="font-semibold text-sm lg:text-base">Travel Type</h3>
                    <p className="text-sm mt-1">{carDetails.data.travelType}</p>
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="600">
                    <h3 className="font-semibold text-sm lg:text-base">Travel Date</h3>
                    <p className="text-sm mt-1">{carDetails.data.departureDate}</p>
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="700">
                    <h3 className="font-semibold text-sm lg:text-base">Number of People</h3>
                    <p className="text-sm mt-1">{carDetails.data.peopleCount} Passengers</p>
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="800">
                    <h3 className="font-semibold text-sm lg:text-base">Journey Type</h3>
                    <p className="text-sm mt-1">{carDetails.data.travelType}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="900">
                  <h3 className="font-semibold mb-2 text-sm lg:text-base">Car Features:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {carDetails.carFeatures.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Display travel details validation errors */}
                {validationErrors.pickUpLocation && <p className="text-sm text-red-500 mt-1">{validationErrors.pickUpLocation}</p>}
                {validationErrors.dropOffLocation && <p className="text-sm text-red-500 mt-1">{validationErrors.dropOffLocation}</p>}
                {validationErrors.travelType && <p className="text-sm text-red-500 mt-1">{validationErrors.travelType}</p>}
                {validationErrors.departureDate && <p className="text-sm text-red-500 mt-1">{validationErrors.departureDate}</p>}
                {validationErrors.peopleCount && <p className="text-sm text-red-500 mt-1">{validationErrors.peopleCount}</p>}
              </div>
            </div>

            {/* User Details Column */}
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6" data-aos="fade-left">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="100">
                    <h3 className="font-semibold text-sm lg:text-base">Name</h3>
                    <p className="text-sm lg:text-base">{userData.user.username}</p>
                    {validationErrors.username && <p className="text-sm text-red-500 mt-1">{validationErrors.username}</p>}
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="200">
                    <h3 className="font-semibold text-sm lg:text-base">Email</h3>
                    <p className="text-sm lg:text-base truncate">{userData.user.email}</p>
                    {validationErrors.email && <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>}
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="300">
                    <h3 className="font-semibold text-sm lg:text-base">Phone</h3>
                    <p className="text-sm lg:text-base">{userData.user.mobile}</p>
                    {validationErrors.mobile && <p className="text-sm text-red-500 mt-1">{validationErrors.mobile}</p>}
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="400">
                    <h3 className="font-semibold text-sm lg:text-base mb-2">Pickup Time</h3>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className={`border-0 focus:ring-0 bg-transparent p-0 text-sm lg:text-base ${
                          validationErrors.pickupTime ? "border-red-500" : ""
                        }`}
                      />
                      <span className="text-sm text-gray-600">
                        {formatTimeWithAMPM(pickupTime)}
                      </span>
                    </div>
                    {validationErrors.pickupTime && <p className="text-sm text-red-500 mt-1">{validationErrors.pickupTime}</p>}
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg col-span-2" data-aos="zoom-in" data-aos-delay="500">
                    <h3 className="font-semibold text-sm lg:text-base mb-2">Pickup Address</h3>
                    <Input
                      type="text"
                      placeholder="Enter pickup address"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className={validationErrors.pickupAddress ? "border-0 focus:ring-0" : "border-0 focus:ring-0"}
                    />
                    {validationErrors.pickupAddress && <p className="text-sm text-red-500 mt-1">{validationErrors.pickupAddress}</p>}
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="600">
                    <h3 className="font-semibold text-sm lg:text-base mb-2">City</h3>
                    <Input
                      type="text"
                      placeholder="Enter city"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      className={validationErrors.pickupCity ? "border-0 focus:ring-0" : "border-0 focus:ring-0"}
                    />
                    {validationErrors.pickupCity && <p className="text-sm text-red-500 mt-1 border-0 focus:ring-0">{validationErrors.pickupCity}</p>}
                  </div>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="700">
                    <h3 className="font-semibold text-sm lg:text-base mb-2">Pincode</h3>
                    <Input
                      type="text"
                      placeholder="Enter pincode"
                      value={pickupPincode}
                      onChange={(e) => setPickupPincode(e.target.value)}
                      maxLength={6}
                      className={validationErrors.pickupPincode ? "border-0 focus:ring-0" : "border-0 focus:ring-0"}
                    />
                    {validationErrors.pickupPincode && <p className="text-sm text-red-500 mt-1">{validationErrors.pickupPincode}</p>}
                  </div>
                </div>

                <Button onClick={handleConfirmBooking} disabled={loadingConfirmation} className="w-full mt-6" data-aos="fade-up" data-aos-delay="400">
                  {loadingConfirmation ? "Confirming..." : "Confirm Booking"}
                </Button>

                {Object.keys(validationErrors).length > 0 && (
                  <p className="text-sm text-red-500 text-center mt-2">
                    Please fill all required fields before confirming
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Enter OTP sent to your registered number {userData.user.mobile}
            </p>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-lg tracking-wider"
              maxLength={6}
            />
            <Button 
              className="w-full" 
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? 'Verifying...' : 'Verify & Confirm Booking'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
