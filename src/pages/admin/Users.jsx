import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_URL, userAPI } from "@/config/api";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserBookings, setSelectedUserBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  console.log("selectedUser",selectedUser);
  useEffect(() => {
    Promise.all([fetchUsers(), fetchBookings()]);
  }, []);

  useEffect(() => {
    console.log("editedUser state changed:", editedUser);
  }, [editedUser]);

  useEffect(() => {
    if (selectedUser) {
      console.log("Selected User Updated:", selectedUser);
      console.log("Selected User Bookings:", selectedUser.bookings);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!showUserDetails) {
      setUserBookings([]); // Clear user bookings when dialog closes
    }
  }, [showUserDetails]);

  useEffect(() => {
    console.log("Current bookings state:", bookings);
    console.log("Current user bookings state:", userBookings);
  }, [bookings, userBookings]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${BASE_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API Response Data:", data);

      const formattedUsers = data.data.map((user) => ({
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.mobile,
        total_bookings: parseInt(user.total_bookings) || 0,
        active_bookings: parseInt(user.active_bookings) || 0,
        past_bookings: parseInt(user.past_bookings) || 0,
        all_bookings: user.all_bookings.map(booking => ({
          id: booking.booking_id,
          userId: booking.user_id,
          travelDate: new Date(booking.travel_date).toLocaleDateString(),
          vehicleType: booking.vehicle_type,
          passengers: booking.number_of_passengers,
          from: booking.pickup_location,
          to: booking.drop_location,
          status: booking.status,
          bookingDate: new Date(booking.booking_date).toLocaleDateString(),
          bookingType: booking.booking_type
        }))
      }));

      console.log("Formatted Users:", formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.message || "Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${BASE_URL}/api/admin/bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw Bookings Data:", data);

      // Transform the data to match your exact API response format
      const formattedBookings = data.map((booking) => ({
        id: booking.booking_id,
        userId: booking.user_id, // Keep this as user_id to match your API
        travelDate: new Date(booking.travel_date).toLocaleDateString(),
        vehicleType: booking.vehicle_type,
        passengers: booking.number_of_passengers,
        from: booking.pickup_location,
        to: booking.drop_location,
        status: booking.status,
        bookingDate: new Date(booking.booking_date).toLocaleDateString(),
        bookingType: booking.booking_type
      }));

      console.log("Formatted Bookings:", formattedBookings);
      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
  };

  const handleViewUser = (user) => {
    console.log("Viewing user with ID:", user.id);
    console.log("User's bookings:", user.all_bookings);
    
    // Use the bookings directly from the user object
    setUserBookings(user.all_bookings);
    setSelectedUser({
      ...user,
      bookings: user.all_bookings
    });
    
    setShowUserDetails(true);
  };

  const handleEditUser = (user) => {
    console.log("Edit button clicked for user:", user);

    if (!user) {
      toast.error("No user data provided");
      return;
    }

    // Create a clean copy of user data
    const userToEdit = {
      id: user._id || user.id, // Try both _id and id
      name: user.name || "",
      email: user.email || "",
      phone: user.mobile || user.phone || "", // Try both mobile and phone
      totalBookings: user.totalBookings || 0,
      activeBookings: user.activeBookings || 0,
    };

    console.log("Prepared user data for editing:", userToEdit);
    setEditedUser(userToEdit);
    setShowEditDialog(true);
  };

  const validateUserData = (userData) => {
    const errors = [];

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!userData.email || !userData.email.includes("@")) {
      errors.push("Please enter a valid email address");
    }

    if (!userData.phone || userData.phone.length < 10) {
      errors.push("Please enter a valid phone number");
    }

    return errors;
  };

  const handleSaveEdit = async () => {
    try {
      if (!editedUser) {
        toast.error("No user data to save");
        return;
      }

      const userId = editedUser.id || editedUser._id;
      if (!userId) {
        toast.error("User ID is missing");
        return;
      }

      setIsEditing(true);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Log the request details
      console.log("Sending update request:", {
        url: `${BASE_URL}/api/admin/users/update/${userId}`,
        data: {
          name: editedUser.name,
          email: editedUser.email,
          mobile: editedUser.phone,
        },
      });

      const response = await fetch(
        `${BASE_URL}/api/admin/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editedUser.name,
            email: editedUser.email,
            mobile: editedUser.phone,
          }),
        }
      );

      // Log the response status
      console.log("Update response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update failed:", errorData);
        throw new Error(errorData.message || "Failed to update user");
      }

      const updatedData = await response.json();
      console.log("Update successful:", updatedData);

      // Update the users list with the new data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                name: editedUser.name,
                email: editedUser.email,
                phone: editedUser.phone,
              }
            : user
        )
      );

      toast.success("User updated successfully");
      setShowEditDialog(false);
      setEditedUser(null);

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      // Get admin email from localStorage
      const adminEmail = localStorage.getItem("adminEmail");
      if (!adminEmail) {
        toast.error("Admin session expired. Please login again.");
        navigate("/admin/login");
        return;
      }

      // Get delete reason from user
      const reason = window.prompt("Please enter reason for deletion:");
      if (!reason) {
        toast.error("Reason is required for deletion");
        return;
      }

      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/admin/login");
        return;
      }

      // Make the delete API call
      const response = await fetch(`${BASE_URL}/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: reason,
          adminEmail: adminEmail
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }

      // Update the UI
      setUsers(users.filter((u) => u.id !== user.id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.message?.includes('authentication') || error.message?.includes('token')) {
        toast.error("Session expired. Please login again.");
        navigate("/admin/login");
      } else {
        toast.error(error.message || "Failed to delete user");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Bookings</TableHead>
               
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.total_bookings}</TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewUser(user)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          console.log("Full user data:", user); // Debug log
                          if (user) {
                            handleEditUser(user);
                          } else {
                            toast.error("Cannot edit: Invalid user data");
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bookings Table */}

        {/* User Details Dialog */}
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="max-w-4xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* User Information */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">User ID</h3>
                      <p className="text-gray-900">{selectedUser.id}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Name</h3>
                      <p className="text-gray-900">{selectedUser.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Email</h3>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Phone</h3>
                      <p className="text-gray-900">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Total Bookings</h3>
                      <p className="text-gray-900">{selectedUser.total_bookings || 0}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Status</h3>
                      <p className="text-green-600 font-medium">Active</p>
                    </div>
                  </div>
                </div>

                {/* User's Bookings */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">User's Bookings</h3>
                  {console.log("Current user bookings:", userBookings)}
                  {userBookings.length > 0 ? (
                    <div className="overflow-x-auto bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Travel Date</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Passengers</TableHead>
                            <TableHead>Vehicle Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.id}</TableCell>
                              <TableCell>{booking.travelDate}</TableCell>
                              <TableCell>{booking.from}</TableCell>
                              <TableCell>{booking.to}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-sm ${
                                    booking.status === "confirmed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </TableCell>
                              <TableCell>{booking.passengers} passengers</TableCell>
                              <TableCell>{booking.vehicleType}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No bookings found for this user</p>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <div className="flex justify-end mt-6">
                  <Button variant="outline" onClick={() => setShowUserDetails(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog
          open={showEditDialog}
          onOpenChange={(open) => {
            if (!open) {
              setEditedUser(null);
            }
            setShowEditDialog(open);
          }}
        >
          <DialogContent className="sm:max-w-[500px] p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <DialogHeader className="mb-6 bg-white">
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                Edit User Details
              </DialogTitle>
            </DialogHeader>
            {editedUser ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
                className="space-y-6"
              >
                {/* Form fields */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedUser.name || ""}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email || ""}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedUser.phone || ""}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditDialog(false);
                      setEditedUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isEditing}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isEditing ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No user data available</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
