import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import "../css/admin/Management.css";
import axios from "axios";
import { notification } from "antd";

const Management = () => {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        gender: "", // Default gender
        status: "Hoạt động",
    });
    const [errorMessage, setErrorMessage] = useState("");


    const [cities, setCities] = useState([]);
    const [newAddress, setNewAddress] = useState({
        address: "",
        city: "",
        district: "",
        isDefault: true,
    });
    const [districts, setDistricts] = useState([]);

    // Lấy danh sách tỉnh thành
    const fetchCities = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const handleCityChange = (e) => {
        const selectedCity = cities.find((city) => city.name === e.target.value);
        setNewAddress({ ...newAddress, city: e.target.value, district: "" });
        setDistricts(selectedCity ? selectedCity.districts : []); // Cập nhật danh sách quận/huyện khi chọn thành phố
    };

    const handleDistrictChange = (e) => {
        setNewAddress({ ...newAddress, district: e.target.value });
    };



    // Fetch all managers on component mount
    const fetchManagers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/api/admin/accounts/manager', {
                headers: { Authorization: `Bearer ${token}` } // Thêm token vào header
            });
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching managers:", error);
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        fetchCities();
        fetchManagers();
    }, []);


    const handleShow = (user) => {
        setSelectedUser(user);
        setNewUser(user); // Set the selected user data to the form
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleAddUser = async () => {
        setErrorMessage(""); // Xóa thông báo lỗi cũ
    
        // Kiểm tra các trường bắt buộc
        if (!newUser.fullname || !newUser.email || !newUser.password || !newUser.phone || !newUser.gender || !newUser.address) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin!");
            return;
        }
    
        // Kiểm tra định dạng email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(newUser.email)) {
        showNotification("error", "Email không hợp lệ!");
        return;
    }
    
        // Kiểm tra độ dài mật khẩu
        if (newUser.password.length < 6) {
            setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }
    
        // Kiểm tra số điện thoại
        if (newUser.phone.length < 10) {
            setErrorMessage("Số điện thoại phải có ít nhất 10 ký tự.");
            return;
        }

        const phonePattern = /^[0-9]+$/; // Chỉ chấp nhận số
        if (!phonePattern.test(newUser.phone)) {
            showNotification("error", "Số điện thoại chỉ được chứa các ký tự số.");
            return;
        }
    
        const token = localStorage.getItem('token');
        try {
            const updatedUser = {
                fullname: newUser.fullname,
                email: newUser.email,
                phone: newUser.phone,
                password: newUser.password,
                gender: newUser.gender === "Nam" ? "Nam" : "Nữ",
                status: newUser.status,
                addresses: [
                    {
                        address: newUser.address,
                        city: newAddress.city,
                        district: newAddress.district,
                        isDefault: newAddress.isDefault,
                    },
                ],
            };
    
            const response = await axios.post(
                'http://localhost:8080/api/admin/accounts/managers',
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response.status === 201) {
                showNotification("success", "Tạo quản lý thành công!");
                setAdmins((prevAdmins) => [...prevAdmins, response.data]);
                setNewUser({
                    ...newUser,
                    addresses: response.data.addresses,
                    fullname: "",
                    email: "",
                    phone: "",
                    password: "",
                    gender: "",
                    status: "Hoạt động",
                });
                setShowAddModal(false);
                fetchManagers();
            }
        } catch (error) {
            if (error.response) {
                const message =
                    error.response.data === "Email này đã được đăng ký. Vui lòng sử dụng email khác."
                        ? error.response.data
                        : error.response.data.message || "Không thể thêm tài khoản.";
                showNotification("error", message);
            } else {
                showNotification("error", "Đã có lỗi xảy ra, vui lòng thử lại sau.");
            }
        }
    };
    

    const showNotification = (type, message) => {
        notification[type]({
            message: type === "error" ? "Lỗi" : "Thông báo",
            description: message,
            duration: 2,
        });
    }



    return (
        <div className="management-container mt-4">
            <div className="card p-4">
                <h2 className="management-title">Danh sách quản lý</h2>
                <div className="d-flex align-items-center mb-0">
                    <input
                        type="text"
                        className="form-control management-input me-2"
                        placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "400px", height: "40px" }}
                    />
                    <Button
                        variant="success"
                        onClick={() => setShowAddModal(true)}
                        className="management-button"
                    >
                        Thêm
                    </Button>
                </div>

                {isLoading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <div className="sales-table-container">
                        <table className="table management-table table-striped">
                            <thead>
                                <tr>
                                    <th className="management-th">Tên</th>
                                    <th className="management-th">Email</th>
                                    <th className="management-th">Giới tính</th>
                                    <th className="management-th">Số điện thoại</th>
                                    <th className="management-th">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">Không có quản lý nào.</td>
                                    </tr>
                                ) : (
                                    admins
                                        .filter(
                                            (admin) =>
                                                admin.fullname
                                                    .toLowerCase()
                                                    .includes(searchTerm.toLowerCase()) ||
                                                admin.email
                                                    .toLowerCase()
                                                    .includes(searchTerm.toLowerCase()) ||
                                                admin.phone.includes(searchTerm)
                                        )
                                        .map((admin) => (
                                            <tr
                                                key={admin.accountId}
                                                onClick={() => handleShow(admin)}
                                                className="management-tr"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <td className="management-td">{admin.fullname}</td>
                                                <td className="management-td">{admin.email}</td>
                                                <td className="management-td">{admin.gender}</td>
                                                <td className="management-td">{admin.phone}</td>
                                                <td className="management-td">{admin.status}</td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal để chỉnh sửa thông tin người dùng */}
            {showModal && selectedUser && (
                <Modal show={showModal} onHide={handleClose} className="management-modal" size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title><h5>Chi tiết quản lý</h5></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-management">
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label className="form-label-management">
                                            Tên:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control-management"
                                            value={newUser.fullname}
                                            readOnly // Chỉ đọc
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label-management">
                                            Email:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control-management"
                                            value={newUser.email}
                                            readOnly // Chỉ đọc
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label-management">
                                            Số điện thoại:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control-management"
                                            value={newUser.phone}
                                            readOnly // Chỉ đọc
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label-management">
                                            Mật khẩu:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control-management"
                                            value={newUser.password}
                                            readOnly // Chỉ đọc
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label className="form-label-management">
                                            Giới tính:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="form-check-staff">
                                            <input
                                                type="radio"
                                                className="form-check-input-management"
                                                id="male"
                                                name="gioiTinh"
                                                value="Nam"
                                                checked={newUser.gender === "Nam"}
                                                disabled // Vô hiệu hóa
                                            />
                                            <label className="form-check-label-management" htmlFor="male">
                                                Nam
                                            </label>
                                            <input
                                                type="radio"
                                                className="form-check-input-management"
                                                id="female"
                                                name="gioiTinh"
                                                value="Nữ"
                                                checked={newUser.gender === "Nữ"}
                                                disabled // Vô hiệu hóa
                                            />
                                            <label className="form-check-label-management" htmlFor="female">
                                                Nữ
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label-management">
                                            Địa chỉ:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <textarea
                                            value={newUser.addresses && newUser.addresses.length > 0
                                                ? newUser.addresses.map((address) => `${address.address} (${address.city}, ${address.district})`).join("\n")
                                                : "Chưa cập nhật"}
                                            readOnly // Chỉ đọc
                                            rows="5"
                                        />
                                    </div>



                                    <div className="mb-3">
                                        <label className="form-label-management">Trạng thái</label>
                                        <input
                                            type="text"
                                            className="form-control-management"
                                            value={newUser.status}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, status: e.target.value })
                                            }
                                            readOnly // Chỉ đọc
                                        />
                                        {/* <select
                                            className="form-control-management"
                                            value={newUser.status}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, status: e.target.value })
                                            }
                                        >
                                            <option value="Hoạt động">Hoạt động</option>
                                            <option value="Tạm khóa">Tạm khóa</option>
                                        </select> */}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            className="management-button"
                        >
                            Đóng
                        </Button>
                        {/* <Button
                            variant="danger"
                            onClick={() => handleDelete(selectedUser.accountId)}
                            className="management-button"
                        >
                            Xóa
                        </Button> */}
                        {/* <Button
                            variant="primary"
                            onClick={handleSave}
                            className="management-button"
                        >
                            Lưu thay đổi
                        </Button> */}
                    </Modal.Footer>
                </Modal>
            )}



            {/* Modal để thêm người dùng mới */}
            <Modal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                className="management-modal"
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title><h5>Thêm mới quản lý</h5></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-management">
                        <div className="row">
                            <div className="col-6">
                                {/* Input fields for user details */}
                                <div className="mb-3">
                                    <label className="form-label-management">Tên:<span style={{ color: "red" }}>*</span></label>
                                    <input type="text" className="form-control-management" value={newUser.fullname}
                                        onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })} />
                                    {errorMessage && !newUser.fullname && (
                                        <small className="text-danger">{errorMessage}</small> // Hiển thị thông báo lỗi dưới trường nhập
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-management">Email:<span style={{ color: "red" }}>*</span></label>
                                    <input type="email" className="form-control-management" value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                    {errorMessage && !newUser.email && (
                                        <small className="text-danger">{errorMessage}</small> // Hiển thị thông báo lỗi
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label-management">Mật khẩu:<span style={{ color: "red" }}>*</span></label>
                                    <input type="password" className="form-control-management" value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                                    {errorMessage && newUser.password.length < 6 && (
                                        <small className="text-danger">Mật khẩu phải có ít nhất 6 ký tự!</small>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-management">Số điện thoại:<span style={{ color: "red" }}>*</span></label>
                                    <input type="text" className="form-control-management" value={newUser.phone}
                                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
                                    {errorMessage && newUser.phone.length < 10 && (
                                        <small className="text-danger">Số điện thoại phải có ít nhất 10 ký tự.</small>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-management">Giới tính:<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-check-staff">
                                        <input type="radio" className="form-check-input-management" id="male" name="gender" value="Nam"
                                            checked={newUser.gender === "Nam"} onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })} />
                                        <label className="form-check-label-management" htmlFor="male">Nam</label>
                                        <input type="radio" className="form-check-input-management" id="female" name="gender" value="Nữ"
                                            checked={newUser.gender === "Nữ"} onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })} />
                                        <label className="form-check-label-management" htmlFor="female">Nữ</label>
                                    </div>
                                    {errorMessage && !newUser.gender && (
                                        <small className="text-danger">Vui lòng chọn giới tính!</small>
                                    )}
                                </div>
                            </div>
                            <div className="col-6">

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label-management">Địa chỉ:<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control-management"
                                        id="address"
                                        value={newUser.address}
                                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                                    />
                                    {errorMessage && !newUser.address && (
                                        <small className="text-danger">{errorMessage}</small> // Hiển thị thông báo lỗi dưới trường nhập
                                    )}
                                </div>
                                {/* Thành phố */}
                                <div className="mb-3">
                                    <label htmlFor="city-select" className="form-label-management">Tỉnh/Thành Phố:<span style={{ color: "red" }}>*</span></label>
                                    <select
                                        id="city-select"
                                        className="form-control-management"
                                        value={newAddress.city || ""}
                                        onChange={handleCityChange}
                                    >
                                        <option value="">Chọn Tỉnh/Thành Phố</option>
                                        {cities.map((city) => (
                                            <option key={city.code} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="district-select" className="form-label-management">Quận/Huyện:<span style={{ color: "red" }}>*</span></label>
                                    <select
                                        id="district-select"
                                        className="form-control-management"
                                        value={newAddress.district || ""}
                                        onChange={handleDistrictChange}
                                    >
                                        <option value="">Chọn Quận/Huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.code} value={district.name}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-management">Trạng thái</label>
                                    <input
                                        type="text"
                                        className="form-control-management"
                                        value={newUser.status}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, status: e.target.value })
                                        }
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)} className="management-button">Đóng</Button>
                    <Button variant="primary" onClick={handleAddUser} className="management-button">Thêm quản lý</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Management;
