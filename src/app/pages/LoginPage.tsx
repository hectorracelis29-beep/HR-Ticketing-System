import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import logo from "../../assets/logo.png";
import "../../styles/login.css";

// --- Mock Data ---
const mockUsers = [
  { id: "HR-001", name: "HR Admin", email: "hr@company.com", role: "hr" },
  { id: "SYS-001", name: "System Admin", email: "admin@company.com", role: "admin" }
];


export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - determine role from email
    let role = "employee";
    if (email.toLowerCase().includes("hr") || email.includes("@company.com")) {
      role = "hr";
    } else if (email.toLowerCase().includes("admin")) {
      role = "admin";
    }

    // Mock user based on role
    let mockUser;
    if (role === "employee") {
      mockUser = {
        id: "EMP-1234",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        role: "employee" as const,
        department: "Engineering",
      };
    } else {
      mockUser = mockUsers.find(u => u.role === role);
    }

    setUser(mockUser);

    // Route based on role
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "hr") {
      navigate("/hr");
    } else {
      navigate("/employee");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#f8f9fa] overflow-hidden font-sans">

      {/* Login Card */}
      <div className="w-full max-w-sm sm:max-w-md shadow-xl border border-gray-100 login-gradient relative z-10 rounded-2xl p-8 sm:p-10 mx-4">
        
        <div className="space-y-4 text-center mb-8">
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="HR Ticketing System Logo" 
              className="w-16 h-16 rounded-2xl shadow-md object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black leading-tight">
            HUMAN RESOURCE<br/>TICKETING
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label htmlFor="email" className="text-sm font-medium text-gray-800">
              Employee ID/ Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your Employee ID or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-3 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#b0bf00]/50 transition-shadow"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="password" className="text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-3 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#b0bf00]/50 transition-shadow"
            />
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: 'rgb(176, 191, 0)' }}
            className="w-full h-11 rounded-md text-white font-medium text-base shadow-md hover:opacity-90 active:scale-[0.98] transition-all mt-2"
          >
            Sign In
          </button>

        </form>

      </div>
    </div>
  );
}
