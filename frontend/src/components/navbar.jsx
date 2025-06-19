import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlusCircle,
  User,
  Info,
  Phone,
  Home,
  Menu,
  X,
  Coins,
  ShoppingCart,
  ListOrdered
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setToken(data.profile.token);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <nav className="bg-white border-b shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1
              onClick={() => handleNavigation("/dashboard")}
              className="text-xl font-bold text-gray-800 tracking-tight cursor-pointer"
            >
              BookHive
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <NavItem icon={<Home className="h-5 w-5" />} label="Home" onClick={() => handleNavigation('/dashboard')} />
            <NavItem icon={<PlusCircle className="h-5 w-5" />} label="Add Book" onClick={() => handleNavigation('/add-book')} />
            <NavItem icon={<User className="h-5 w-5" />} label="Profile" onClick={() => handleNavigation('/profile')} />
            <NavItem icon={<ListOrdered className="h-5 w-5" />} label="My Orders" onClick={() => handleNavigation('/myorders')} />
            <NavItem icon={<ShoppingCart className="h-5 w-5" />} label="Cart" onClick={() => handleNavigation('/cart')} />
            
            <NavItem icon={<Coins className="h-5 w-5" />} label={token} />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            <NavItem icon={<Home className="h-5 w-5" />} label="Home" onClick={() => handleNavigation('/dashboard')} />
            <NavItem icon={<PlusCircle className="h-5 w-5" />} label="Add Book" onClick={() => handleNavigation('/add-book')} />
            <NavItem icon={<User className="h-5 w-5" />} label="Profile" onClick={() => handleNavigation('/profile')} />
            <NavItem icon={<ListOrdered className="h-5 w-5" />} label="My Orders" onClick={() => handleNavigation('/myorders')} />
            <NavItem icon={<ShoppingCart className="h-5 w-5" />} label="Cart" onClick={() => handleNavigation('/cart')} />
            <NavItem icon={<Info className="h-5 w-5" />} label="About" onClick={() => handleNavigation('/about')} />
            <NavItem icon={<Phone className="h-5 w-5" />} label="Contact" onClick={() => handleNavigation('/contact')} />
            <NavItem icon={<Coins className="h-5 w-5" />} label={token} />
          </div>
        )}
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition text-sm font-medium"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Navbar;
