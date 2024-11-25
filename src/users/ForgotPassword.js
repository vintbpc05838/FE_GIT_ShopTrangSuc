import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/forgotpassword.css'; 

const ForgotPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="forgotPasword-container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="forgot-password-card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-3">Quên mật khẩu</h2>
        <p className="text-center mb-4">
          <Link to="/dangnhap" className="text-danger">Lấy lại được mật khẩu? Đăng nhập tại đây</Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group-custom mb-3">
            <input type="tel" className="form-control" placeholder="Số điện thoại" required />
          </div>
          <div className="form-group-custom mb-3">
            <input type="email" className="form-control" placeholder="Email" required />
          </div>
          <button type="submit" className="btn submit-btn btn-block">Gửi</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;