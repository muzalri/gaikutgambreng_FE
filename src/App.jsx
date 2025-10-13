import BerandaPengguna from "./pages/Pengguna/Beranda";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPengguna from "./pages/Pengguna/LoginPengguna";
import RegisterPengguna from "./pages/Pengguna/RegisterPengguna";
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

export default function App() {
  // ...existing code...
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/santri" element={<Santri />} />
        <Route path="/admin/pendidik" element={<Pendidik />} />
        <Route path="/admin/artikel" element={<Artikel />} />
        <Route path="/admin/ppdb" element={<PPDB />} />
        <Route path="/loginpengguna" element={<LoginPengguna />} />
        <Route path="/registerpengguna" element={<RegisterPengguna />} />
        <Route path="/pengguna/beranda" element={<BerandaPengguna />} />
        <Route
          path="*"
          element={
            <div className="text-slate-800">
              {window.location.pathname !== "/pendaftaran" &&
                window.location.pathname !== "/loginpengguna" && <Navbar />}
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
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
