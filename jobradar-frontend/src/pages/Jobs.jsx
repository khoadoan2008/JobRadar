import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Bộ lọc bên Sidebar
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Hàm gọi API lấy danh sách việc làm
  const fetchJobsList = async (pageNum = 0) => {
    setLoading(true);
    try {
      // Gộp các query parameters
      const params = {
        page: pageNum,
        size: 8,
        location: location || null
      };

      // Xử lý từ khóa: Gộp từ khóa tìm kiếm và các bộ lọc loại hình / nguồn nếu có
      let queryKeyword = keyword || '';
      
      // Nếu có chọn provider, ta thêm vào keyword để backend specification OR tìm kiếm
      if (selectedProviders.length > 0) {
        queryKeyword += (queryKeyword ? ',' : '') + selectedProviders.join(',');
      }
      
      // Nếu có chọn loại hình, ta thêm vào keyword
      if (selectedTypes.length > 0) {
        queryKeyword += (queryKeyword ? ',' : '') + selectedTypes.join(',');
      }

      if (queryKeyword) {
        params.keyword = queryKeyword;
      }

      const response = await api.get('/jobs', { params });
      setJobs(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      setPage(pageNum);
    } catch (err) {
      console.error('Lỗi khi tải danh sách việc làm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsList(0);
  }, [selectedProviders, selectedTypes]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobsList(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchJobsList(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProviderToggle = (provider) => {
    if (selectedProviders.includes(provider)) {
      setSelectedProviders(selectedProviders.filter(p => p !== provider));
    } else {
      setSelectedProviders([...selectedProviders, provider]);
    }
  };

  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
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

  const getProviderBadgeClass = (provider) => {
    switch (provider?.toUpperCase()) {
      case 'ITVIEC':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'TOPCV':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'VIETNAMWORKS':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'VIECLAMTOT':
      case 'CHOTOT':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="bg-background min-h-screen selection:bg-primary/30 text-on-background relative pb-36">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 flex justify-between items-center px-12 z-40 bg-gradient-to-b from-background via-background/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative">
            <span className="material-symbols-outlined text-primary text-xl">radar</span>
            <div className="absolute inset-0 border border-primary/20 rounded-full radar-line"></div>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-white tracking-tighter">JobRadar<span className="text-primary">.</span></span>
        </Link>
        <Link to="/dashboard" className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">dashboard</span> Quay lại Dashboard
        </Link>
      </header>

      {/* Main Container */}
      <main className="pt-32 px-12 max-w-7xl mx-auto">
        
        {/* Search Bar Row */}
        <div className="mb-10">
          <form onSubmit={handleSearchSubmit} className="bg-surface-container-low p-2 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-2 shadow-xl">
            <div className="flex-1 flex items-center px-4 gap-3 bg-slate-950/40 rounded-xl border border-transparent focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-slate-500">search</span>
              <input 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-white py-4 font-semibold outline-none text-sm placeholder-slate-500" 
                placeholder="Kỹ năng, tiêu đề công việc hoặc công ty..." 
                type="text" 
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-3 bg-slate-950/40 rounded-xl border border-transparent focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-slate-500">location_on</span>
              <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-white py-4 font-semibold outline-none text-sm placeholder-slate-500" 
                placeholder="Địa điểm làm việc..." 
                type="text" 
              />
            </div>
            <button type="submit" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-sm">
              Tìm Kiếm
            </button>
          </form>
        </div>

        {/* Content Split Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Nguồn tuyển dụng</h3>
              <div className="space-y-4">
                {['TOPCV', 'VIETNAMWORKS', 'VIECLAMTOT'].map((provider) => (
                  <label key={provider} className="flex items-center gap-3 cursor-pointer text-slate-350 hover:text-white transition-colors group">
                    <input 
                      type="checkbox"
                      checked={selectedProviders.includes(provider)}
                      onChange={() => handleProviderToggle(provider)}
                      className="rounded border-white/10 bg-slate-950 text-primary focus:ring-primary focus:ring-offset-background"
                    />
                    <span className="text-sm font-bold tracking-wide">
                      {provider === 'VIECLAMTOT' ? 'Việc Làm Tốt' : provider}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Loại hình công việc</h3>
              <div className="space-y-4">
                {['Full-time', 'Part-time', 'Internship'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer text-slate-350 hover:text-white transition-colors group">
                    <input 
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="rounded border-white/10 bg-slate-950 text-primary focus:ring-primary focus:ring-offset-background"
                    />
                    <span className="text-sm font-bold tracking-wide">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Jobs Listing Area */}
          <section className="flex-1 space-y-6">
            
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">work</span>
                Danh sách tin tuyển dụng
              </h2>
              <span className="text-xs font-bold text-slate-500">Tìm thấy {totalElements} kết quả</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Đang quét tin tuyển dụng...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 border border-white/5 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">search_off</span>
                <h3 className="text-lg font-bold text-white mb-2">Không tìm thấy công việc nào</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">Vui lòng thay đổi từ khóa hoặc điều kiện bộ lọc để tìm lại nhé.</p>
              </div>
            ) : (
              <>
                {/* Jobs grid list */}
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      onMouseMove={handleMouseMove}
                      className="gradient-border-glow p-6 rounded-3xl transition-all flex flex-col md:flex-row justify-between gap-6"
                    >
                      <div className="flex items-start gap-5">
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
                          <h3 className="text-lg font-bold text-white hover:text-primary transition-colors cursor-pointer">
                            {job.title}
                          </h3>
                          <p className="text-slate-400 text-sm font-semibold mt-1">
                            {job.companyName} • <span className="text-slate-500 font-normal">{job.location}</span>
                          </p>
                          
                          {/* Tags kỹ năng */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills?.split(',').map((skill, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-0.5 rounded bg-white/5 text-slate-450 text-[10px] font-bold border border-white/5"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col justify-between items-end shrink-0 md:text-right gap-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${getProviderBadgeClass(job.provider)}`}>
                          {job.provider}
                        </span>
                        <div>
                          <p className="text-primary font-black text-sm mb-2">{job.salary}</p>
                          <a 
                            href={job.jobUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
                          >
                            Ứng tuyển
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 pt-8">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 0}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-black uppercase tracking-wider text-slate-350 transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Trang trước
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      Trang <span className="text-white font-black">{page + 1}</span> / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages - 1}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-black uppercase tracking-wider text-slate-350 transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Trang sau
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
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

          <Link className="dock-item group relative" to="/dashboard">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-3xl transition-colors">dashboard</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Bảng điều khiển</span>
          </Link>
          
          <a className="dock-item group relative" href="#">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-white/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-3xl transition-colors">edit_note</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">CV Builder</span>
          </a>
          
          <Link className="dock-item group relative" to="/jobs">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40 neon-glow-blue">
              <span className="material-symbols-outlined text-primary text-3xl">work</span>
            </div>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 uppercase tracking-widest">Việc làm</span>
          </Link>
          
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

export default Jobs;
