import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        setProfile(response.data);
      } catch (err) {
        setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          // api.js interceptor will handle token refresh, 
          // if it still fails it will redirect to login.
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  if (loading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-title">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyItems: 'center', padding: '2rem' }}>
        <div className="error-message" style={{ maxWidth: '400px', marginTop: '2rem' }}>{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ maxWidth: '200px' }}>
          Quay lại Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="app-container dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="auth-title" style={{ fontSize: '2.5rem' }}>Dashboard</h1>
          <p className="auth-subtitle">Trang cá nhân của bạn trên JobRadar</p>
        </div>
        
        <button className="btn" style={{ width: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }} onClick={handleLogout}>
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>

      <div className="dashboard-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon size={40} color="var(--accent-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{profile?.fullName || 'Người dùng'}</h2>
            <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              {profile?.role || 'CANDIDATE'}
            </div>
          </div>
        </div>

        <div className="auth-divider" style={{ margin: '2rem 0' }}></div>

        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Email đăng nhập</span>
            <span className="info-value">{profile?.email || 'N/A'}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Mã tài khoản</span>
            <span className="info-value">#{profile?.id || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
