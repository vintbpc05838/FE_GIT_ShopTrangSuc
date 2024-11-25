import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/admin/adminInformation.css";
import axios from "axios";
import { notification } from "antd";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';



const AdminInformation = () => {
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [user, setUser] = useState({
        fullname: "",
        phone: "",
        email: "",
        gender: "",
    });
    const [newAddress, setNewAddress] = useState({
        address: "",
        city: "",
        district: "",
        isDefault: true,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAdminInfor, setSelectedAdminInfor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Lấy danh sách tỉnh thành
    const fetchCities = async () => {
        try {
            const response = await axios.get(
                "https://provinces.open-api.vn/api/?depth=3"
            );
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };


    const fetchUserData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/admin/admin-information",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = response.data;
            setUser({
                fullname: data.fullname,
                phone: data.phone,
                email: data.email,
                gender: data.gender,
                address: data.addresses && data.addresses.length > 0 ? data.addresses[0].address : "",
            });

            if (data.addresses && data.addresses.length > 0) {
                const firstAddress = data.addresses[0];
                setNewAddress({
                    addressId: firstAddress.addressId || "",  // Đảm bảo địa chỉ ID được lưu vào state
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
            await fetchCities(); // Đảm bảo tải xong cities
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
    }



    const handleUpdateAccount = async () => {
        setLoading(true);
    
        // Kiểm tra dữ liệu nhập
        const newErrors = {};
        const phonePattern = /^(0\d{9})$/; // Biểu thức chính quy để kiểm tra số điện thoại
        if (!user.phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại!";
        } else if (!phonePattern.test(user.phone)) {
            newErrors.phone = "Số điện thoại phải là 10 chữ số và bắt đầu bằng số 0!";
        }
        if (!user.fullname) newErrors.fullname = "Vui lòng nhập tên!";
        if (!user.gender) newErrors.gender = "Vui lòng chọn giới tính!";
    
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
    
        // Nếu không có lỗi, xóa thông báo lỗi
        setErrors({});
    
        // Kiểm tra nếu newAddress là đối tượng đơn lẻ
        const addressArray = Array.isArray(newAddress) ? newAddress : [newAddress];
    
        // Chuẩn bị dữ liệu để gửi lên backend (bao gồm cả addressId)
        const updatedAccount = {
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            addresses: addressArray.map((address) => ({
                addressId: address.addressId || null,  // Nếu có ID thì gửi theo, nếu không thì gửi null
                address: address.address,
                city: address.city,
                district: address.district,
                isDefault: address.isDefault || false, // Nếu có isDefault thì cập nhật, nếu không thì mặc định là false
            })),
        };
    
        try {
            // Gửi yêu cầu PUT tới API backend
            const response = await axios.put(
                "http://localhost:8080/api/admin/save/admin-information",
                updatedAccount,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            // Kiểm tra phản hồi từ server, có thể là thông tin tài khoản đã được cập nhật
            if (response.data) {
                // Cập nhật lại danh sách địa chỉ và thông tin người dùng
                setAddresses(response.data.addresses || []);
                setUser((prevState) => ({
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
                console.error("Yêu cầu đã được gửi nhưng không nhận được phản hồi:", error.request);
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
    



    // const deleteAccount = async () => {

    //     try {
    //         const response = await axios.delete("http://localhost:8080/api/admin/accounts/delete",{
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             },
    //         });  // Gửi yêu cầu xóa tài khoản

    //         if (response.status === 200) {
    //             alert("Tài khoản đã được vô hiệu hóa.");

    //             // Xóa token và thông tin người dùng khỏi localStorage
    //             localStorage.removeItem("token");
    //             localStorage.removeItem("user");

    //             // Chuyển hướng về trang login
    //             navigate("/login");
    //         }
    //     } catch (error) {
    //         console.error("Có lỗi khi xóa tài khoản:", error);
    //         alert("Có lỗi xảy ra khi xóa tài khoản.");
    //     }
    // };


    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


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
            const response = await axios.put(
                "http://localhost:8080/api/admin/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            showNotification("Mật khẩu đã được thay đổi thành công!");
            setShowModal(false); // Đóng modal
        } catch (error) {
            setErrors({
                api: error.response?.data?.message || "Có lỗi khi thay đổi mật khẩu",
            });
        }
    };


    const handleShow = (admin) => {
        setSelectedAdminInfor(admin);
        setUser(admin);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedAdminInfor(null);
    };

    return (
        <div className="adminInformation-container">
            {/* Form hiển thị thông tin người dùng */}
            <div className="adminInformation-card">
                <div className="adminInformation-card-title d-flex">
                    <i
                        className="bi bi-person-circle me-2"
                        style={{ fontSize: "1.5rem" }}
                    ></i>
                    <h5>Thông tin tài khoản</h5>
                    <div className="admin-doimatkhau">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            class="btn btn-secondary btn-sm"
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>
                <div className="adminInformation-card-body">
                    <form className="formadminInformation">
                        {/* Form chi tiết */}
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label-adminInformation">
                                        Họ Tên
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control-adminInformation"
                                        id="name"
                                        value={user.fullname}
                                        onChange={(e) =>
                                            setUser({ ...user, fullname: e.target.value })
                                        }
                                    />
                                    {errors.fullname && (
                                        <span className="text-danger">{errors.fullname}</span>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="phone"
                                        className="form-label-adminInformation"
                                    >
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control-adminInformation"
                                        id="phone"
                                        value={user.phone}
                                        onChange={(e) =>
                                            setUser({ ...user, phone: e.target.value })
                                        }
                                    />
                                    {errors.phone && (
                                        <span className="text-danger">{errors.phone}</span>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="email"
                                        className="form-label-adminInformation"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control-adminInformation"
                                        id="email"
                                        value={user.email}
                                        readOnly
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-adminInformation">
                                        Giới tính:
                                    </label>
                                    <div className="form-check-adminInformation">
                                        <input
                                            type="radio"
                                            className="form-check-input-adminInformation"
                                            id="male"
                                            name="gender"
                                            value="Nam"
                                            checked={user.gender === "Nam"}
                                            onChange={() => setUser({ ...user, gender: "Nam" })}
                                        />
                                        <label
                                            className="form-check-label-adminInformation"
                                            htmlFor="male"
                                        >
                                            Nam
                                        </label>
                                        <input
                                            type="radio"
                                            className="form-check-input-adminInformation"
                                            id="female"
                                            name="gender"
                                            value="Nữ"
                                            checked={user.gender === "Nữ"}
                                            onChange={() => setUser({ ...user, gender: "Nữ" })}
                                        />
                                        <label
                                            className="form-check-label-adminInformation"
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
                                    {/* <label htmlFor="name" className="form-label-adminInformation">
                                        Địa chỉ ID
                                    </label> */}
                                    <input
                                        type="hidden"
                                        className="form-control-adminInformation"
                                        id="name"
                                        value={newAddress.addressId} // Hiển thị ID địa chỉ
                                        onChange={(e) =>
                                            setNewAddress({ ...newAddress, addressId: e.target.value })
                                        }
                                        readOnly
                                    />
                                </div>
                                {/* Địa chỉ */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="address"
                                        className="form-label-adminInformation"
                                    >
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control-adminInformation"
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
                                        className="form-label-adminInformation"
                                    >
                                        Tỉnh/Thành Phố
                                    </label>
                                    <select
                                        id="city-select"
                                        className="form-control-adminInformation"
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
                                        className="form-label-adminInformation"
                                    >
                                        Quận/Huyện
                                    </label>
                                    <select
                                        id="district-select"
                                        className="form-control-adminInformation"
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
                            {/* <button type="button" className="btn xoa-btn-adminInformation"
                                onClick={deleteAccount}
                            >
                                Xóa tài khoản
                            </button> */}
                            <button
                                type="button"
                                className="btn save-btn-adminInformation"
                                onClick={handleUpdateAccount}
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/*Đổi mật khẩu */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                className="management-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>Đổi mật khẩu</h5>
                    </Modal.Title>
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
                    <Button
                        variant="primary"
                        onClick={handleChangePassword}
                        className="admin-information-button"
                    >
                        Lưu cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default AdminInformation;
