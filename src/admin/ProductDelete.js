import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/admin/productDelete.css";
import { notification } from "antd";
import axios from "axios";

const ProductDelete = () => {
    const [deletedProducts, setDeletedProducts] = useState([]);

    // Hàm hiển thị thông báo
    const showNotification = (message, type = "success") => {
        notification[type]({
            message: type === "error" ? "Lỗi" : "Thông báo",
            description: message,
            duration: 2,
        });
    };

    // Lấy danh sách sản phẩm đã xóa
    const fetchDeletedProducts = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                "http://localhost:8080/api/admin/product-details/trash",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDeletedProducts(response.data);
        } catch (error) {
            showNotification(
                error.response?.data?.message || "Lỗi khi lấy danh sách sản phẩm đã xóa.",
                "error"
            );
        }
    };

    // Khôi phục sản phẩm
    const handleRestore = async (productId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:8080/api/admin/product-details/restore/${productId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            showNotification("Khôi phục sản phẩm thành công!");
            fetchDeletedProducts(); // Cập nhật lại danh sách
        } catch (error) {
            showNotification(
                error.response?.data?.message || "Không thể khôi phục sản phẩm.",
                "error"
            );
        }
    };

    // Hàm xóa sản phẩm và chi tiết sản phẩm vĩnh viễn
    const deleteProductAndDetails = async (productId) => {
        const token = localStorage.getItem("token");

        try {
            // Gửi yêu cầu DELETE đến API
            await axios.delete(
                `http://localhost:8080/api/admin/product-details/delete/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Gửi token trong header
                    },
                }
            );

            // Nếu xóa thành công
            showNotification("Sản phẩm và chi tiết sản phẩm đã được xóa thành công.", "success");

            // Có thể gọi lại API để tải lại danh sách sản phẩm sau khi xóa
            fetchDeletedProducts(); // Cập nhật lại danh sách sản phẩm, tùy theo yêu cầu của bạn
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm và chi tiết sản phẩm:", error);
            showNotification("Đã xảy ra lỗi khi xóa sản phẩm.", "error");
        }
    };

    // Hàm này có thể được gọi khi người dùng nhấn nút xác nhận xóa
    const confirmDelete = (productId) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm và chi tiết sản phẩm này?");

        if (confirm) {
            deleteProductAndDetails(productId);
        }
    };

    // Lấy danh sách khi component được render
    useEffect(() => {
        fetchDeletedProducts();
    }, []);

    return (
        <div className="productDelete">
            <div className="card-delete">
                <p className="font-productDelete">
                    <i className="bi bi-layout-text-sidebar-reverse"></i> Danh sách sản phẩm đã xóa
                </p>
                <hr className="hr-productDelete" />
                <div className="card-body-delete">
                    <table className="table-delete">
                        <thead>
                            <tr>
                                <th className="th-product">ID</th>
                                <th className="th-product">Hình ảnh</th>
                                <th className="th-product">Tên sản phẩm</th>
                                <th className="th-product">Giá</th>
                                <th className="th-product">Chất liệu</th>
                                <th className="th-product">Loại</th>
                                <th className="th-product">Trạng thái</th>
                                <th className="th-product">Số lượng</th>
                                <th className="th-product"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {deletedProducts.length > 0 ? (
                                deletedProducts.map((product) => (
                                    <tr key={product.detailProductId}>
                                        <td>{product.detailProductId}</td>
                                        <td>
                                            {product.images.length > 0 ? (
                                                <img src={product.images[0].imageUrl} alt={product.productName} className="images" />
                                            ) : (
                                                <span>Không có hình ảnh</span>
                                            )}
                                        </td>
                                        <td className="td-product">{product.productName}</td>
                                        <td className="td-product">{product.price.toLocaleString()} VND</td>
                                        <td className="td-product">{product.material.materialName}</td>
                                        <td className="td-product">{product.productCategory.categoryName}</td>
                                        <td className="td-product">{product.status}</td>
                                        <td className="td-product">{product.quantity}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRestore(product.detailProductId)}
                                                className="btn btn-restore"
                                            >
                                                Khôi phục
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(product.detailProductId)}
                                                className="btn btn-info btn-sm"
                                            >
                                                Xóa vĩnh viễn
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        Không có sản phẩm nào trong thùng rác.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductDelete;
