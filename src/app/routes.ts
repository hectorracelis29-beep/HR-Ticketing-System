import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth";
import { EmployeeDashboard, CreateTicket, TicketDetail } from "./features/employee";
import { HRPage, HREmployees } from "./features/hr";
import { AdminDashboard, AdminTickets, AdminAssignmentMatrix, AdminEmployees } from "./features/admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/employee",
    Component: EmployeeDashboard,
  },
  {
    path: "/employee/create-ticket",
    Component: CreateTicket,
  },
  {
    path: "/hr",
    Component: HRPage,
  },
  {
    path: "/hr/employees",
    Component: HREmployees,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/tickets",
    Component: AdminTickets,
  },
  {
    path: "/admin/assignment-matrix",
    Component: AdminAssignmentMatrix,
  },
  {
    path: "/admin/employees",
    Component: AdminEmployees,
  },
  {
    path: "/ticket/:id",
    Component: TicketDetail,
  },
]);
