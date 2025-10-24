import React from "react";
import { useAlertContext } from "../contexts/AlertContext";

const AlertDemo = () => {
  const { showSuccess, showWarning, showError } = useAlertContext();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Modals Alert</h1>

        {/* Row 1 - Text Only Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Success (Text Only)
            </h2>
            <button
              onClick={() =>
                showSuccess("Berhasil Menambahkan Data Berkas Pendaftaran!")
              }
              className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              Success Alert
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Warning (Text Only)
            </h2>
            <button
              onClick={() =>
                showWarning("Lengkapi Data Berkas Pendaftaran Anda!")
              }
              className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              Warning Alert
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Error (Text Only)
            </h2>
            <button
              onClick={() =>
                showError("Gagal Menambahkan Data Berkas Pendaftaran")
              }
              className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              Error Alert
            </button>
          </div>
        </div>

        {/* Row 2 - Alerts with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Success (With Icon)
            </h2>
            <button
              onClick={() =>
                showSuccess(
                  "Berhasil Menambahkan Data Berkas Pendaftaran",
                  true
                )
              }
              className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              Success with Icon
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Warning (With Icon)
            </h2>
            <button
              onClick={() =>
                showWarning("Lengkapi Data Berkas Pendaftaran Anda!", true)
              }
              className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              Warning with Icon
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Error (With Icon)
            </h2>
            <button
              onClick={() =>
                showError("Gagal Menambahkan Data Berkas Pendaftaran", true)
              }
              className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              Error with Icon
            </button>
          </div>
        </div>

        {/* Login Examples */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Login Examples
          </h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => showSuccess("Berhasil Login!", true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Login Success
            </button>
            <button
              onClick={() =>
                showError("Gagal Login! Username atau password salah.", true)
              }
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Login Failed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDemo;
