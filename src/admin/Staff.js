import React, { useState, useEffect } from "react";
import "../css/admin/staff.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { notification } from "antd";

const Staff = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [staffs, setStaffs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [activeTab, setActiveTab] = useState("staff1");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [newStaff, setNewStaff] = useState({
        fullname: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        status: "Hoạt động",
    });

    const itemsPerPage = 5;
    const indexOfLastStaff = currentPage * itemsPerPage;
    const indexOfFirstStaff = indexOfLastStaff - itemsPerPage;

    const filteredStaffs = staffs.filter((staff) =>
        (staff.fullname && staff.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (staff.email && staff.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const currentStaff = filteredStaffs.slice(
        indexOfFirstStaff,
        indexOfLastStaff
    );

    const [cities, setCities] = useState([]);
    const [newAddress, setNewAddress] = useState({
        address: "",
        city: "",
        district: "",
    });
    const [districts, setDistricts] = useState([]);


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


    // const handleCityChange = (e) => {
    //     setNewAddress({ ...newAddress, city: e.target.value });
    // };
    
    // const handleDistrictChange = (e) => {
    //     setNewAddress({ ...newAddress, district: e.target.value });
    // };
    

    const handleRowClick = (staff) => {
        setSelectedStaff(staff);
        setNewStaff(staff);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedStaff(null);
        setShowModal(false);
    };


    // useEffect(() => {
    //     const fetchStaffs = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:8080/admin/accounts/staff");
    //             // setStaffs(response.data); // Lưu danh sách nhân viên vào state
    //             setIsLoading(false); // Đã tải xong dữ liệu
    //             console.log("Dữ liệu nhận được từ API:", response.data);

    //             if (Array.isArray(response.data)) {
    //                 // Dùng Set để loại bỏ các địa chỉ trùng lặp
    //                 const uniqueCustomers = response.data.map(staff => {
    //                     // Lọc địa chỉ mặc định
    //                     const defaultAddress = staff.addresses.find(address => address.isDefault);

    //                     return {
    //                         ...staff,
    //                         // Lọc lại địa chỉ không bị lặp lại (nếu cần)
    //                         addresses: Array.from(new Set(staff.addresses.map(a => JSON.stringify(a))))
    //                             .map(e => JSON.parse(e)),
    //                         defaultAddress: defaultAddress || null // Chỉ lưu địa chỉ mặc định
    //                     };
    //                 });

    //                 setStaffs(uniqueCustomers); // Gán dữ liệu đã xử lý
    //             } else {
    //                 console.error("Dữ liệu trả về không phải là mảng", response.data);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching staffs:", error);
    //             setIsLoading(false); // Đảm bảo dừng loading dù có lỗi
    //         }
    //     };
    //     fetchStaffs(); // Gọi hàm lấy dữ liệu nhân viên
    // }, []); 

    const fetchStaffs = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/api/admin/accounts/staff', {
                headers: { Authorization: `Bearer ${token}` } // Thêm token vào header
            });
            setStaffs(response.data);
        } catch (error) {
            console.error("Error fetching managers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
        fetchStaffs();
    }, []);

    const handleAddStaff = async () => {
        setErrorMessage(""); // Xóa thông báo lỗi cũ
    
        // Kiểm tra các trường bắt buộc
        if (!newStaff.fullname || !newStaff.email || !newStaff.password || !newStaff.phone || !newStaff.gender || !newStaff.address) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin!");
            return;
        }
    
        // Kiểm tra định dạng email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(newStaff.email)) {
            showNotification("error", "Email không hợp lệ!");
            return;
        }
    
        // Kiểm tra độ dài mật khẩu
        if (newStaff.password.length < 6) {
            setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }
    
        // Kiểm tra số điện thoại
        if (newStaff.phone.length < 10) {
            setErrorMessage("Số điện thoại phải có ít nhất 10 ký tự.");
            return;
        }
    
        const phonePattern = /^[0-9]+$/; // Chỉ chấp nhận số
        if (!phonePattern.test(newStaff.phone)) {
            showNotification("error", "Số điện thoại chỉ được chứa các ký tự số.");
            return;
        }
    
        const token = localStorage.getItem('token');
        try {
            const updatedStaff = {
                fullname: newStaff.fullname,
                email: newStaff.email,
                phone: newStaff.phone,
                password: newStaff.password,
                gender: newStaff.gender === "Nam" ? "Nam" : "Nữ",
                status: newStaff.status,
                addresses: [
                    {
                        address: newStaff.address,
                        city: newAddress.city,
                        district: newAddress.district,
                        isDefault: newAddress.isDefault,
                    },
                ],
            };
    
            const response = await axios.post(
                'http://localhost:8080/api/admin/accounts/staffs',
                updatedStaff,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response.status === 201) {
                showNotification("success", "Thêm nhân viên thành công!");
                setStaffs((prevStaffs) => [...prevStaffs, response.data]);
                setNewStaff({
                    ...newStaff,
                    addresses: response.data.addresses,
                    fullname: "",
                    email: "",
                    phone: "",
                    password: "",
                    gender: "",
                    status: "Hoạt động",
                });
                setShowModal(false);
                fetchStaffs(); // Hàm này để tải lại danh sách nhân viên
            }
        } catch (error) {
            if (error.response) {
                // Kiểm tra lỗi từ backend (lỗi email trùng)
                const message =
                    error.response.data === "Email này đã được đăng ký. Vui lòng sử dụng email khác."
                        ? error.response.data
                        : error.response.data.message || "Không thể thêm tài khoản.";
                showNotification("error", message); // Hiển thị thông báo lỗi
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


    // const handleDelete = async (id) => {
    //     const confirmed = window.confirm("Bạn chắc muốn xóa nhân viên này không?");
    //     if (confirmed) {
    //         try {
    //             await axios.delete(`http://localhost:8080/admin/accounts/${id}`);
    //             setStaffs(staffs.filter((staff) => staff.accountId !== id));
    //             closeModal();
    //         } catch (error) {
    //             console.error("Lỗi khi xóa người dùng:", error);
    //         }
    //     }
    // };


    return (
        <div className="staff-container">
            <div className="d-flex-staff">
                <input
                    type="text"
                    className="form-control-staff-search  w-25"
                    placeholder="Tìm kiếm theo tên hoặc Email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="btn btn-add-staff"
                    onClick={() => setShowModal(true)}
                >
                    Thêm mới
                </button>
            </div>
            <ul className="nav nav-tabs-staff">
                <li className="nav-item-staff">
                    <a
                        className={`nav-link-staff ${activeTab === "staff1" ? "active-staff" : ""
                            }`}
                        onClick={() => setActiveTab("staff1")}
                    >
                        Tất cả
                    </a>
                </li>
                <li className="nav-item-staff">
                    <a
                        className={`nav-link-staff ${activeTab === "staff2" ? "active-staff" : ""
                            }`}
                        onClick={() => setActiveTab("staff2")}
                    >
                        Đang làm việc
                    </a>
                </li>
            </ul>

            <div className="tab-content-staff">
                {activeTab === "staff1" && (
                    <div className="tab-pane-staff fade show active-staff">
                        <h5 className="font-staff2 m-3"><strong>Danh sách tất cả nhân viên</strong></h5>
                        <table className="table-staff2">
                            <thead>
                                <tr className="tr-staff">
                                    <th className="th-staff">Email</th>
                                    <th className="th-staff">Họ tên</th>
                                    <th className="th-staff">Số điện thoại</th>
                                    <th className="th-staff">Giới tính</th>
                                    <th className="th-staff">Địa chỉ</th>
                                    <th className="th-staff">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaffs.map((staff) => (
                                    <tr
                                        className="tr-staff"
                                        key={staff.email}
                                        onClick={() => handleRowClick(staff)}
                                    >
                                        <td className="td-staff">{staff.email}</td>
                                        <td className="td-staff">{staff.fullname}</td>
                                        <td className="td-staff">{staff.phone}</td>
                                        <td className="td-staff">{staff.gender}</td>
                                        <td className="td-staff">{staff.addresses && staff.addresses.length > 0 ? staff.addresses[0].address : "Chưa cập nhật"}</td>
                                        <td className="td-staff">
                                            <span
                                                className={`badge rounded-pill-staff ${staff.status === "Hoạt động"
                                                    ? "text-bg-warning"
                                                    : "text-bg-danger"
                                                    }`}
                                            >
                                                {staff.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === "staff2" && (
                    <div className="tab-pane-staff fade show active-staff">
                        <h2 className="font-staff1 m-3">
                            <strong>Danh sách nhân viên đang làm việc</strong>
                        </h2>
                        <table className="table-staff1">
                            <thead className="thead-staff">
                                <tr className="tr-staff">
                                    <th className="th-staff">Email</th>
                                    <th className="th-staff">Họ tên</th>
                                    <th className="th-staff">Số điện thoại</th>
                                    <th className="th-staff">Giới tính</th>
                                    <th className="th-staff">Địa chỉ</th>
                                    <th className="th-staff">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaffs
                                    .filter((staff) => staff.status === "Hoạt động")
                                    .map((staff) => (
                                        <tr
                                            className="tr-staff"
                                            key={staff.email}
                                            onClick={() => handleRowClick(staff)}
                                        >
                                            <td className="td-staff">{staff.email}</td>
                                            <td className="td-staff">{staff.fullname}</td>
                                            <td className="td-staff">{staff.phone}</td>
                                            <td className="td-staff">{staff.gender}</td>
                                            <td className="td-staff">{staff.addresses && staff.addresses.length > 0 ? staff.addresses[0].address : "Chưa cập nhật"}</td>
                                            <td className="td-staff">
                                                <span
                                                    className={`badge rounded-pill-staff ${staff.status === "Hoạt động"
                                                        ? "text-bg-warning"
                                                        : "text-bg-danger"
                                                        }`}
                                                >
                                                    {staff.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {showModal && selectedStaff && (
                <Modal show={showModal} onHide={closeModal} className="model-detailedStaff" size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title><h5>Nhân viên chi tiết</h5></Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-detailedStaff">
                        <form className="form-detailedStaff">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label className="form-label-detailedStaff">
                                            Email:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control-detailedStaff"
                                            value={newStaff.email}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label-detailedStaff">
                                            Tên:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control-detailedStaff"
                                            value={newStaff.fullname}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label-detailedStaff">
                                            Giới tính:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="form-check-detailedStaff">
                                            <input
                                                type="radio"
                                                className="form-check-input-detailedStaff"
                                                id="male"
                                                name="gender"
                                                value="Nam"
                                                checked={newStaff.gender === "Nam"}
                                                disabled // Vô hiệu hóa
                                            />
                                            <label className="form-check-label-detailedStaff" htmlFor="male">
                                                Nam
                                            </label>
                                            <input
                                                type="radio"
                                                className="form-check-input-detailedStaff"
                                                id="female"
                                                name="gender"
                                                value="Nữ"
                                                checked={newStaff.gender === "Nữ"}
                                                disabled // Vô hiệu hóa
                                            />
                                            <label className="form-check-label-detailedStaff" htmlFor="female">
                                                Nữ
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label className="form-label-detailedStaff">
                                            Số điện thoại:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control-detailedStaff"
                                            value={newStaff.phone}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label-detailedStaff">
                                            Địa chỉ:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <textarea
                                            value={newStaff.addresses && newStaff.addresses.length > 0
                                                ? newStaff.addresses.map((address) => `${address.address} (${address.city}, ${address.district})`).join("\n")
                                                : "Chưa cập nhật"}
                                            readOnly // Chỉ đọc
                                            rows="3"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label-detailedStaff">
                                            Trạng thái:<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div>
                                            <div className="form-check-detailedStaff">
                                                <input
                                                    type="radio"
                                                    className="form-check-input-detailedStaff"
                                                    id="working"
                                                    name="trangThai"
                                                    value="Đang làm việc"
                                                    checked={newStaff.status === "Hoạt động"}
                                                    onChange={() => setNewStaff({ ...newStaff, status: "Hoạt động" })}
                                                    disabled
                                                />
                                                <label className="form-check-label-detailedStaff" htmlFor="working">
                                                    Đang làm việc
                                                </label>
                                            </div>
                                            <div className="form-check-detailedStaff">
                                                <input
                                                    type="radio"
                                                    className="form-check-input-detailedStaff"
                                                    id="resigned"
                                                    name="trangThai"
                                                    value="Đã dừng"
                                                    checked={newStaff.status === "Đã nghỉ việc"}
                                                    onChange={() => setNewStaff({ ...newStaff, status: "Đã dừng" })}
                                                    disabled
                                                />
                                                <label className="form-check-label-detailedStaff" htmlFor="resigned">
                                                    Đã nghỉ việc
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {/* <button
                                    type="button"
                                    className="btn btn-delete-detailedStaff"
                                    onClick={() => handleDelete(selectedStaff.accountId)}
                                >
                                    Xóa
                                </button> */}
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            )}

            {/* Thêm nhân viên */}
            <Modal
                show={showModal && !selectedStaff}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title><h5>Thêm nhân viên mới</h5></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-staff">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label className="form-label-staff">
                                        Email:<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control-staff"
                                        value={newStaff.email}
                                        onChange={(e) =>
                                            setNewStaff({ ...newStaff, email: e.target.value })
                                        }

                                    />
                                   {errorMessage && !newStaff.email && (
                                        <small className="text-danger">{errorMessage}</small> // Hiển thị thông báo lỗi
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-staff">
                                        Tên:<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control-staff"
                                        value={newStaff.fullname}
                                        onChange={(e) =>
                                            setNewStaff({ ...newStaff, fullname: e.target.value })
                                        }

                                    />
                                    {errorMessage && !newStaff.fullname && (
                                        <small className="text-danger">{errorMessage}</small> // Hiển thị thông báo lỗi dưới trường nhập
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-staff">
                                        Mật khẩu:<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control-staff"
                                        value={newStaff.password}
                                        onChange={(e) =>
                                            setNewStaff({ ...newStaff, password: e.target.value })
                                        }

                                    />
                                    {errorMessage && newStaff.password.length < 6 && (
                                        <small className="text-danger">Mật khẩu phải có ít nhất 6 ký tự!</small>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-staff">
                                        Giới tính:<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <div className="form-check-staff">
                                        <input
                                            type="radio"
                                            className="form-check-input-staff"
                                            id="male"
                                            name="gender"
                                            value="Nam"
                                            checked={newStaff.gender === "Nam"}
                                            onChange={(e) =>
                                                setNewStaff({ ...newStaff, gender: e.target.value })
                                            }
                                        />
                                        <label className="form-check-label-staff" htmlFor="male">
                                            Nam
                                        </label>
                                        <input
                                            type="radio"
                                            className="form-check-input-staff"
                                            id="female"
                                            name="gender"
                                            value="Nữ"
                                            checked={newStaff.gender === "Nữ"}
                                            onChange={(e) =>
                                                setNewStaff({ ...newStaff, gender: e.target.value })
                                            }
                                        />
                                        <label className="form-check-label-staff" htmlFor="female">
                                            Nữ
                                        </label>
                                    </div>
                                    {errorMessage && !newStaff.gender && (
                                        <small className="text-danger">Vui lòng chọn giới tính!</small>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-staff">
                                        Số điện thoại:<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control-staff"
                                        value={newStaff.phone}
                                        onChange={(e) =>
                                            setNewStaff({ ...newStaff, phone: e.target.value })
                                        }
                                    />
                                    {errorMessage && newStaff.phone.length < 10 && (
                                        <small className="text-danger">Số điện thoại phải có ít nhất 10 ký tự.</small>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label-management">Địa chỉ:<span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control-management"
                                        id="address"
                                        value={newStaff.address}
                                        onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                                    />
                                    {errorMessage && !newStaff.address && (
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
                                {/* <div className="mb-3">
                                    <label className="form-label-staff">
                                        Ngày sinh:<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control-staff"
                                        // value={newStaff.email}
                                        onChange={(e) =>
                                            setNewStaff({ ...newStaff, ngaysinh: e.target.value })
                                        }
                                        required
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="form-label-staff">
                                        Trạng thái:<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <div>
                                        <div className="form-check-staff">
                                            <input
                                                type="radio"
                                                className="form-check-input-staff"
                                                id="working"
                                                name="trangThai"
                                                value="Hoạt động"
                                                checked={newStaff.status === "Hoạt động"}
                                                onChange={(e) =>
                                                    setNewStaff({ ...newStaff, trangThai: e.target.value })
                                                }
                                            />
                                            <label className="form-check-label-staff" htmlFor="working">
                                                Đang làm việc
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-save-staff"
                                onClick={handleAddStaff}
                            >
                                Thêm nhân viên
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Staff;
