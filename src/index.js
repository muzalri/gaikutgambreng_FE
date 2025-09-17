import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="p-8 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Halo, React + Tailwind!</h1>
        <p className="text-gray-700">Ini adalah tampilan page sederhana.</p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
