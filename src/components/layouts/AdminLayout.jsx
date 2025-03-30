import { useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon 
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const sidebarItems = [
  { icon: HomeIcon, label: "Overview", path: "/admin/dashboard" },
  { icon: UsersIcon, label: "Users", path: "/admin/users" },
  { icon: CalendarIcon, label: "Bookings", path: "/admin/bookings" },
  { icon: UserCircleIcon, label: "Admin", path: "/admin/profile" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    navigate("/", { replace: true });
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 