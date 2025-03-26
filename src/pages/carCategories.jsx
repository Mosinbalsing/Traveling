import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Wagnor from "assets/images/Cars/Wagnor.png";
import Swift from "assets/images/Cars/Swift.png";
import Crysta from "assets/images/Cars/crysta.png";
import Innova from "assets/images/Cars/Innova.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { authAPI, bookingAPI, taxiAPI } from "@/config/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Add this function before the carCategories array
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const carCategories = [
  {
    type: "Hatchback",
    image: Wagnor,
    seating: "4 + 1 Seater",
    ac: true,
    price: 2500,
    features: [
      "Comfortable seating",
      "Luggage: 2 Small Bags",
      "Fuel: Petrol/CNG",
      "Best for small families"
    ],
    mileage: "20-22 km/l",
    transmission: "Manual"
  },
  {
    type: "Sedan",
    image: Swift,
    seating: "4 + 1 Seater",
    ac: true,
    price: 2500,
    features: [
      "Premium comfort",
      "Luggage: 2 Large Bags",
      "Fuel: Petrol/Diesel",
      "Best for long trips"
    ],
    mileage: "18-20 km/l",
    transmission: "Manual/Automatic"
  },
  {
    type: "SUV",
    image: Innova,
    seating: "6 + 1 Seater",
    ac: true,
    price: 3500,
    features: [
      "Spacious interiors",
      "Luggage: 3 Large Bags",
      "Fuel: Diesel",
      "Perfect for group travel"
    ],
    mileage: "14-16 km/l",
    transmission: "Manual"
  },
  {
    type: "Prime SUV",
    image: Crysta,
    seating: "6 + 1 Seater",
    ac: true,
    price: 4500,
    features: [
      "Luxury comfort",
      "Luggage: 4 Large Bags",
      "Fuel: Diesel",
      "Best for premium travel"
    ],
    mileage: "12-14 km/l",
    transmission: "Automatic"
  }
];

