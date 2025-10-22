import React, { useState } from "react";

export default function LoginPengguna() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-white">
      <div className="flex w-full h-screen">
        {/* Left Side - Image & Title (no rounded) */}
        <div
          className="flex flex-col items-center justify-center w-1/2 h-full bg-center bg-cover"
          style={{ backgroundImage: "url('/assets/FotoPesantren.png')" }}
        >
          <div className="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-40">
            <h1 className="mb-2 text-5xl font-bold text-center text-white drop-shadow-lg">
              Pesantren <span className="text-yellow-400">Al-Ihsan</span> Bekasi
            </h1>
          </div>
        </div>
        {/* Right Side - Form */}
        <div className="flex flex-col items-center justify-center w-1/2 h-full bg-white">
          <div className="w-full max-w-md px-8">
            <h2 className="mb-2 text-3xl font-bold text-center">
              Login Pengguna
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Silahkan Masukkan Data Akun Anda!
            </p>
            <form className="flex flex-col gap-4">
              <div className="flex items-center px-5 py-3 bg-gray-100 rounded-full">
                <span className="mr-3 text-gray-400 material-icons">
                  person
                </span>
                <input
                  type="text"
                  placeholder="Masukkan Username..."
                  className="w-full font-medium text-gray-700 bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center px-5 py-3 bg-gray-100 rounded-full">
                <span className="mr-3 text-gray-400 material-icons">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan Kata Sandi..."
                  className="w-full font-medium text-gray-700 bg-transparent outline-none"
                />
                <span
                  className="ml-3 text-gray-400 cursor-pointer select-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={0}
                  role="button"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-icons">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 mt-2 font-semibold text-white bg-teal-700 rounded-full shadow-lg"
              >
                Masuk
              </button>
              <div className="flex items-center my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-2 text-gray-400 text-sm">atau</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 mt-2 font-semibold text-white bg-gradient-to-r from-[#155e63] to-[#1ca7a7] rounded-full shadow-[0_4px_24px_0_rgba(21,94,99,0.15)] hover:from-[#134e53] hover:to-[#178a8a] transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="white"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="white"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="white"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="white"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <div className="w-px h-4 bg-white/30"></div>
                <span>Masuk dengan Google</span>
              </button>
            </form>
            <div className="mt-6 text-center text-gray-700">
              Belum punya akun?{" "}
              <a
                href="/registerpengguna"
                className="font-semibold text-teal-700 hover:underline"
              >
                Daftar Sekarang!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
