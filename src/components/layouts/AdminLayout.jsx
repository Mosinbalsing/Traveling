import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: HomeIcon, label: "Overview", path: "/admin/dashboard" },
  { icon: UsersIcon, label: "Users", path: "/admin/users" },
  { icon: CalendarIcon, label: "Bookings", path: "/admin/bookings" },
  { icon: UserCircleIcon, label: "Admin", path: "/admin/profile" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    navigate("/", { replace: true });
    toast.success("Logged out successfully");
  };

  const Sidebar = () => (
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
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
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
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-lg z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
} 