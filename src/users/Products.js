import React, { useState } from 'react';
import '../css/product.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
const Products = () => {
    const listProducts = [
        {
            id: 1,
            image: "https://lili.vn/wp-content/uploads/2021/12/Day-chuyen-vang-18k-co-bon-la-LILI_482417_11.jpg",
            ten_san_pham: "Dây chuyền vàng",
            gia: "5.499.000",
            gia_khuyen_mai: "4.999.000"
        },
        {
            id: 2,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 3,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 4,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 5,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 6,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 7,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 8,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 9,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 10,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 11,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 12,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },
        {
            id: 13,
            image: "https://lili.vn/wp-content/uploads/2022/05/Bong-tai-bac-nu-tron-ma-vang-dinh-da-CZ-hinh-chiec-la-LILI_945749_2.jpg",
            ten_san_pham: "Bông tai bạc nữ tròn mạ vàng hình chiếc lá",
            gia: "5.000.000",
            gia_khuyen_mai: "4.500.000"
        },

        // Thêm sản phẩm khác nếu cần
    ];
    const itemsPerPage = 9; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages based on products
    const totalPages = Math.ceil(listProducts.length / itemsPerPage);

    // Function to handle pagination
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Get current items based on the current page
    const currentItems = listProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    return (
        <div className="custom-container">
            <main>
                <div className="custom-row">
                    <div className="custom-col-4 me-5">
                        <h4 className="text-title-list">
                            <i className="bi bi-justify custom-icon"></i> Danh mục
                        </h4>
                        <div className="custom-menu">
                            <ul className="custom-menu-list">
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-earrings me-2"></i> Bông tai</a>
                                </li>
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-gem me-2"></i> Nhẫn</a>
                                </li>
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-bracelet me-2"></i> Vòng tay</a>
                                </li>
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-necklace me-2"></i> Dây chuyền</a>
                                </li>
                            </ul>
                        </div>

                        <h4 className="text-title-list">
                            <i className="bi bi-headphones custom-icon"></i> Hỗ trợ khách hàng
                        </h4>
                        <div className="custom-menu">
                            <ul className="custom-menu-list">
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-house-door me-2"></i> Trang chủ</a>
                                </li>
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-info-circle me-2"></i> Giới thiệu</a>
                                </li>
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-box me-2"></i> Tất cả sản phẩm</a>
                                </li>
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-newspaper me-2"></i> Tin tức</a>
                                </li>
                                <li className="custom-menu-item">
                                    <a href="/"><i className="bi bi-envelope me-2"></i> Liên hệ</a>
                                </li>
                            </ul>
                        </div>

                        <h4 className="text-title-list">
                            <i className="bi bi-tags-fill custom-icon"></i> Sản phẩm nổi bật
                        </h4>
                        {listProducts.slice(0, 2).map(product => (
                            <div className="custom-product-highlight" key={product.id}>
                                <img src={product.image} alt={product.ten_san_pham} className="custom-product-image" />
                                <div className="custom-product-info">
                                    <h6 className="custom-product-title">{product.ten_san_pham}</h6>
                                    <p className="custom-product-price">
                                        <del className="text-muted">{product.gia}đ</del>
                                    </p>
                                    <p className="custom-product-discounted-price text-danger">{product.gia_khuyen_mai}đ</p>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="custom-col-7">
                        <h2 className="text-start">Tất cả sản phẩm</h2>
                        <div className="custom-filter-bar">
                            {/* <div className="filter-option">
        <select id="category" className="form-select">
            <option value="all">Tất cả</option>
            <option value="bong-tai">Bông tai</option>
            <option value="nhan">Nhẫn</option>
            <option value="vong-tay">Vòng tay</option>
            <option value="day-chuyen">Dây chuyền</option>
        </select>
    </div> */}
                            <div className="filter-option">
                                {/* <label htmlFor="price">Khoảng giá:</label> */}
                                <select id="price" className="form-select">
                                    <option value="all">Tất cả</option>
                                    <option value="0-2">Dưới 2 triệu</option>
                                    <option value="2-5">2 triệu - 5 triệu</option>
                                    <option value="5-10">5 triệu - 10 triệu</option>
                                    <option value="above-10">Trên 10 triệu</option>
                                </select>
                            </div>
                        </div>

                        <div className="custom-product-list row">
                            {currentItems.map((product, index) => (
                                <div className="custom-product-card col-md-4" key={product.id}>
                                    <img src={product.image} className="custom-card-img-top" alt={product.ten_san_pham} />
                                    <div className="custom-card-body">
                                        <h6 className="custom-card-title">{product.ten_san_pham}</h6>
                                        <div className="custom-card-text">
                                            <p className="custom-card-text-price">
                                                <del className="text-muted">{product.gia}đ</del>
                                            </p>
                                            <p className="custom-card-text-promotion text-danger">{product.gia_khuyen_mai}đ</p>
                                        </div>
                                        <div className="custom-product-actions">
                                            <a href={`/home/giohang/add/${product.id}`} className="custom-btn">
                                                <i className="bi bi-cart"></i>
                                            </a>
                                            <a href={`/home/detail/${product.id}`} className="custom-btn">
                                                <i className="bi bi-search-heart"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination */}
                        <nav aria-label="Page navigation">
                            <ul className="custom-pagination justify-content-end">
                                <li className="custom-page-item">
                                    <button
                                        className="custom-page-link"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        &lt; {/* Left arrow */}
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <li className={`custom-page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
                                        <button
                                            className="custom-page-link"
                                            onClick={() => paginate(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className="custom-page-item">
                                    <button
                                        className="custom-page-link"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        &gt; {/* Right arrow */}
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Products;