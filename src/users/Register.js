import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { notification, Spin } from 'antd'; // Import notification và Spin từ antd
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/register.css';

const Register = () => {
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [sdt, setSdt] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [gioiTinh, setGioiTinh] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorSdt, setErrorSdt] = useState('');
  const [errorMatKhau, setErrorMatKhau] = useState('');
  const [loading, setLoading] = useState(false); // State cho loading

  const handleRegister = async (e) => {
    e.preventDefault();

    // Reset error messages
    setErrorEmail('');
    setErrorSdt('');
    setErrorMatKhau('');

    // Prepare data to send
    const accountData = {
      fullname: hoTen,
      email: email,
      phone: sdt,
      password: matKhau,
      gender: gioiTinh,
    };

    setLoading(true); // Bắt đầu loading

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      const result = await response.json();

      if (response.ok) {
        // Hiển thị thông báo thành công
        notification.success({
          message: 'Đăng ký thành công!',
          description: 'Bạn có thể đăng nhập ngay bây giờ.',
          duration: 5, // Tự động mất sau 5 giây
        });
      } else {
        // Handle server errors
        if (result.error) {
          if (result.error.includes("Email")) setErrorEmail(result.error);
          else if (result.error.includes("Số điện thoại")) setErrorSdt(result.error);
          else if (result.error.includes("Mật khẩu")) setErrorMatKhau(result.error);
        }
      }
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Vui lòng thử lại sau.',
        duration: 5, // Tự động mất sau 5 giây
      });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementsByName('matKhau')[0];
    const passwordToggleIcon = document.querySelector('.password-toggle-icon i');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passwordToggleIcon.classList.remove('bi-lightbulb');
      passwordToggleIcon.classList.add('bi-lightbulb-fill');
    } else {
      passwordInput.type = 'password';
      passwordToggleIcon.classList.remove('bi-lightbulb-fill');
      passwordToggleIcon.classList.add('bi-lightbulb');
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="register-card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Đăng ký</h2>
        <p className="text-center">
          <Link to="/login" className="text-danger">Đã có tài khoản? Đăng nhập tại đây</Link>
        </p>
        {loading && <Spin size="large" />} {/* Hiển thị loading spinner */}
        <form onSubmit={handleRegister}>
          <div className="form-group-custom mb-3">
            <input type="text" className="form-control" name="hoTen" placeholder="Họ tên" required value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
          </div>
          <div className="form-group-custom mb-3">
            <input type="email" className="form-control" name="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            {errorEmail && <span className="error-message fst-italic">{errorEmail}</span>}
          </div>
          <div className="form-group-custom mb-3">
            <input type="tel" className="form-control" name="sdt" placeholder="Số điện thoại" required value={sdt} onChange={(e) => setSdt(e.target.value)} />
            {errorSdt && <span className="error-message fst-italic">{errorSdt}</span>}
          </div>
          <div className="form-group-custom mb-3">
            <div className="input-group">
              <input type="password" className="form-control" name="matKhau" placeholder="Mật khẩu" required value={matKhau} onChange={(e) => setMatKhau(e.target.value)} />
              <span className="input-group-text password-toggle-icon" onClick={togglePasswordVisibility}>
                <i className="bi bi-lightbulb"></i>
              </span>
            </div>
            {errorMatKhau && <span className="error-message fst-italic">{errorMatKhau}</span>}
          </div>
          <div className="form-group-custom mb-3">
            <label className="me-3">Giới tính:</label>
            <div className="form-check-custom">
              <input className="radio-input" value="true" type="radio" name="gioitinh" required onChange={() => setGioiTinh('Nam')} />
              <label className="radio-label">Nam</label>
            </div>
            <div className="form-check-custom">
              <input className="radio-input" value="false" type="radio" name="gioitinh" required onChange={() => setGioiTinh('Nữ')} />
              <label className="radio-label">Nữ</label>
            </div>
          </div>
          <button type="submit" className="btn register-btn btn-block">Đăng ký</button>
          <hr className="hr-custom" />
        </form>
      </div>
    </div>
  );
};

export default Register;