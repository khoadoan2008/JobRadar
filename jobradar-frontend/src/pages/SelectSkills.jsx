import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const SelectSkills = () => {
  const [activeSkills, setActiveSkills] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Danh mục toàn bộ kỹ năng đa ngành được nhóm theo lĩnh vực
  const allSkillsGrouped = {
    'Văn phòng & Hành chính': ['Tin học văn phòng', 'Hành chính / Nhân sự'],
    'Tài chính & Kế toán': ['Kế toán / Thuế'],
    'Kinh doanh & Dịch vụ': ['Bán hàng & CSKH', 'Kỹ năng giao tiếp'],
    'Marketing & Truyền thông': ['Digital Marketing', 'Content & SEO'],
    'Mỹ thuật & Thiết kế': ['Thiết kế đồ họa / Video', 'Thiết kế kỹ thuật CAD/3D'],
    'Vận tải & Giao nhận': ['Lái xe / Vận tải', 'Giao nhận hàng hóa'],
    'Kỹ thuật & Sản xuất': ['Kỹ thuật cơ khí', 'Kỹ thuật điện/điện tử'],
    'Công nghệ thông tin': ['Công nghệ thông tin'],
    'Ngoại ngữ': ['Tiếng Anh', 'Tiếng Trung', 'Tiếng Nhật']
  };

  // Load kỹ năng hiện tại từ Database
  useEffect(() => {
    const fetchCurrentSkills = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.skills) {
          const userSkills = response.data.skills.split(',').map(s => s.trim());
          if (userSkills.length > 0 && userSkills[0] !== '') {
            setActiveSkills(userSkills);
          }
        }
      } catch (err) {
        setError('Không thể tải thông tin kỹ năng. Vui lòng đăng nhập lại.');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchCurrentSkills();
  }, []);

  const toggleSkill = (skill) => {
    if (activeSkills.includes(skill)) {
      setActiveSkills(activeSkills.filter(s => s !== skill));
    } else {
      setActiveSkills([...activeSkills, skill]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const skillsString = activeSkills.join(', ');
      await api.put('/auth/skills', { skills: skillsString });
      setSuccess('Cập nhật bộ kỹ năng thành công!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Đã xảy ra lỗi khi lưu kỹ năng. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-background min-h-screen selection:bg-primary/30 text-on-background relative pb-20">
      
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
          <span className="material-symbols-outlined text-sm">arrow_back</span> Quay lại Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main className="pt-32 px-12 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-10 border border-white/5 relative overflow-hidden mb-10">
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">LỰA CHỌN KỸ NĂNG CỦA BẠN</h2>
            <p className="text-slate-400 text-sm mb-8">Hệ thống gợi ý việc làm đa ngành JobRadar sẽ tự động hiển thị và cảnh báo các công việc phù hợp nhất dựa trên bộ kỹ năng bạn đã chọn dưới đây.</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span> {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span> {success}
              </div>
            )}

            {profileLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Đang tải cấu hình...</p>
              </div>
            ) : (
              <>
                {/* Danh sách các nhóm kỹ năng */}
                <div className="space-y-8 mb-10">
                  {Object.entries(allSkillsGrouped).map(([groupName, skills]) => (
                    <div key={groupName} className="p-6 bg-slate-900/30 rounded-2xl border border-white/5">
                      <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">{groupName}</h4>
                      <div className="flex flex-wrap gap-3">
                        {skills.map((skill) => {
                          const isActive = activeSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              onClick={() => toggleSkill(skill)}
                              className={`px-4 py-2 rounded-full border text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 ${
                                isActive 
                                  ? 'bg-primary/25 border-primary text-primary neon-glow-blue' 
                                  : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                              }`}
                            >
                              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div className="text-slate-500 text-xs">
                    Đang chọn: <span className="text-primary font-bold">{activeSkills.length}</span> kỹ năng
                  </div>
                  <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 transition-all">
                      Hủy bỏ
                    </Link>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-8 py-3 bg-gradient-to-r from-primary to-tertiary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectSkills;
