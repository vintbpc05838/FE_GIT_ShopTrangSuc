import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/admin/staffInformation.css';
import axios from 'axios';
import { notification } from 'antd';
import { Modal, Button } from "react-bootstrap";

const StaffInformation = () => {
    const [cities, setCities] = useState([]);
    const [staff, setStaff] = useState({
        fullname: "",
        phone: "",
        email: "",
        gender: "",
        address: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedStaffInfor, setSelectedStaffInfor] = useState(null);
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

    // Lấy thông tin người dùng từ endpoint của backend
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/staff/staff-information', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = response.data;
            setStaff({
                fullname: data.fullname,
                phone: data.phone,
                email: data.email,
                gender: data.gender,
                address: data.addresses && data.addresses.length > 0 ? data.addresses[0].address : "",
            });

            if (data.addresses && data.addresses.length > 0) {
                const firstAddress = data.addresses[0];
                setNewAddress({
                    addressId: firstAddress.addressId || "",
                    address: firstAddress.address || "",
                    city: firstAddress.city || "",
                    district: firstAddress.district || "",
                });

                // Tìm thành phố và thiết lập quận/huyện nếu có
                const selectedCity = cities.find((city) => city.name === firstAddress.city);
                if (selectedCity) {
                    setDistricts(selectedCity.districts || []);
                }
            }

            setAddresses(data.addresses || []);
        } catch (error) {
            console.error("Error fetching user data:", error);
            showNotification("error", "Không thể lấy thông tin tài khoản.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchCities();  // Đảm bảo tải xong cities
            await fetchUserData(); // Sau đó tải dữ liệu người dùng
        };
        fetchData();
    }, []);


    useEffect(() => {
        // Khi `newAddress.city` thay đổi, cập nhật danh sách quận/huyện
        if (newAddress.city) {
            const selectedCity = cities.find((city) => city.name === newAddress.city);
            setDistricts(selectedCity ? selectedCity.districts : []);
        } else {
            setDistricts([]);
        }
    }, [newAddress.city, cities]);


    const handleCityChange = (e) => {
        const selectedCity = cities.find((city) => city.name === e.target.value);
        if (selectedCity) {
            setNewAddress({ ...newAddress, city: e.target.value, district: "" });
            setDistricts(selectedCity.districts || []);
        }
    };

    const handleDistrictChange = (e) => {
        setNewAddress({ ...newAddress, district: e.target.value });
    };

    const showNotification = (type, message) => {
        notification[type]({
            message: type === "error" ? "Lỗi" : "Thông báo",
            description: message,
            duration: 2,
        });
    };

    const handleSelectAddress = (address) => {
        setSelectedStaffInfor(address);
        setStaff({ ...staff, address: address.address });
    };

    const handleSave = async () => {
        setLoading(true);

        // Kiểm tra dữ liệu nhập
        const newErrors = {};

        const phonePattern = /^(0\d{9})$/;
        if (!staff.phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại!";
        } else if (!phonePattern.test(staff.phone)) {
            newErrors.phone = "Số điện thoại phải là 10 chữ số và bắt đầu bằng số 0!";
        }


        if (!staff.fullname) newErrors.fullname = "Vui lòng nhập tên!";
        if (!staff.gender) newErrors.gender = "Vui lòng chọn giới tính!";

        // Kiểm tra địa chỉ
        if (
            !newAddress ||
            !newAddress.address ||
            !newAddress.city ||
            !newAddress.district
        ) {
            newErrors.address = "Vui lòng chọn địa chỉ hợp lệ để cập nhật!";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        setErrors({});

        // Kiểm tra nếu newAddress là đối tượng đơn lẻ
        const addressArray = Array.isArray(newAddress) ? newAddress : [newAddress];

        // Chuẩn bị dữ liệu để gửi lên backend (bao gồm cả addressId)
        const updatedAccount = {
            fullname: staff.fullname,
            email: staff.email,
            phone: staff.phone,
            gender: staff.gender,
            addresses: addressArray.map((address) => ({
                addressId: address.addressId || null,  // Nếu có ID thì gửi theo, nếu không thì gửi null
                address: address.address,
                city: address.city,
                district: address.district,
                isDefault: address.isDefault || false, // Nếu có isDefault thì cập nhật, nếu không thì mặc định là false
            })),
        };

        try {
            const response = await axios.put('http://localhost:8080/api/staff/save/staff-information', updatedAccount, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data) {
                // Cập nhật lại danh sách địa chỉ và thông tin người dùng
                setAddresses(response.data.addresses || []);
                setStaff((prevState) => ({
                    ...prevState,
                    addresses: response.data.addresses || [],
                }));

                // Hiển thị thông báo thành công
                notification.success({
                    message: "Cập nhật tài khoản và địa chỉ thành công!",
                });
            } else {
                notification.error({
                    message: "Không có dữ liệu cập nhật!",
                    description: "Vui lòng thử lại sau.",
                });
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            if (error.response) {
                console.error("Chi tiết lỗi từ backend:", error.response.data);
            } else if (error.request) {
                console.error(
                    "Yêu cầu đã được gửi nhưng không nhận được phản hồi:",
                    error.request
                );
            } else {
                console.error("Lỗi khi thiết lập yêu cầu:", error.message);
            }

            // Hiển thị thông báo lỗi nếu có
            notification.error({
                message: "Có lỗi khi cập nhật tài khoản!",
                description: error.message || "Vui lòng thử lại sau.",
            });
        } finally {
            setLoading(false);
        }
    };


    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleChangePassword = async () => {
        // Reset errors
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
            const response = await axios.put('http://localhost:8080/api/staff/staff-change-password', {
                currentPassword,
                newPassword,
                confirmPassword,  // Mật khẩu xác nhận
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
        <div className="staffInformation-container">
            {/* Form hiển thị thông tin người dùng */}
            <div className="staffInformation-card">
                <div className="staffInformation-card-title d-flex">
                    <i className="bi bi-person-circle me-2" style={{ fontSize: '1.5rem' }}></i>
                    <h5>Thông tin tài khoản</h5>
                    <div className="staff-doimatkhau">
                        <button type="button" onClick={() => setShowModal(true)} class="btn btn-secondary btn-sm">Đổi mật khẩu</button>
                    </div>
                </div>
                <div className="staffInformation-card-body">
                    <form className="staffInformation">
                        {/* Form chi tiết */}
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label-staffInformation">Họ Tên</label>
                                    <input
                                        type="text"
                                        className="form-control-staffInformation"
                                        id="name"
                                        value={staff.fullname}
                                        onChange={(e) => setStaff({ ...staff, fullname: e.target.value })}
                                    />
                                    {errors.fullname && (
                                        <span className="text-danger">{errors.fullname}</span>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label-staffInformation">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="form-control-staffInformation"
                                        id="phone"
                                        value={staff.phone}
                                        onChange={(e) => setStaff({ ...staff, phone: e.target.value })}

                                    />
                                    {errors.phone && (
                                        <span className="text-danger">{errors.phone}</span>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label-staffInformation">Email</label>
                                    <input
                                        type="text"
                                        className="form-control-staffInformation"
                                        id="email"
                                        value={staff.email}
                                        readOnly
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-staffInformation">
                                        Giới tính:
                                    </label>
                                    <div className="form-check-staffInformation">
                                        <input
                                            type="radio"
                                            className="form-check-input-staffInformation"
                                            id="male"
                                            name="gender"
                                            value="Nam"
                                            checked={staff.gender === "Nam"}
                                            onChange={() => setStaff({ ...staff, gender: "Nam" })}
                                        />
                                        <label
                                            className="form-check-label-staffInformation"
                                            htmlFor="male"
                                        >
                                            Nam
                                        </label>
                                        <input
                                            type="radio"
                                            className="form-check-input-staffInformation"
                                            id="female"
                                            name="gender"
                                            value="Nữ"
                                            checked={staff.gender === "Nữ"}
                                            onChange={() => setStaff({ ...staff, gender: "Nữ" })}
                                        />
                                        <label
                                            className="form-check-label-staffInformation"
                                            htmlFor="female"
                                        >
                                            Nữ
                                        </label>
                                    </div>
                                    {errors.gender && (
                                        <span className="text-danger">{errors.gender}</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="">
                                    {/* <label htmlFor="name" className="form-label-staffInformation">
                                        Địa chỉ ID
                                    </label> */}
                                    <input
                                        type="hidden"
                                        className="form-control-staffInformation"
                                        id="name"
                                        value={newAddress.addressId} // Hiển thị ID địa chỉ
                                        onChange={(e) =>
                                            setNewAddress({ ...newAddress, addressId: e.target.value })
                                        }
                                        readOnly
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="address"
                                        className="form-label-staffInformation"
                                    >
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control-staffInformation"
                                        id="address"
                                        value={newAddress.address}
                                        onChange={
                                            (e) =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    address: e.target.value,
                                                }) // Sửa thành address
                                        }
                                        required
                                    />
                                </div>

                                {/* Thành phố */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="city-select"
                                        className="form-label-staffInformation"
                                    >
                                        Tỉnh/Thành Phố
                                    </label>
                                    <select
                                        id="city-select"
                                        className="form-control-staffInformation"
                                        value={newAddress.city || ""}
                                        onChange={(e) =>
                                            setNewAddress({ ...newAddress, city: e.target.value })
                                        } // Cập nhật city
                                    >
                                        <option value="">Chọn Tỉnh/Thành Phố</option>
                                        {cities.map((city) => (
                                            <option key={city.code} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quận/Huyện */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="district-select"
                                        className="form-label-staffInformation"
                                    >
                                        Quận/Huyện
                                    </label>
                                    <select
                                        id="district-select"
                                        className="form-control-staffInformation"
                                        value={newAddress.district || ""}
                                        onChange={(e) =>
                                            setNewAddress({ ...newAddress, district: e.target.value })
                                        } // Cập nhật district
                                    >
                                        <option value="">Chọn Quận/Huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.code} value={district.name}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            {/* <button type="button" className="btn xoa-btn-staffInformation">Xóa tài khoản</button> */}
                            <button type="button" className="btn save-btn-staffInformation" onClick={handleSave}>Lưu</button>
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

export default StaffInformation;
