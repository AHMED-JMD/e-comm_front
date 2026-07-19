import { Link } from "react-router-dom";
import { FiArrowRight, FiTrendingUp, FiShield, FiZap } from "react-icons/fi";
import { useState } from "react";

const CATEGORIES = [
  { id: 1, name: "إلكترونيات", icon: "📱", count: 124 },
  { id: 2, name: "الملابس", icon: "👕", count: 89 },
  { id: 3, name: "الأثاث", icon: "🪑", count: 45 },
  { id: 4, name: "الكتب", icon: "📚", count: 67 },
  { id: 5, name: "الرياضة", icon: "⚽", count: 52 },
  { id: 6, name: "الجمال", icon: "💄", count: 38 },
];

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "هاتف ذكي",
    price: 2500,
    store: "متجري",
    rating: 4.8,
    image: "📱",
    status: "جديد",
  },
  {
    id: 2,
    name: "لابتوب",
    price: 8000,
    store: "تك ستور",
    rating: 4.5,
    image: "💻",
    status: "جديد",
  },
  {
    id: 3,
    name: "سماعات",
    price: 500,
    store: "صوت مصر",
    rating: 4.9,
    image: "🎧",
    status: "جديد",
  },
  {
    id: 4,
    name: "كاميرا",
    price: 3500,
    store: "فوتوغرافيا",
    rating: 4.7,
    image: "📷",
    status: "مستعمل",
  },
  {
    id: 5,
    name: "ساعة ذكية",
    price: 1200,
    store: "الوقت",
    rating: 4.6,
    image: "⌚",
    status: "جديد",
  },
  {
    id: 6,
    name: "جهاز لوحي",
    price: 3000,
    store: "الأجهزة",
    rating: 4.8,
    image: "📲",
    status: "جديد",
  },
];

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState(FEATURED_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredProducts(FEATURED_PRODUCTS);
    } else {
      setFilteredProducts(
        FEATURED_PRODUCTS.filter(
          (p) => p.name.includes(term) || p.store.includes(term),
        ),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                منصة تجارة إلكترونية آمنة وموثوقة
              </h1>
              <p className="text-lg text-blue-50 mb-8">
                تصل بين البائعين والمشترين في بيئة آمنة. ابدأ البيع أو الشراء
                اليوم
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/browse"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  تصفح المنتجات
                  <FiArrowRight className="mr-2" size={20} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-900 transition-colors"
                >
                  ابدأ البيع الآن
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="text-9xl">🛍️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">لماذا اختيار منصتنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">آمن وموثوق</h3>
              <p className="text-gray-600">
                معاملات آمنة مع حماية كاملة للبيانات الشخصية والمالية
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-3">تقييمات وثقة</h3>
              <p className="text-gray-600">
                نظام تقييم شفاف يساعدك على اختيار البائعين الموثوقين
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">سريع وسهل</h3>
              <p className="text-gray-600">
                واجهة بسيطة وسهلة الاستخدام للبيع والشراء بسرعة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">الفئات الرئيسية</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="card text-center hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count} منتج</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="ابحث عن منتج أو متجر..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <button className="btn-primary w-full md:w-auto">بحث</button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title">المنتجات المميزة</h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="card hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 group"
                >
                  <div className="mb-4 relative">
                    <div className="text-6xl text-center mb-2">
                      {product.image}
                    </div>
                    <span className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">
                      {product.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{product.store}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {product.price} ج.م
                    </span>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-bold ml-1">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <button className="btn-primary w-full mt-4">أضف للسلة</button>
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
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">هل أنت متجر؟</h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف التجار الذين يبيعون منتجاتهم على منصتنا. ابدأ الآن
            مجاناً!
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            تواصل معنا
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                15,234
              </div>
              <p className="text-gray-600">منتج متاح</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                2,845
              </div>
              <p className="text-gray-600">بائع موثوق</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                48,500
              </div>
              <p className="text-gray-600">مشتري سعيد</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                125K
              </div>
              <p className="text-gray-600">عملية بيع ناجحة</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
