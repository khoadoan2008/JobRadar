import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const radarFragmentShader = `
precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = (v_texCoord - 0.5) * 2.0;
    float dist = length(uv);
    
    // Radar sweep
    float angle = atan(uv.y, uv.x);
    float sweep = mod(angle - u_time * 2.5, 6.28318) / 6.28318;
    sweep = pow(sweep, 4.0);
    
    // Rings
    float rings = smoothstep(0.02, 0.0, abs(dist - 0.2)) + 
                  smoothstep(0.02, 0.0, abs(dist - 0.5)) + 
                  smoothstep(0.02, 0.0, abs(dist - 0.8));
    
    vec3 color = vec3(0.0, 0.32, 1.0); // Brand Blue
    float alpha = (sweep * 0.7 + rings * 0.4) * smoothstep(1.0, 0.9, dist);
    
    gl_FragColor = vec4(color * alpha, alpha);
}
`;

const vertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
}
`;

const OAuth2Redirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'error'
  const radarCanvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const [progressWidth, setProgressWidth] = useState('0%');
  
  useEffect(() => {
    // Start progress animation
    setTimeout(() => setProgressWidth('85%'), 100);

    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    // Simulate loading for UI
    const timer = setTimeout(() => {
      if (token) {
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        navigate('/dashboard');
      } else {
        setStatus('error');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.4;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = `rgba(183, 196, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 70; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas || status !== 'loading') return;
    
    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;
    
    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, radarFragmentShader));
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);

    let animationFrameId;
    const render = (time) => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [status]);

  const handleBackToLogin = () => {
    const error = searchParams.get('error') || 'Xác thực thất bại';
    navigate('/login', { state: { error } });
  };

  return (
    <div className="fixed inset-0 bg-[#0a0e14] font-['Inter'] flex items-center justify-center overflow-hidden z-50">
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .error-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}
      </style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#003ec7]/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#4a5e87]/5 rounded-full blur-[120px]"></div>
        <canvas ref={particleCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-md w-full">
        {/* Glass Panel */}
        <div 
          className={`w-full rounded-2xl p-10 flex flex-col items-center justify-center min-h-[460px] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 ${status === 'error' ? 'error-shake' : ''}`}
          style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          {status === 'loading' ? (
            <div className="flex flex-col items-center w-full transition-opacity duration-400">
              <div className="relative mb-10 w-64 h-64 flex items-center justify-center">
                <canvas ref={radarCanvasRef} className="w-[256px] h-[256px] rounded-full"></canvas>
                <div className="absolute inset-0 rounded-full border border-blue-500/20 pointer-events-none"></div>
              </div>
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold text-white tracking-wide">
                  Đang xác thực...
                </h1>
                <p className="text-base font-normal text-gray-400">
                  Vui lòng chờ trong giây lát.
                </p>
              </div>
              {/* Progress Line */}
              <div className="mt-12 w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-[1500ms] ease-out" 
                  style={{ width: progressWidth }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full transition-opacity duration-400">
              <div className="mb-8 flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30">
                <span className="material-symbols-outlined text-[48px] text-red-500">close</span>
              </div>
              <div className="space-y-4 mb-10">
                <h1 className="text-2xl font-semibold text-white tracking-wide">
                  Xác thực thất bại
                </h1>
                <p className="text-base font-normal text-gray-400">
                  Rất tiếc, đã có lỗi xảy ra trong quá trình xác thực tài khoản của bạn.
                </p>
              </div>
              <button 
                onClick={handleBackToLogin}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm px-8 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-red-500/20"
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                Quay lại trang đăng nhập
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span className="text-xs font-medium uppercase tracking-widest">Secure Authentication Protocol</span>
        </div>
      </main>
    </div>
  );
};

export default OAuth2Redirect;
