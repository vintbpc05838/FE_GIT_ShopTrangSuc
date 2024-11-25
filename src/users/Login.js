import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { notification, Spin } from 'antd'; // Import notification và Spin từ antd
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm state loading

  const navigate = useNavigate();

  const openNotification = (type, message, duration = 2) => {
    notification[type]({
      message: message,
      duration: duration, // Thay đổi thời gian hiển thị thông báo
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        Cookies.set("token", data.token, { expires: 7, secure: true });
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.fullname);
    
        // Decode token để lấy thông tin người dùng
        const decodedPayload = JSON.parse(atob(data.token.split('.')[1]));
        const username = decodedPayload.sub;
        const roles = decodedPayload.roles || [];
        localStorage.setItem('username', username);
    
        // Hiển thị thông báo đăng nhập thành công
        openNotification('success', 'Đăng nhập thành công!', 5); // Thông báo tự động mất sau 5 giây

        // Redirect dựa trên role
        if (roles.includes("ADMIN")) {
            navigate('/admin/dashboard');
        }else if(roles.includes("STAFF")){
          navigate('/staff/dashboard');
        } else {
            navigate('/');
        }
      } else {
        const data = await response.json();
        openNotification('error', data.error || "Đăng nhập thất bại"); // Hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      openNotification('error', 'Đã xảy ra lỗi khi kết nối với máy chủ.'); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="login-card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-3">Đăng nhập</h2>
        <p className="text-center mb-4">
          <Link to="/register" className="text-danger">Nếu chưa có tài khoản? Đăng ký tại đây</Link>
        </p>
        {loading && <Spin size="large" />} {/* Hiển thị loading spinner */}
        <form onSubmit={handleSubmit}>
          <div className="form-group-custom mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group-custom mb-3">
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn login-btn btn-block" disabled={loading}>
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;