import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiShield,
  FiZap,
  FiStar,
  FiSmartphone,
  FiShoppingBag,
  FiBox,
  FiBook,
  FiActivity,
  FiSun,
} from "react-icons/fi";
import { useState } from "react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  {
    id: 1,
    name: "إلكترونيات",
    icon: FiSmartphone,
    gradient: "from-blue-600 to-purple-600",
    count: 124,
  },
  {
    id: 2,
    name: "الملابس",
    icon: FiShoppingBag,
    gradient: "from-purple-600 to-pink-500",
    count: 89,
  },
  {
    id: 3,
    name: "الأثاث",
    icon: FiBox,
    gradient: "from-amber-500 to-orange-600",
    count: 45,
  },
  {
    id: 4,
    name: "الكتب",
    icon: FiBook,
    gradient: "from-green-500 to-emerald-600",
    count: 67,
  },
  {
    id: 5,
    name: "الرياضة",
    icon: FiActivity,
    gradient: "from-red-500 to-pink-600",
    count: 52,
  },
  {
    id: 6,
    name: "الجمال",
    icon: FiSun,
    gradient: "from-pink-500 to-purple-500",
    count: 38,
  },
];

const FEATURED_PRODUCTS = PRODUCTS.slice(0, 6);

export default function Home() {
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(FEATURED_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredProducts(FEATURED_PRODUCTS);
    } else {
      setFilteredProducts(
        FEATURED_PRODUCTS.filter(
          (p) => p.name.includes(term) || p.storeName.includes(term),
        ),
      );
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-mesh-hero bg-[length:200%_200%] animate-gradient-x text-white py-24 px-4">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:44px_44px] opacity-30" />
        <div className="blob w-80 h-80 bg-white/30 top-10 -right-10" />
        <div className="blob w-72 h-72 bg-green-400/40 bottom-0 left-10 [animation-delay:2s]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="badge-pill bg-white/15 border border-white/25 text-white mb-6">
                ✨ تجربة تسوق جديدة كلياً
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-black mb-6 leading-[1.15]">
                منصة تجارة إلكترونية
                <span className="block text-transparent bg-clip-text bg-gradient-to-l from-white to-green-200">
                  آمنة، سريعة، وموثوقة
                </span>
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-lg">
                تصل بين البائعين والمشترين في بيئة آمنة. ابدأ البيع أو الشراء
                اليوم
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/browse"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-full shadow-glow-lg hover:-translate-y-0.5 transition-all"
                >
                  تصفح المنتجات
                  <FiArrowLeft size={20} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 border-2 border-white/40 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all"
                >
                  ابدأ البيع الآن
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative animate-float">
                <div className="absolute inset-0 blur-3xl bg-white/30 rounded-full" />
                <div className="relative text-[10rem] leading-none drop-shadow-2xl">
                  🛍️
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">لماذا اختيار منصتنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-glow group-hover:rotate-6 transition-transform">
                <FiShield size={34} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">آمن وموثوق</h3>
              <p className="text-gray-600">
                معاملات آمنة مع حماية كاملة للبيانات الشخصية والمالية
              </p>
            </div>
            <div className="card text-center group">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-glow group-hover:rotate-6 transition-transform">
                <FiStar size={34} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">تقييمات وثقة</h3>
              <p className="text-gray-600">
                نظام تقييم شفاف يساعدك على اختيار البائعين الموثوقين
              </p>
            </div>
            <div className="card text-center group">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-glow-green group-hover:rotate-6 transition-transform">
                <FiZap size={34} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">سريع وسهل</h3>
              <p className="text-gray-600">
                واجهة بسيطة وسهلة الاستخدام للبيع والشراء بسرعة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-mesh-soft">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">الفئات الرئيسية</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="card !p-5 text-center hover:-translate-y-2 cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent size={26} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">{category.count} منتج</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card !rounded-full !p-2 flex flex-col md:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="ابحث عن منتج أو متجر..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 w-full px-5 py-3 rounded-full focus:outline-none bg-transparent"
            />
            <button className="btn-primary w-full md:w-auto">بحث</button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">المنتجات المميزة</h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="card hover:-translate-y-2 group overflow-hidden"
                >
                  <div className="mb-4 relative -mx-6 -mt-6 px-6 pt-6 pb-6 bg-mesh-soft">
                    <div className="text-7xl text-center drop-shadow-sm group-hover:scale-110 transition-transform">
                      {product.image}
                    </div>
                    <span className="absolute top-4 left-4 badge-pill bg-gradient-to-l from-green-500 to-emerald-600 text-white shadow-glow-green">
                      {product.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-blue-700 transition">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {product.storeName}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-display font-extrabold text-gradient">
                      {product.price} ج.م
                    </span>
                    <div className="badge-pill bg-amber-50 text-amber-700">
                      <span>★</span>
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <button
                    className="btn-primary w-full"
                    onClick={() => addToCart(product)}
                  >
                    أضف للسلة
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg">لم يتم العثور على منتجات</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative overflow-hidden py-20 px-4 bg-cta-mesh bg-[length:200%_200%] animate-gradient-x text-white">
        <div className="blob w-96 h-96 bg-white/20 -top-20 left-1/3" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-6">
            هل أنت متجر؟
          </h2>
          <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف التجار الذين يبيعون منتجاتهم على منصتنا. ابدأ الآن
            مجاناً!
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3.5 bg-white text-purple-700 font-bold rounded-full shadow-glow-lg hover:-translate-y-0.5 transition-all"
          >
            تواصل معنا
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-display font-black text-gradient mb-2">
                15,234
              </div>
              <p className="text-gray-600 font-medium">منتج متاح</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-black text-gradient mb-2">
                2,845
              </div>
              <p className="text-gray-600 font-medium">بائع موثوق</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-black text-gradient mb-2">
                48,500
              </div>
              <p className="text-gray-600 font-medium">مشتري سعيد</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-black text-gradient mb-2">
                125K
              </div>
              <p className="text-gray-600 font-medium">عملية بيع ناجحة</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
