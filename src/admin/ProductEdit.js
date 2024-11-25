import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/admin/ProductEdit.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from 'antd';

const ProductEdit = ({ product, onUpdate, onCancel, materials, sizes, categories }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        product_name: '',
        price: '',
        describe: '',
        quantity: '',
        materialId: '',
        sizeId: '',
        categoryId: '',
        status: '',
        images: [],
    });
    const [message, setMessage] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [visible, setVisible] = useState(false); // State for modal visibility
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (product) {
            setFormData({
                id: product.detailProductId || '',
                product_name: product.productName || '',
                price: product.price || '',
                describe: product.describe || '',
                quantity: product.quantity || '',
                materialId: product.material ? product.material.materialId : '',
                sizeId: product.size ? product.size.sizeId : '',
                categoryId: product.productCategory ? product.productCategory.categoryId : '',
                status: product.status || 'Còn hàng',
                images: [],
            });
            setImagePreviews(product.images.map(image => image.imageUrl)); // Hiển thị hình ảnh hiện tại
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setFormData({ ...formData, images: files });
        setImagePreviews(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedData = new FormData();
            updatedData.append('productName', formData.product_name); // Ensure productName is included
            // updatedData.append('status', formData.status);
            updatedData.append("price", formData.price);
            updatedData.append("quantity", formData.quantity);
            updatedData.append("materialId", formData.materialId);
            updatedData.append("sizeId", formData.sizeId);
            updatedData.append("categoryId", formData.categoryId);
            updatedData.append("describe", formData.describe);
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(file => updatedData.append('images', file)); // Append each image file
                } else {
                    updatedData.append(key, value);
                }
            });
            await onUpdate(updatedData);
            // setMessage('Sản phẩm đã được cập nhật thành công!');
            // alert('Cập nhật sản phẩm thành công');
            onCancel();
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            // setMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };
    const showModal = (index) => {
        setCurrentImageIndex(index);
        setVisible(true);
    };

    const handleCancelModal = () => {
        setVisible(false);
        setCurrentImageIndex(0);
    };
    return (
        <div className="product-edit-container">
            <h1 className="product-edit-title">Cập nhật Sản Phẩm</h1>
            {message && <div className="product-edit-message">{message}</div>}
            <form onSubmit={handleSubmit} className="product-edit-form">
                <div className="product-edit-field">
                    <label>ID:</label>
                    <input type="text" name="id" value={formData.id} readOnly required className="product-edit-input" />
                </div>
                <div className="product-edit-field">
                    <label>Tên:</label>
                    <input type="text" name="product_name" value={formData.product_name} onChange={handleInputChange} required className="product-edit-input" />
                </div>
                <div className="product-edit-field">
                    <label>Chất liệu:</label>
                    <select name="materialId" value={formData.materialId} onChange={handleInputChange} required className="product-edit-select">
                        <option value="">Chọn chất liệu</option>
                        {materials.map((material) => (
                            <option key={material.materialId} value={material.materialId}>{material.materialName}</option>
                        ))}
                    </select>
                </div>
                <div className="product-edit-field">
                    <label>Kích thước:</label>
                    <select name="sizeId" value={formData.sizeId} onChange={handleInputChange} required className="product-edit-select">
                        <option value="">Chọn kích thước</option>
                        {sizes.map((size) => (
                            <option key={size.sizeId} value={size.sizeId}>{size.sizeDescription}</option>
                        ))}
                    </select>
                </div>
                <div className="product-edit-field">
                    <label>Số lượng:</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required className="product-edit-input" />
                </div>
                <div className="product-edit-field">
                    <label>Giá:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="product-edit-input" />
                </div>
                <div className="product-edit-field">
                    <label>Trạng thái:</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="product-edit-select">
                        <option value="">Chọn trạng thái</option>
                        <option value="Còn hàng">Còn hàng</option>
                        <option value="Hết hàng">Hết hàng</option>
                    </select>
                </div>
                <div className="product-edit-field">
                    <label>Danh mục:</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required className="product-edit-select">
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                        ))}
                    </select>
                </div>
                <div className="product-edit-field">
                    <label>Mô tả:</label>
                    <textarea name="describe" value={formData.describe} onChange={handleInputChange} required className="product-edit-textarea" />
                </div>
                <div className="product-edit-field-image">
                    <label>Ảnh:</label>
                    <input type="file" name="images" onChange={handleFileChange} className="product-edit-file" multiple />
                    <div className="product-edit-image-gallery">
                        <a href="#" onClick={(e) => { e.preventDefault(); showModal(0); }}>Xem tất cả hình ảnh</a>
                    </div>
                </div>
                <div className="product-edit-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="product-back-button"
                        disabled={loading} // Vô hiệu hóa khi đang loading
                    >
                        Trở Về
                    </button>
                    <button
                        type="submit"
                        className="product-edit-button"
                        disabled={loading} // Vô hiệu hóa khi đang loading
                    >
                        {loading ? 'Đang lưu...' : 'Lưu'} {/* Hiển thị trạng thái */}
                    </button>
                </div>

            </form>
            {/* Modal để hiển thị hình ảnh */}
            <Modal
                visible={visible}
                footer={null}
                onCancel={handleCancelModal}
                width={800}
            >
                <div className="modal-image-gallery" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
                    {imagePreviews.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Image ${index}`}
                            style={{ width: '80px', height: 'auto', margin: '5px', cursor: 'pointer' }} // Kích thước nhỏ hơn cho hình ảnh
                            onClick={() => setCurrentImageIndex(index)} // Set current image index on click
                        />
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={imagePreviews[currentImageIndex]}
                        alt="Selected"
                        style={{ width: '100%', maxWidth: '500px', height: 'auto' }} // Giới hạn chiều rộng tối đa
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ProductEdit;