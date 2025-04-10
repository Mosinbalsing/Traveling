import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UsersIcon, CalendarIcon } from "@heroicons/react/24/outline";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    upcomingBookings: 0,
    pastBookings: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [userTrends, setUserTrends] = useState([]);
  const [userHistogramFilter, setUserHistogramFilter] = useState("month"); // Default to month view
  const ITEMS_PER_PAGE = 5;
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "mobile",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mobile
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
  ];

  const table = useReactTable({
    data: recentUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const bookingColumns = [
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "travelDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "from",
      header: "From",
      cell: ({ row }) => <span className="hidden sm:table-cell">{row.original.from}</span>,
    },
    {
      accessorKey: "to",
      header: "To",
      cell: ({ row }) => <span className="hidden sm:table-cell">{row.original.to}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          row.original.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.original.status}
        </span>
      ),
    },
  ];

  const bookingsTable = useReactTable({
    data: upcomingBookings,
    columns: bookingColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
        const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
        const adminToken = localStorage.getItem("adminToken");

        console.log("Auth Check:", {
          isAuthenticated,
          isLoggedIn,
          hasToken: !!adminToken,
          token: adminToken
        });

        if (!isAuthenticated || !isLoggedIn) {
          console.log("Authentication failed - redirecting to login");
          localStorage.removeItem("isAdminAuthenticated");
          localStorage.removeItem("adminLoggedIn");
          localStorage.removeItem("adminToken");
          toast.error("Please login to access the dashboard");
          navigate("/admin/login", { replace: true });
          return;
        }

        // Fetch data in sequence to ensure correct counts
        await fetchDashboardStats();
        await fetchPastBookings(); // Fetch past bookings first
        await fetchRecentBookings(); // Then fetch recent bookings
        await getUsers();

      } catch (error) {
        console.error("Auth Error:", error);
        setError(error.message);
        toast.error(error.message || "Authentication failed");
        localStorage.removeItem("isAdminAuthenticated");
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (Array.isArray(recentUsers)) {
      // Group users by month
      const usersByMonth = recentUsers.reduce((acc, user) => {
        const month = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format for chart
      const trends = Object.entries(usersByMonth).map(([month, count]) => ({
        month,
        count
      }));

      setUserTrends(trends);
    }
  }, [recentUsers]);

  const fetchDashboardStats = async () => {
    try {
      // Initialize stats with zeros instead of hardcoded values
      setStats({
        totalUsers: 0,
        totalBookings: 0,
        upcomingBookings: 0,
        pastBookings: 0,
        cancelledBookings: 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard statistics");
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:3000/api/admin/bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Recent Bookings API Response:", data);

      const formattedBookings = data.data.map(booking => ({
        id: booking.booking_id,
        userName: booking.user_name || "User",
        travelDate: formatDate(booking.travel_date),
        from: booking.pickup_location,
        to: booking.drop_location,
        status: booking.status,
        vehicleType: booking.vehicle_type,
        numberOfPassengers: booking.number_of_passengers,
        bookingDate: formatDate(booking.booking_date)
      }));

      // Filter bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingBookings = formattedBookings.filter(booking => {
        const bookingDate = new Date(booking.travelDate.split('/').reverse().join('-'));
        return bookingDate >= today && booking.status !== "completed";
      });

      setUpcomingBookings(upcomingBookings);

      // Update stats for upcoming bookings
      setStats(prevStats => ({
        ...prevStats,
        upcomingBookings: upcomingBookings.length,
        totalBookings: upcomingBookings.length + prevStats.pastBookings
      }));

    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      toast.error("Failed to load recent bookings");
      setUpcomingBookings([]);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if formatting fails
    }
  };

  const fetchPastBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Fetching past bookings...");

      const response = await fetch("http://localhost:3000/api/admin/pastbookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Past Bookings API Response:", data);

      if (!data.success) {
        throw new Error("Failed to fetch past bookings");
      }

      // Ensure we're accessing the correct data structure
      const bookingsData = Array.isArray(data.data) ? data.data : [];
      console.log("Past Bookings Data:", bookingsData);

      const formattedBookings = bookingsData.map(booking => ({
        id: booking.booking_id,
        userName: booking.user_name || "User",
        travelDate: formatDate(booking.travel_date),
        from: booking.pickup_location,
        to: booking.drop_location,
        status: booking.status,
        vehicleType: booking.vehicle_type,
        numberOfPassengers: booking.number_of_passengers,
        bookingDate: formatDate(booking.booking_date)
      }));

      console.log("Formatted Past Bookings:", formattedBookings);
      setPastBookings(formattedBookings);

      // Update stats with the correct counts
      setStats(prevStats => {
        const pastCount = formattedBookings.length;
        const cancelledCount = formattedBookings.filter(b => b.status === 'cancelled').length;
        
        return {
          ...prevStats,
          pastBookings: pastCount,
          cancelledBookings: cancelledCount,
          totalBookings: pastCount + prevStats.upcomingBookings
        };
      });

    } catch (error) {
      console.error("Error fetching past bookings:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
      toast.error("Failed to load past bookings");
      setPastBookings([]);
    }
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:3000/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const users = data.users || data;
      
      const formattedUsers = users.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        createdAt: user.created_at || new Date().toISOString(),
      }));

      setRecentUsers(formattedUsers);

      // Update total users count
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: formattedUsers.length
      }));

      // Process users for histogram
      const usersByMonth = formattedUsers.reduce((acc, user) => {
        const date = new Date(user.createdAt);
        const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      }, {});

      // Sort by date and convert to array
      const sortedMonths = Object.keys(usersByMonth).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      const trends = sortedMonths.map(month => ({
        month,
        count: usersByMonth[month]
      }));

      setUserTrends(trends);

    } catch (error) {
      console.error("Error fetching users:", error);
      setRecentUsers([]);
    }
  };

  const getUserChartData = () => {
    if (!Array.isArray(recentUsers)) return { labels: [], datasets: [] };

    const today = new Date();
    let filteredUsers = [];
    let filteredBookings = [];
    let labels = [];
    let userData = {};
    let bookingData = {};

    // Combine all bookings
    const allBookings = [...upcomingBookings, ...pastBookings];

    switch (userHistogramFilter) {
      case "30days": {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Filter users
        filteredUsers = recentUsers.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate >= thirtyDaysAgo && userDate <= today;
        });

        // Filter bookings
        filteredBookings = allBookings.filter(booking => {
          const bookingDate = new Date(booking.bookingDate.split('/').reverse().join('-'));
          return bookingDate >= thirtyDaysAgo && bookingDate <= today;
        });

        // Create labels for all 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          labels.push(dateStr);
          userData[dateStr] = 0;
          bookingData[dateStr] = 0;
        }

        // Group users by date
        filteredUsers.forEach(user => {
          const date = new Date(user.createdAt);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          userData[dateStr] = (userData[dateStr] || 0) + 1;
        });

        // Group bookings by date
        filteredBookings.forEach(booking => {
          const date = new Date(booking.bookingDate.split('/').reverse().join('-'));
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          bookingData[dateStr] = (bookingData[dateStr] || 0) + 1;
        });
        break;
      }

      case "week": {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);

        // Filter users
        filteredUsers = recentUsers.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate >= weekAgo && userDate <= today;
        });

        // Filter bookings
        filteredBookings = allBookings.filter(booking => {
          const bookingDate = new Date(booking.bookingDate.split('/').reverse().join('-'));
          return bookingDate >= weekAgo && bookingDate <= today;
        });

        // Create labels for all days of the week
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
          labels.push(dateStr);
          userData[dateStr] = 0;
          bookingData[dateStr] = 0;
        }

        // Group users by day
        filteredUsers.forEach(user => {
          const date = new Date(user.createdAt);
          const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
          userData[dateStr] = (userData[dateStr] || 0) + 1;
        });

        // Group bookings by day
        filteredBookings.forEach(booking => {
          const date = new Date(booking.bookingDate.split('/').reverse().join('-'));
          const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
          bookingData[dateStr] = (bookingData[dateStr] || 0) + 1;
        });
        break;
      }

      case "month": {
        // Filter for current month
        filteredUsers = recentUsers.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate.getMonth() === today.getMonth() &&
                 userDate.getFullYear() === today.getFullYear();
        });

        filteredBookings = allBookings.filter(booking => {
          const bookingDate = new Date(booking.bookingDate.split('/').reverse().join('-'));
          return bookingDate.getMonth() === today.getMonth() &&
                 bookingDate.getFullYear() === today.getFullYear();
        });

        // Create labels for all days in current month
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          labels.push(i.toString());
          userData[i.toString()] = 0;
          bookingData[i.toString()] = 0;
        }

        // Group users by day of month
        filteredUsers.forEach(user => {
          const date = new Date(user.createdAt);
          const dateStr = date.getDate().toString();
          userData[dateStr] = (userData[dateStr] || 0) + 1;
        });

        // Group bookings by day of month
        filteredBookings.forEach(booking => {
          const date = new Date(booking.bookingDate.split('/').reverse().join('-'));
          const dateStr = date.getDate().toString();
          bookingData[dateStr] = (bookingData[dateStr] || 0) + 1;
        });
        break;
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: 'New Users',
          data: labels.map(label => userData[label] || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.4,
        },
        {
          label: 'Bookings',
          data: labels.map(label => bookingData[label] || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.4,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Count'
        }
      },
      x: {
        grid: {
          display: false
        },
        title: {
          display: true,
          text: userHistogramFilter === "month" ? 'Day of Month' : 
                userHistogramFilter === "week" ? 'Day of Week' : 'Date'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: `Users & Bookings Trend (${
          userHistogramFilter === "30days" ? "Last 30 Days" :
          userHistogramFilter === "week" ? "This Week" :
          "This Month"
        })`
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button onClick={() => navigate("/admin/login")} className="mt-4">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Users */}
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Bookings</h2>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Upcoming Bookings</h2>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{stats.upcomingBookings}</p>
              </div>
            </div>
          </div>

          {/* Past Bookings */}
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Past Bookings</h2>
                <p className="text-xl md:text-2xl font-semibold text-gray-800">{stats.pastBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status Pie Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Booking Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Booking Distribution</h2>
            <div className="h-[300px] flex items-center justify-center">
              <Pie
                data={{
                  labels: ['Upcoming', 'Past', 'Cancelled'],
                  datasets: [
                    {
                      data: [
                        stats.upcomingBookings,
                        stats.pastBookings,
                        stats.cancelledBookings || 0
                      ],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.6)', // green
                        'rgba(59, 130, 246, 0.6)', // blue
                        'rgba(239, 68, 68, 0.6)', // red
                      ],
                      borderColor: [
                        'rgba(34, 197, 94, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(239, 68, 68, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Users Histogram */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">User Registration Trend</h2>
              <Select value={userHistogramFilter} onValueChange={setUserHistogramFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[300px]">
              <Bar
                data={getUserChartData()}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Users with Search and Sort */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-x-auto">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Users</h2>
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search users..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/users">View All</Link>
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.slice(0, ITEMS_PER_PAGE).map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Upcoming Bookings with Search and Sort */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-x-auto">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search bookings..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/bookings">View All</Link>
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {bookingsTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {bookingsTable.getRowModel().rows?.length ? (
                      bookingsTable.getRowModel().rows.slice(0, ITEMS_PER_PAGE).map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={bookingColumns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Past Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 overflow-x-auto xl:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Past Bookings</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/bookings">View All</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="hidden sm:table-cell">From</TableHead>
                    <TableHead className="hidden sm:table-cell">To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Vehicle Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings
                    .slice(0, ITEMS_PER_PAGE)
                    .map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.userName}</TableCell>
                        <TableCell>{booking.travelDate}</TableCell>
                        <TableCell className="hidden sm:table-cell">{booking.from}</TableCell>
                        <TableCell className="hidden sm:table-cell">{booking.to}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{booking.vehicleType}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 