import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSkills, setActiveSkills] = useState(['Java', 'ReactJS', 'Microservices']);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const navigate = useNavigate();

  const skillsList = ['Java', 'ReactJS', 'Spring Boot', 'Python', 'RabbitMQ', 'Microservices'];

  // Lấy thông tin cá nhân của User khi đăng nhập
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        setProfile(response.data);
        // Nếu user có kỹ năng lưu trong DB, cập nhật activeSkills từ profile (phân tách bằng dấu phẩy)
        if (response.data.skills) {
          const userSkills = response.data.skills.split(',').map(s => s.trim());
          if (userSkills.length > 0 && userSkills[0] !== '') {
            setActiveSkills(userSkills);
          }
        }
      } catch (err) {
        setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
      } finally {
        // Mô phỏng loading overlay tối thiểu 1 giây để tạo cảm giác mượt mà
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchProfile();
  }, []);

  // Gọi API lấy danh sách job phù hợp dựa trên activeSkills
  useEffect(() => {
    const fetchMatchedJobs = async () => {
      setJobsLoading(true);
      try {
        // Tạo keyword tìm kiếm bằng cách gộp các active skills
        const keyword = activeSkills.join(' ');
        const response = await api.get('/jobs', {
          params: {
            keyword: keyword || null, // Nếu rỗng thì lấy job mới nhất
            page: 0,
            size: 5
          }
        });
        setJobs(response.data.content || []);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách job phù hợp:', err);
      } finally {
        setJobsLoading(false);
      }
    };

    // Chỉ gọi API khi luồng tải profile đã hoàn thành
    if (!loading) {
      fetchMatchedJobs();
    }
  }, [activeSkills, loading]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const toggleSkill = (skill) => {
    if (activeSkills.includes(skill)) {
      setActiveSkills(activeSkills.filter(s => s !== skill));
    } else {
      setActiveSkills([...activeSkills, skill]);
    }
  };

  const getProviderBadgeClass = (provider) => {
    switch (provider?.toUpperCase()) {
      case 'ITVIEC':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'TOPCV':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'VIETNAMWORKS':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="glass-card rounded-3xl p-8 border border-white/5 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button 
            className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
            onClick={() => navigate('/login')}
          >
            Quay lại Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen selection:bg-primary/30 text-on-background relative pb-32">
      {/* Loading Overlay */}
      <div className={`fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-32 h-32 relative mb-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">radar</span>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-black text-white mb-3 tracking-[0.3em] uppercase">Initializing...</h3>
          <p className="text-primary font-bold text-sm uppercase tracking-widest animate-pulse">Syncing AI Database</p>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 flex justify-between items-center px-12 z-40 bg-gradient-to-b from-background via-background/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative">
            <span className="material-symbols-outlined text-primary text-xl">radar</span>
            <div className="absolute inset-0 border border-primary/20 rounded-full radar-line"></div>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-white tracking-tighter">JobRadar<span className="text-primary">.</span></span>
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-lg group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-2.5 text-sm text-on-background focus:ring-2 focus:ring-primary/40 focus:border-primary/40 w-64 transition-all outline-none" 
              placeholder="Tìm kiếm hệ thống..." 
              type="text" 
            />
          </div>
          
          <button className="relative text-slate-400 hover:text-primary transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full"></span>
          </button>
 
          {/* Nút Đăng xuất */}
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 transition-all flex items-center justify-center gap-2 group" 
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined group-hover:scale-105 transition-transform">logout</span>
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="pt-32 px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-10 gap-10">
          
          {/* Left Column (30%) */}
          <div className="col-span-3 space-y-10">
            {/* Profile Card */}
            <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary/30 rotate-3 group-hover:rotate-0 transition-transform duration-500 ring-4 ring-primary/10">
                    <img 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover" 
                      src={profile?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAeklPVna6Q3WQoffTIcvcMpxYvj9iydN16IDA9G1wIWDsrBzeCWdgNpQqqArNbdzg7hL3Xie9bEB7PubZuv8uCDG5wCi_P9SSp1FUo0C0Lek3skcTfMdTqYgIzojsZ2QsHBSjMTKHR0FxNHPEW_NhcKXTsvdpktZa6CtQxUjetV0-0GfBfqIRYJ0c8oTCz3Bh-Y7ww-sX-ApxJ_Hj3w-VktyA0oBQCuxXGq-seoGO_Ycsbm-SRwCePk-S3VkhWRDPqUTBBXznG71s"}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-xl border-4 border-background">
                    <span className="material-symbols-outlined text-xs">verified</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-extrabold text-white">{profile?.fullName || 'Người dùng'}</h2>
                <p className="text-primary text-xs font-semibold tracking-wider uppercase mt-1">
                  {profile?.roles?.replace('ROLE_', '') || 'CANDIDATE'} Premium
                </p>
                
                <div className="mt-6 w-full grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Lượt xem</p>
                    <p className="text-lg font-bold text-white">15</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Thứ hạng</p>
                    <p className="text-lg font-bold text-white">Top 5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Timeline Application Tracker */}
            <div className="glass-card rounded-3xl p-8 border border-white/5">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Trạng thái hồ sơ</h3>
              <div className="relative pl-8">
                {/* Timeline Line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10 opacity-20"></div>
                <div className="space-y-12">
                  {/* Step 1: Submitted */}
                  <div className="relative">
                    <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] z-10"></div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Java Backend Engineer</h4>
                      <p className="text-slate-500 text-xs mt-0.5">VNG Corporation</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">ĐÃ NỘP • 2 NGÀY TRƯỚC</span>
                    </div>
                  </div>
                  
                  {/* Step 2: Interview */}
                  <div className="relative">
                    <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(0,82,255,0.6)] z-10"></div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Technical Interview</h4>
                      <p className="text-slate-500 text-xs mt-0.5">FPT Software</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">PHỎNG VẤN • THỨ 3, 14:00</span>
                    </div>
                  </div>
                  
                  {/* Step 3: Offer */}
                  <div className="relative opacity-40">
                    <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] z-10"></div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Nhận Offer</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Hệ thống đang cập nhật</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (70%) */}
          <div className="col-span-7 space-y-10">
            {/* Welcome Header */}
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-white">Xin chào {profile?.fullName || 'Bạn'}! 👋</h2>
                <p className="text-slate-500 mt-2 text-lg">
                  {jobsLoading ? 'AI đang dò tìm...' : `Hệ thống AI đã tìm thấy ${jobs.length} cơ hội mới phù hợp với bạn.`}
                </p>
              </div>
            </div>

            {/* Onboarding Alert */}
            {(!profile?.phone || !profile?.skills) && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                    <span className="material-symbols-outlined text-2xl">warning</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-base">Hồ sơ của bạn chưa hoàn thiện!</h4>
                    <p className="text-slate-400 text-sm mt-1">
                      {(!profile?.phone && !profile?.skills) 
                        ? "Vui lòng cập nhật Số điện thoại và Kỹ năng của bạn để hệ thống AI của JobRadar có thể gợi ý việc làm và gửi email cảnh báo chính xác nhất."
                        : !profile?.phone 
                          ? "Vui lòng cập nhật Số điện thoại để nhà tuyển dụng có thể liên hệ trực tiếp với bạn."
                          : "Vui lòng thêm các Kỹ năng chính của bạn để AI tiến hành phân tích độ tương thích việc làm."}
                    </p>
                  </div>
                  <button className="px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all shrink-0">
                    Cập nhật ngay
                  </button>
                </div>
              </div>
            )}

            {/* Smart Match Jobs Carousel */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  Gợi ý AI Match theo Kỹ năng
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-white/5 bg-white/5 text-white hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-2 rounded-full border border-white/5 bg-white/5 text-white hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Jobs dynamic display */}
              {jobsLoading ? (
                <div className="flex gap-6 overflow-x-auto pb-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex-shrink-0 w-[400px] bg-white/5 border border-white/5 p-6 rounded-3xl animate-pulse flex flex-col justify-between h-[230px]">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="w-14 h-14 rounded-2xl bg-white/10"></div>
                          <div className="w-16 h-5 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                        <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-6 w-24 bg-white/10 rounded"></div>
                        <div className="h-8 w-24 bg-white/10 rounded-xl"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="glass-card rounded-3xl p-8 border border-white/5 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">search_off</span>
                  <h4 className="text-white font-bold mb-1">Không tìm thấy job match</h4>
                  <p className="text-slate-400 text-xs">Hãy bật/tắt hoặc thêm kỹ năng ở góc dưới để AI cập nhật danh sách việc làm phù hợp cho bạn.</p>
                </div>
              ) : (
                <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex-shrink-0 w-[400px] snap-start gradient-border-glow p-6 rounded-3xl flex flex-col justify-between bg-surface-container-low border border-white/5">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden border border-white/10 shrink-0 flex items-center justify-center p-1.5">
                            <img 
                              src={job.companyLogo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Z3m5S_aY3tN7b4a2C1R9H9P-yM8P2A6o8Q&s"} 
                              alt={job.companyName}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Z3m5S_aY3tN7b4a2C1R9H9P-yM8P2A6o8Q&s";
                              }}
                            />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getProviderBadgeClass(job.provider)}`}>
                            {job.provider}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1 truncate" title={job.title}>{job.title}</h4>
                        <p className="text-slate-400 text-sm mb-4 truncate">{job.companyName} • {job.location}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {job.skills?.split(',').slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 rounded-lg bg-white/5 text-slate-400 text-[10px] font-bold">{skill.trim()}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-primary font-black">{job.salary}</p>
                        <a 
                          href={job.jobUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
                        >
                          Ứng tuyển
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="grid grid-cols-2 gap-10">
              {/* Skill Alert Matrix */}
              <div className="glass-card rounded-3xl p-8 border border-white/5">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Skill Radar Cloud</h3>
                <div className="flex flex-wrap gap-4">
                  {skillsList.map((skill) => {
                    const isActive = activeSkills.includes(skill);
                    return (
                      <button 
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`skill-bubble px-4 py-2 rounded-full border border-white/10 text-sm font-semibold flex items-center gap-2 transition-all ${
                          isActive ? 'active' : 'text-slate-400 hover:border-white/20'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>} 
                        {skill}
                      </button>
                    );
                  })}
                  <button className="px-4 py-2 rounded-full border border-dashed border-white/20 text-slate-500 text-sm font-bold hover:text-white hover:border-white/40 transition-all">+ Thêm</button>
                </div>
              </div>

              {/* Mini CV Editor */}
              <div className="glass-card rounded-3xl p-8 border border-white/5 group">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Hồ sơ hiện tại</h3>
                  <span className="material-symbols-outlined text-slate-500 text-lg group-hover:text-primary transition-colors cursor-pointer">edit</span>
                </div>
                
                <div className="w-full h-32 bg-slate-900/50 rounded-2xl border border-white/5 p-4 mb-6 relative overflow-hidden">
                  <div className="space-y-2 opacity-30">
                    <div className="h-2 w-3/4 bg-white rounded-full"></div>
                    <div className="h-2 w-1/2 bg-white/50 rounded-full"></div>
                    <div className="h-2 w-2/3 bg-white/50 rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Xem trước CV</p>
                  </div>
                </div>
                
                <button className="w-full py-4 bg-gradient-to-r from-primary to-tertiary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                  Xuất file PDF
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      {/* Floating Navigation Dock */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <nav className="floating-dock px-6 py-4 rounded-3xl flex items-center gap-6">
          <Link className="dock-item group relative" to="/">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-3xl transition-colors">home</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Trang chủ</span>
          </Link>

          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40 neon-glow-blue">
              <span className="material-symbols-outlined text-primary text-3xl">dashboard</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Bảng điều khiển</span>
          </a>
          
          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-3xl transition-colors">edit_note</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">CV Builder</span>
          </a>
          
          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-3xl transition-colors">rocket_launch</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Ứng tuyển</span>
          </a>
          
          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-3xl transition-colors">campaign</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Cảnh báo</span>
          </a>
          
          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-3xl transition-colors">domain</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Đánh giá</span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
