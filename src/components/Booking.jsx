import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CarBookingForm = () => {
  const [date, setDate] = useState(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">WE PROMISE, YOU WILL HAVE THE BEST EXPERIENCE</h1>
          <div className="space-y-4 text-muted-foreground">
            <p>
              In omni memoria patriae religionis sunt diri undead historiarum. Golums, zombies et fascinati. Maleficia!
            </p>
            <p>
              Ut fames cerebro enim carnis, viscera et organa viventium. Sicut spargit virus ad impetum, qui supersumus.
            </p>
            <Button variant="link" className="text-primary p-0">
              READ MORE
            </Button>
          </div>
          <div className="relative h-48 mt-[-60] ">
            <img
              src="assets/images/bg/car-layer.png"
              alt="Classic car illustration"
              className="absolute bottom-0 left-0 w-full h-auto object-contain "
            />
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>VEHICLE TYPE</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="SUV" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>DEPARTURE DATE</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="[&_.rdp-day_selected]:bg-white [&_.rdp-day_selected]:text-black"
                    />
                  </PopoverContent >
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>PICK UP LOCATION</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="location1">Location 1</SelectItem>
                  <SelectItem value="location2">Location 2</SelectItem>
                  <SelectItem value="location3">Location 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>DROP OFF LOCATION</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="location1">Location 1</SelectItem>
                  <SelectItem value="location2">Location 2</SelectItem>
                  <SelectItem value="location3">Location 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>HOW MANY PEOPLE (INCLUDING CHILDREN)?</Label>
              <Input type="number" min="1" placeholder="Enter number of people" />
            </div>

            <div className="space-y-2">
              <RadioGroup defaultValue="return" className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="return" id="return" />
                  <Label htmlFor="return">RETURN</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-way" id="one-way" />
                  <Label htmlFor="one-way">ONE WAY</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">BOOK NOW</Button>
        </div>
      </div>
    </div>
  );
};

export default CarBookingForm;
