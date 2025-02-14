import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function BookingConfirmation({ userData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { carDetails } = location.state || {};
  const [loadingConfirmation, setLoadingConfirmation] = useState(false);
  const [userInfo, setUserInfo] = useState({
    city: userData.user.city || '',
    address: userData.user.address || '',
    state: userData.user.state || '',
    zip: userData.user.zip || ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  if (!carDetails) {
    return <p>No car details available</p>;
  }

  console.log("userData", userData.user);
  console.log("carDetails", carDetails);

  const handleConfirmBooking = async () => {
    setLoadingConfirmation(true);
    try {
      console.log('Booking Details:', {
        carName: carDetails.carName,
        pickupLocation: carDetails.pickupLocation,
        dropLocation: carDetails.dropLocation,
        travelType: carDetails.travelType,
        travelDate: carDetails.travelDate,
        price: carDetails.price
      });

      const response = await axios.post('http://localhost:3000/api/auth/confirm-booking', {
        carDetails,
        pickupLocation: carDetails.pickupLocation,
        dropLocation: carDetails.dropLocation,
        travelType: carDetails.travelType,
        travelDate: carDetails.travelDate
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
      setLoadingConfirmation(false);
    }
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUserInfo = async () => {
    setUpdating(true);
    try {
      const response = await axios.put('http://localhost:3000/api/auth/update-user-info', {
        userId: userData.user._id,
        ...userInfo
      });

      if (response.data.success) {
        toast.success('User information updated successfully!');
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update user information');
    } finally {
      setUpdating(false);
    }
  };

  const {user}=userData;
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1100px] w-full">
        <h2 className="text-2xl font-bold text-center mb-8" data-aos="fade-down">Confirm Your Booking</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Car Details Column */}
          <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-right">
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={carDetails.carImage} 
                  alt={carDetails.carName} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="100">
                  <h3 className="font-semibold">Car Name</h3>
                  <p>{carDetails.carName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="200">
                  <h3 className="font-semibold">Price</h3>
                  <p>₹{carDetails.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="300">
                  <h3 className="font-semibold">Pickup Location</h3>
                  <p className="text-sm mt-1">{carDetails.data.pickUpLocation}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="400">
                  <h3 className="font-semibold">Drop Location</h3>
                  <p className="text-sm mt-1">{carDetails.data.dropOffLocation}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="500">
                  <h3 className="font-semibold">Travel Type</h3>
                  <p className="mt-1">{carDetails.data.travelType}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="600">
                  <h3 className="font-semibold">Travel Date</h3>
                  <p className="mt-1">{carDetails.data.departureDate}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="700">
                  <h3 className="font-semibold">Number of People</h3>
                  <p className="mt-1">{carDetails.data.peopleCount} Passengers</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="800">
                  <h3 className="font-semibold">Journey Type</h3>
                  <p className="mt-1">{carDetails.data.travelType}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="900">
                <h3 className="font-semibold mb-2">Car Features:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {carDetails.carFeatures.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* User Details Column */}
          <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="100">
                  <h3 className="font-semibold">Name</h3>
                  <p>{user.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="200">
                  <h3 className="font-semibold">Email</h3>
                  <p className="truncate">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="300">
                  <h3 className="font-semibold">Phone</h3>
                  <p>{user.mobile}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="400">
                  <h3 className="font-semibold">City</h3>
                  <Input
                    name="city"
                    value={userInfo.city}
                    onChange={handleUserInfoChange}
                    className="mt-1 border-0 focus:ring-0 bg-transparent placeholder:text-gray-400"
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="500">
                <h3 className="font-semibold">Address</h3>
                <Input
                  name="address"
                  value={userInfo.address}
                  onChange={handleUserInfoChange}
                  className="mt-1 border-0 focus:ring-0 bg-transparent placeholder:text-gray-400"
                  placeholder="Enter Pickup address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="600">
                  <h3 className="font-semibold">State</h3>
                  <Input
                    name="state"
                    value={userInfo.state}
                    onChange={handleUserInfoChange}
                    className="mt-1 border-0 focus:ring-0 bg-transparent placeholder:text-gray-400"
                    placeholder="Enter state"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="700">
                  <h3 className="font-semibold">ZIP</h3>
                  <Input
                    name="zip"
                    value={userInfo.zip}
                    onChange={handleUserInfoChange}
                    className="mt-1 border-0 focus:ring-0 bg-transparent placeholder:text-gray-400"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>

             
              </div>

              <Button 
                onClick={handleConfirmBooking} 
                disabled={loadingConfirmation}
                className="w-full mt-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {loadingConfirmation ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    
    
    
  );
} 