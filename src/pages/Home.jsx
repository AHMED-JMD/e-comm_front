import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiShield,
  FiZap,
  FiStar,
  FiSearch,
  FiTrendingUp,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import ProductReviewsModal from "../components/ProductReviewsModal";
import Spinner from "../components/Spinner";
import { CategoryIconBadge } from "../utils/categoryIcons";
import { useCart } from "../context/CartContext";
import apiClient from "../utils/api";

/** Shown when the shop API can't be reached, so an outage never looks like "no data". */
function LoadErrorCard({ onRetry }) {
  return (
    <div className="card text-center py-10 max-w-lg mx-auto">
      <span className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center">
        <FiAlertCircle size={30} />
      </span>
      <p className="text-gray-800 font-bold mb-1">تعذر الاتصال بالخادم</p>
      <p className="text-gray-500 text-sm mb-5">
        تأكد من تشغيل الخادم ثم أعد المحاولة.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="btn-primary inline-flex items-center gap-2"
      >
        <FiRefreshCw />
        إعادة المحاولة
      </button>
    </div>
  );
}

function StatValue({ value, suffix = "" }) {
  return (
    <div className="text-4xl md:text-5xl font-display font-black text-gradient mb-2">
      {new Intl.NumberFormat("ar-EG").format(value || 0)}
      {suffix}
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewProduct, setReviewProduct] = useState(null);

  const loadHome = useCallback(async () => {
    setIsLoading(true);
    setHasLoadError(false);

    try {
      const [categoriesRes, featuredRes, statsRes] = await Promise.all([
        apiClient.get("/shop/categories"),
        apiClient.get("/shop/products/featured", { params: { limit: 6 } }),
        apiClient.get("/shop/stats"),
      ]);

      setCategories(categoriesRes.data.categories || []);
      setFeatured(featuredRes.data.products || []);
      setStats(statsRes.data.stats || null);
    } catch {
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();
    navigate(term ? `/browse?search=${encodeURIComponent(term)}` : "/browse");
  };

  const handleRatingChange = (productId, summary) => {
    if (!summary) return;
    setFeatured((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              ratingAvg: summary.ratingAvg,
              ratingCount: summary.ratingCount,
            }
          : product,
      ),
    );
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

              <form
                onSubmit={handleSearch}
                className="glass !bg-white/95 rounded-full p-1.5 flex items-center gap-2 mb-6 max-w-lg"
              >
                <FiSearch className="text-blue-600 mr-3 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن منتج أو متجر..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="flex-1 min-w-0 py-2.5 bg-transparent text-gray-800 focus:outline-none placeholder:text-gray-400"
                />
                <button type="submit" className="btn-primary !py-2.5 !px-6">
                  بحث
                </button>
              </form>

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
      <section className="py-16 px-4 bg-mesh-soft">
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

      {/* Categories Section — icons defined by the admin */}
      <section className="py-16 px-4 bg-mesh-soft">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title !mb-4">الفئات الرئيسية</h2>
          <p className="text-center text-gray-600 mb-10">
            اختر القسم الذي تبحث فيه وتصفّح منتجاته مباشرة
          </p>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner className="w-8 h-8 border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : hasLoadError ? (
            <LoadErrorCard onRetry={loadHome} />
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500">لم يتم تعريف أقسام بعد.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/browse?categoryId=${category.id}`}
                  className="card !p-5 text-center hover:-translate-y-2 group"
                >
                  <CategoryIconBadge
                    icon={category.icon}
                    color={category.color}
                    size="md"
                    className="mx-auto mb-3 group-hover:scale-110 transition-transform"
                  />
                  <h3 className="font-bold text-gray-900 mb-1 text-sm line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.productsCount || 0} منتج
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top rated products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="badge-pill bg-amber-50 text-amber-700 mb-3">
                <FiTrendingUp size={14} />
                الأعلى تقييماً من المشترين
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
                المنتجات المميزة
              </h2>
            </div>
            <Link to="/browse?sort=rating" className="btn-outline !py-2.5">
              عرض الكل
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner className="w-8 h-8 border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : hasLoadError ? (
            <LoadErrorCard onRetry={loadHome} />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onOpenReviews={setReviewProduct}
                />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="text-5xl mb-4">🛍️</div>
              <p className="text-gray-600 text-lg">
                لا توجد منتجات معروضة حالياً.
              </p>
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

      {/* Live platform stats */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <StatValue value={stats?.productsCount} />
              <p className="text-gray-600 font-medium">منتج متاح</p>
            </div>
            <div>
              <StatValue value={stats?.storesCount} />
              <p className="text-gray-600 font-medium">متجر موثوق</p>
            </div>
            <div>
              <StatValue value={stats?.buyersCount} />
              <p className="text-gray-600 font-medium">مشتري مسجل</p>
            </div>
            <div>
              <StatValue value={stats?.reviewsCount} />
              <p className="text-gray-600 font-medium">تقييم منتج</p>
            </div>
          </div>
        </div>
      </section>

      <ProductReviewsModal
        product={reviewProduct}
        isOpen={Boolean(reviewProduct)}
        onClose={() => setReviewProduct(null)}
        onRatingChange={handleRatingChange}
      />
    </div>
  );
}
