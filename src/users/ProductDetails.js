import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/productdetails.css';
import imgSize from '../images/stepsizes.jpg';
const ProductDetail = () => {
    const [selectedSize, setSelectedSize] = useState('Size 5');
    const [selectedMaterial, setSelectedMaterial] = useState('bac');
    const [showModal, setShowModal] = useState(false);
  
    const handleSizeChange = (size) => setSelectedSize(size);
    const handleMaterialChange = (material) => setSelectedMaterial(material);
    const [selectedImage, setSelectedImage] = useState(
        "https://lili.vn/wp-content/uploads/2021/12/Day-chuyen-vang-18k-co-bon-la-LILI_482417_11.jpg"
    );

    const handleThumbnailClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    return (
        <div className="product-detail-container">
            <div className="product-detail">
                <div className="row">
                    {/* Product Image Section */}
                    <div className="col-md-6">
                        <img src={selectedImage} alt="Selected Product" className="img-fluid" />
                        <div className="thumbnail-container mt-2">
                            <img
                                src="https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg"
                                alt="thumbnail1"
                                className="img-thumbnail me-3 product-thumbnail"
                                onClick={() => handleThumbnailClick("https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg")}
                            />
                            <img
                                src="https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg"
                                alt="thumbnail2"
                                className="img-thumbnail product-thumbnail"
                                onClick={() => handleThumbnailClick("https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg")}
                            />
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="col-md-6">
                        <h3 className="text-start product-detail-title">Nhẫn bạc nữ VBTG Nhẫn hoa hồng đính đá</h3>
                        <div className="d-flex align-items-center product-price">
                            <span className="text-danger fs-3">₫65,000</span>
                            <span className="text-muted ms-2"><s>₫105,000</s></span>
                        </div>

                        <div className="mt-2 text-start product-detail-rating">
                            <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                            <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                            <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                            <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                            <span className="text-warning"><i className="bi bi-star-half"></i></span>
                            <span className="text-muted ms-2">(328 đánh giá)</span>
                        </div>

                        <div className="text-start mt-4 product-detail-size-selection">
                            <p className="fw-bold">Chọn Size</p>
                            <div className="d-flex">
                                {['Size 5', 'Size 6', 'Size 7', 'Size 8', 'Size 9', 'Size 10'].map((size) => (
                                    <button
                                        key={size}
                                        className={`btn me-2 ${selectedSize === size ? 'btn-primary' : 'btn-outline-primary'} size-button`}
                                        onClick={() => handleSizeChange(size)}
                                    >{size}</button>
                                ))}
                            </div>
                            <button className="btn btn-link mt-2" onClick={() => setShowModal(true)}>
                                Hướng dẫn đo kích cỡ
                            </button>

                            <div className="mt-4 text-start product-detail-quantity-material">
                                <div>
                                    <label className="me-3">Số Lượng:</label>
                                    <input type="number" defaultValue="1" className="form-control d-inline-block" style={{ width: '60px' }} />
                                </div>
                                <div className="mt-3">
                                    <label className="me-2 mt-2">Chất liệu:</label>
                                    <div className='mt-2'>
                                        <button
                                            className={`btn me-2 ${selectedMaterial === 'bac' ? 'silver-button' : 'silver-button-outline'}`}
                                            onClick={() => handleMaterialChange('bac')}
                                        >
                                            Bạc
                                        </button>
                                        <button
                                            className={`btn ${selectedMaterial === 'vang' ? 'gold-button' : 'gold-button-outline'}`}
                                            onClick={() => handleMaterialChange('vang')}
                                        >
                                            Vàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 my-5 d-flex align-items-center product-detail-action-buttons">
                            <div className="">
                                <button className="btn me-2 buy-now-button">Mua Ngay</button>
                                <button className="btn add-to-cart-button">
                                    <i className="bi bi-cart-fill me-1"></i>
                                    Thêm Giỏ Hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Backdrop */}
            {showModal && (
                <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
            )}

            {/* Size Guide Modal */}
            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Hướng dẫn</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <img src={imgSize} alt="Size Guide" className="img-fluid" />
                            <p>Hướng dẫn chi tiết về cách đo kích cỡ.</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="product-reviews mt-5">
                <h4 className="mb-3">Đánh Giá Sản Phẩm</h4>
                <div className="review">
                    <div className="d-flex align-items-center mb-2">
                        <span className="username">malong990</span>
                        <span className="timestamp">2024-07-11 10:54</span>
                    </div>
                    <div className="rating d-flex">
                        <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                        <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                        <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                        <span className="text-warning"><i className="bi bi-star-fill"></i></span>
                        <span className="text-muted"><i className="bi bi-star"></i></span>
                    </div>
                    <p>Rất đẹp và chất lượng tốt, tôi rất hài lòng!</p>
                </div>
                {/* Thêm đánh giá khác tại đây */}
            </div>
            <div className="product-relateds">
                <h4 className="related-title">Sản phẩm liên quan</h4>
                <div className="related-products">
                    {/* Related products here */}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;