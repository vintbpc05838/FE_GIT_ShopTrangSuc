import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/admin/order_admin.css";
import { Link, useNavigate } from 'react-router-dom';
import { notification, Spin } from 'antd';
const Order = ({ orders, setOrders }) => {
  const [keywords, setKeywords] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const ordersPerPage = 10; // Thay đổi số lượng đơn hàng mỗi trang

  const orderStatuses = [
    { id: '', name: 'Tất cả' },
    { id: 1, name: 'Đang xử lý' },
    { id: 2, name: 'Đang giao hàng' },
    { id: 3, name: 'Đã giao' },
    { id: 4, name: 'Hủy đơn hàng' },
    { id: 5, name: 'Xác nhận hủy đơn' }
  ];

  // Sắp xếp đơn hàng từ lớn đến nhỏ theo orderId
  const sortedOrders = [...orders].sort((a, b) => b.orderId - a.orderId);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Kiểm tra xem mã đơn hàng có phải là số dương không
    if (!/^\d+$/.test(keywords)) {
      notification.error({
        message: "Lỗi đầu vào",
        description: "Mã đơn hàng phải là một số nguyên dương.",
        duration: 3,
      });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/orders/search?orderId=${keywords}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.length === 0) {
        notification.warning({
          message: "Không tìm thấy",
          description: `Không tìm thấy đơn hàng với mã: ${keywords}.`,
          duration: 3,
        });
        setOrders([]);
      } else {
        setOrders(response.data);
        setCurrentPage(1);
        notification.success({
          message: "Tìm kiếm thành công",
          description: `Đã tìm thấy ${response.data.length} kết quả.`,
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      notification.error({
        message: "Lỗi hệ thống",
        description: "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại.",
        duration: 3,
      });
    }
  };


  const handleStatusChange = async (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(status ? `http://localhost:8080/api/admin/orders/filter?status=${status}` : `http://localhost:8080/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      alert("Đã xảy ra lỗi trong quá trình lọc đơn hàng.");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="order-admin-container">
      <div className="row">
        <div className="col-lg-12">
          <div className="container">
            <div className="search-bar mb-4 d-flex justify-content-end align-items-center">
              <div className="d-flex align-items-center mr-3">
                <label htmlFor="orderStatus" className="mr-3">Trạng thái đơn hàng:</label>
                <select
                  id="orderStatus"
                  className="form-control select-status-order me-4"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  style={{ height: "40px", minWidth: "200px" }}
                >
                  {orderStatuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              <form onSubmit={handleSearch} className="d-flex align-items-center">
                <div className="input-group" style={{ maxWidth: "500px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập mã đơn hàng (chỉ số nguyên dương)..."
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    style={{ height: "40px" }}
                  />

                  <div className="input-group-append ml-2">
                    <button
                      className="btn btn-order-admin-search"
                      type="submit"
                      style={{ height: "40px" }}
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card-admin-order card">
        <div className="card-admin-order-title p-1 text-start">
          <h5>Danh sách đơn hàng</h5>
        </div>
        <div className="card-order-admin-body">
          <table className="table-order">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày tạo</th>
                <th>Tên khách hàng</th>
                <th>Trạng thái</th>
                <th>Phương thức giao hàng</th>
                <th>Phương thức thanh toán</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.account?.fullname || 'Không có thông tin'}</td>
                  <td>{order.orderStatus?.statusName || 'Chưa có trạng thái'}</td>
                  <td>{order.shippingMethod?.methodName || 'Không có thông tin'}</td>
                  <td>{order.payment ? order.payment.paymentMethod : 'Không có thông tin thanh toán'}</td>
                  <td>{order.totatAmountAfterDiscount?.toLocaleString() || 'Không có thông tin'} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row float-end m-3">
        <nav aria-label="order-pagination">
          <ul className="order-admin-pagination">
            <li className="order-admin-page-item">
              <button
                className="order-admin-page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li className={`order-admin-page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index + 1}>
                <button
                  className="order-admin-page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className="order-admin-page-item">
              <button
                className="order-admin-page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        setError("Không thể tải dữ liệu đơn hàng.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="OrderAdmin">
      <Order orders={orders} setOrders={setOrders} />
    </div>
  );
};

export default OrderAdmin;