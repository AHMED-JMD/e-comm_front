import {
  FiGrid,
  FiShoppingCart,
  FiBox,
  FiHome,
  FiLayers,
  FiUsers,
  FiStar,
  FiBarChart2,
  FiUser,
} from "react-icons/fi";

/**
 * Single source of truth for the dashboard navigation: the sidebar, the mobile
 * drawer, the command palette and the overview cards all read from here.
 * Paths are root-relative because the dashboard owns its own subdomain.
 */
export const ADMIN_GROUPS = [
  {
    label: "نظرة عامة",
    items: [
      {
        to: "/",
        end: true,
        label: "الرئيسية",
        description: "ملخص أداء المنصة وآخر النشاطات",
        Icon: FiGrid,
        gradient: "from-blue-600 to-purple-600",
        countKey: null,
      },
    ],
  },
  {
    label: "المبيعات",
    items: [
      {
        to: "/orders",
        label: "الطلبات",
        description: "متابعة الطلبات وتحديث حالتها حتى التسليم",
        Icon: FiShoppingCart,
        gradient: "from-blue-600 to-purple-600",
        countKey: "orders",
      },
      {
        to: "/products",
        label: "المنتجات",
        description: "إضافة وتعديل منتجات المتاجر وصورها ومخزونها",
        Icon: FiBox,
        gradient: "from-green-500 to-emerald-600",
        countKey: "products",
      },
      {
        to: "/stores",
        label: "المتاجر",
        description: "إدارة المتاجر المسجلة داخل المنصة وبياناتها",
        Icon: FiHome,
        gradient: "from-amber-400 to-orange-500",
        countKey: "stores",
      },
      {
        to: "/categories",
        label: "الأقسام",
        description: "تعريف الأقسام واختيار الأيقونة الظاهرة في الواجهة",
        Icon: FiLayers,
        gradient: "from-pink-500 to-rose-500",
        countKey: "categories",
      },
    ],
  },
  {
    label: "المجتمع",
    items: [
      {
        to: "/users",
        label: "المستخدمون",
        description: "إدارة حسابات المشترين والمدراء وصلاحياتهم",
        Icon: FiUsers,
        gradient: "from-indigo-500 to-blue-600",
        countKey: "users",
      },
      {
        to: "/reviews",
        label: "التقييمات",
        description: "مراجعة تقييمات المنتجات وتعليقات المشترين",
        Icon: FiStar,
        gradient: "from-teal-500 to-cyan-600",
        countKey: "reviews",
      },
    ],
  },
  {
    label: "النظام",
    items: [
      {
        to: "/reports",
        label: "التقارير",
        description: "مؤشرات الأداء ومبيعات المنصة",
        Icon: FiBarChart2,
        gradient: "from-slate-600 to-slate-800",
        countKey: null,
      },
      {
        to: "/account",
        label: "حسابي",
        description: "بيانات حساب المدير وإعدادات الأمان",
        Icon: FiUser,
        gradient: "from-teal-500 to-blue-600",
        countKey: null,
      },
    ],
  },
];

export const ADMIN_SECTIONS = ADMIN_GROUPS.flatMap((group) => group.items);

export function findActiveSection(pathname) {
  if (pathname === "/") {
    return ADMIN_SECTIONS[0];
  }

  return (
    ADMIN_SECTIONS.filter((section) => section.to !== "/").find((section) =>
      pathname.startsWith(section.to),
    ) || ADMIN_SECTIONS[0]
  );
}
