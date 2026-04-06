import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#1a1a18', color: '#ccc', fontFamily: "'Mulish', sans-serif" }}>
      {/* Newsletter Bar */}
      <div style={{ background: '#1a6b4a', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'white', letterSpacing: '0.03em' }}>
          📩 Đăng ký nhận ưu đãi độc quyền & cảm hứng thiết kế:
        </span>
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 0 }}>
          <input
            type="email"
            placeholder="Nhập email của bạn..."
            style={{ padding: '10px 18px', border: 'none', fontSize: 13, width: 260, outline: 'none', background: 'white', color: '#333' }}
            id="footer-newsletter-email"
          />
          <button
            type="submit"
            style={{ background: '#0f4530', color: 'white', border: 'none', padding: '10px 22px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: 'background 0.2s' }}
            id="footer-newsletter-submit"
          >
            Đăng Ký
          </button>
        </form>
      </div>

      {/* Main Footer */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
        {/* Brand */}
        <div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 14, display: 'block' }}>
            NỘITHẤT<span style={{ color: '#e8a045' }}>·</span>XANH
          </span>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: '#888', marginBottom: 20, maxWidth: 300 }}>
            Chúng tôi mang đến những giải pháp nội thất tinh tế, nơi thiết kế đương đại gặp gỡ chất liệu tự nhiên bền vững.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {[
              { icon: <Instagram size={18} />, href: '#' },
              { icon: <Facebook size={18} />, href: '#' },
              { icon: <Youtube size={18} />, href: '#' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #3a3a38', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', textDecoration: 'none', transition: 'all 0.2s' }}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
              <Phone size={14} style={{ color: '#1a6b4a', flexShrink: 0 }} />
              <span>Hotline: <strong style={{ color: '#ccc' }}>1800 1234</strong> (Miễn phí)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
              <MapPin size={14} style={{ color: '#1a6b4a', flexShrink: 0 }} />
              <span>123 Nguyễn Văn Linh, TP. HCM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
              <Mail size={14} style={{ color: '#1a6b4a', flexShrink: 0 }} />
              <span>hello@noithatxanh.vn</span>
            </div>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999', marginBottom: 18 }}>Sản Phẩm</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Sofa & Ghế Sofa', 'Bàn & Ghế Ăn', 'Phòng Ngủ', 'Đèn Trang Trí', 'Tủ & Kệ', 'Phụ Kiện Decor'].map(item => (
              <li key={item}>
                <Link to="/catalog" style={{ fontSize: 13, color: '#888', textDecoration: 'none', display: 'block', padding: '5px 0', transition: 'color 0.2s' }}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999', marginBottom: 18 }}>Về Chúng Tôi</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Giới Thiệu', 'Showroom', 'Blog Cảm Hứng', 'Thiết Kế Nội Thất', 'Chính Sách Bảo Hành', 'Tuyển Dụng'].map(item => (
              <li key={item}>
                <a href="#" style={{ fontSize: 13, color: '#888', textDecoration: 'none', display: 'block', padding: '5px 0', transition: 'color 0.2s' }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999', marginBottom: 18 }}>Hỗ Trợ</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Câu Hỏi Thường Gặp', 'Theo Dõi Đơn Hàng', 'Chính Sách Đổi Trả', 'Hướng Dẫn Bảo Quản', 'Liên Hệ Tư Vấn'].map(item => (
              <li key={item}>
                <a href="#" style={{ fontSize: 13, color: '#888', textDecoration: 'none', display: 'block', padding: '5px 0', transition: 'color 0.2s' }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Store locator */}
          <a
            href="#"
            style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid #3a3a38', color: '#ccc', padding: '10px 18px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', transition: 'all 0.2s', borderRadius: 2 }}
          >
            <MapPin size={14} />
            Hệ Thống Showroom
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #2a2a28', padding: '18px 24px', maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 11, color: '#555' }}>
        <p>© 2025 Nội Thất Xanh. Bảo lưu mọi quyền.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Chính Sách Bảo Mật', 'Điều Khoản Sử Dụng', 'Chính Sách Cookie'].map(item => (
            <a key={item} href="#" style={{ color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}>{item}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};
