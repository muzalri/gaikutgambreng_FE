import BerandaPengguna from "./pages/Pengguna/Beranda";
import LoginPengguna from "./pages/Pengguna/LoginPengguna";
import RegisterPengguna from "./pages/Pengguna/RegisterPengguna";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/CompanyProfile/Home";
import About from "./pages/CompanyProfile/About";
import Teachers from "./pages/CompanyProfile/Teachers";
import Articles from "./pages/CompanyProfile/Articles";
import Register from "./pages/CompanyProfile/Register";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Santri from "./pages/Admin/Santri";
import Pendidik from "./pages/Admin/Pendidik";
import Artikel from "./pages/Admin/Artikel";
import PPDB from "./pages/Admin/PPDB";
import Profil from "./pages/Admin/Profil";

export default function App() {
  // ...existing code...
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/santri"
          element={
            <ProtectedRoute>
              <Santri />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pendidik"
          element={
            <ProtectedRoute>
              <Pendidik />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artikel"
          element={
            <ProtectedRoute>
              <Artikel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ppdb"
          element={
            <ProtectedRoute>
              <PPDB />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="text-slate-800">
              {window.location.pathname !== "/pendaftaran" &&
                window.location.pathname !== "/loginpengguna" &&
                window.location.pathname !== "/registerpengguna" && <Navbar />}
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profil/tentang-kami" element={<About />} />
                  <Route
                    path="/profil/tenaga-pendidik"
                    element={<Teachers />}
                  />
                  <Route path="/artikel" element={<Articles />} />
                  <Route path="/pendaftaran" element={<Register />} />
                  <Route path="/loginpengguna" element={<LoginPengguna />} />
                  <Route
                    path="/registerpengguna"
                    element={<RegisterPengguna />}
                  />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              {window.location.pathname !== "/loginpengguna" &&
                window.location.pathname !== "/registerpengguna" && <Footer />}
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
