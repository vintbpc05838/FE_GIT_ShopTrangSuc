import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { notification } from 'antd';
import { Modal, Button } from "react-bootstrap";

const Information = () => {
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    fullname: "",
    phone: "",
    email: "",
    gender: "",
  });


  // Hàm lấy thông tin người dùng từ API
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/user-information", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Lấy token từ localStorage
        },
      });

      const data = response.data;
      setUser({
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
      });

    } catch (error) {
      console.error("Error fetching user data:", error);
      showNotification("error", "Không thể lấy thông tin tài khoản.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const showNotification = (type = "success", message) => {
    notification[type]({
      message: type === "error" ? "Lỗi" : "Thông báo",
      description: message,
      duration: 2,
    });
  };


  // Hàm xử lý khi người dùng cập nhật thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    const phonePattern = /^(0\d{9})$/; // Kiểm tra số điện thoại
    if (!user.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại!";
    } else if (!phonePattern.test(user.phone)) {
      newErrors.phone = "Số điện thoại phải là 10 chữ số và bắt đầu bằng số 0!";
    }
    if (!user.fullname) newErrors.fullname = "Vui lòng nhập tên!";
    if (!user.gender) newErrors.gender = "Vui lòng chọn giới tính!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const updatedUser = {
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
      gender: user.gender === "Nam" ? "Nam" : "Nữ",
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/save/user-information",
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        showNotification("success", "Thông tin đã được lưu thành công!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      const errorMessage = error.response?.data?.message || "Lỗi khi lưu thông tin!";
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleChangePassword = async () => {
    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp không
    setErrors({});

    // Validate inputs
    const validationErrors = {};
    if (!currentPassword) {
      validationErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại!";
    }
    if (!newPassword) {
      validationErrors.newPassword = "Vui lòng nhập mật khẩu mới!";
    } else if (newPassword.length < 6) {
      validationErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự!";
    }
    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    }

    // Nếu có lỗi, hiển thị thông báo
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.put('http://localhost:8080/api/user/save/user-information', {
        currentPassword,
        newPassword,
        confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      showNotification("Mật khẩu đã được thay đổi thành công!");
      setShowModal(false);
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Có lỗi khi thay đổi mật khẩu",
      });
    }
  };

  return (
    <div className="information-container">
      <div className="information-card">
        <div className="information-card-title d-flex">
          <i className="bi bi-person-circle me-2" style={{ fontSize: '1.5rem' }}></i>
          <h5>Thông Tin Cá Nhân</h5>
          <div className="user-doimatkhau">
            <button type="button" onClick={() => setShowModal(true)} class="btn btn-secondary btn-sm">Đổi mật khẩu</button>
          </div>
        </div>
        <div className="information-card-body">
          <form className="formInformation" >
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Họ Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={user.fullname}
                    onChange={(e) => {
                      setUser({ ...user, fullname: e.target.value });
                      if (e.target.value) {
                        setErrors((prevErrors) => {
                          const { fullname, ...rest } = prevErrors; // Xóa lỗi "fullname" khỏi errors
                          return rest;
                        });
                      }
                    }}
                  />
                  {errors.fullname && (
                    <span className="text-danger">{errors.fullname}</span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={user.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUser({ ...user, phone: value });

                      if (!value) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          phone: "Vui lòng nhập số điện thoại!",
                        }));
                      } else if (!/^(0\d{9})$/.test(value)) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          phone: "Số điện thoại phải là 10 chữ số và bắt đầu bằng số 0!",
                        }));
                      } else {
                        setErrors((prevErrors) => {
                          const { phone, ...rest } = prevErrors; // Xóa lỗi "phone" khỏi errors
                          return rest;
                        });
                      }
                    }}
                  />
                  {errors.phone && (
                    <span className="text-danger">{errors.phone}</span>
                  )}
                </div>


              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Giới Tính</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="male"
                        value="male"
                        checked={user.gender === "Nam"}
                        onChange={() => {
                          setUser({ ...user, gender: "Nam" });
                          setErrors((prevErrors) => {
                            const { gender, ...rest } = prevErrors; // Xóa lỗi "gender" khỏi errors
                            return rest;
                          });
                        }}
                      />
                      <label className="form-check-label" htmlFor="male">Nam</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="female"
                        value="female"
                        checked={user.gender === "Nữ"}
                        onChange={() => {
                          setUser({ ...user, gender: "Nữ" });
                          setErrors((prevErrors) => {
                            const { gender, ...rest } = prevErrors; // Xóa lỗi "gender" khỏi errors
                            return rest;
                          });
                        }}
                      />
                      <label className="form-check-label" htmlFor="female">Nữ</label>
                    </div>
                  </div>
                  {errors.gender && (
                    <span className="text-danger">{errors.gender}</span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    readOnly
                  />
                </div>
                <div className="d-flex justify-content-end">
                  {/* <button type="button" className="btn xoa-btn"
                  // onClick={handleDeleteAccount}
                  >Xóa tài khoản</button> */}
                  <button
                    type="submit"
                    className="btn save-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>


      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="management-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title><h5>Đổi mật khẩu</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-admin-information">
            <div className="row">
              {/* Mật khẩu hiện tại */}
              <div className="mb-3">
                <label className="form-label-admin-information">
                  Mật khẩu hiện tại:<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-control-admin-information"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                {errors.currentPassword && (
                  <span className="text-danger">{errors.currentPassword}</span>
                )}
              </div>
              <hr></hr>

              {/* Mật khẩu mới */}
              <div className="mb-3">
                <label className="form-label-admin-information">
                  Mật khẩu mới:<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-control-admin-information"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {errors.newPassword && (
                  <span className="text-danger">{errors.newPassword}</span>
                )}
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="mb-3">
                <label className="form-label-admin-information">
                  Xác nhận lại mật khẩu:<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-control-admin-information"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {errors.confirmPassword && (
                  <span className="text-danger">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Lỗi từ API */}
              {errors.api && <div className="text-danger">{errors.api}</div>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleChangePassword} className="admin-information-button">Lưu cập nhật</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Information;
