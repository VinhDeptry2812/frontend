import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold">
                FL
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">Furniture Luxury</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Mang đến không gian sống đẳng cấp với các bộ sưu tập nội thất sang trọng, tinh tế và bền bỉ từ các thương hiệu hàng đầu thế giới.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center hover:text-amber-600 hover:shadow-md transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center hover:text-amber-600 hover:shadow-md transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center hover:text-amber-600 hover:shadow-md transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center hover:text-amber-600 hover:shadow-md transition-all"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold text-lg mb-6">Liên kết hữu ích</h4>
            <ul className="space-y-4">
              <li><Link to="/category" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Nội thất phòng khách</Link></li>
              <li><Link to="/brands" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Thương hiệu</Link></li>
              <li><Link to="/flash-sale" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Sale cuối năm</Link></li>
              <li><Link to="/best-sellers" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Bán chạy nhất</Link></li>
              <li><Link to="/category" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Nội thất phòng ngủ</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6">Chính sách</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Biểu phí vận chuyển</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Đổi trả miễn phí</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Hướng dẫn thanh toán</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 transition-colors">Bảo mật thông tin</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-bold text-lg mb-6">Liên hệ trải nghiệm</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-gray-500 dark:text-gray-400">123 Đại lô Nội thất, Quận 1, TP. HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="text-gray-500 dark:text-gray-400">1900 1234 (Hotline)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="text-gray-500 dark:text-gray-400">admin@furnitureluxury.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Furniture Luxury. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <div className="w-12 h-8 bg-white rounded shadow-sm border flex items-center justify-center text-xs font-bold text-blue-800">VISA</div>
            <div className="w-12 h-8 bg-white rounded shadow-sm border flex items-center justify-center text-xs font-bold text-red-500">MC</div>
            <div className="w-12 h-8 bg-white rounded shadow-sm border flex items-center justify-center text-[10px] font-bold text-blue-500">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
