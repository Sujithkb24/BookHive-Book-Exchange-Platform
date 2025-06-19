import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <header className="backdrop-blur-lg z-50 bg-white/10 border border-white/20 rounded-xl shadow-md mx-4 mt-4 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <img
            src="/favicon.png"
            alt="Logo"
            className="w-8 h-8 rounded-full shadow"
          />
          <span className="text-white text-xl font-semibold tracking-wide">
            BookHive
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </header>
  );
}
