import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { notification, Spin } from "antd"; // Import notification and Spin from Ant Design
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form
import "../css/admin/ProductCreate.css";

const ProductCreate = ({ onCreate, onCancel }) => {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    const token = localStorage.getItem("token");

    // Initialize the useForm hook
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [materialsData, sizesData, categoriesData] = await Promise.all([
                    axios.get("http://localhost:8080/api/admin/product-details/materials", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:8080/api/admin/product-details/sizes", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:8080/api/admin/product-details/categories", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);
                setMaterials(materialsData.data);
                setSizes(sizesData.data);
                setCategories(categoriesData.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token]);

    const handleFileChange = (e) => {
        const files = e.target.files;
        setValue("images", files);

        if (files.length > 0) {
            const previewUrls = Array.from(files).map(file => URL.createObjectURL(file));
            setImagePreview(previewUrls);
        }
    };
    const MAX_VALUE = 1000000000000;
    const onSubmit = async (data) => {
        setLoading(true); // Set loading state to true
        const formDataToSend = new FormData();
        formDataToSend.append("productName", data.product_name);
        formDataToSend.append("price", data.price);
        formDataToSend.append("quantity", data.quantity);
        formDataToSend.append("status", "Còn hàng");
        formDataToSend.append("materialId", data.materialId);
        formDataToSend.append("sizeId", data.sizeId);
        formDataToSend.append("categoryId", data.categoryId);
        formDataToSend.append("describe", data.describe); // Added describe field

        if (data.images) {
            Array.from(data.images).forEach((image) => {
                formDataToSend.append("images", image);
            });
        }

        try {
            if (data.price <= 0) {
                throw new Error("Giá phải lớn hơn 0.");
            }
            if (data.price > MAX_VALUE) {
                throw new Error(`Giá không được vượt quá ${MAX_VALUE}.`);
            }
            if (data.quantity < 0) {
                throw new Error("Số lượng không được âm.");
            }
            if (data.quantity > MAX_VALUE) {
                throw new Error(`Số lượng không được vượt quá ${MAX_VALUE}.`);
            }

            await axios.post("http://localhost:8080/api/admin/product-details/add", formDataToSend, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            notification.success({
                message: 'Thành công!',
                description: 'Sản phẩm đã được tạo thành công!',
                duration: 3,
            });

            // Reset form fields
            Object.keys(data).forEach(key => setValue(key, ""));
            setImagePreview([]);
        } catch (error) {
            console.error("Error creating product:", error);
            notification.error({
                message: 'Lỗi!',
                description: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
                duration: 3,
            });
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="product-create-container">
            <h2 className="product-create-title">Thêm Sản Phẩm Mới</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="product-create-form">
                <div className="product-create-group">
                    <div className="product-create-column">
                        <div>
                            <label className="product-create-label">Tên:</label>
                            <input
                                type="text"
                                {...register("product_name", { required: "Tên sản phẩm là bắt buộc" })}
                                className="product-create-input"
                            />
                            {errors.product_name && <p className="error-product-create">{errors.product_name.message}</p>}
                        </div>
                        <div>
                            <label className="product-create-label">Chất liệu:</label>
                            <select
                                {...register("materialId", { required: "Chất liệu là bắt buộc" })}
                                className="product-create-select"
                            >
                                <option value="">Chọn chất liệu</option>
                                {materials.map((material) => (
                                    <option key={material.materialId} value={material.materialId}>
                                        {material.materialName}
                                    </option>
                                ))}
                            </select>
                            {errors.materialId && <p className="error-product-create">{errors.materialId.message}</p>}
                        </div>
                        <div className="product-create-column">
                            <label className="product-create-label">Mô tả:</label>
                            <textarea
                                {...register("describe", { required: "Mô tả là bắt buộc" })}
                                rows="3"
                                className="product-create-textarea"
                            />
                            {errors.describe && <p className="error-product-create">{errors.describe.message}</p>}
                        </div>
                        <div className="product-create-column">
                            <label className="product-create-label">Ảnh:</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                multiple
                                className="product-create-input"
                            />
                        </div>
                    </div>
                    <div className="product-create-column">
                        <div>
                            <label className="product-create-label">Số lượng:</label>
                            <input
                                type="number"
                                {...register("quantity", { required: "Số lượng là bắt buộc" })}
                                className="product-create-input"
                            />
                            {errors.quantity && <p className="error-product-create">{errors.quantity.message}</p>}
                        </div>
                        <div>
                            <label className="product-create-label">Giá:</label>
                            <input
                                type="number"
                                {...register("price", { required: "Giá là bắt buộc" })}
                                className="product-create-input"
                            />
                            {errors.price && <p className="error-product-create">{errors.price.message}</p>}
                        </div>
                        <div>
                            <label className="product-create-label">Kích thước:</label>
                            <select
                                {...register("sizeId", { required: "Kích thước là bắt buộc" })}
                                className="product-create-select"
                            >
                                <option value="">Chọn kích thước</option>
                                {sizes.map((size) => (
                                    <option key={size.sizeId} value={size.sizeId}>
                                        {size.sizeDescription}
                                    </option>
                                ))}
                            </select>
                            {errors.sizeId && <p className="error-product-create">{errors.sizeId.message}</p>}
                        </div>
                        <div >
                            <label className="product-create-label">Danh mục:</label>
                            <select
                                {...register("categoryId", { required: "Danh mục là bắt buộc" })}
                                className="product-create-select"
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="error-product-create">{errors.categoryId.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="product-create-group">

                </div>
                {imagePreview.length > 0 && (
                    <div className="product-create-previews">
                        {imagePreview.map((url, index) => (
                            <img key={index} src={url} alt={`Preview ${index}`} className="product-create-preview me-3" />
                        ))}
                    </div>
                )}
                <div className="product-create-buttons">
                    <button
                        type="button"
                        onClick={() => navigate(-1)} // Quay lại trang trước đó
                        className="product-create-btn product-create-btn-cancel"
                    >
                        Trở Về
                    </button>


                    <button
                        type="submit"
                        className="product-create-btn product-create-btn-submit"
                        disabled={loading} // Disable button if loading
                    >
                        {loading ? 'Đang lưu...' : "Tạo Mới"} {/* Show loading spinner */}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductCreate;