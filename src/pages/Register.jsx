import React from "react";

export default function Register() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <h1 className="text-base">Beranda › Pendaftaran</h1>
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Formulir Pendaftaran
          </h2>
          <form className="mt-6 grid gap-4">
            <input
              placeholder="Nama Lengkap"
              className="px-4 py-3 border border-slate-300 rounded-md"
            />
            <input
              placeholder="Email"
              type="email"
              className="px-4 py-3 border border-slate-300 rounded-md"
            />
            <input
              placeholder="No. HP"
              className="px-4 py-3 border border-slate-300 rounded-md"
            />
            <textarea
              placeholder="Catatan"
              rows="4"
              className="px-4 py-3 border border-slate-300 rounded-md"
            />
            <button
              type="button"
              className="px-5 py-3 rounded-md bg-amber-500 text-white w-fit"
            >
              Kirim
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
