import BerandaPengguna from "./pages/Pengguna/Beranda";
import BerkasPengguna from "./pages/Pengguna/Berkas";
import LoginPengguna from "./pages/Pengguna/LoginPengguna";
import RegisterPengguna from "./pages/Pengguna/RegisterPengguna";
import Testimonial from "./pages/Admin/Testimonial";
import Pendaftaran from "./pages/Admin/Pendaftaran";
import Promosi from "./pages/Admin/Promosi";
import VoiceNote from "./pages/Admin/VoiceNote";
import GroupChat from "./pages/Admin/GroupChat";
import FAQ from "./pages/Admin/FAQ";
import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedRoutePengguna from "./components/ProtectedRoutePengguna";
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
import { AlertProvider } from "./contexts/AlertContext";
import AlertDemo from "./pages/AlertDemo";

export default function App() {
  return (
    <AlertProvider>
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
            path="/admin/testimonial"
            element={
              <ProtectedRoute>
                <Testimonial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pendaftaran"
            element={
              <ProtectedRoute>
                <Pendaftaran />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/promosi"
            element={
              <ProtectedRoute>
                <Promosi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/voicenote"
            element={
              <ProtectedRoute>
                <VoiceNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/groupchat"
            element={
              <ProtectedRoute>
                <GroupChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="text-slate-800">
                {window.location.pathname !== "/pendaftaran" &&
                  window.location.pathname !== "/loginpengguna" &&
                  window.location.pathname !== "/registerpengguna" &&
                  !window.location.pathname.startsWith("/pengguna") && (
                    <Navbar />
                  )}
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
                    <Route path="/alert-demo" element={<AlertDemo />} />
                    {/* Pengguna routes */}
                    <Route
                      path="/pengguna/beranda"
                      element={
                        <ProtectedRoutePengguna>
                          <BerandaPengguna />
                        </ProtectedRoutePengguna>
                      }
                    />
                    <Route
                      path="/pengguna/berkas"
                      element={
                        <ProtectedRoutePengguna>
                          <BerkasPengguna />
                        </ProtectedRoutePengguna>
                      }
                    />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </main>
                {window.location.pathname !== "/loginpengguna" &&
                  window.location.pathname !== "/registerpengguna" &&
                  !window.location.pathname.startsWith("/pengguna") && (
                    <Footer />
                  )}
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}
