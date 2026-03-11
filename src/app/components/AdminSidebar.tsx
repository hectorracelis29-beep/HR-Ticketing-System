import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "../components/ui/utils";
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Settings,
  Network
} from "lucide-react";
import logo from "../../assets/logo.png";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/tickets", label: "Tickets", icon: Ticket },
    { path: "/admin/assignment-matrix", label: "Assignment Matrix", icon: Network },
    { path: "/admin/employees", label: "Employees", icon: Users },
  ];

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-screen sticky top-0", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-semibold text-lg">DMTS</span>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
