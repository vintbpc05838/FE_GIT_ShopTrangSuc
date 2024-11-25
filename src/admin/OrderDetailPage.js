import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { notification } from 'antd'; 
import "../css/admin/orderdetailpage.css";

const OrderDetailPage = ({ orderId, onBack }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/admin/order-details/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.data.length > 0) {
                    setOrder(response.data[0]);
                } else {
                    setError("No data found for this order.");
                }
            } catch (error) {
                setError("Error fetching order details. Please try again later.");
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const openNotification = (type, message) => {
        notification[type]({
            message: message,
            duration: 5,
        });
    };

    const onConfirmOrder = async () => {
        try {
            await axios.put(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
                statusId: 2
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOrder((prevOrder) => ({
                ...prevOrder,
                order: { ...prevOrder.order, orderStatus: { statusName: "Đang giao hàng", orderStatusId: 2 } }
            }));
            openNotification('success', "Đơn hàng đã được xác nhận");
        } catch (error) {
            console.error("Error updating order status:", error);
            openNotification('error', "Failed to update order status");
        }
    };

    const onCancelOrder = async () => {
        try {
            await axios.put(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
                statusId: 4
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOrder((prevOrder) => ({
                ...prevOrder,
                order: { ...prevOrder.order, orderStatus: { statusName: "Hủy đơn hàng", orderStatusId: 4 } }
            }));
            openNotification('success', "Đơn hàng đã được hủy");
        } catch (error) {
            console.error("Error updating order status:", error);
            openNotification('error', "Failed to update order status");
        }
    };

    // Hàm để ẩn một phần số điện thoại
const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Không có số điện thoại"; // Kiểm tra nếu số điện thoại không tồn tại
    const masked = phoneNumber.slice(-4); // Lấy 4 số cuối
    return `*******${masked}`; // Thay phần đầu bằng ký tự '*'
};

    const printOrderDetails = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) {
            openNotification('error', "Unable to open print dialog.");
            return;
        }
    
        const orderData = order?.order;
        const product = order?.product;

printWindow.document.write(`
    <html>
        <head>
            <title>Phiếu giao hàng</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                    color: #333;
                }
                .container {
                    width: 90%;
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header img {
                    max-width: 100px;
                }
                .header h1 {
                    font-size: 26px;
                    font-weight: bold;
                    margin: 10px 0;
                    color: #ff5722;
                }
                .barcode {
                    text-align: center;
                    margin: 20px 0;
                    font-size: 16px;
                    font-weight: bold;
                    color: #444;
                }
              .from-to {
    display: flex;
    justify-content: space-between;
    gap: 20px; /* Thêm khoảng cách giữa hai ô */
    margin-bottom: 20px;
}

                .from-to div {
                    width: 48%;
                    background-color: #f7f7f7;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                }
                .from-to div h4 {
                    font-size: 16px;
                    margin-bottom: 10px;
                    color: #ff5722;
                    font-weight: bold;
                }
                .section {
                    margin-bottom: 20px;
                }
                .section h4 {
                    font-size: 18px;
                    color: #333;
                    border-bottom: 2px solid #ff5722;
                    display: inline-block;
                    margin-bottom: 10px;
                    padding-bottom: 3px;
                    font-weight: bold;
                }
                .section table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .section table th, .section table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                    font-size: 14px;
                }
                .section table th {
                    background-color: #ff5722;
                    color: #fff;
                    font-weight: bold;
                }
                .section table td {
                    background-color: #f9f9f9;
                }
                .highlight {
                    font-weight: bold;
                    font-size: 20px;
                    color: #d32f2f;
                    margin-top: 20px;
                    display: block;
                    text-align: right;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 12px;
                    color: #555;
                }
                .footer p {
                    margin: 5px 0;
                }
                .signature {
                    margin-top: 20px;
                    border-top: 1px solid #ccc;
                    text-align: left;
                    padding-top: 10px;
                    font-size: 14px;
                    color: #777;
                }
                .separator {
    border: none;
    border-top: 2px dashed #ff5722; /* Màu và kiểu nét đứt */
    margin: 15px 0; /* Khoảng cách trên và dưới đường kẻ */
    width: 100%;
}

            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://via.placeholder.com/100" alt="Shopee Logo" />
                    <h1>Phiếu giao hàng</h1>
                </div>
                <div class="barcode">
                    <p><strong>Mã đơn hàng:</strong> ${orderData?.orderId}</p>
                </div>
                 <hr class="separator"> 
                <div class="from-to">
                    <div>
                        <h4>Người gửi</h4>
                        <p><strong>Cửa hàng:</strong> Marni.Store</p>
                        <p><strong>Địa chỉ:</strong> ABC</p>
                        <p><strong>SĐT:</strong> 0123456789</p>
                        <p><strong>Email:</strong> acc@gmail.com</p>
                    </div>
                    <div>
                        <h4>Người nhận</h4>
                        <p><strong>Họ và tên:</strong> ${orderData?.account?.fullname}</p>
                        <p><strong>Địa chỉ:</strong> ${orderData?.address}</p>
                        <p><strong>SĐT:</strong> ${maskPhoneNumber(orderData?.account?.phone)}</p>
                    </div>
                </div>
                 <hr class="separator"> 
                <div class="section">
                    <h4>Chi tiết sản phẩm</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${product?.productName}</td>
                                <td>${order?.quantity}</td>
                                <td>${product?.price?.toLocaleString()} VNĐ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="highlight">Tổng tiền: ${orderData?.totatAmountAfterDiscount?.toLocaleString()} VNĐ</p>
                <p><strong>Ghi chú:</strong> ${orderData?.note || "Không có ghi chú"}</p>
                <div class="footer">
                    <p>Chữ ký người nhận:</p>
                    <p>(Xác nhận hàng nguyên vẹn, không móp méo, bể vỡ)</p>
                </div>
            </div>
        </body>
    </html>
`);

        printWindow.document.close();
        printWindow.print();
    };
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const { order: orderData, product, quantity } = order;
    const accountData = orderData?.account;
    const paymentData = orderData?.payment;

    return (
        <div className="order-detail-container">
            <div className="order-detail-left">
                <button onClick={onBack} className="btn btn-back mb-3">Back to Orders</button>
                <h6 className="order-id">Mã hóa đơn #{orderData.orderId}</h6>
                <img src={product?.imageUrl || 'https://via.placeholder.com/150'} alt={product?.productName} className="order-image" />
                <p><strong>Sản phẩm:</strong> {product?.productName}</p>
                <p><strong>Giá:</strong> {product?.price?.toLocaleString()} VNĐ</p>
                <p><strong>Số lượng:</strong> {quantity}</p>
                <p><strong>Khách hàng:</strong> {accountData?.fullname}</p>
                <p><strong>Email:</strong> {accountData?.email}</p>
                <p><strong>Số điện thoại:</strong> {accountData?.phone}</p>
                <p><strong>Địa chỉ:</strong> {orderData?.address || "Not provided"}</p>
            </div>

            <div className="order-detail-right">
                <div className="order-detail-summary">
                    <p><span>Trạng thái đơn hàng:</span><span>{orderData?.orderStatus?.statusName}</span></p>
                    <p><span>Phương thức thanh toán:</span><span>{paymentData?.paymentMethod}</span></p>
                    <p className="total-price"><span>Tổng tiền:</span><span>{orderData?.totatAmountAfterDiscount?.toLocaleString()} VNĐ</span></p>
                </div>
                <div className="order-actions">
                    {orderData?.orderStatus?.orderStatusId === 1 && (
                        <>
                            <button type="button" className="btn btn-primary" onClick={printOrderDetails}>In đơn hàng</button>
                            <button type="button" className="btn btn-success" onClick={onConfirmOrder}>Xác nhận đơn</button>
                        </>
                    )}
                    {orderData?.orderStatus?.orderStatusId === 5 && (
                        <button type="button" className="btn btn-danger" onClick={onCancelOrder}>Xác nhận hủy đơn hàng</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;