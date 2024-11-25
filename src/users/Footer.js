import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

const Footer = () => {
  return (
    <div className="custom-footer bg-dark py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 text-center mb-3">
            <img src="https://bizweb.dktcdn.net/100/376/737/themes/894814/assets/logo.png?1676271560514" alt="Logo" className="footer-logo" /> {/* Thêm className cho logo */}
          </div>
          <div className="col-md-4 text-white p-3"> 
            <h5 className="footer-title">Hỗ trợ khách hàng</h5> 
            <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn qua email. Vui lòng gửi câu hỏi hoặc ý kiến của bạn đến địa chỉ: <a href="mailto:support@example.com" className="text-white">support@example.com</a></p> {/* Thêm nội dung */}
          </div>
          <div className="col-md-4 text-white p-3">
            <h5 className="footer-title">Hệ thống cửa hàng</h5> 
            <p>Chúng tôi có một hệ thống cửa hàng rộng khắp trên toàn quốc để phục vụ khách hàng một cách nhanh chóng và tiện lợi.</p>
          </div>
          <div className="col-md-4 text-white p-3">
            <h5 className="footer-title">Trang web liên quan</h5> 
            <ul className="list-unstyled">
              <li><a href="#" className="text-white">Trang chủ</a></li>
              <li><a href="#" className="text-white">Giới thiệu</a></li>
              <li><a href="#" className="text-white">Tất cả sản phẩm</a></li>
              <li><a href="#" className="text-white">Tin tức</a></li>
              <li><a href="#" className="text-white">Liên hệ</a></li>
            </ul>
          </div>
          <div className="row align-items-center mt-3">
            <div className="col-12 text-center text-white">
              <h5 className="footer-title">Liên hệ với chúng tôi</h5>
              <div className="social-icons">
                <a href="#" className="text-white me-2"><i className="bi bi-facebook" style={{ fontSize: '1.5rem', color: '#4267B2' }}></i></a> {/* Giảm kích thước biểu tượng */}
                <a href="#" className="text-white me-2"><i className="bi bi-google" style={{ fontSize: '1.5rem', color: '#DB4437' }}></i></a> {/* Giảm kích thước biểu tượng */}
                <a href="#" className="text-white"><i className="bi bi-instagram" style={{ fontSize: '1.5rem', color: '#E1306C' }}></i></a> {/* Giảm kích thước biểu tượng */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;