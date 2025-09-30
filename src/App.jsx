import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Teachers from "./pages/Teachers";
import Articles from "./pages/Articles";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="*"
          element={
            <div className="text-slate-800">
              {window.location.pathname !== "/pendaftaran" && <Navbar />}
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
