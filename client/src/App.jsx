import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import History from "./pages/History";
import TransactionHistory from "./pages/TransactionHistory";
import Navbar from "./components/Navbar";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Users from "./pages/Users";
import ForgotPassword
from "./pages/ForgotPassword";
import ResetPassword
from "./pages/ResetPassword";
import AdminRoute from "./components/adminRoute";

import ProtectedRoute from "./components/ProtectedRoute";

import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

function App() {

useEffect(() => {

  // Run only on Android/iOS apps, not in browser
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  const listener = CapacitorApp.addListener(
    "appStateChange",
    ({ isActive }) => {

      if (!isActive) {

        localStorage.removeItem("token");
localStorage.removeItem("role");
localStorage.removeItem("userId");
localStorage.removeItem("username");

      }

    }
  );

  return () => {
    listener.then((l) => l.remove());
  };

}, []);


const logoutTimer = useRef(null);

useEffect(() => {

  if (!Capacitor.isNativePlatform()) {
    return;
  }

  const setupListener = async () => {

    const listener =
      await CapacitorApp.addListener(
        "appStateChange",
        ({ isActive }) => {

          if (!isActive) {

            console.log(
              "App in background. Logout in 5 minutes..."
            );

            logoutTimer.current =
              setTimeout(() => {

                localStorage.clear();

                console.log(
                  "User logged out after 5 minutes."
                );

              }, 5 * 60 * 1000);

          } else {

            if (logoutTimer.current) {

              clearTimeout(
                logoutTimer.current
              );

              logoutTimer.current = null;

              console.log(
                "Logout cancelled."
              );

            }

          }

        }
      );

    return listener;

  };

  let listener;

  setupListener().then((l) => {
    listener = l;
  });

  return () => {

    if (logoutTimer.current) {
      clearTimeout(
        logoutTimer.current
      );
    }

    if (listener) {
      listener.remove();
    }

  };

}, []);

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;