import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2Redirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (token) {
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { error: error || 'Đăng nhập bằng bên thứ 3 thất bại' } });
    }
  }, [searchParams, navigate]);

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-title">Đang xác thực...</div>
      <p className="auth-subtitle">Vui lòng chờ trong giây lát.</p>
    </div>
  );
};

export default OAuth2Redirect;
