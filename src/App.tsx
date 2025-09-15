import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoginForm from "@/pages/auth/LoginForm";
import NotFound from "@/pages/auth/NotFound";
import HomePage from "@/pages/customer/HomePage";
import Profile from "@/pages/customer/Profile";
import CustomerLayout from "@/pages/customer/CustomerLayout";
import ManageLayout from "@/pages/manage/ManageLayout";
import AdminDashboard from "./pages/manage/admin/AdminDashboard";
import AdminProduct from "./pages/manage/admin/AdminProducts";
import AdminOrders from "./pages/manage/admin/AdminOrders";
import AdminCarts from "./pages/manage/admin/AdminCarts";
import AdminPayments from "./pages/manage/admin/AdminPayments";
import AdminChatting from "./pages/manage/admin/AdminChatting";
import AdminUsers from "./pages/manage/admin/AdminUsers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <CustomerLayout />,
        children: [
          { index: true, element: <HomePage /> },
          {
            path: "login",
            element: <LoginForm />,
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute allowedRoles={["Customer"]}>
                <Profile />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManageLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "products",
            element: <AdminProduct />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
          {
            path: "carts",
            element: <AdminCarts />,
          },
          {
            path: "payments",
            element: <AdminPayments />,
          },
          {
            path: "chatting",
            element: <AdminChatting />,
          },
          {
            path: "users",
            element: <AdminUsers />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
