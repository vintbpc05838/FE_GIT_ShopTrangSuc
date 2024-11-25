import React from 'react';
import '../css/about.css';  // Replace with your CSS file path
import bannerImage1 from '../images/banner_aboutus1.jpg';  // Replace with the first image path
import bannerImage2 from '../images/banner_aboutus2.webp';  // Replace with the second image path

const About = () => {
    return (
        <div className="about-container">
            {/* First Section */}
            <div className="about-section">
                <div className="image-container">
                    <img src={bannerImage1} alt="Jewelry 1" className="banner-image" />
                </div>
                <div className="text-container">
                    <h2>About Us</h2>
                    <p>
                        Cửa hàng đầu tiên được thành lập vào năm 1999 tại Heilbronn, Đức, vẫn là trụ sở chính cho các chi nhánh của nó. Trong suốt tám năm kinh nghiệm thành công trong lĩnh vực trang sức phát triển cao, công ty đã trải qua những thay đổi kinh doanh lớn để phát triển việc cung cấp và mở rộng cơ sở khách hàng của mình. Việc phát triển từ một thợ kim hoàn nhỏ thành một trong những nhân vật quan trọng trong lĩnh vực trang sức châu Âu, tên thương mại Marni Store được thành lập vào năm 2011. Cuối năm 2011, Marni Store đã đạt được tiến bộ tuyệt vời tại thị trường Anh và Tây Ban Nha bên cạnh Đức.
                    </p>
                </div>
            </div>

            {/* Second Section */}
            <div className="about-section reverse">
            <div className="image-container">
                    <img src={bannerImage2} alt="Jewelry 2" className="banner-image" />
                </div>
                <div className="text-container">
                    <p>
                        Chúng tôi với tư cách là Glamira làm việc không mệt mỏi để đáp ứng nhu cầu của khách hàng một cách chuyên nghiệp và hiệu quả - phù hợp với các giá trị của công ty về sự liêm chính và tin cậy. Marni Store đã phát triển cơ sở hạ tầng Thương mại điện tử đáp ứng tốt điều kiện thuận lợi cho nhu cầu của người tiêu dùng toàn cầu hiện nay với việc cung cấp dịch vụ nhanh chóng và chất lượng cao cho người dùng bằng cách sử dụng công nghệ mới nhất.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default About;
