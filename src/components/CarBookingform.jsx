import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function CarBookingform() {
  return (
    <div className="w-full max-w-7xl mx-auto  bg-[#FAFAFA] relative sm:top-[-200px]">
      <Card className="w-full shadow-md">
        <CardContent className="p-6">
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">VEHICLE TYPE</Label>
              <Select>
                <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-orange-400">
                  <SelectValue placeholder="SUV" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Departure Date */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">DEPARTURE DATE</Label>
              <Input type="date" className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400" />
            </div>

            {/* Pick Up Location */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">PICK UP LOCATION</Label>
              <Select>
                <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-orange-400">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="airport">Airport</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Drop Off Location */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-600">DROP OFF LOCATION</Label>
              <Select>
                <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-orange-400">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="airport">Airport</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of People */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm font-semibold text-gray-600">
                HOW MANY PEOPLES (INCLUDING CHILDREN)?
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="Enter number of people"
                className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Return/One Way Radio */}
            <div className="space-y-2 flex items-end">
              <RadioGroup defaultValue="return" className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="return" id="return" />
                  <Label htmlFor="return" className="text-sm font-semibold text-gray-600">
                    RETURN
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-way" id="one-way" />
                  <Label htmlFor="one-way" className="text-sm font-semibold text-gray-600">
                    ONE WAY
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Book Now Button */}
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 rounded-lg shadow-md"
              >
                BOOK NOW
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
