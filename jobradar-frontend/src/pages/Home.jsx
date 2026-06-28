import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Gọi API lấy danh sách công việc
  const fetchJobs = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const response = await api.get('/jobs', {
        params: {
          keyword: keyword,
          location: location,
          page: pageNumber,
          size: 5
        }
      });
      setJobs(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      setPage(pageNumber);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách công việc:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách công việc mới nhất khi vừa vào trang
  useEffect(() => {
    fetchJobs(0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchJobs(newPage);
      // Cuộn mượt lên phần kết quả tìm kiếm
      const element = document.getElementById('job-results');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Hàm trả về màu sắc tag nguồn tuyển dụng
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

  return (
    <div className="text-on-surface bg-background min-h-screen relative pb-36">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-20 flex justify-between items-center px-12 z-40 bg-gradient-to-b from-background via-background/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative">
            <span className="material-symbols-outlined text-primary text-xl">radar</span>
            <div className="absolute inset-0 border border-primary/20 rounded-full radar-line"></div>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-white tracking-tighter">JobRadar<span className="text-primary">.</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="radar-pulse-home absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hệ thống Online</span>
          </div>
          {isLoggedIn ? (
            <Link to="/dashboard" className="w-9 h-9 rounded-full overflow-hidden border border-primary/40 hover:scale-105 transition-transform" title="Bảng điều khiển">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeklPVna6Q3WQoffTIcvcMpxYvj9iydN16IDA9G1wIWDsrBzeCWdgNpQqqArNbdzg7hL3Xie9bEB7PubZuv8uCDG5wCi_P9SSp1FUo0C0Lek3skcTfMdTqYgIzojsZ2QsHBSjMTKHR0FxNHPEW_NhcKXTsvdpktZa6CtQxUjetV0-0GfBfqIRYJ0c8oTCz3Bh-Y7ww-sX-ApxJ_Hj3w-VktyA0oBQCuxXGq-seoGO_Ycsbm-SRwCePk-S3VkhWRDPqUTBBXznG71s" 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </Link>
          ) : (
            <Link to="/login" className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:brightness-110 active:scale-95 transition-all">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <header className="relative pt-36 pb-16 overflow-hidden">
        {/* Background Animations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary-container/10 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="radar-pulse-home absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">Hệ thống cập nhật real-time 60s/lần</span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight max-w-4xl mx-auto">
            Radar Quét Việc Làm Đa Ngành <br/> <span className="text-primary-fixed-dim">Mọi Cơ Hội Trong Tầm Tay</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
            Hệ thống tự động tổng hợp việc làm từ TopCV, ITviec, VietnamWorks, Chợ Tốt. Dữ liệu real-time, cập nhật mỗi phút.
          </p>
          
          {/* Search Bar Component */}
          <form onSubmit={handleSearch} className="bg-surface-container-low p-2 rounded-2xl border border-outline-variant max-w-4xl mx-auto flex flex-col md:flex-row gap-2 shadow-xl">
            <div className="flex-1 flex items-center px-4 gap-3 bg-surface-container-lowest rounded-xl border border-transparent focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-outline">search</span>
              <input 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 font-body-md text-body-md outline-none" 
                placeholder="Kỹ năng hoặc từ khóa: Bán hàng, Java, Kế toán..." 
                type="text" 
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-3 bg-surface-container-lowest rounded-xl border border-transparent focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 font-body-md text-body-md outline-none" 
                placeholder="Địa điểm: Hà Nội, Hồ Chí Minh..." 
                type="text" 
              />
            </div>
            <button type="submit" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all">
              Tìm Việc Ngay
            </button>
          </form>
        </div>
      </header>

      {/* Trusted Sources */}
      <section className="py-12 border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <p className="text-center font-label-sm text-label-sm uppercase tracking-widest text-outline mb-10">Nguồn dữ liệu uy tín từ các nền tảng hàng đầu</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="h-8 w-32 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDda8-P4_lNWvLfZsFFdosmBTEthI_fhBg0g-jLohAZ8EUINhc37EM0Fwp9a6i8TtzAwLza1y_woyr3kv9-0VAfmKKeoVMadSL7tnYwJiax4aR3J08YlSAdyTEOGJIR6Gxj0ntBmfi1rwI1HFSdgU7LGQvhHURRkToZjjSQh1YW4x_HN9Ps9n1PSRfge10_o1ikhoFvXeLm2RSj4hfGvSdPQAxXwSuym57-mnM6irO3Vz0jnN8qyeGi9815zJePQSvx8WDQBMNHYRc')" }}></div>
            <div className="h-8 w-32 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsAFuR-RQ4AxWvZ_2W4FnrULb9pQ3-jrx0edl9X8lcLCvWMTRrLbZQVZBaBQxkJ3F603q5MC-vKAuTDOQZslnRpJIAu55M1dZgN84-TYRKlkK6LJ6VN8x5XGMs_rg2Qfyt83wH_a86dbB6sjOu0az8WGHRfN66YbppWxT3V8hdZQd9jaPA9hjdMV1W7yThy7J2e0aRjDfByLgTT4SW3aVkQYKLLz20kI5kWyCxdQaNDCBjDEvrdYSjtwrOS8CJtVFtIWkSoOo2edw')" }}></div>
            <div className="h-8 w-32 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA48FwO0Q0UmsIfonydKiJacBdXCvF_FMo_c92LPOxLxBEJdlGvhtCeRjDFKB7IfpbwatZE1MdPM-44AChS-NEWJHUL4S4zP26UPjAUhS55UfgD8y0ncFsObPOSry1beyQVsDEeFZlVLCfsYib1wmRP84JMqLqL-72l6i2e74B5YsZDZRXtZnb2P1uw6EWGelq7yoTISx61h5g3WUuhrtFTH_ZA27OAWltMRfcLATSPgVTGzOzdEwTSEllIRVPRbhRzmC7KUFcVKF4')" }}></div>
            <div className="h-8 w-32 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjUN_7IDXKPegixQUDyYwQ2063YtjPWnT1_pJ-3X6efX7TshUng86otIJkRbmm6Hl4_Kzwoe4l6rxXk_HPo739yG3hhVlnQiJBZSk5wccNyXAe1AytARK7F7EtyULEBbR_GxWoiiZva-eE8jy1UiwyqBPjG-eQ_YoSphd1iJg7_z6hHKqRluNc60VzanTZ8znTmE9ghsi_2Hs1oDl1Rzov4ueA7edfajt6CXqNj6_GIbn0LO36XvNDbcon4-ImXoK0Y5WFgrOGR9I')" }}></div>
          </div>
        </div>
      </section>

      {/* Job Results Section */}
      <section id="job-results" className="py-20 scroll-mt-20">
        <div className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">travel_explore</span>
                {keyword || location ? 'Kết quả tìm kiếm' : 'Công việc mới nhất'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">Tìm thấy {totalElements} cơ hội việc làm phù hợp</p>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm animate-pulse">Đang dò quét tín hiệu việc làm...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 border border-white/5 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">search_off</span>
              <h3 className="text-lg font-bold text-white mb-2">Không tìm thấy công việc phù hợp</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">Hãy thử thay đổi từ khóa kỹ năng hoặc địa điểm để tìm kiếm lại nhé.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  onMouseMove={handleMouseMove}
                  className="gradient-border-glow p-6 rounded-3xl transition-all flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="flex items-start gap-5">
                    {/* Logo công ty */}
                    <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border border-white/10 shrink-0 flex items-center justify-center p-2">
                      <img 
                        src={job.companyLogo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Z3m5S_aY3tN7b4a2C1R9H9P-yM8P2A6o8Q&s"} 
                        alt={job.companyName}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Z3m5S_aY3tN7b4a2C1R9H9P-yM8P2A6o8Q&s";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white hover:text-primary transition-colors cursor-pointer">
                        {job.title}
                      </h3>
                      <p className="text-slate-400 text-sm font-semibold mt-1">
                        {job.companyName} • <span className="text-slate-500 font-normal">{job.location}</span>
                      </p>
                      
                      {/* Tags kỹ năng */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.skills?.split(',').map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 text-[11px] font-bold border border-white/5"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cột thông tin mức lương & nút ứng tuyển */}
                  <div className="flex md:flex-col justify-between items-end gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 shrink-0">
                    <div className="text-left md:text-right">
                      <p className="text-primary font-black text-lg">{job.salary}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase mt-1 ${getProviderBadgeClass(job.provider)}`}>
                        {job.provider}
                      </span>
                    </div>
                    
                    <a 
                      href={job.jobUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10"
                    >
                      Ứng Tuyển
                    </a>
                  </div>
                </div>
              ))}

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8">
                  <button 
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <span className="material-symbols-outlined text-sm block">chevron_left</span>
                  </button>
                  <span className="text-slate-400 text-sm font-semibold">
                    Trang {page + 1} / {totalPages}
                  </span>
                  <button 
                    disabled={page === totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <span className="material-symbols-outlined text-sm block">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-container-lowest/30 border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md md:text-display-lg-mobile text-on-surface mb-4">Tại sao chọn JobRadar?</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">Công nghệ radar tiên tiến giúp bạn dẫn đầu thị trường tuyển dụng IT cạnh tranh.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Feature 1 */}
            <div onMouseMove={handleMouseMove} className="gradient-border-glow p-8 rounded-2xl flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">manage_search</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm mb-3">Tổng Hợp Đa Nguồn</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Không cần mở nhiều tab. Tất cả job từ các trang lớn đều hội tụ tại đây.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div onMouseMove={handleMouseMove} className="gradient-border-glow p-8 rounded-2xl flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">person_search</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm mb-3">Đánh Giá Ẩn Danh</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Đọc review công ty chân thực từ người đi trước, né ngay các công ty red flag.</p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div onMouseMove={handleMouseMove} className="gradient-border-glow p-8 rounded-2xl flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">notifications_active</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm mb-3">Cảnh Báo Phù Hợp</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Không cần tự tìm, hệ thống sẽ gửi mail ngay khi có job match với CV của bạn.</p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div onMouseMove={handleMouseMove} className="gradient-border-glow p-8 rounded-2xl flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">description</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm mb-3">AI Resume Parsing</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Tự động đọc file PDF để phân tích kỹ năng và gợi ý việc làm phù hợp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-md text-headline-md md:text-display-lg-mobile text-on-surface mb-16 text-center">Bắt đầu chỉ trong 3 bước</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-primary/30 flex items-center justify-center mb-8 shadow-2xl">
                <span className="material-symbols-outlined text-4xl text-primary">person_add</span>
              </div>
              <div className="px-4">
                <h4 className="font-headline-sm text-headline-sm mb-4">Tạo Tài Khoản & Cấu Hình Radar</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">Tạo tài khoản miễn phí, nhập từ khóa tìm việc bạn quan tâm.</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-primary/30 flex items-center justify-center mb-8 shadow-2xl">
                <span className="material-symbols-outlined text-4xl text-primary">mail</span>
              </div>
              <div className="px-4">
                <h4 className="font-headline-sm text-headline-sm mb-4">Nghỉ Ngơi & Đợi Email</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">Hệ thống tự động quét job mới phút, gửi thông báo khi có job phù hợp.</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-primary flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
                <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
              </div>
              <div className="px-4">
                <h4 className="font-headline-sm text-headline-sm mb-4">Xem Review & Ứng Tuyển</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">Đọc đánh giá công ty từ cộng đồng, sau đó bấm ứng tuyển ngay lập tức.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/20 pt-20 pb-10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="font-headline-md text-headline-md font-bold text-on-surface mb-6 block">JobRadar</span>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-8">
                Tìm việc làm IT thông minh - Tổng hợp, cảnh báo, đánh giá. Nền tảng hỗ trợ ứng viên IT hàng đầu Việt Nam.
              </p>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all" href="#">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all" href="#">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="font-label-md text-label-md text-on-surface mb-6">Sản phẩm</h5>
              <ul className="flex flex-col gap-4">
                <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Về chúng tôi</a></li>
                <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Tuyển dụng</a></li>
                <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Dữ liệu thị trường</a></li>
                <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-label-md text-label-md text-on-surface mb-6">Pháp lý</h5>
              <ul className="flex flex-col gap-4">
                <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Liên hệ</a></li>
                <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Điều khoản sử dụng</a></li>
                <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Chính sách bảo mật</a></li>
                <li><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body-sm text-body-sm text-on-surface-variant/60">
              © 2026 JobRadar. All rights reserved. Precision matching for IT professionals.
            </p>
            <div className="flex gap-6">
              <span className="font-body-sm text-body-sm text-on-surface-variant/60">Tiếng Việt (VN)</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant/60">System Status: <span className="text-green-500">Online</span></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Navigation Dock kiểu macOS */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <nav className="floating-dock px-6 py-4 rounded-3xl flex items-center gap-6">
          <a className="dock-item group relative" href="#job-results">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors">travel_explore</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Tìm việc</span>
          </a>
          
          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors">domain</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Công ty</span>
          </a>
          
          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors">reviews</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Đánh giá</span>
          </a>
          
          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors">payments</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Mức lương</span>
          </a>

          {/* Divider ngăn cách menu chính và phần tài khoản */}
          <div className="w-px h-10 bg-white/10"></div>

          {isLoggedIn ? (
            <Link className="dock-item group relative" to="/dashboard">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40 neon-glow-blue">
                <span className="material-symbols-outlined text-primary text-3xl">dashboard</span>
              </div>
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Bảng điều khiển</span>
            </Link>
          ) : (
            <>
              <Link className="dock-item group relative" to="/login">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors">login</span>
                </div>
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Đăng nhập</span>
              </Link>
              
              <Link className="dock-item group relative" to="/register">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/30 transition-all">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors">person_add</span>
                </div>
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Đăng ký</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Home;
