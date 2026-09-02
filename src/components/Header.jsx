import { Link, useLocation } from "react-router-dom";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiExternalLink,
  FiHome,
  FiGrid,
  FiPhone,
  FiPackage,
  FiUser,
  FiInfo,
  FiLogOut,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { adminUrl } from "../utils/host";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/validators";
import Logo from "./Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const isActive = (path) => location.pathname === path;

  // A tap on any drawer link navigates — the drawer must not linger on top of
  // the page the user just asked for.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // While the drawer is open the page behind it should not scroll.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  /** One row of the mobile drawer. */
  const drawerLink = ({ to, href, label, Icon, badge }) => {
    const active = to ? isActive(to) : false;
    const className = `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors ${
      active
        ? "bg-white text-blue-700 shadow-card"
        : "text-gray-700 active:bg-white/70"
    }`;

    const content = (
      <>
        <Icon
          size={19}
          className={active ? "text-blue-600" : "text-gray-400"}
        />
        <span className="flex-1 text-right">{label}</span>
        {badge > 0 && (
          <span className="min-w-[1.5rem] h-6 px-1.5 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
            {badge}
          </span>
        )}
      </>
    );

    return href ? (
      <a key={label} href={href} className={className}>
        {content}
      </a>
    ) : (
      <Link key={label} to={to} className={className}>
        {content}
      </Link>
    );
  };

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
    <>
      <header className="sticky top-0 z-50 glass shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center group" aria-label="لُوما">
              <Logo
                height={26}
                showLatin
                showArabic
                className="group-hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1 items-center bg-white/60 border border-black/[0.04] rounded-full p-1">
              {navLink("/", "الرئيسية")}
              {navLink("/browse", "تصفح")}
              {isLoggedIn && !isAdmin && navLink("/account", "طلباتي")}
              {isAdmin && (
                <a
                  href={adminUrl("/")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm text-green-700 hover:text-white hover:bg-green-600 transition-all whitespace-nowrap"
                >
                  <FiExternalLink size={14} />
                  بوابة الإدارة
                </a>
              )}
              <a
                href="/contact"
                className="px-4 py-2 rounded-full font-bold text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all whitespace-nowrap"
              >
                تواصل معنا
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
                    to="/account"
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                      isActive("/account") || isActive("/profile")
                        ? "bg-blue-600 text-white shadow-glow"
                        : "text-blue-700 border-2 border-blue-600/30 hover:border-blue-600"
                    }`}
                  >
                    حسابي
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

            {/* Mobile actions */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/cart"
                className="relative w-11 h-11 rounded-2xl bg-white border border-black/[0.06] text-gray-700 flex items-center justify-center active:bg-blue-50"
                aria-label="السلة"
              >
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-pink-500 to-purple-600 text-white text-[11px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-glow-pink">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-glow"
                onClick={() => setIsOpen(true)}
                aria-label="القائمة"
                aria-expanded={isOpen}
              >
                <FiMenu size={20} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          <aside
            className="relative mr-auto w-[86%] max-w-[340px] h-full bg-canvas bg-mesh-soft shadow-glow-lg flex flex-col animate-drawer-in"
            role="dialog"
            aria-modal="true"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between gap-3 p-4 border-b border-blue-100/70">
              <Link to="/" className="flex items-center" aria-label="لُوما">
                <Logo height={22} />
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-2xl bg-white/70 text-gray-600 flex items-center justify-center active:bg-white"
                aria-label="إغلاق القائمة"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Account block */}
            <div className="p-4 border-b border-blue-100/70">
              {isLoggedIn ? (
                <div className="flex items-center gap-3 px-1">
                  <span className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-black flex items-center justify-center">
                    {getInitials(user?.name || "؟")}
                  </span>
                  <span className="font-bold text-gray-900 truncate">
                    {user?.name}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-4 py-3 rounded-2xl font-bold text-sm text-blue-700 border-2 border-blue-600/30"
                  >
                    دخول
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary !rounded-2xl !px-4 !py-3 text-sm"
                  >
                    تسجيل
                  </Link>
                </div>
              )}
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {drawerLink({ to: "/", label: "الرئيسية", Icon: FiHome })}
              {drawerLink({
                to: "/browse",
                label: "تصفح المنتجات",
                Icon: FiGrid,
              })}
              {drawerLink({
                to: "/cart",
                label: "السلة",
                Icon: FiShoppingCart,
                badge: totalItems,
              })}

              {isLoggedIn &&
                !isAdmin &&
                drawerLink({
                  to: "/account",
                  label: "طلباتي",
                  Icon: FiPackage,
                })}

              {isLoggedIn &&
                drawerLink({
                  to: "/profile",
                  label: "الملف الشخصي",
                  Icon: FiUser,
                })}

              {isAdmin &&
                drawerLink({
                  href: adminUrl("/"),
                  label: "بوابة الإدارة",
                  Icon: FiExternalLink,
                })}

              {drawerLink({
                href: "/contact",
                label: "تواصل معنا",
                Icon: FiPhone,
              })}
            </nav>

            {/* Footer */}
            {isLoggedIn && (
              <div className="p-4 border-t border-blue-100/70">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-600 active:bg-white/70"
                >
                  <FiLogOut size={19} />
                  <span className="flex-1 text-right">تسجيل الخروج</span>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
