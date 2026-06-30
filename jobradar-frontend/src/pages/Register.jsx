import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    
    if (!agreed) {
      setError('Bạn phải đồng ý với Điều khoản dịch vụ.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', { 
        fullName, 
        email, 
        password 
      });
      
      const { token, refreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorize/${provider}`;
  };

  return (
    <div className="mesh-bg text-on-surface font-body-md min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30">
      <main className="flex-grow flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto">
        
        {/* Left Side: Editorial Content */}
        <div className="hidden lg:flex lg:w-[50%] relative items-center justify-center p-margin-desktop overflow-hidden">
          <div className="relative z-10 w-full max-w-2xl">
            <div className="mb-12">
              <img alt="JobRadar Logo" className="h-12 w-auto mb-10 filter brightness-0 invert" src="https://lh3.googleusercontent.com/aida/AP1WRLtVnSdAdOoLFNOlLGwmyJZD--eaM5f-LwKHIA_4NuZ4nZ6j_Qc70QGdIGsJf4qwUvBNt_fh1UEUVkE67U2iB-awKuwyXmVZqIsn6Z1OmPo9FzGhP_29btSalhpMNhxrwnHcvUq7WVI1kBglzgY-Tb0Zs_zYuh7OZVc_3zv_JviLhZ1brFXAZunIta4K3UVgSDS2eJAZcYhI39fNA3K0rIsZhVWTM9ECyo5qYvplw1UIpGzbUV_--qYZzg" />
              <h1 className="font-display-lg text-display-lg text-white mb-6 leading-[1.1]">
                Mở khóa tương lai <br /><span className="text-primary">nghề nghiệp của bạn.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed opacity-80">
                Tham gia cùng hàng nghìn chuyên gia đang sử dụng công nghệ Radar để quét và tìm kiếm những cơ hội việc làm chính xác nhất.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 max-w-lg">
              <div className="glass-card p-6 rounded-2xl flex items-center space-x-5 transform hover:-translate-y-1 transition-all duration-500">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 animate-radar shadow-[0_0_15px_rgba(0,82,255,0.2)]">
                  <span className="material-symbols-outlined !text-3xl">radar</span>
                </div>
                <div>
                  <p className="font-label-md text-white">Đang quét 12,400+ việc làm</p>
                  <p className="text-sm text-on-surface-variant">Cập nhật 2 phút trước</p>
                </div>
                <div className="ml-auto">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-[50%] flex items-center justify-center p-margin-mobile md:p-margin-desktop relative">
          
          <div className="absolute top-10 left-margin-mobile lg:hidden flex items-center gap-3">
            <img alt="JobRadar Logo" className="h-8 w-auto filter brightness-0 invert" src="https://lh3.googleusercontent.com/aida/AP1WRLtVnSdAdOoLFNOlLGwmyJZD--eaM5f-LwKHIA_4NuZ4nZ6j_Qc70QGdIGsJf4qwUvBNt_fh1UEUVkE67U2iB-awKuwyXmVZqIsn6Z1OmPo9FzGhP_29btSalhpMNhxrwnHcvUq7WVI1kBglzgY-Tb0Zs_zYuh7OZVc_3zv_JviLhZ1brFXAZunIta4K3UVgSDS2eJAZcYhI39fNA3K0rIsZhVWTM9ECyo5qYvplw1UIpGzbUV_--qYZzg" />
            <span className="font-headline-sm text-white font-bold tracking-tighter">JobRadar</span>
          </div>

          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="absolute top-10 right-6 md:right-10 flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-sm cursor-pointer z-20"
          >
            <span className="material-symbols-outlined !text-[18px]">arrow_back</span>
            <span>Trang chủ</span>
          </Link>
          
          <div className="w-full max-w-[480px] z-10">
            <div className="glass-card p-8 md:p-12 rounded-3xl">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="font-headline-md text-white mb-2">Tạo tài khoản mới</h2>
                <p className="font-body-md text-on-surface-variant opacity-70">Bắt đầu hành trình tìm kiếm sự nghiệp mơ ước ngay hôm nay.</p>
              </div>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-error-container/20 text-error rounded-xl border border-error/30 backdrop-blur-sm mb-6">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    <span className="text-sm font-semibold">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface/80 ml-1" htmlFor="fullName">Họ và tên</label>
                  <div className="relative group input-glow rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <input 
                      className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-xl bg-white/[0.03] text-white focus:bg-white/[0.05] focus:outline-none focus:border-primary/50 transition-all duration-300 placeholder:text-outline/40 text-sm" 
                      id="fullName" 
                      placeholder="Nguyễn Văn A" 
                      required 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface/80 ml-1" htmlFor="email">Địa chỉ Email</label>
                  <div className="relative group input-glow rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <input 
                      className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-xl bg-white/[0.03] text-white focus:bg-white/[0.05] focus:outline-none focus:border-primary/50 transition-all duration-300 placeholder:text-outline/40 text-sm" 
                      id="email" 
                      placeholder="email@example.com" 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface/80 ml-1" htmlFor="password">Mật khẩu</label>
                  <div className="relative group input-glow rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <input 
                      className="block w-full pl-12 pr-12 py-3.5 border border-white/5 rounded-xl bg-white/[0.03] text-white focus:bg-white/[0.05] focus:outline-none focus:border-primary/50 transition-all duration-300 placeholder:text-outline/40 text-sm" 
                      id="password" 
                      placeholder="••••••••" 
                      required 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-white transition-colors" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-on-surface-variant opacity-50 ml-1">Ít nhất 8 ký tự, 1 chữ hoa, 1 số</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface/80 ml-1" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <div className="relative group input-glow rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined">lock_reset</span>
                    </div>
                    <input 
                      className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-xl bg-white/[0.03] text-white focus:bg-white/[0.05] focus:outline-none focus:border-primary/50 transition-all duration-300 placeholder:text-outline/40 text-sm" 
                      id="confirmPassword" 
                      placeholder="••••••••" 
                      required 
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center px-1">
                  <input 
                    className="h-4 w-4 text-primary bg-white/5 border-white/10 rounded focus:ring-primary focus:ring-offset-surface transition-all cursor-pointer" 
                    id="terms" 
                    required 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label className="ml-2.5 block text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
                    Tôi đồng ý với <a className="text-primary hover:underline font-semibold" href="#">Điều khoản dịch vụ</a>
                  </label>
                </div>
                
                <button 
                  className="w-full btn-premium text-white py-4 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group active:scale-[0.99] mt-2 disabled:opacity-80 disabled:cursor-not-allowed border-none cursor-pointer" 
                  type="submit"
                  disabled={loading}
                >
                  {!loading ? (
                    <span>Đăng ký tài khoản</span>
                  ) : (
                    <div>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                      </svg>
                    </div>
                  )}
                </button>
              </form>
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest text-outline">
                  <span className="bg-[#0f172a] px-4 font-medium">Hoặc đăng ký bằng</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center py-3 px-4 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 active:scale-[0.98] bg-transparent cursor-pointer"
                >
                  <img alt="Google" className="w-5 h-5 mr-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6S6donFrNCoBt-YzkeMnG7gylfx3vHAuH3p7T_azB2AL3kfvmSsO2Z6GWQc7csgwOYo1yzylAdlg8L8scJ_ebX7yuU77Cs0udpy6T07Txk_I-7zyKomH3omQcEMyLpcCQiZICTjvn_XyG3aYiIho-K7__0ApCCz86yOmf-F00fiW_Cz7yeMjkCbSjsLzgtPvmL2OwUgfRwJ42QHtHwoCCIWW5UcmaXMqIFCSyHsnzT8TfijX1jQzQwly_S9cdsTokxgJnD5uzOY8" />
                  Google
                </button>
                <button 
                  onClick={() => handleSocialLogin('github')}
                  className="flex items-center justify-center py-3 px-4 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 active:scale-[0.98] bg-transparent cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                  GitHub
                </button>
              </div>
              
              <p className="mt-8 text-center text-sm text-on-surface-variant">
                Đã có tài khoản? 
                <Link className="text-primary font-bold hover:underline transition-all ml-1" to="/login">Đăng nhập</Link>
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-10 w-full px-margin-mobile flex justify-center lg:justify-start gap-8 opacity-40">
            <a className="text-xs font-medium hover:text-white transition-colors" href="#">Quyền riêng tư</a>
            <a className="text-xs font-medium hover:text-white transition-colors" href="#">Điều khoản</a>
            <a className="text-xs font-medium hover:text-white transition-colors" href="#">Hỗ trợ</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
