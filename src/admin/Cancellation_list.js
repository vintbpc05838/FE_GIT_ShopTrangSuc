import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/admin/order_admin.css";

const Order = ({ orders, setOrders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20; // Thay đổi số lượng đơn hàng mỗi trang

  // Sắp xếp đơn hàng từ lớn đến nhỏ theo orderId
  const sortedOrders = [...orders].sort((a, b) => b.orderId - a.orderId);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="order-admin-container">
      <div className="card-admin-order card">
        <div className="card-admin-order-title p-1 text-start">
          <h5>Danh sách đơn hàng đã hủy</h5>
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
                  <td>{order.account?.fullname}</td>
                  <td>{order.orderStatus?.statusName || 'Chưa có trạng thái'}</td>
                  <td>{order.shippingMethod?.methodName || 'Không có thông tin'}</td>
                  <td>{order.payment ? order.payment.paymentMethod : 'Không có thông tin thanh toán'}</td>
                  <td>{order.totatAmountAfterDiscount?.toLocaleString() || 'Trạng thái không xác định'} VNĐ</td>
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
        const response = await axios.get('http://localhost:8080/api/admin/orders/filter?status=4', {
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