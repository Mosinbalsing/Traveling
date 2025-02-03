import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Calendar } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const carCategories = [
  {
    name: "Mini",
    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg",
    seating: "4 + 1 Seater",
    ac: true,
    price: 2500,
  },
  {
    name: "Prime Sedan",
    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/144681/virtus-exterior-right-front-three-quarter-6.jpeg",
    seating: "4 + 1 Seater",
    ac: true,
    price: 2500,
  },
  {
    name: "Prime SUV",
    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/130583/fronx-exterior-right-front-three-quarter-4.jpeg",
    seating: "6 + 1 Seater",
    ac: true,
    price: 3500,
  },
  {
    name: "Prime SUV+",
    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/142739/safari-exterior-right-front-three-quarter-2.jpeg",
    seating: "6 + 1 Seater",
    ac: true,
    price: 4500,
  },
]

export default function CarRental({ navigate }) {
  console.log("Navigate prop:", navigate)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const departureDate = queryParams.get("departureDate")
  const pickUpLocation = queryParams.get("pickUpLocation")
  const dropOffLocation = queryParams.get("dropOffLocation")
  const peopleCount = queryParams.get("peopleCount")
  const travelType = queryParams.get("travelType")

  console.log("Query parameters:", departureDate, pickUpLocation, dropOffLocation, peopleCount, travelType)

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      {/* Sidebar Header (Top on mobile/tablet, Left on desktop) */}
      <div className="w-full lg:w-80 bg-white p-4 lg:p-6 shadow-lg">
        <Button variant="outline" className="mb-4 w-full">
          <Link to="/">Back to home</Link>
        </Button>

        <div className="flex flex-row lg:flex-col justify-between lg:justify-start space-y-0 lg:space-y-6">
          <div className="space-y-2">
            <h2 className="text-base lg:text-lg font-semibold">Pickup from</h2>
            <div className="flex items-center gap-2 text-green-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{pickUpLocation}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-base lg:text-lg font-semibold">Drop to</h2>
            <div className="flex items-center gap-2 text-red-600">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{dropOffLocation}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-base lg:text-lg font-semibold">Passengers</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{peopleCount}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-base lg:text-lg font-semibold">Date</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-sm lg:text-base">{departureDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="flex justify-end mb-4 lg:mb-6">
          <h2 className="text-base lg:text-lg font-semibold">Showing 4 results</h2>
        </div>
        <div className="grid gap-4 lg:gap-6">
          {carCategories.map((car) => (
            <Card key={car.name} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="relative h-32 w-full sm:w-48 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={car.image || "/placeholder.svg"}
                        alt={car.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl lg:text-2xl font-bold">{car.name}</h3>
                      <p className="text-sm lg:text-base text-gray-600">
                        {car.seating} | {car.ac ? "AC" : "Non-AC"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end gap-4">
                    <div className="text-xl lg:text-2xl font-bold">₹{car.price.toLocaleString()}</div>
                    <Button className="bg-[#76B82A] hover:bg-[#5a8c20] text-sm lg:text-base">Book Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

