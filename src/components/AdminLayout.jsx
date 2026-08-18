import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiExternalLink,
  FiLogOut,
  FiChevronDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiUser,
  FiCommand,
} from "react-icons/fi";
import { useAdmin } from "../context/useAdmin";
import { useAuth } from "../context/AuthContext";
import { storeUrl } from "../utils/host";
import { getInitials } from "../utils/validators";
import { ADMIN_GROUPS, findActiveSection } from "../utils/adminSections";

const COLLAPSE_KEY = "adminSidebarCollapsed";

function Brand({ isCollapsed }) {
  return (
    <div className="flex items-center gap-3 px-2">
      <span className="relative w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-glow-pink">
        <span className="text-white font-display font-black text-xl">ل</span>
      </span>
      {!isCollapsed && (
        <div className="min-w-0">
          <p className="font-display font-black text-gray-900 leading-tight">
            لُوما
          </p>
          <p className="text-[11px] text-gray-400 font-bold">لوحة التحكم</p>
        </div>
      )}
    </div>
  );
}

/** Sidebar navigation, shared by the desktop rail and the mobile drawer. */
function SidebarNav({ counts, isCollapsed, onNavigate }) {
  return (
    <nav className="space-y-6">
      {ADMIN_GROUPS.map((group) => (
        <div key={group.label}>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
              {group.label}
            </p>
          )}

          <div className="space-y-1">
            {group.items.map((section) => {
              const SectionIcon = section.Icon;
              const count = section.countKey ? counts[section.countKey] : null;

              return (
                <NavLink
                  key={section.to}
                  to={section.to}
                  end={section.end}
                  onClick={onNavigate}
                  title={isCollapsed ? section.label : undefined}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 rounded-2xl text-sm font-bold transition-all ${
                      isCollapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-white text-pink-700 shadow-card"
                        : "text-gray-600 hover:text-pink-700 hover:bg-white/70"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-full bg-gradient-to-b from-pink-500 to-purple-600" />
                      )}
                      <span
                        className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? `bg-gradient-to-br ${section.gradient} text-white shadow-md`
                            : "bg-white text-gray-500"
                        }`}
                      >
                        <SectionIcon size={16} />
                      </span>

                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-right">{section.label}</span>
                          {count !== null && count !== undefined && (
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                                isActive
                                  ? "bg-pink-600 text-white"
                                  : "bg-white text-gray-500"
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

/** ⌘K jump-to-section palette — faster than hunting the sidebar. */
function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef(null);

  const matches = useMemo(() => {
    const normalized = query.trim();
    const all = ADMIN_GROUPS.flatMap((group) =>
      group.items.map((item) => ({ ...item, group: group.label })),
    );

    if (!normalized) return all;

    return all.filter(
      (item) =>
        item.label.includes(normalized) ||
        item.description.includes(normalized) ||
        item.group.includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setHighlighted(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const go = (section) => {
    navigate(section.to);
    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((index) => (index + 1) % Math.max(matches.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted(
        (index) => (index - 1 + matches.length) % Math.max(matches.length, 1),
      );
    } else if (event.key === "Enter" && matches[highlighted]) {
      event.preventDefault();
      go(matches[highlighted]);
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-ink/30 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-glow-lg border border-black/[0.05] overflow-hidden animate-fade-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <FiSearch className="text-pink-500 shrink-0" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setHighlighted(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="انتقل إلى قسم…"
            className="flex-1 outline-none text-sm font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
          />
          <kbd className="text-[10px] font-black text-gray-400 border border-gray-200 rounded-lg px-2 py-1">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {matches.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              لا يوجد قسم مطابق
            </p>
          ) : (
            matches.map((section, index) => {
              const SectionIcon = section.Icon;

              return (
                <button
                  key={section.to}
                  type="button"
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => go(section)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-right transition-colors ${
                    index === highlighted ? "bg-pink-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br ${section.gradient} text-white flex items-center justify-center`}
                  >
                    <SectionIcon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-gray-900">
                      {section.label}
                    </span>
                    <span className="block text-xs text-gray-500 truncate">
                      {section.description}
                    </span>
                  </span>
                  <span className="text-[10px] font-black text-gray-400 shrink-0">
                    {section.group}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl border border-black/[0.06] bg-white hover:border-pink-200 hover:shadow-card transition-all"
      >
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-black flex items-center justify-center">
          {getInitials(user?.name || "؟")}
        </span>
        <span className="hidden sm:block text-right leading-tight">
          <span className="block text-sm font-bold text-gray-900 max-w-[8rem] truncate">
            {user?.name}
          </span>
          <span className="block text-[11px] text-gray-400">مدير المنصة</span>
        </span>
        <FiChevronDown
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          size={16}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-white shadow-glow-lg border border-black/[0.05] p-2 animate-fade-up z-50">
          <div className="px-3 py-2.5 mb-1 rounded-xl bg-gray-50">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          <NavLink
            to="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors"
          >
            <FiUser size={15} />
            حسابي
          </NavLink>

          <a
            href={storeUrl("/")}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors"
          >
            <FiExternalLink size={15} />
            زيارة المتجر
          </a>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut size={15} />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout() {
  const {
    stores,
    products,
    orders,
    categories,
    userStats,
    reviewsPagination,
    productPagination,
    orderPagination,
  } = useAdmin();
  const { user, logout } = useAuth();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "true",
  );

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsPaletteOpen((previous) => !previous);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const counts = {
    orders: orderPagination.totalItems || orders.length,
    products: productPagination.totalItems || products.length,
    stores: stores.length,
    categories: categories.length,
    reviews: reviewsPagination?.totalItems || 0,
    users: userStats?.total ?? 0,
  };

  const activeSection = useMemo(
    () => findActiveSection(location.pathname),
    [location.pathname],
  );

  const sidebarWidth = isCollapsed ? "lg:w-[88px]" : "lg:w-[276px]";
  const contentOffset = isCollapsed ? "lg:mr-[88px]" : "lg:mr-[276px]";

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 right-0 z-40 flex-col ${sidebarWidth} bg-pink-50 border-l border-pink-100 transition-[width] duration-300`}
      >
        <div className="h-20 flex items-center shrink-0 px-4">
          <Brand isCollapsed={isCollapsed} />
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <SidebarNav counts={counts} isCollapsed={isCollapsed} />
        </div>

        <div className="p-3 border-t border-pink-100 space-y-2">
          <a
            href={storeUrl("/")}
            className={`flex items-center gap-3 rounded-2xl bg-white text-gray-600 hover:text-pink-700 hover:shadow-card text-sm font-bold transition-colors ${
              isCollapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"
            }`}
            title="زيارة المتجر"
          >
            <FiExternalLink size={16} className="shrink-0" />
            {!isCollapsed && <span>زيارة المتجر</span>}
          </a>

          <button
            type="button"
            onClick={() => setIsCollapsed((previous) => !previous)}
            className={`w-full flex items-center gap-3 rounded-2xl text-gray-400 hover:text-pink-700 hover:bg-white/70 text-sm font-bold transition-colors ${
              isCollapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"
            }`}
          >
            {isCollapsed ? (
              <FiChevronsLeft size={16} />
            ) : (
              <>
                <FiChevronsRight size={16} />
                <span>طي القائمة</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="relative mr-auto w-[280px] h-full bg-pink-50 flex flex-col animate-fade-up">
            <div className="h-20 flex items-center justify-between shrink-0 px-4">
              <Brand isCollapsed={false} />
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-9 h-9 rounded-xl bg-white text-gray-600 flex items-center justify-center"
                aria-label="إغلاق القائمة"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <SidebarNav
                counts={counts}
                onNavigate={() => setIsDrawerOpen(false)}
              />
            </div>

            <div className="p-3 border-t border-pink-100">
              <a
                href={storeUrl("/")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white text-gray-600 text-sm font-bold"
              >
                <FiExternalLink size={16} />
                زيارة المتجر
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className={`${contentOffset} transition-[margin] duration-300`}>
        <header className="sticky top-0 z-30 glass border-b border-black/[0.04]">
          <div className="flex items-center gap-3 px-4 sm:px-6 h-20">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden w-10 h-10 shrink-0 rounded-2xl bg-white border border-black/[0.06] text-gray-700 flex items-center justify-center"
              aria-label="فتح القائمة"
            >
              <FiMenu size={18} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black text-pink-600 uppercase tracking-wider">
                بوابة الإدارة
              </p>
              <h1 className="text-lg sm:text-xl font-display font-black text-gray-900 truncate">
                {activeSection.label}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-black/[0.06] bg-white text-gray-400 hover:border-pink-200 hover:text-pink-600 transition-all"
            >
              <FiSearch size={16} />
              <span className="text-sm font-bold">بحث سريع</span>
              <kbd className="flex items-center gap-0.5 text-[10px] font-black text-gray-400 border border-gray-200 rounded-lg px-1.5 py-0.5">
                <FiCommand size={10} />K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              className="md:hidden w-10 h-10 shrink-0 rounded-2xl bg-white border border-black/[0.06] text-gray-600 flex items-center justify-center"
              aria-label="بحث سريع"
            >
              <FiSearch size={17} />
            </button>

            <UserMenu user={user} onLogout={logout} />
          </div>
        </header>

        <main className="px-4 sm:px-6 py-6 max-w-[1500px] mx-auto">
          <Outlet />
        </main>
      </div>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </div>
  );
}
