import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/home.css';
import { Link } from 'react-router-dom';
import carousel2 from '../images/carousel-2.webp';
import imgNews1 from '../images/img-news1.webp';
import imgNews2 from '../images/img-news5.webp';
const Home = () => {
  const products = [
    {
      id: 1,
      ten_san_pham: 'Vòng tay',
      image: { duong_dan: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2qeMcVUeekBoVUzZ8eRp0XniJBP3EfGBIsQ&s', mo_ta: 'Vòng tay' },
      getPricePromotion: () => 200000,
      promotion: { getRemainingTime: () => 'Active', ngay_kt: new Date() }
    },
    {
      id: 2,
      ten_san_pham: 'Vòng cổ',
      image: { duong_dan: 'https://images.squarespace-cdn.com/content/v1/5fc46ed50b6b03258f4c2bb4/1609927797444-CLOCEAVDTGRYUTJHPATY/lich-su-phat-trien-cua-trang-suc-2.jpg', mo_ta: 'Vòng cổ' },
      getPricePromotion: () => 300000,
      promotion: null
    },
    {
      id: 3,
      ten_san_pham: 'Bông tai',
      image: { duong_dan: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/337/476/products/thiet-ke-khong-ten-2021-08-26t122351-989.png?v=1629957399787', mo_ta: 'Bông tai' },
      getPricePromotion: () => 150000,
      promotion: { getRemainingTime: () => 'Expired', ngay_kt: new Date() }
    },
    {
      id: 4,
      ten_san_pham: 'Bông tai',
      image: { duong_dan: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/337/476/products/thiet-ke-khong-ten-2021-08-26t122351-989.png?v=1629957399787', mo_ta: 'Bông tai' },
      getPricePromotion: () => 150000,
      promotion: { getRemainingTime: () => 'Expired', ngay_kt: new Date() }
    },
  ];

  const promotion = {
    getRemainingTime: () => 'Còn 2 giờ',
    ngay_kt: { time: new Date().getTime() + 7200000 }
  };

  return (
    <div>
      <header>
        <div className="header-bottom">
          {/* <Carousel /> */}
          <TopList />
          <Services />
        </div>
      </header>

      <main>
        <NewProduct products={products} />
        <div className="">
          <img
            alt="Banner"
            src={carousel2}
            width="100%"
          />
        </div>
        <AllProducts products={products} />
        <TopNews />
        <TopProduct />
      </main>
    </div>
  );
};
const TopList = () => (
  <div className="TopList">
    <div className="container">
      <div className="row">
        <div className="col-12 text-end mb-4">
          <h1>Top danh mục</h1>
        </div>
      </div>
      <div className="row g-4">
        <CategoryCard imageSrc="https://www.junie.vn/cdn/shop/files/vong-tay-amanda-14.jpg?v=1696476825" title="# Vòng tay" />
        <CategoryCard imageSrc="https://bizweb.dktcdn.net/100/376/737/themes/894814/assets/banner_col_1.jpg?1676271560514" title="# Vòng cổ" />
        <CategoryCard imageSrc="https://bizweb.dktcdn.net/100/376/737/themes/894814/assets/banner_col_2.jpg?1676271560514" title="# Bông tai" />
      </div>
    </div>
  </div>
);

const CategoryCard = ({ imageSrc, title }) => (
  <div className="col-4">
    <div className="category-card">
      <img src={imageSrc} className="card-img-top mb-3" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
      </div>
    </div>
  </div>
);

const Services = () => (
  <div className="services">
    <div className="container my-5">
      <div className="row g-4">
        <ServiceCard icon="bi-arrow-clockwise" title="Đổi trả hàng" text="Trong vòng 24h" />
        <ServiceCard icon="bi-car-front" title="Miễn phí giao hàng" text="Với đơn hàng > 500k" />
        <ServiceCard icon="bi-telephone-inbound" title="Hỗ trợ trực tuyến" text="1900 6750" />
        <ServiceCard icon="bi-coin" title="Thanh toán" text="An toàn, Bảo mật" />
      </div>
    </div>
  </div>
);

const ServiceCard = ({ icon, title, text }) => (
  <div className="col-3">
    <div className="card text-center">
      <div className="card-body d-flex align-items-center">
        <i className={`bi ${icon} me-4`} style={{ fontSize: '3rem', color: 'red' }}></i>
        <div>
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{text}</p>
        </div>
      </div>
    </div>
  </div>
);

const NewProduct = ({ products }) => (
  <section className="NewProduct my-5">
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 mb-3">
          <h2 className="header-title text-start">Sản phẩm mới</h2>
        </div>
        <div className="col-md-4 text-end mb-3">
          <a href="sanpham" className="btn btn-warning">Xem thêm sản phẩm</a>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.slice(0, 4).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </section>
);
const ProductCard = ({ product }) => (
  <div className="col">
    <div className="card text-center product-card">
      <div className="product-image">
        <img src={product.image.duong_dan} className="card-img-top" alt={product.image.mo_ta} />
        <div className="product-actions">
          <a href={`/home/giohang/add/${product.id}`} className="btn btn-secondary btn-lg me-3">
            <i className="bi bi-cart"></i>
          </a>
          <a href={`/home/detail/${product.id}`} className="btn btn-secondary btn-lg">
            <i className="bi bi-search-heart"></i>
          </a>
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">{product.ten_san_pham}</h5>
        <p className="card-text">Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.getPricePromotion())}</p>
      </div>
    </div>
  </div>
);
const DealProduct = ({ products, promotion }) => (
  <section className="DealProduct">
    <div className="container my-5">
      <div className="row align-items-center g-5">
        <div className="col-md-6">
          <h2 className="text-dark header-title">Deal chớp nhoáng</h2>
        </div>
        <div className="col-md-6 text-end">
          <h3 className="text-primary">
            <input type="hidden" id="promotion-end-timestamp" value={promotion.ngay_kt.time} />
            {promotion.getRemainingTime() === 'Expired' ? (
              <p>Hết hạn</p>
            ) : (
              <p>Thời gian kết thúc: {promotion.getRemainingTime()}</p>
            )}
          </h3>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-2">
        {products.slice(0, 3).map(product => (
          <DealProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </section>
);
const DealProductCard = ({ product }) => (
  <div className="col g-2">
    <div className="card mb-3" style={{ maxWidth: '500px' }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img src={product.image.duong_dan} className="img-fluid rounded-start" alt={product.image.mo_ta} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{product.ten_san_pham}</h5>
            <p className="card-text">Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.getPricePromotion())}</p>
            {product.promotion == null || product.promotion.getRemainingTime() === 'Expired' ? (
              <p className="card-text"><small className="text-muted">Hết hạn</small></p>
            ) : (
              <p className="card-text"><small className="text-muted">Kết thúc vào {product.promotion.ngay_kt.toLocaleDateString()}</small></p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AllProducts = ({ products }) => (
  <section className="AllProduct my-5">
    {/* <nav className="navbar-allproduct navbar-expand-lg navbar-light mb-4">
      <div className="container">
        <h3 className="display-4 fw-bold me-5">Tất cả sản phẩm</h3>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item"><a className="nav-link" href="#">Vòng tay</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Nhẫn</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Bông tai</a></li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link " href="sanpham">Xem tất cả sản phẩm</a></li>
          </ul>
        </div>
      </div>
    </nav> */}

    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-start fw-bold">Tất cả sản phẩm</h2>
        <Link to="/product" className="btn btn-warning">Tất cả sản phẩm</Link>
      </div>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.slice(2, 6).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </section>
);
const TopNews = () => (
  <section className="TopNews">
    <h1>Tin tức nổi bật</h1>
    <div class="TopNews-container">
      <div className="row">
        <div className="col-md-6 ">
          <div className="TopNews-item">
            <img src={imgNews1} className="card-img-top mb-2" alt="News" />
            <div className="TopNews-content">
              <p>Cắt giữ với các vật phẩm có sẵn trong nhà</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 ">

          <div className="TopNews-item">
            <img src={imgNews2} className="card-img-top mb-2" alt="News" />
            <div className="TopNews-content">
              <p>Chọn màu trang sức phù hợp với 4 nguyên tắc hoàng đạo</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
);
const TopProduct = () => (
  <section className="TopProduct">
    <div className="container">
      <div className="row justify-content-end">
        <h3 className="text-end mb-4 px-5">Top sản phẩm được khách hàng xem nhiều nhất</h3>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="row g-0">
              <div className="col-md-4">
                <img src="https://bizweb.dktcdn.net/100/376/737/products/28-e085f513-d466-44eb-871e-72441a6b15cc.jpg" className="img-fluid rounded-start" alt="Bông tai" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">BÔNG TAI DÂU TÂY CELEBRATORY</h5>
                  <p className="card-text">3,500,000đ</p>
                  <p className="card-text"><small className="text-muted">Kết thúc trong Hết hạn</small></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="row g-0">
              <div className="col-md-4">
                <img src="https://bizweb.dktcdn.net/100/376/737/products/1-e7df17d2-976d-4028-950c-2f90ac3603a9.jpg?v=1580867318857" className="img-fluid rounded-start" alt="Dây chuyền" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">DÂY CHUYỀN VÀNG JESSO</h5>
                  <p className="card-text">3,500,000đ</p>
                  <p className="card-text"><small className="text-muted">Kết thúc trong Hết hạn</small></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Home;