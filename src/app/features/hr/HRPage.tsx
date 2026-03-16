import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTickets } from "../../contexts/TicketContext";
import logo from "../../../assets/logo.png";
import { 
  Ticket, 
  FolderOpen,
  Clock,
  LogOut, 
  LayoutDashboard, 
  Users, 
  Bell,
  Search,
  ChevronRight,
  Menu,
  ArrowLeft,
  Send,
  MoreVertical,
  Paperclip,
  Filter,
  CheckCircle
} from "lucide-react";

// UI Components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "secondary";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const variants = {
    primary: "bg-[#B0BF00] text-white hover:bg-[#99A600]",
    ghost: "text-gray-600 hover:bg-gray-100",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  return (
    <button className={`rounded-lg font-medium transition-colors flex items-center gap-2 ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between relative overflow-hidden group">
    <div className="relative z-10">
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-gray-50 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default function HRPage() {
  const { user, logout } = useAuth();
  const { tickets } = useTickets();
  
  if (!user) return <div>Loading...</div>;

  // Filter officer tickets
  const officerTickets = (tickets ?? []).filter((t: any) => t.assignedOfficerUid === user?.uid);
  
  const pendingCount = officerTickets.filter((t: any) => t.status === "open").length;
  const inProgressCount = officerTickets.filter((t: any) => t.status === "in-progress").length;
  const resolvedCount = officerTickets.filter((t: any) => t.status === "resolved").length;

  const [activeTab, setActiveTab] = useState<"dashboard" | "tickets">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const selectedTicket = officerTickets.find((t: any) => t.id === selectedTicketId);

  const menuItems = [
    { id: "dashboard" as const, label: "Overview", icon: LayoutDashboard },
    { id: "tickets" as const, label: "Tickets", icon: Ticket },
  ];

  const displayTickets = filterCategory === "all" 
    ? officerTickets 
    : officerTickets.filter((t: any) => t.category === filterCategory);

  const assignedCategories = user.assignedCategories || [];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      <aside className={`
        ${isSidebarOpen ? "w-64" : "w-20"}
        bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-50
      `}>
        <div className="p-6 flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl" />
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">DMTS</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedTicketId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? "bg-[#B0BF00]/10 text-[#B0BF00]" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={async () => {
              await logout();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold capitalize">
              {selectedTicket ? "Manage Ticket" : activeTab === "dashboard" ? "Dashboard" : "Tickets"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-full" />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user.name}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Officer</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B0BF00] to-[#D4E200] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {selectedTicket ? (
            <div className="max-w-6xl mx-auto">
              <button 
                onClick={() => setSelectedTicketId(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-[#B0BF00] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold">{selectedTicket.title}</h1>
                  <p className="text-gray-500 mt-1">{selectedTicket.description}</p>
                  <p>Ticket ID: {selectedTicket.id} | Status: {selectedTicket.status}</p>
                </div>
                <Button className="w-full mb-4" variant="outline">
                  Update Status
                </Button>
                <Button className="w-full" onClick={() => setSelectedTicketId(null)}>
                  Close Ticket
                </Button>
              </div>
            </div>
          ) : activeTab === "dashboard" ? (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#B0BF00] rounded-3xl p-8 text-white shadow-xl">
                <div>
<h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Team'}!</h1>
                  <p className="mt-2 text-white/80">
                    You have {pendingCount} pending tickets.
                  </p>
                </div>
                <Button onClick={() => setActiveTab("tickets")} variant="outline" className="bg-white text-[#B0BF00]">
                  View Tickets
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard title="Pending" value={pendingCount.toString()} icon={Ticket} color="text-blue-500" />
                <KPICard title="In Progress" value={inProgressCount.toString()} icon={FolderOpen} color="text-orange-500" />
                <KPICard title="Resolved" value={resolvedCount.toString()} icon={CheckCircle} color="text-green-500" />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold">My Assigned Tickets</h1>
                  <p className="text-gray-500 mt-1">Manage your tickets ({officerTickets.length})</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {displayTickets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No assigned tickets yet
                        </td>
                      </tr>
                    ) : (
                      (displayTickets ?? []).map((ticket: any) => (
                        <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTicketId(ticket.id)}>
                          <td className="px-6 py-4 font-mono text-sm font-bold">{ticket.ticketNumber || ticket.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{ticket.title}</div>
                            <div className="text-xs text-gray-500">{ticket.description.substring(0, 50)}...</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

