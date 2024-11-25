import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import OrderDetailPage from "./OrderDetailPage";
import "../css/admin/createorders.css";

const CreateOrders = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState(""); // State để lưu mã đơn hàng tìm kiếm
  const [searchCustomerName, setSearchCustomerName] = useState(""); 
  // Lấy các trạng thái đơn hàng
  useEffect(() => {
    const fetchOrderStatuses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin/order-status", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrderStatuses(response.data);
        const defaultTab = response.data.find(status => status.orderStatusId === 1);
        if (defaultTab) {
          setActiveTab(defaultTab.orderStatusId);
        }
      } catch (error) {
        setError("Error fetching order statuses.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderStatuses();
  }, []);

  // Lấy danh sách đơn hàng theo trạng thái
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:8080/api/admin/orders`;
        if (activeTab) {
          url += `/filter?status=${activeTab}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setError("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab !== null) {
      fetchOrders();
    }
  }, [activeTab]);

  // Tìm kiếm đơn hàng theo mã
  const searchOrders = async () => {
    if (!searchOrderId) return; // Không thực hiện tìm kiếm nếu không có mã

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/admin/orders/search?orderId=${searchOrderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data); // Cập nhật danh sách đơn hàng với kết quả tìm kiếm
    } catch (error) {
      setError("Error searching for orders.");
    } finally {
      setLoading(false);
    }
  };
  const searchOrdersByCustomerName = async () => {
    if (!searchCustomerName) return; // Không thực hiện tìm kiếm nếu không có tên khách hàng
  
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/admin/orders/search-by-customer-name?customerName=${searchCustomerName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data); // Cập nhật danh sách đơn hàng với kết quả tìm kiếm
    } catch (error) {
      setError("Error searching for orders by customer name.");
    } finally {
      setLoading(false);
    }
  };
  const getCurrentOrders = () => {
    const sortedOrders = orders.sort((a, b) => b.orderId - a.orderId);
    const pageCount = Math.ceil(sortedOrders.length / ordersPerPage);
    const currentOrders = sortedOrders.slice(
      (currentPage - 1) * ordersPerPage,
      currentPage * ordersPerPage
    );

    return { currentOrders, pageCount };
  };

  const { currentOrders, pageCount } = getCurrentOrders();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleOrderDetails = (order) => {
    setSelectedOrderId(order.orderId);
  };

  return (
    <div className="create-orders-page">
      {selectedOrderId ? (
        <OrderDetailPage
          orderId={selectedOrderId}
          onBack={() => setSelectedOrderId(null)}
        />
      ) : (       
        <>
          {/* Ô tìm kiếm mã đơn hàng */}
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Nhập mã đơn hàng..."
              value={searchOrderId}
              className="search-id-order-input"
              onChange={(e) => setSearchOrderId(e.target.value)} // Cập nhật mã tìm kiếm
            />
            <button className="btn-search-order me-2" onClick={searchOrders}>Tìm kiếm</button>
            
            <input
              type="text"
              placeholder="Nhập tên khách hàng..."
              value={searchCustomerName}
              className="search-id-order-input"
              onChange={(e) => setSearchCustomerName(e.target.value)} // Cập nhật tên khách hàng tìm kiếm
            />
            <button className="btn-search-fullname-customer" onClick={searchOrdersByCustomerName}>Tìm kiếm</button>
          </div>
          
          {/* Phần còn lại của giao diện */}
          <div className="create-order-tabs-container">
            {orderStatuses
              .filter(status => [1, 2, 5].includes(status.orderStatusId))
              .map((status) => (
                <button
                  key={status.orderStatusId}
                  className={`create-order-tab-btn ${activeTab === status.orderStatusId ? "active" : ""}`}
                  onClick={() => {
                    if (activeTab !== status.orderStatusId) {
                      setActiveTab(status.orderStatusId);
                      setCurrentPage(1);
                    }
                  }}
                >
                  {status.statusName}
                </button>
              ))}
          </div>
  
          <table className="orders-table">
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
              {currentOrders.map((order, index) => (
                <tr key={index} onClick={() => handleOrderDetails(order)}>
                  <td>{order.orderId}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString() || 'Không có thông tin'}</td>
                  <td>{order.account?.fullname || 'Chưa có thông tin'}</td>
                  <td>{order.orderStatus?.statusName || 'Chưa có trạng thái'}</td>
                  <td>{order.shippingMethod?.methodName || 'Không có thông tin'}</td>
                  <td>{order.payment?.paymentMethod || 'Không có thông tin thanh toán'}</td>
                  <td>{order.totalAmountAfterDiscount?.toLocaleString() || 'Không có thông tin'} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {pageCount > 1 && (
            <div className="pagination-container">
              <button onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1}>
                Trước
              </button>
              <span>Trang {currentPage} / {pageCount}</span>
              <button onClick={() => setCurrentPage(currentPage < pageCount ? currentPage + 1 : pageCount)} disabled={currentPage === pageCount}>
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreateOrders;