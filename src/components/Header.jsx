import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">م</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-gray-900">
              متجري
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            <Link
              to="/"
              className={`font-medium transition-colors whitespace-nowrap ${
                isActive("/")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              الرئيسية
            </Link>

            <Link
              to="/browse"
              className={`font-medium transition-colors whitespace-nowrap ${
                isActive("/browse")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              تصفح
            </Link>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
            >
              عن المنصة
            </a>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FiShoppingCart size={24} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/login")
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
            >
              دخول
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/register")
                  ? "bg-green-600 text-white"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              تسجيل
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg font-medium ${
                isActive("/") ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              to="/browse"
              className="block px-4 py-2 rounded-lg font-medium text-gray-700"
            >
              تصفح
            </Link>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg font-medium text-gray-700"
            >
              عن المنصة
            </a>
            <Link
              to="/cart"
              className="block px-4 py-2 rounded-lg font-medium text-gray-700"
            >
              السلة ({totalItems})
            </Link>
            <div className="space-y-2">
              <Link
                to="/login"
                className="block px-4 py-2 rounded-lg font-medium text-blue-600 border border-blue-600 text-center"
              >
                دخول
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 rounded-lg font-medium bg-green-600 text-white text-center"
              >
                تسجيل
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
