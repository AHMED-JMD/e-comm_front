import { Link } from "react-router-dom";
import Logo from "./Logo";
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-ink text-gray-300 overflow-hidden">
      <div className="absolute -top-32 -right-24 w-96 h-96 blob bg-blue-600" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 blob bg-pink-500 [animation-delay:3s]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <Logo height={24} tone="onDark" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              منصة تجارة إلكترونية آمنة وموثوقة لربط البائعين بالمشترين
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-pink-400 transition">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-pink-400 transition">
                  تصفح المنتجات
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  الفئات
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-400 transition">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-bold mb-4">السياسات</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  سياسة الاسترجاع
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  سياسة الدفع
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-bold mb-4">تابعنا</h3>
            <div className="flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-pink-500 hover:-translate-y-1 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
              <Link
                to="/contact"
                aria-label="تواصل معنا"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-pink-500 hover:-translate-y-1 transition-all"
              >
                <FiMail size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-7">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-500">
              © 2026 EComm Platform. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:text-pink-400 transition">
                عربي
              </a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-pink-400 transition">
                English
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
