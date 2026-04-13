import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, ChevronRight, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <div>
                <div className="font-serif font-bold text-xl">NỘI THẤT XANH</div>
                <div className="text-[10px] uppercase tracking-widest text-accent">Không gian đẳng cấp</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Nội Thất Xanh mang đến những sản phẩm nội thất cao cấp, thiết kế tinh tế từ các chất liệu tự nhiên bền vững, tạo nên không gian sống hoàn hảo cho gia đình bạn.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Mua sắm */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-accent mb-5">Mua Sắm</h4>
            <ul className="space-y-3">
              {[
                { name: 'Tất cả sản phẩm', href: '/catalog' },
                { name: 'Sản phẩm mới', href: '/catalog?sort_by=created_at&sort_order=desc' },
                { name: 'Khuyến mãi', href: '/catalog' },
                { name: 'Sofa & Ghế', href: '/catalog?search=sofa' },
                { name: 'Bàn & Tủ', href: '/catalog?search=bàn' },
                { name: 'Phòng Ngủ', href: '/catalog?search=giường' },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-accent text-sm flex items-center gap-1.5 group transition-colors">
                    <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-accent mb-5">Hỗ Trợ</h4>
            <ul className="space-y-3">
              {[
                'Giới thiệu công ty',
                'Chính sách bảo hành',
                'Chính sách đổi trả',
                'Hướng dẫn đặt hàng',
                'Câu hỏi thường gặp',
                'Liên hệ với chúng tôi',
              ].map(item => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-accent text-sm flex items-center gap-1.5 group transition-colors">
                    <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-accent mb-5">Liên Hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white/60 text-xs mb-0.5">Hotline</div>
                  <a href="tel:1900123456" className="text-white font-semibold text-sm hover:text-accent transition-colors">
                    1900 123 456
                  </a>
                  <div className="text-white/40 text-xs">8:00 - 22:00 mỗi ngày</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white/60 text-xs mb-0.5">Email</div>
                  <a href="mailto:info@noithatxanh.vn" className="text-white text-sm hover:text-accent transition-colors">
                    info@noithatxanh.vn
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white/60 text-xs mb-0.5">Showroom</div>
                  <p className="text-white text-sm">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-[11px] uppercase tracking-widest">
            © {currentYear} Nội Thất Xanh. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-6 text-[11px] uppercase tracking-widest">
            {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Chính sách cookie'].map(item => (
              <a key={item} href="#" className="text-white/40 hover:text-accent transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
