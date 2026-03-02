import { useState, type FormEvent, useEffect } from 'react';
import {
  Sun,
  User,
  ShoppingBag,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSearchParams, Link } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States for form data
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);

    if (!tokenParam || !emailParam) {
      setError('Thiếu thông tin xác thực. Vui lòng kiểm tra lại link trong email.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== passwordConfirmation) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://tttn-1.onrender.com/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: token,
          password: password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors or token errors
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          setError(Array.isArray(firstError) ? firstError[0] : (typeof firstError === 'string' ? firstError : 'Đã có lỗi xảy ra.'));
        } else {
          setError(data.message || 'Đã có lỗi xảy ra.');
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sun className="text-primary w-6 h-6" />
            <h1 className="font-display font-bold text-xl tracking-tight">MINIMALIST FASHION</h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/catalog" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
            <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">Collection</Link>
            <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">Journal</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
            <Link to="/cart" className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-slate-100"
          >
            {success ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <h2 className="font-display text-2xl font-bold mb-3 text-slate-900">Mật khẩu đã được cập nhật!</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
                </p>
                <Link
                  to="/account"
                  className="inline-flex w-full justify-center bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Đến trang Đăng Nhập
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="font-display text-3xl font-bold mb-3 text-slate-900">Đặt lại mật khẩu</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Vui lòng nhập mật khẩu mới để bảo mật tài khoản của bạn.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">
                      Địa chỉ Email
                    </label>
                    <input
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed focus:ring-0 focus:border-slate-200 transition-all outline-none"
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="new_password">
                      Mật khẩu mới
                    </label>
                    <div className="relative group">
                      <input
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                        id="new_password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="confirm_password">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative group">
                      <input
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || !!error && !token}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Đang cập nhật...
                        </>
                      ) : 'Cập nhật mật khẩu'}
                    </button>
                  </div>

                  <div className="text-center">
                    <Link to="/account" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors group">
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      Quay lại Đăng nhập
                    </Link>
                  </div>
                </form>
              </>
            )}
          </motion.div>

          <footer className="mt-12 text-center text-slate-400 text-xs">
            <p>© {new Date().getFullYear()} Minimalist Fashion Inc. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
