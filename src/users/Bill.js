import React, { useState } from "react";
import '../css/bill.css'; // Để thêm phần CSS cho giao diện

const Bill = () => {
    const [form, setForm] = useState({
        email: "",
        hoTen: "",
        soDienThoai: "",
        diaChi: "",
        quanHuyen: "",
        tinhThanh: "",
        phuongXa: "",
        ghiChu: ""
    });

    const [shippingFee, setShippingFee] = useState(30000);
    const [promotion, setPromotion] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cod"); // State để lưu phương thức thanh toán

    // Danh sách sản phẩm trong đơn hàng
    const [products, setProducts] = useState([
        { id: 1, name: "Nhẫn bạc nữ", size: "15", quantity: 1, price: 460000 },
        { id: 2, name: "Lắc tay bạc", size: "20", quantity: 1, price: 520000 },
        { id: 3, name: "Dây chuyền bạc", size: "45", quantity: 1, price: 650000 },
        // Thêm nhiều sản phẩm để kiểm tra thanh cuộn
        { id: 4, name: "Vòng tay", size: "18", quantity: 1, price: 300000 },
        { id: 5, name: "Nhẫn bạc nam", size: "20", quantity: 1, price: 400000 },
        { id: 6, name: "Lắc tay vàng", size: "21", quantity: 1, price: 700000 },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    // Tính tổng giá trị sản phẩm
    const totalProductPrice = products.reduce((total, product) => total + (product.price * product.quantity), 0);

    return (
        <div className="bill-container">
            <div className="row">
                <div className="col-lg-4">
                    <div className="left-section">
                        <div className="bill-header">
                            <h2 className="bill-title">Thông tin nhận hàng</h2>
                            <a href="#change-address" className="change-address-link">
                                Thay đổi địa chỉ
                            </a>
                        </div>

                        <form className="bill-form">
                            <input
                                type="email"
                                className="bill-input"
                                placeholder="Email"
                                name="email"
                                value={form.email}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="bill-input"
                                placeholder="Họ và tên"
                                name="hoTen"
                                value={form.hoTen}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="bill-input"
                                placeholder="Số điện thoại"
                                name="soDienThoai"
                                value={form.soDienThoai}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="bill-input"
                                placeholder="Địa chỉ"
                                name="diaChi"
                                value={form.diaChi}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="bill-input"
                                placeholder="Quận / Huyện"
                                name="quanHuyen"
                                value={form.quanHuyen}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="bill-input"
                                placeholder="Tỉnh / Thành phố"
                                name="tinhThanh"
                                value={form.tinhThanh}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="bill-input"
                                placeholder="Phường / Xã"
                                name="phuongXa"
                                value={form.phuongXa}
                                onChange={handleInputChange}
                            />
                            <textarea
                                className="bill-textarea"
                                placeholder="Ghi chú"
                                name="ghiChu"
                                value={form.ghiChu}
                                onChange={handleInputChange}
                            ></textarea>
                        </form>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="center-section">
                        <h3 className="shipping-title">Vận Chuyển</h3>
                        <div className="shipping-options">
                            <label className="shipping-label">
                                <input type="radio" checked readOnly /> Giao hàng tận nơi
                            </label>
                            <p className="shipping-fee">Phí Giao Hàng: {shippingFee.toLocaleString()} đ</p>
                        </div>
                        <h3 className="payment-title">Thanh toán</h3>
                        <div className="payment-options">
                            <label className="payment-label">
                                <input
                                    type="radio"
                                    value="cod"
                                    checked={paymentMethod === "cod"}
                                    onChange={handlePaymentChange}
                                /> Thanh toán khi nhận hàng
                            </label>
                            <label className="payment-label">
                                <input
                                    type="radio"
                                    value="vnpay"
                                    checked={paymentMethod === "vnpay"}
                                    onChange={handlePaymentChange}
                                /> Chuyển khoản qua ví điện tử VNPay
                            </label>
                            {/* Hiển thị nút Thanh Toán khi chọn VNPay */}
                            {paymentMethod === "vnpay" && (
                                <button className="btn pay-button">
                                    Thanh Toán
                                </button>
                            )}
                        </div>
                        <h3 className="promo-title">Mã Khuyến Mãi</h3>
                        <div className="promo-options">
                            <button className="promo-button" onClick={() => setPromotion(100000)}>SUMMER30</button>
                            <button className="promo-button" onClick={() => setPromotion(150000)}>FREESHIP</button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="right-section-custom">
                        <h2 className="order-title-custom">Đơn hàng</h2>
                        {/* Gói danh sách sản phẩm trong container có thanh cuộn */}
                        <div className="product-list-custom">
                            {products.map((product) => (
                                <div key={product.id} className="product-info-custom">
                                    <img src="https://via.placeholder.com/100" alt="Product" className="product-img-custom" />
                                    <div className="product-details-custom">
                                        <p className="product-name-custom">{product.name}</p>
                                        <p className="product-size-custom">Size: {product.size}</p>
                                        <p className="product-quantity-custom">Số lượng: {product.quantity}</p>
                                    </div>
                                    <p className="price-custom">{(product.price * product.quantity).toLocaleString()}đ</p>
                                </div>
                            ))}
                        </div>

                        <div className="order-summary-custom">
                            <p>Phí giao: <span>{shippingFee.toLocaleString()} đ</span></p>
                            <p>Tạm tính: <span>{totalProductPrice.toLocaleString()} đ</span></p>
                            <p>Giảm giá: <span>{promotion.toLocaleString()} đ</span></p>
                            <p className="total-custom">
                                Tổng cộng: <span>{(totalProductPrice + shippingFee - promotion).toLocaleString()} đ</span>
                            </p>
                        </div>

                        <button className="order-btn-custom">Đặt hàng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bill;
