import { Navigate } from 'react-router-dom';

const ProtectedRoutePengguna = ({ children }) => {
  const santriData = localStorage.getItem('santriData');
  
  if (!santriData) {
    // Jika belum login, redirect ke halaman login
    return <Navigate to="/loginpengguna" replace />;
  }

  // Jika sudah login, tampilkan halaman
  return children;
};

export default ProtectedRoutePengguna;
