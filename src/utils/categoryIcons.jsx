import {
  MdOutlineCategory,
  MdOutlineSmartphone,
  MdOutlineLaptop,
  MdOutlineHeadphones,
  MdOutlineCameraAlt,
  MdOutlineWatch,
  MdOutlineSportsEsports,
  MdOutlineDevicesOther,
  MdOutlineCheckroom,
  MdOutlineDiamond,
  MdOutlineSpa,
  MdOutlineChair,
  MdOutlineBed,
  MdOutlineKitchen,
  MdOutlineHome,
  MdOutlineLocalFlorist,
  MdOutlineRestaurant,
  MdOutlineFastfood,
  MdOutlineLocalCafe,
  MdOutlineLocalGroceryStore,
  MdOutlineMenuBook,
  MdOutlineSchool,
  MdOutlineSportsSoccer,
  MdOutlineDirectionsCar,
  MdOutlineBuild,
  MdOutlinePets,
  MdOutlineChildCare,
  MdOutlineToys,
  MdOutlineHealthAndSafety,
  MdOutlineMusicNote,
  MdOutlineBrush,
  MdOutlineFlight,
  MdOutlineCleaningServices,
  MdOutlineLocalOffer,
} from "react-icons/md";

/**
 * The icon library an admin picks from when defining a category.
 * `key` is what gets persisted on the category record.
 */
export const CATEGORY_ICONS = [
  { key: "box", label: "عام", Icon: MdOutlineCategory },
  { key: "smartphone", label: "هواتف", Icon: MdOutlineSmartphone },
  { key: "laptop", label: "حواسيب", Icon: MdOutlineLaptop },
  { key: "headphones", label: "سماعات", Icon: MdOutlineHeadphones },
  { key: "camera", label: "كاميرات", Icon: MdOutlineCameraAlt },
  { key: "watch", label: "ساعات", Icon: MdOutlineWatch },
  { key: "gaming", label: "ألعاب إلكترونية", Icon: MdOutlineSportsEsports },
  { key: "devices", label: "أجهزة", Icon: MdOutlineDevicesOther },
  { key: "clothes", label: "ملابس", Icon: MdOutlineCheckroom },
  { key: "jewelry", label: "مجوهرات", Icon: MdOutlineDiamond },
  { key: "beauty", label: "تجميل", Icon: MdOutlineSpa },
  { key: "furniture", label: "أثاث", Icon: MdOutlineChair },
  { key: "bedroom", label: "غرف نوم", Icon: MdOutlineBed },
  { key: "appliances", label: "أجهزة منزلية", Icon: MdOutlineKitchen },
  { key: "home", label: "مستلزمات المنزل", Icon: MdOutlineHome },
  { key: "plants", label: "نباتات", Icon: MdOutlineLocalFlorist },
  { key: "restaurant", label: "مطاعم", Icon: MdOutlineRestaurant },
  { key: "fastfood", label: "وجبات سريعة", Icon: MdOutlineFastfood },
  { key: "coffee", label: "مشروبات", Icon: MdOutlineLocalCafe },
  { key: "grocery", label: "بقالة", Icon: MdOutlineLocalGroceryStore },
  { key: "books", label: "كتب", Icon: MdOutlineMenuBook },
  { key: "education", label: "تعليم", Icon: MdOutlineSchool },
  { key: "sports", label: "رياضة", Icon: MdOutlineSportsSoccer },
  { key: "cars", label: "سيارات", Icon: MdOutlineDirectionsCar },
  { key: "tools", label: "أدوات وعدد", Icon: MdOutlineBuild },
  { key: "pets", label: "حيوانات أليفة", Icon: MdOutlinePets },
  { key: "kids", label: "مستلزمات أطفال", Icon: MdOutlineChildCare },
  { key: "toys", label: "ألعاب", Icon: MdOutlineToys },
  { key: "health", label: "صحة", Icon: MdOutlineHealthAndSafety },
  { key: "music", label: "موسيقى", Icon: MdOutlineMusicNote },
  { key: "art", label: "فنون", Icon: MdOutlineBrush },
  { key: "travel", label: "سفر", Icon: MdOutlineFlight },
  { key: "cleaning", label: "تنظيف", Icon: MdOutlineCleaningServices },
  { key: "offers", label: "عروض", Icon: MdOutlineLocalOffer },
];

const ICON_BY_KEY = CATEGORY_ICONS.reduce((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {});

/**
 * Palette an admin picks alongside the icon. Class strings are written out in
 * full so Tailwind keeps them during the build.
 */
export const CATEGORY_COLORS = [
  {
    key: "blue",
    label: "بنفسجي",
    gradient: "from-blue-600 to-purple-600",
    soft: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-600",
    dot: "bg-blue-600",
  },
  {
    key: "purple",
    label: "أرجواني",
    gradient: "from-purple-600 to-pink-500",
    soft: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-600",
    dot: "bg-purple-600",
  },
  {
    key: "pink",
    label: "وردي",
    gradient: "from-pink-500 to-rose-500",
    soft: "bg-pink-50",
    text: "text-pink-700",
    ring: "ring-pink-500",
    dot: "bg-pink-500",
  },
  {
    key: "green",
    label: "أخضر",
    gradient: "from-green-500 to-emerald-600",
    soft: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-600",
    dot: "bg-green-600",
  },
  {
    key: "teal",
    label: "تركوازي",
    gradient: "from-teal-500 to-cyan-600",
    soft: "bg-teal-50",
    text: "text-teal-700",
    ring: "ring-teal-500",
    dot: "bg-teal-500",
  },
  {
    key: "amber",
    label: "ذهبي",
    gradient: "from-amber-400 to-orange-500",
    soft: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-500",
    dot: "bg-amber-500",
  },
  {
    key: "red",
    label: "أحمر",
    gradient: "from-red-500 to-pink-600",
    soft: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-500",
    dot: "bg-red-500",
  },
  {
    key: "slate",
    label: "رمادي",
    gradient: "from-slate-600 to-slate-800",
    soft: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-600",
    dot: "bg-slate-600",
  },
];

const COLOR_BY_KEY = CATEGORY_COLORS.reduce((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {});

export const DEFAULT_CATEGORY_ICON = "box";
export const DEFAULT_CATEGORY_COLOR = "blue";

export function getCategoryIcon(iconKey) {
  return (ICON_BY_KEY[iconKey] || ICON_BY_KEY[DEFAULT_CATEGORY_ICON]).Icon;
}

export function getCategoryColor(colorKey) {
  return COLOR_BY_KEY[colorKey] || COLOR_BY_KEY[DEFAULT_CATEGORY_COLOR];
}

/** Small round icon badge used across the storefront and the admin portal. */
export function CategoryIconBadge({
  icon,
  color,
  size = "md",
  iconSize,
  className = "",
}) {
  const Icon = getCategoryIcon(icon);
  const palette = getCategoryColor(color);

  const sizes = {
    sm: { box: "w-9 h-9 rounded-xl", icon: 18 },
    md: { box: "w-12 h-12 rounded-2xl", icon: 24 },
    lg: { box: "w-16 h-16 rounded-3xl", icon: 32 },
  };
  const dimensions = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center justify-center bg-gradient-to-br ${palette.gradient} text-white shadow-md ${dimensions.box} ${className}`}
    >
      <Icon size={iconSize || dimensions.icon} />
    </span>
  );
}
