import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/shoppingcart.css'; // Tạo file CSS riêng nếu cần

const ShoppingCart = () => {
    // Dữ liệu tĩnh cho giỏ hàng
    const carts = [
        {
            id: 1,
            product: {
                ten_san_pham: "Sản phẩm 1",
                image: { duong_dan: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg" },
                getPricePromotion: () => 200000,
                category: { ten_loai: "Loại 1" },
                size: { kich_co: "M" },
            },
            so_luong: 2,
        },
        {
            id: 2,
            product: {
                ten_san_pham: "Sản phẩm 2",
                image: { duong_dan: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg" },
                getPricePromotion: () => 150000,
                category: { ten_loai: "Loại 2" },
                size: { kich_co: "L" },
            },
            so_luong: 0,
        },
        {
            id: 3,
            product: {
                ten_san_pham: "Sản phẩm 2",
                image: { duong_dan: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg" },
                getPricePromotion: () => 150000,
                category: { ten_loai: "Loại 2" },
                size: { kich_co: "L" },
            },
            so_luong: 0,
        },
    ];

    // Tính tổng tiền
    const totalPrice = carts.reduce((total, item) => {
        return total + (item.product.getPricePromotion() * item.so_luong);
    }, 0);

    const handlePayment = () => {
        const checkboxes = document.getElementsByName('cartId');
        let result = "";
        let isChecked = false;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                result += checkbox.value + ",";
                isChecked = true;
            }
        });
        if (isChecked) {
            window.location.href = `/home/giohang/thanh-toan?ids=${result}`;
        } else {
            alert("Vui lòng chọn sản phẩm để tiến hành thanh toán.");
        }
    };

    return (
        <div className="shopping-cart-container my-5">
            <h3 className="shopping-cart-title mb-4">Giỏ hàng của bạn</h3>
            <div className="row">
                <div className="col-lg-9">
                    {carts.map(cartItem => (
                        <div key={cartItem.id} className="shopping-cart-content card bg-white border-0 shadow mb-3">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="cartId"
                                                value={cartItem.id}
                                                id={`checkbox-${cartItem.id}`}
                                            />
                                            <label className="form-check-label" htmlFor={`checkbox-${cartItem.id}`}>
                                                <img
                                                    src={cartItem.product.image.duong_dan}
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '100px', objectFit: 'cover' }} 
                                                    alt={cartItem.product.ten_san_pham}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <div className="row">
                                            <div className="col-4">
                                                <h5 className="card-title">{cartItem.product.ten_san_pham}</h5>
                                                <p className="card-text text-danger">
                                                    {cartItem.product.getPricePromotion().toLocaleString()} VND
                                                </p>
                                                <p className="card-text">
                                                    <em>Loại sản phẩm: {cartItem.product.category.ten_loai}</em>
                                                </p>
                                                <p className="card-text">
                                                    <em>Size: {cartItem.product.size.kich_co}</em>
                                                </p>
                                            </div>
                                            <div className="col-8">
                                                <div className="d-flex justify-content-end my-5">
                                                    <button
                                                        type="button"
                                                        className="btn btn-reduce btn-sm me-2"
                                                        onClick={() => alert("Giảm số lượng")}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        className="input-quantity form-control-sm w-25 text-center"
                                                        value={cartItem.so_luong}
                                                        readOnly
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-increase btn-sm ms-2 me-4"
                                                        onClick={() => alert("Tăng số lượng")}
                                                    >
                                                        +
                                                    </button>
                                                    <a href={`/home/giohang/remove/${cartItem.id}`}>
                                                        <i className="bi bi-trash3-fill fs-4"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-lg-3">
                    <div className="shopping-cart-summary card bg-white border-0 shadow">
                        <div className="card-body">
                            <h5 className="card-title text-center">
                                Tổng tiền: {totalPrice.toLocaleString()} VND
                            </h5>
                            <div className="d-grid gap-2">
                                <button className="btn btn-warning" onClick={handlePayment}>
                                    Tiến hành thanh toán
                                </button>
                                <a href="/home/sanpham" className="btn btn-secondary">Tiếp tục mua hàng</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;