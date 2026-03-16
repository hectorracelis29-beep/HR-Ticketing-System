import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";
import HRPage from "./pages/HRPage";
import HREmployees from "./pages/HREmployees";
import AdminDashboard from "./pages/AdminDashboard";
import { AdminTickets, AdminAssignmentMatrix, AdminEmployees, AdminCreateAccount } from "./features/admin";
import RegisterPage from "./pages/RegisterPage";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import React from "react";
import { ErrorPage } from "./components/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    errorElement: React.createElement(ErrorPage),
    children: [
      { index: true, Component: LoginPage },
      { path: "register", Component: RegisterPage }
    ]
  },

  {
    path: "/employee",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: EmployeeDashboard },
      { path: "create-ticket", Component: CreateTicket },
    ],
  },
  {
    path: "/hr",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: HRPage },
      { path: "employees", Component: HREmployees },
    ],
  },
  {
    path: "/admin",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "tickets", Component: AdminTickets },
      { path: "assignment-matrix", Component: AdminAssignmentMatrix },
      { path: "employees", Component: AdminEmployees },
      { path: "create-account", Component: AdminCreateAccount },
    ],
  },
  {
    path: "/ticket/:id",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: TicketDetail },
    ],
  },
]);

