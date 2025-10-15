import React from "react";

export default function RegisterPengguna() {
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
              SELAMAT DATANG
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
                  placeholder="Masukkan Username Anda..."
                  className="w-full font-medium text-gray-700 bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center px-5 py-3 bg-gray-100 rounded-full">
                <span className="mr-3 text-gray-400 material-icons">email</span>
                <input
                  type="email"
                  placeholder="Masukkan Email Anda..."
                  className="w-full font-medium text-gray-700 bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center px-5 py-3 bg-gray-100 rounded-full">
                <span className="mr-3 text-gray-400 material-icons">lock</span>
                <input
                  type="password"
                  placeholder="Masukkan Kata Sandi Anda..."
                  className="w-full font-medium text-gray-700 bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center px-5 py-3 bg-gray-100 rounded-full">
                <span className="mr-3 text-gray-400 material-icons">lock</span>
                <input
                  type="password"
                  placeholder="Masukkan Kata Sandi Anda Lagi..."
                  className="w-full font-medium text-gray-700 bg-transparent outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 mt-2 font-semibold text-white bg-teal-700 rounded-full shadow-lg"
              >
                Buat Akun
              </button>
            </form>
            <div className="mt-6 text-center text-gray-700">
              Sudah punya akun?{" "}
              <a
                href="/loginpengguna"
                className="font-semibold text-teal-700 hover:underline"
              >
                Masuk Sekarang!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
