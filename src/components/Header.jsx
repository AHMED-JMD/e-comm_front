import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const isAdminRoute = location.pathname.startsWith("/admin");

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label, variant = "blue") => (
    <Link
      to={path}
      className={`relative px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
        isActive(path)
          ? variant === "green"
            ? "bg-green-600 text-white shadow-glow-green"
            : "bg-blue-600 text-white shadow-glow"
          : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 glass shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-glow group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <span className="text-white font-display font-black text-xl">
                ل
              </span>
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-600 to-pink-500 opacity-40 blur-md -z-10" />
            </div>
            <span className="hidden sm:inline text-xl font-display font-extrabold text-gradient">
              لُوما
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1 items-center bg-white/60 border border-black/[0.04] rounded-full p-1">
            {navLink("/", "الرئيسية")}
            {navLink("/browse", "تصفح")}
            {isAdmin && navLink("/admin/stores", "بوابة الإدارة", "green")}
            <a
              href="#"
              className="px-4 py-2 rounded-full font-bold text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all whitespace-nowrap"
            >
              عن المنصة
            </a>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-gray-700 hover:text-white hover:bg-blue-600 transition-all"
            >
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-pink-500 to-purple-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-glow-pink">
                  {totalItems}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                    isActive("/profile")
                      ? "bg-blue-600 text-white shadow-glow"
                      : "text-blue-700 border-2 border-blue-600/30 hover:border-blue-600"
                  }`}
                >
                  الملف الشخصي
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-full font-bold text-sm text-red-600 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 transition-all"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                    isActive("/login")
                      ? "bg-blue-600 text-white shadow-glow"
                      : "text-blue-700 border-2 border-blue-600/30 hover:border-blue-600"
                  }`}
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !px-5 !py-2 text-sm"
                >
                  تسجيل
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full bg-blue-50 text-blue-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 animate-fade-up">
            <Link
              to="/"
              className={`block px-4 py-2.5 rounded-2xl font-bold ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 bg-gray-50"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              to="/browse"
              className="block px-4 py-2.5 rounded-2xl font-bold text-gray-700 bg-gray-50"
            >
              تصفح
            </Link>
            {isAdmin && (
              <Link
                to="/admin/stores"
                className={`block px-4 py-2.5 rounded-2xl font-bold ${
                  isAdminRoute
                    ? "bg-green-600 text-white"
                    : "text-gray-700 bg-gray-50"
                }`}
              >
                بوابة الإدارة
              </Link>
            )}
            <a
              href="#"
              className="block px-4 py-2.5 rounded-2xl font-bold text-gray-700 bg-gray-50"
            >
              عن المنصة
            </a>
            <Link
              to="/cart"
              className="block px-4 py-2.5 rounded-2xl font-bold text-gray-700 bg-gray-50"
            >
              السلة ({totalItems})
            </Link>
            {isLoggedIn ? (
              <div className="space-y-2 pt-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2.5 rounded-2xl font-bold text-blue-700 border-2 border-blue-600/30 text-center"
                >
                  الملف الشخصي
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full px-4 py-2.5 rounded-2xl font-bold text-red-600 border-2 border-red-200 text-center"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <Link
                  to="/login"
                  className="block px-4 py-2.5 rounded-2xl font-bold text-blue-700 border-2 border-blue-600/30 text-center"
                >
                  دخول
                </Link>
                <Link to="/register" className="btn-primary w-full text-center">
                  تسجيل
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
