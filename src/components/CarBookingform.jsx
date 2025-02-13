import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { taxiAPI } from '@/config/api';

import { MdOutlineMyLocation } from "react-icons/md";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CarBookingForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const [bookingDetails, setBookingDetails] = useState({
    departureDate: "",
    pickUpLocation: "",
    dropOffLocation: "",
    peopleCount: "",
    travelType: "One Way",
  });

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const address = data.address;
            let locationText = `${address.village || address.town || address.city}, ${address.county}, ${address.state}`;
            locationText = locationText.replace("undefined, ", "").replace(", undefined", "");

            setBookingDetails((prev) => ({
              ...prev,
              pickUpLocation: locationText,
            }));
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      const { departureDate, pickUpLocation, dropOffLocation, peopleCount } = bookingDetails;
      if (!departureDate || !pickUpLocation || !dropOffLocation || !peopleCount) {
        throw new Error('Please fill in all required fields');
      }

      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/log');
        return;
      }

      // Make direct API call
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/available-taxis',
        data: {
          pickUpLocation,
          dropOffLocation,
          departureDate,
          peopleCount: parseInt(peopleCount),
          travelType: bookingDetails.travelType
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data.data);
      
      if (response.data) {
        toast.success('Successfully fetched available taxis');
        navigate('/book', {
          state: {
            bookingDetails,
            availableTaxis: response.data.data.availableVehicles 
          }
        });
      }

    } catch (error) {
      console.error('Submit Error:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

   const cities = [
    "Pune",
    "Shirdi",
    "Mahableshwar",
    "Lonavala",
    "Mumbai",
    "Nashik",
    "Kolhapur",
    "ahmadnagar",
    "sambhaji nagar",
  ];
  const travelTypes = ["One Way"];

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#FAFAFA] relative sm:top-[-200px]">
      <Card className="w-full shadow-md">
        <CardContent className="p-6">
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">DEPARTURE DATE</Label>
              <Input
                type="date"
                className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
                min={getCurrentDate()}
                value={bookingDetails.departureDate}
                onChange={(e) => setBookingDetails({ ...bookingDetails, departureDate: e.target.value })}
              />
            </div>

            <div className="space-y-2 relative">
              <Label className="text-sm font-semibold text-gray-600">PICK UP LOCATION</Label>
              <div className="flex items-center border border-gray-300 rounded px-2">
                <Input
                  type="text"
                  value={bookingDetails.pickUpLocation}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, pickUpLocation: e.target.value })}
                  className="w-full border-none focus:ring-0"
                  placeholder="Enter pickup location"
                />
                <MdOutlineMyLocation className="text-orange-400 cursor-pointer" onClick={fetchLocation} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">DROP OFF LOCATION</Label>
              <Select onValueChange={(value) => setBookingDetails({ ...bookingDetails, dropOffLocation: value })}>
                <SelectTrigger>
                  <div>{bookingDetails.dropOffLocation || "Select a city"}</div>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {cities
                    .filter((city) => city !== bookingDetails.pickUpLocation)
                    .map((city, index) => (
                      <SelectItem key={index} value={city} className="capitalize city-item">
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">TRAVEL TYPE</Label>
              <Select onValueChange={(value) => setBookingDetails({ ...bookingDetails, travelType: value })}>
                <SelectTrigger>
                  <div>{bookingDetails.travelType || "Select Travel Type"}</div>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {travelTypes.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm font-semibold text-gray-600">HOW MANY PEOPLE (INCLUDING CHILDREN)?</Label>
              <Input
                type="number"
                min="1"
                placeholder="Enter number of people"
                className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
                onChange={(e) => setBookingDetails({ ...bookingDetails, peopleCount: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                disabled={loading}
                className="relative px-[43px] py-[14px] flex items-center leading-[24px] uppercase text-white border-2 border-[#ff8201] text-[14px] font-extrabold rounded-full bg-[#ff8201] hover:bg-transparent hover:text-[#ff8201] w-[160px] h-[50px]"
              >
                {loading ? 'Loading...' : 'BOOK NOW'}
              </Button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
