import React, { useState, useEffect } from 'react';
import '../css/order.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Hàm lấy dữ liệu từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Thay accountId bằng ID thực tế của tài khoản người dùng
        const response = await axios.get("http://localhost:8080/user/orders/account/1");
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const displayedOrders = orders.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="order-container">
      <div className="order-title">
        <h4>Đơn hàng của bạn</h4>
      </div>
      {displayedOrders.map(order => (
        <Link to={`/order/${order.orderId}`} className="text-decoration-none text-dark" key={order.orderId}>
          <div className="order-card mb-3">
            <div className="row">
              <div className="order-card-header">
                <p>Marni.store</p>
                <button type="submit" className="btn chat-btn">
                  <i className="bi bi-chat-dots"></i> Chat
                </button>
                <div className="order-card-header-content d-flex">
                  <i className="bi bi-truck-front"></i>
                  <p>Giao hàng thành công</p>
                  <span className="divider"></span>
                  <a href="/danh-gia" className="review-link">Đánh giá</a>
                </div>
              </div>
              <hr />
              <div className="col-lg-3">
                {order.orderDetails.map((detail, index) => (
                  <div key={index} className="order-image mb-2">
                    <img src={detail.product.image} alt={detail.product.name} className="order-img" />
                  </div>
                ))}
              </div>
              <div className="col-lg-9">
                <div className="order-details">
                  {order.orderDetails.map((detail, index) => (
                    <div key={index} className="product-details">
                      <h5 className="order-product-name">{detail.product.name}</h5>
                      <p className="order-quantity">Số Lượng: {detail.quantity}</p>
                      <p className="order-price">Giá: {detail.price.toLocaleString()} VNĐ</p>
                    </div>
                  ))}
                  <p className="order-date">Ngày Mua: {order.orderDate}</p>
                  <hr />
                  <div className="order-card-footer">
                    <p className="order-total">
                      Thành Tiền: {order.totalAmountAfterDiscount.toLocaleString()} VNĐ
                    </p>
                    <div className="button d-flex justify-content-end">
                      <button type="submit" className="btn receive-btn me-2">Đã nhận hàng</button>
                      <button type="submit" className="btn cancel-btn me-2">Hủy</button>
                      <button type="submit" className="btn refund-btn me-2">Yêu cầu hoàn tiền</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <div className="pagination d-flex justify-content-end my-3">
        <button onClick={handlePreviousPage} disabled={currentPage === 0} className="btn btn-secondary me-2">Trước</button>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1} className="btn btn-secondary">Tiếp theo</button>
      </div>
    </div>
  );
};

export default Order;
