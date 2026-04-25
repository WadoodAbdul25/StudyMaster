import { useState } from 'react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
        <nav className="bg-white border-gray-200 px-7 h-13 flex items-center justify-between">
        <p className="font-semibold text-gray-800">StudyMaster</p>
        </nav>

    </div>
  );
}