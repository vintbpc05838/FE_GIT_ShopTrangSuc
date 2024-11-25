import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/news.css';

const articles = [
    {
        id: 1,
        title: "Cắt giữ với các vật phẩm có sẵn trong nhà",
        imgSrc: "https://bizweb.dktcdn.net/thumb/1024x1024/100/376/737/articles/untitled-1.png?v=1580810555147",
        description: "Nếu bạn đang tìm kiếm cách để giữ gìn đồ đạc của mình..."
    },
    {
        id: 2,
        title: "Tăng thêm vận may với đá lục ngọc bảo cho cung Kim Ngưu",
        imgSrc: "https://bizweb.dktcdn.net/thumb/large/100/376/737/articles/untitled-2.png?v=1580808990447",
        description: ""
    },
    {
        id: 3,
        title: "Mách bạn cách phối trang sức ngọc trai đẹp nhất",
        imgSrc: "https://bizweb.dktcdn.net/thumb/large/100/376/737/articles/untitled-4.png?v=1580808589980",
        description: ""
    },
    {
        id: 4,
        title: "Mách bạn cách bảo quản trang sức vàng ý đúng cách",
        imgSrc: "https://bizweb.dktcdn.net/thumb/large/100/376/737/articles/untitled-5.png?v=1580808467993",
        description: ""
    },
    {
        id: 5,
        title: "Chọn màu trang sức phù hợp với 4 nguyên tố hoàng đạo",
        imgSrc: "https://bizweb.dktcdn.net/thumb/large/100/376/737/articles/untitled-6.png?v=1580782973573",
        description: ""
    }
];

const News = () => {
    return (
        <div className="news-container">
            <div className="row">
                <div className="col-md-4">
                    <div className="news-list">
                        <h2 className="news-title">Danh mục tin tức</h2>
                        <ul className="news-list-items list-unstyled mb-4">
                            <li><a href="/">Trang chủ</a></li>
                            <li><a href="/about">Giới thiệu</a></li>
                            <li><a href="/product">Tất cả sản phẩm</a></li>
                            <li><a href="/news">Tin tức</a></li>
                            <li><a href="/contact">Liên hệ</a></li>
                        </ul>
                        <h6 className="news-title">Top tin nổi bật</h6>
                        <ul className="list-unstyled">
                            {articles.slice(0, 3).map(article => (
                                <li key={article.id} className="top-article mb-3">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <img src={article.imgSrc} alt={article.title} className="img-fluid" />
                                        </div>
                                        <div className="col-md-8">
                                            <h4>{article.title}</h4>
                                        </div>
                                    </div>
                                    <hr></hr>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-md-8">
                    <h2 className="news-title">Tin tức nổi bật</h2>
                    <div className="featured-article mb-2">
                        <img src={articles[0].imgSrc} alt="Article 1" className="img-fluid" />
                        <h3>{articles[0].title}</h3>
                        <p>{articles[0].description}</p>
                    </div>
                    <div className="row">
                        {articles.slice(1).map(article => (
                            <div className="col-md-6" key={article.id}>
                                <div className="small-article">
                                    <img src={article.imgSrc} alt={article.title} className="img-fluid" />
                                    <p>{article.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;