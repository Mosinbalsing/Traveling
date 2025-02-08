import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"; // Ensure SelectTrigger is imported
import { FaMapMarkerAlt } from "react-icons/fa";

export default function CarBookingForm() {
  const [bookingDetails, setBookingDetails] = useState({
    departureDate: "",
    pickUpLocation: "",
    dropOffLocation: "",
    peopleCount: "",
    travelType: "one way",
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
            let locationText = `${
              address.village || address.town || address.city
            }, ${address.county}, ${address.state}`;
            locationText = locationText
              .replace("undefined, ", "")
              .replace(", undefined", "");
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

  const handleBookNow = (e) => {
    e.preventDefault();

    const {
      departureDate,
      pickUpLocation,
      dropOffLocation,
      peopleCount,
      travelType,
    } = bookingDetails;
    let missingFields = [];
    if (!departureDate) missingFields.push("Departure Date");
    if (!pickUpLocation) missingFields.push("Pick Up Location");
    if (!dropOffLocation) missingFields.push("Drop Off Location");
    if (!peopleCount) missingFields.push("Number of People");

    if (missingFields.length > 0) {
      alert(`Please fill the following fields: ${missingFields.join(", ")}`);
      return;
    }

    window.location.href = `/book?departureDate=${departureDate}&pickUpLocation=${pickUpLocation}&dropOffLocation=${dropOffLocation}&peopleCount=${peopleCount}&travelType=${travelType}`;
  };

  const cities = [
    "PUNE",
    "SHIRDI",
    "MAHABLESHWAR",
    "Lonavala",
    "Mumbai",
    "nashik",
    "kolhapur",
    "ahmadnagar",
    "sambhaji nagar",
  ];
  const travelTypes = ["One Way", "Return"];

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#FAFAFA] relative sm:top-[-200px]">
      <Card className="w-full shadow-md">
        <CardContent className="p-6">
          <form
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            onSubmit={handleBookNow}
          >
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">
                DEPARTURE DATE
              </Label>
              <Input
                type="date"
                className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    departureDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2 relative">
              <Label className="text-sm font-semibold text-gray-600">
                PICK UP LOCATION
              </Label>
              <div className="flex items-center border border-gray-300 rounded px-2">
                <Input
                  type="text"
                  value={bookingDetails.pickUpLocation}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      pickUpLocation: e.target.value,
                    })
                  }
                  className="w-full border-none focus:ring-0"
                  placeholder="Enter pickup location"
                />
                <FaMapMarkerAlt
                  className="text-orange-400 cursor-pointer"
                  onClick={fetchLocation}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">
                DROP OFF LOCATION
              </Label>
              <Select
                onValueChange={(value) =>
                  setBookingDetails({
                    ...bookingDetails,
                    dropOffLocation: value,
                  })
                }
              >
                <SelectTrigger>
                  <div className="font-sans text-[15px] text-gray-500 ">{bookingDetails.dropOffLocation || "Select a city"}</div>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {cities
                    .filter((city) => city !== bookingDetails.pickUpLocation)
                    .map((city, index) => (
                      <SelectItem
                        key={index}
                        value={city}
                        className="city-item"
                      >
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600 ">
                TRAVEL TYPE
              </Label>
              <Select
                onValueChange={(value) =>
                  setBookingDetails({ ...bookingDetails, travelType: value })
                }
              >
                <SelectTrigger>
                  <div className="font-sans text-[15px] text-gray-500 ">{bookingDetails.travelType || "Select Travel Type"}</div>
                </SelectTrigger>
                <SelectContent>
                  {travelTypes.map((type, index) => (
                    <SelectItem key={index} value={type} className="city-item">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm font-semibold text-gray-600 ">
                HOW MANY PEOPLE (INCLUDING CHILDREN)?
              </Label>
              <Input
                type="number"
                min="1"
                // placeholder="Enter number"
                className="w-16 border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    peopleCount: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                className="relative px-[43px] py-[14px] flex items-center leading-[24px] uppercase text-white border-2 border-[#ff8201] text-[14px] font-extrabold rounded-full bg-[#ff8201] hover:bg-transparent hover:text-[#ff8201] w-[160px] h-[50px]"
              >
                BOOK NOW
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
