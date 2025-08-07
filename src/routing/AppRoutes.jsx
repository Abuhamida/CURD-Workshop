import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

// Layout and Pages
const MainLayout = lazy(() => import("../layout/MainLayout"));
const Home = lazy(() => import("../pages/home/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Login = lazy(() => import("../pages/Login/Login"));
const Error = lazy(() => import("../pages/Error/Error"));
const Signup = lazy(() => import("../pages/Signup/Signup"));

const LoadingSpinner = () => <p>Loading...</p>;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <MainLayout />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingSpinner />}>
        <Error />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <ProtectedRoute type="auth">
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <ProtectedRoute type="auth">
            <Suspense fallback={<LoadingSpinner />}>
              <Signup />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export const AppRoutes = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true} // Right-to-left for Arabic
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  );
};
