import React from "react";

export default function Footer() {
  const socials = [
    {
      name: "Instagram",
      href: "https://instagram.com/your_account",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM17.8 6.2a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com/your_page",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M13 22v-9h3l1-4h-4V7.5c0-1.16.32-1.95 2-1.95H17V2.14C16.65 2.1 15.56 2 14.31 2 11.64 2 10 3.66 10 6.7V9H7v4h3v9z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.2 4.2 0 0 0 1.84-2.31 8.4 8.4 0 0 1-2.66 1.02 4.19 4.19 0 0 0-7.13 3.82A11.9 11.9 0 0 1 3.15 4.9a4.18 4.18 0 0 0 1.3 5.59c-.64-.02-1.25-.2-1.78-.49v.05a4.19 4.19 0 0 0 3.36 4.11c-.3.08-.61.12-.93.12-.23 0-.45-.02-.66-.06a4.2 4.2 0 0 0 3.91 2.9A8.4 8.4 0 0 1 2 19.55a11.86 11.86 0 0 0 6.43 1.88c7.71 0 11.93-6.39 11.93-11.93 0-.18 0-.36-.01-.54A8.52 8.52 0 0 0 22.46 6z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M6.94 21.5H3.56V8.89h3.38V21.5zM5.25 7.3A1.95 1.95 0 1 1 5.26 3.4a1.95 1.95 0 0 1-.01 3.9zM21.49 21.5h-3.37v-6.27c0-1.49-.03-3.4-2.07-3.4-2.07 0-2.39 1.62-2.39 3.29v6.38H10.3V8.89h3.24v1.72h.05c.45-.86 1.55-1.77 3.19-1.77 3.41 0 4.04 2.24 4.04 5.15v7.51z" />
        </svg>
      ),
    },
    {
      name: "Instagram2",
      href: "https://instagram.com/your_account",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Row: logo | divider | icons */}
          <div className="flex items-center gap-6">
            <img
              src="/assets/logo2.png"
              alt="Logo"
              className="h-6 w-auto opacity-90"
            />
            <span className="h-6 w-px bg-slate-600" />
            <div className="flex items-center gap-4 text-slate-300">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-700 hover:border-slate-500 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <p className="max-w-3xl text-[11px] leading-5 text-slate-400">
            Pesantren Al Ihsan Bekasi adalah lembaga pendidikan berbasis Islam
            yang hadir untuk menyiapkan generasi santri yang berilmu, berakhlak
            mulia, dan siap menjadi pemimpin masa depan. Pesantren ini
            memberikan pendidikan agama yang komprehensif dan pengembangan
            karakter melalui kegiatan belajar-mengajar, pengajian, dan
            pembiasaan akhlakul karimah secara seimbang.
          </p>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Pesantren Al Ihsan Bekasi |
            Dipersembahkan Oleh Gaikut Gambreng
          </p>
        </div>
      </div>
    </footer>
  );
}
