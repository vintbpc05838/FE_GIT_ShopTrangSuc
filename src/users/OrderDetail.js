import React from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/orderdetail.css';

const orders = [
  {
    id: 1,
    products: [
      {
        name: 'Sản Phẩm 1',
        category: 'Móc Khóa Mèo Đen',
        price: 100000,
        quantity: 2,
        imageUrl: 'https://example.com/product1.jpg'
      },
    ],
    purchaseDate: '2024-09-15',
    shippingCost: 28700,
    discount: 24700,
  },
];

const orderStatus = [
  { step: 'Đơn Hàng Đã Đặt', time: '21:24 01-10-2024', icon: 'bi-receipt' },
  { step: 'Đã Xác Nhận Thông Tin Thanh Toán', time: '21:54 01-10-2024', icon: 'bi-cash' },
  { step: 'Đang giao', time: '16:48 02-10-2024', icon: 'bi-truck' },
  { step: 'Đã Nhận Được Hàng', time: '13:21 03-10-2024', icon: 'bi-box' },
  { step: 'Đơn Hàng Đã Được Đánh Giá', time: '13:22 03-10-2024', icon: 'bi-star' },
];

const OrderDetail = () => {
  const { orderId } = useParams();
  const order = orders.find((o) => o.id === parseInt(orderId));

  if (!order) {
    return <div>Order not found</div>;
  }

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <section className="order-detail-section vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12">
            <div className="card order-detail-card" style={{ borderRadius: '16px' }}>
              <div className="card-body p-5">
                {/* Order Header */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                  <div>
                    <h5 className="mb-0">HÓA ĐƠN <span className="text-primary font-weight-bold">#{orderId}</span></h5>
                  </div>
                  <div className="text-end">
                    <p className="mb-0">Ngày Mua: {order.purchaseDate}</p>
                  </div>
                </div>

                {/* Order Status */}
                <div className="order-status-timeline d-flex justify-content-between align-items-center mb-5">
                  {orderStatus.map((status, index) => (
                    <div
                      key={index}
                      className={`timeline-item d-flex flex-column align-items-center text-center ${index === orderStatus.length - 1 ? '' : 'timeline-connector'
                        }`}
                    >
                      <div className="timeline-icon mb-2">
                        <i className={`bi ${status.icon} text-success`} style={{ fontSize: '2rem' }}></i>
                      </div>
                      <p className="mb-0 fw-bold">{status.step}</p>
                      <small className="text-muted">{status.time}</small>
                    </div>
                  ))}
                </div>

                {/* Product Details */}
                <div className="product-details">
                  {order.products.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        style={{ width: '70px', height: '70px' }}
                      />

                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-0 text-start">{product.name}</h6>
                        <p className="mb-0 text-start">Số Lượng: {product.quantity}</p>
                      </div>
                      <div className="text-end">
                        <p className="mb-0 text-danger">{(product.price * product.quantity).toLocaleString()}₫</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Details */}
                <div className="pricing-details mb-4">
                  <div className="d-flex justify-content-between">
                    <p>Tổng Giá:</p>
                    <p>{order.products.reduce((total, product) => total + product.price * product.quantity, 0).toLocaleString()}₫</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Phí Vận Chuyển:</p>
                    <p>{order.shippingCost.toLocaleString()}₫</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Giảm Giá Vận Chuyển:</p>
                    <p>-{order.discount.toLocaleString()}₫</p>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <p>Tổng Số Tiền:</p>
                    <p className="text-danger">{(order.products.reduce((total, product) => total + product.price * product.quantity, 0) + order.shippingCost - order.discount).toLocaleString()}₫</p>
                  </div>
                </div>

                {/* Back Button */}
                <div className="text-end mb-4">
                  <button className="btn btn-warning" onClick={handleGoBack}>
                    <i className="bi bi-arrow-left"></i> Trở Về
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
