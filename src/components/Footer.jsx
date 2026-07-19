import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">EC</span>
              </div>
              <span className="text-lg font-bold text-white">EComm</span>
            </div>
            <p className="text-sm text-gray-400">
              منصة تجارة إلكترونية آمنة وموثوقة لربط البائعين بالمشترين
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  الرئيسية
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  تصفح المنتجات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  الفئات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-bold mb-4">السياسات</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  سياسة الاسترجاع
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  سياسة الدفع
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-bold mb-4">تابعنا</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-blue-400 transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FiMail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2026 EComm Platform. جميع الحقوق محفوظة.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4 text-sm">
              <a href="#" className="hover:text-blue-400 transition">
                عربي
              </a>
              <span className="text-gray-600">|</span>
              <a href="#" className="hover:text-blue-400 transition">
                English
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
