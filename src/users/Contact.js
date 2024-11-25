import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/contact.css';
import axios from 'axios';
import { notification } from 'antd';

const Contact = () => {
  const [account, setAccount] = useState({
    fullname: "",
    phone: "",
    email: "",
  });

  const [message, setMessage] = useState("");

  // Fetch user data khi component load
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/contact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      setAccount({
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      showNotification("error", "Không thể lấy thông tin tài khoản.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Hiển thị thông báo
  const showNotification = (type, message) => {
    notification[type]({
      message: type === "error" ? "Lỗi" : "Thông báo",
      description: message,
      duration: 2,
    });
  };

  // Hàm gửi thông tin liên hệ
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Ngừng gửi form mặc định

    const contactMessage = {
      fullname: account.fullname,
      email: account.email,
      phone: account.phone,
      message: message,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/user/contact/send", contactMessage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        showNotification("success", "Thông tin liên hệ đã được gửi.");
      } else {
        showNotification("error", "Có lỗi khi gửi thông tin.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showNotification("error", "Có lỗi khi gửi thông tin liên hệ.");
    }
  };

  return (
    <div className="contact-container my-5">
      <main>
        <div className="row">
          <h2 className="contact-heading">Liên hệ</h2>
        </div>

        <div className="row mb-4">
          <div className='col-lg-7'>
            {/* <div className="col-lg-12"> */}
              <div className="card mb-3">
                <div className="card-body ">
                  <div className="contact-map">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15716.102315191523!2d105.76568493955078!3d10.014745700000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a089cb87ab7abf%3A0x8ded7457828a8ddb!2zUGjhu5UgdGjDtG5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYyBD4bqnbiBUaMah!5e0!3m2!1sen!2s!4v1716190336155!5m2!1sen!2s"
                      width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy">
                    </iframe>
                  </div>
                </div>
              </div>
            {/* </div> */}

            <div className="col-lg-12">
              <div className="card shadow-sm contact-card">
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <h6><strong>Địa chỉ</strong></h6>
                      <p><em>Toà nhà A2, Quang Trung, P, Cái Răng, Cần Thơ</em></p>
                    </div>
                    <div className="col-md-4">
                    <h6><strong>Số điện thoại</strong></h6>
                      <p><em>0799624325</em></p>
                    </div>
                    <div className="col-md-4">
                    <h6><strong>Email</strong></h6>
                      <p><em>gamttpc05905@fpt.edu.vn</em></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className='col-lg-5'>
            <h5 className="contact-heading">Gửi Thông Tin Liên hệ</h5>

            <form className="row g-3" onSubmit={handleSendMessage}>
              <div className="col-md-4">
                <label htmlFor="name" className="form-label">Họ tên</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={account.fullname}
                  onChange={(e) => setAccount({ ...account, fullname: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="dienthoai" className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  value={account.phone}
                  onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                  required
                />
              </div>
              <div className="col-12 mt-3">
                <label htmlFor="message" className="form-label">Nội dung</label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="5"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập nội dung"
                />
              </div>
              <div className="col-12 mt-3">
                <button type="submit" className="contact-button">Gửi ngay</button>
              </div>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Contact;