export default function CarRental() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, availableTaxis = [] } = location.state || {};
  const [availableTaxisState, setAvailableTaxis] = useState(availableTaxis);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerificationRequired, setIsOtpVerificationRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedBookingDetails, setEditedBookingDetails] = useState(bookingDetails || {});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState("");
  const [isUserDetailsRequired, setIsUserDetailsRequired] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedEditTime, setSelectedEditTime] = useState("");
  const [isEditTimePopoverOpen, setIsEditTimePopoverOpen] = useState(false);
  const [userDetailsState, setUserDetailsState] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  const cities = [
    "Pune",
    "Shirdi",
    "Mahabaleshwar",
    "Lonavala",
    "Mumbai",
    "Nashik",
    "Kolhapur",
    "Ahmadnagar",
    "Sambhaji Nagar"
  ];

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">No booking details available</p>
      </div>
    );
  }

  const handleMobileSubmit = async () => {
    setIsLoading(true);
    try {
      if (!mobile) {
        throw new Error("Mobile number is required");
      }

      // Check API directly
      const userResponse = await bookingAPI.checkMobileExists(mobile);
      if (userResponse.success && userResponse.data) {
        const userData = {
          name: userResponse.data.name,
          email: userResponse.data.email,
          mobile: userResponse.data.mobile,
        };

        setName(userData.name);
        setEmail(userData.email);
        setMobile(userData.mobile);
        setUserDetailsState(userData);
        setIsUserDetailsRequired(false);
      } else {
        setIsUserDetailsRequired(true);
      }

      const otpResponse = await bookingAPI.sendOTP({
        phoneNumber: mobile,
        userName: userResponse.data?.name || "user"
      });

      if (otpResponse.success) {
        setIsOtpVerificationRequired(true);
        toast.success("OTP sent to your mobile number.");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsUserDetailsRequired(true);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(mobile, name, email, otp);
  const userDatas = {
    name:name,
    mobile:mobile
  }
  const handleUserDetailsSubmit = async () => {
    setIsLoading(true);
    try {
      if (!mobile || !name || !email) {
        throw new Error("All fields are required");
      }

      const userData = { mobile, name, email };
      setUserDetailsState(userData);

      const response = await authAPI.storeUserDetails(userData);
      if (response.success) {
        const otpResponse = await bookingAPI.sendOTP({
          phoneNumber: mobile,
          userName: name
        });
        
        if (otpResponse.success) {
          setIsOtpVerificationRequired(true);
          setIsUserDetailsRequired(false);
          toast.success("Details saved and OTP sent");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to save details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Log user details before OTP verification
      console.log("User Details before OTP verification:", {
        userDetailsState,
        name,
        email,
        mobile
      });

      const response = await bookingAPI.verifyOTP({ phoneNumber: mobile, otp });
      
      if (response.success) {
        // Log user details after OTP verification
        console.log("User Details after OTP verification:", {
          userDetailsState,
          name,
          email,
          mobile
        });

        toast.success("OTP verified successfully.");
        setIsMobileDialogOpen(false);

        const vehicleTypeMap = {
          'Hatchback': 'Hatchback',
          'Sedan': 'Sedan',
          'SUV': 'SUV',
          'Prime SUV': 'Prime_SUV'
        };

        const formattedVehicleType = vehicleTypeMap[selectedCar.type];
        
        const bookingData = {
          bookingDate: new Date().toISOString(),
          travelDate: editedBookingDetails.departureDate,
          departureTime: editedBookingDetails.departureTime,
          vehicleType: formattedVehicleType,
          numberOfPassengers: parseInt(editedBookingDetails.peopleCount),
          pickupLocation: editedBookingDetails.pickUpLocation,
          dropLocation: editedBookingDetails.dropOffLocation,
          price: selectedCar.price,
          userDetails: userDetailsState,
          status: "CONFIRMED",
          travelType: editedBookingDetails.travelType || "One Way"
        };

        // Log booking data before API call
        console.log("Booking Data with User Details:", bookingData);

        const bookingResponse = await bookingAPI.createBookingDetails(bookingData);

        if (bookingResponse.success) {
          // Create a proper search criteria object
          const searchCriteria = {
            pickupLocation: editedBookingDetails.pickUpLocation,
            dropLocation: editedBookingDetails.dropOffLocation,
            date: editedBookingDetails.departureDate,
            vehicleType: formattedVehicleType,
            userDetails: {
              name: name,
              mobile: mobile,
              email: email
            }
          };

          // Log the search criteria for debugging
          console.log("Search Criteria being sent:", searchCriteria);

          const searchResponse = await bookingAPI.searchBookings(searchCriteria);
          
          // Log the search response
          console.log("Search Response:", searchResponse);

          if (searchResponse.success && searchResponse.data?.length > 0) {
            const latestBooking = searchResponse.data[0];
            
            navigate("/booking-success", { 
              state: {
                bookingDetails: {
                  ...latestBooking,
                  userDetails: {
                    name: name,
                    mobile: mobile,
                    email: email
                  },
                  PickupLocation: latestBooking.pickupLocation || editedBookingDetails.pickUpLocation,
                  DropLocation: latestBooking.dropLocation || editedBookingDetails.dropOffLocation,
                  vehicleType: formattedVehicleType,
                  price: selectedCar.price,
                  departureTime: editedBookingDetails.departureTime,
                  bookingDate: new Date().toISOString(),
                  travelDate: editedBookingDetails.departureDate,
                  numberOfPassengers: parseInt(editedBookingDetails.peopleCount)
                }
              },
              replace: true
            });
            toast.success("Booking created successfully!");
          } else {
            throw new Error("Could not find the created booking");
          }
        } else {
          throw new Error(bookingResponse.message || "Failed to create booking");
        }
      } else {
        throw new Error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleOtpSubmit:", error);
      toast.error(error.message || "Failed to process booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = (car) => {
    setSelectedCar(car);
    setIsMobileDialogOpen(true);
  };

  const handleEditOpen = () => {
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { departureDate, departureTime, pickUpLocation, dropOffLocation, peopleCount, travelType } = editedBookingDetails;

      if (pickUpLocation === dropOffLocation) {
        setError("Pickup and Drop Location cannot be the same.");
        toast.error("Pickup and Drop Location cannot be the same.");
        return;
      }

      if (!departureDate || !departureTime || !pickUpLocation || !dropOffLocation || !peopleCount) {
        setError("Please fill in all required fields.");
        return;
      }

      const formData = {
        departureDate,
        departureTime,
        pickUpLocation,
        dropOffLocation,
        peopleCount: parseInt(peopleCount),
        travelType
      };

      const response = await taxiAPI.getAvailableTaxis(formData);

      if (response.success) {
        toast.success('Results updated successfully');
        setAvailableTaxis(response.data.availableVehicles);
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error(error.message || 'Failed to update results');
    } finally {
      setIsLoading(false);
      handleEditClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBookingDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ['00', '30']) {
        const time = `${String(hour).padStart(2, '0')}:${minute}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleEditTimeSelect = (time) => {
    setSelectedEditTime(time);
    setEditedBookingDetails(prev => ({ ...prev, departureTime: time }));
    setIsEditTimePopoverOpen(false);
  };

  const handleDirectBooking = async () => {
    try {
      // ... existing booking creation code ...

      const bookingResponse = await bookingAPI.createBookingDetails(bookingData);
      
      if (bookingResponse.success) {
        navigate("/booking-success", { 
          state: {
            bookingId: bookingResponse.data.bookingId
          },
          replace: true
        });
      } else {
        throw new Error("Failed to create booking");
      }

    } catch (error) {
      console.error("Error in handleDirectBooking:", error);
      toast.error(error.message || "Failed to create booking");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen sm:mt-0 mt-[100px]">
      <div className="w-full lg:w-80 bg-white p-4 lg:p-6 shadow-lg lg:fixed lg:h-screen lg:overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" className="w-[48%]">
          <Link to="/">Back to home</Link>
        </Button>
          <Button 
            variant="outline" 
            className="w-[48%]"
            onClick={handleEditOpen}
          >
            Edit Details
          </Button>
        </div>

        <div className="flex flex-row lg:flex-col justify-between lg:justify-start space-y-0 lg:space-y-6 flex-wrap">
          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Pickup from</h2>
            <div className="flex items-center gap-2 text-green-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{editedBookingDetails.pickUpLocation}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Drop to</h2>
            <div className="flex items-center gap-2 text-red-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{editedBookingDetails.dropOffLocation}</span>
            </div>
          </div>
   <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Departure Time</h2>
            <div className="flex items-center gap-2 text-red-600">
            <Clock className="h-4 w-4 lg:h-5 lg:w-5" />

              <span className="text-sm lg:text-base">{editedBookingDetails.departureTime}</span>
            </div>
          </div>
          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Passengers</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{editedBookingDetails.peopleCount}</span>
            </div>
          </div>

          <div className="space-y-2 w-full lg:w-auto">
            <h2 className="text-base lg:text-lg font-semibold">Date</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{editedBookingDetails.departureDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-6 overflow-auto lg:ml-80">
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h2 className="text-xl font-semibold">Available Cars</h2>
          <p className="text-base lg:text-lg">
            Showing {availableTaxisState.length} results
          </p>
        </div>

        <div className="grid gap-4 lg:gap-6">
          {availableTaxisState.map((taxi, index) => {
            const matchedCar = carCategories.find(car => 
              car.type.toLowerCase().replace(/[\s_-]/g, '') === 
              taxi.type.toLowerCase().replace(/[\s_-]/g, '')
            );

            if (!matchedCar) {
              console.log("No match found for taxi type:", taxi.type);
              return null;
            }

            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="relative h-48 w-full sm:w-48 shrink-0 overflow-hidden rounded-lg">
                      <img
                          src={matchedCar.image}
                          alt={matchedCar.type}
                          className="object-contain w-full h-full"
                      />
                    </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl lg:text-2xl font-bold">{matchedCar.type}</h3>
                      <p className="text-sm lg:text-base text-gray-600">
                            {matchedCar.seating} | {matchedCar.ac ? "AC" : "Non-AC"}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-gray-600">Features:</h4>
                          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                            {matchedCar.features.map((feature, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Starting from</div>
                        <div className="text-xl lg:text-2xl font-bold">₹{matchedCar.price?.toLocaleString()}</div>
                    <Button
                      className="bg-[#76B82A] hover:bg-[#5a8c20] text-sm lg:text-base"
                          onClick={() => handleBookNow(matchedCar)}
                    >
                      Book Now
                    </Button>
                      </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Enter Your Mobile Number</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isUserDetailsRequired) {
                handleUserDetailsSubmit();
              } else {
                isOtpVerificationRequired ? handleOtpSubmit(e) : handleMobileSubmit();
              }
            }}
            className="space-y-4"
          >
            {!isOtpVerificationRequired ? (
              <>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>

                {isUserDetailsRequired && (
                  <div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Enter OTP</Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP sent to your mobile"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsMobileDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : isOtpVerificationRequired ? "Verify OTP" : isUserDetailsRequired ? "Submit Details" : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={handleEditClose}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Booking Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input
                type="date"
                name="departureDate"
                value={editedBookingDetails.departureDate}
                onChange={handleInputChange}
                min={getCurrentDate()}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Departure Time</Label>
              <Popover open={isEditTimePopoverOpen} onOpenChange={setIsEditTimePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editedBookingDetails.departureTime && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {editedBookingDetails.departureTime || "Select time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 h-[300px] overflow-y-auto">
                  <div className="grid gap-1">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="ghost"
                        className={cn(
                          "justify-start font-normal",
                          editedBookingDetails.departureTime === time && "bg-orange-100"
                        )}
                        onClick={() => handleEditTimeSelect(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Pickup Location</Label>
              <Select 
                name="pickUpLocation"
                value={editedBookingDetails.pickUpLocation}
                onValueChange={(value) => handleInputChange({ target: { name: 'pickUpLocation', value }})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Drop-off Location</Label>
              <Select 
                name="dropOffLocation"
                value={editedBookingDetails.dropOffLocation}
                onValueChange={(value) => handleInputChange({ target: { name: 'dropOffLocation', value }})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select drop-off location" />
                </SelectTrigger>
                <SelectContent>
                  {cities
                    .filter(city => city !== editedBookingDetails.pickUpLocation)
                    .map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Passengers</Label>
              <Input
                type="number"
                name="peopleCount"
                value={editedBookingDetails.peopleCount}
                onChange={handleInputChange}
                placeholder="Enter number of passengers"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Travel Type</Label>
              <Select 
                name="travelType"
                value={editedBookingDetails.travelType}
                onValueChange={(value) => handleInputChange({ target: { name: 'travelType', value }})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select travel type" />
                </SelectTrigger>
                <SelectContent>
                  {["One Way"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleEditClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}