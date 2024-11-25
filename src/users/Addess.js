import React, { useState, useEffect } from 'react';
import '../css/address.css'; // Đừng quên tạo file CSS này
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Modal, Button, notification } from 'antd';
import { jwtDecode } from "jwt-decode";

const Address = () => {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        district: '',
        isDefault: false,
    });
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState(null);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);

    // Fetch địa chỉ từ API
    const fetchAddresses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/address/list', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAddresses(response.data);
        } catch (error) {
            showNotification('error', 'Lỗi khi lấy danh sách địa chỉ.');
            console.error('Error fetching addresses:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
        fetchCities();
    }, []);

    // Fetch danh sách thành phố
    const fetchCities = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    // Xử lý thay đổi thành phố
    const handleCityChange = (e) => {
        const selectedCity = cities.find((city) => city.name === e.target.value);
        setNewAddress({ ...newAddress, city: e.target.value, district: '' });
        setDistricts(selectedCity ? selectedCity.districts : []);
    };

    // Xử lý thay đổi quận/huyện
    const handleDistrictChange = (e) => {
        setNewAddress({ ...newAddress, district: e.target.value });
    };

    // Hàm kiểm tra địa chỉ hợp lệ
    const validateAddress = () => {
        if (!newAddress.city) {
            showNotification('error', 'Vui lòng chọn tỉnh/thành phố.');
            return false;
        }
        if (!newAddress.district) {
            showNotification('error', 'Vui lòng chọn quận/huyện.');
            return false;
        }
        if (!newAddress.address) {
            showNotification('error', 'Vui lòng nhập địa chỉ cụ thể.');
            return false;
        }
        if (newAddress.address.length < 6 || newAddress.address.length > 250) {
            showNotification('error', 'Địa chỉ cụ thể phải có từ 6 đến 250 ký tự.');
            return false;
        }
        return true;
    };

    // Lưu địa chỉ mới
    const saveNewAddress = async () => {
        if (!validateAddress()) return;

        try {
            const response = await axios.post('http://localhost:8080/api/user/address/add', newAddress, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setAddresses([...addresses, response.data]); // Thêm địa chỉ mới vào danh sách
            showNotification('success', 'Lưu địa chỉ thành công!');
            fetchAddresses(); // Gọi lại fetchAddresses() để làm mới dữ liệu
            closeAddModal();
        } catch (error) {
            showNotification('error', 'Lỗi khi lưu địa chỉ.');
            console.error('Error saving address:', error);
        }
    };

    // Cập nhật địa chỉ
    const saveUpdatedAddress = async () => {
        if (!validateAddress()) return;

        try {
            const response = await axios.put(`http://localhost:8080/api/user/address/update/${editId}`, newAddress, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            setAddresses(addresses.map((addr) => (addr.id === editId ? response.data : addr)));
            showNotification('success', 'Cập nhật địa chỉ thành công!');
            closeAddModal();
        } catch (error) {
            showNotification('error', 'Lỗi khi cập nhật địa chỉ.');
            console.error('Error updating address:', error);
        }
    };

    const saveAddress = async () => {
        if (editId) {
            saveUpdatedAddress();
        } else {
            saveNewAddress();
        }
    };



    const getToken = () => {
        return localStorage.getItem('token'); // Hoặc lấy từ sessionStorage nếu dùng
    };

    
    const setDefaultAddress = async (addressId) => {
        const token = getToken(); // Lấy token từ localStorage
        if (!token) {
            console.error("Chưa đăng nhập.");
            return;
        }
    
        try {
            // Gửi yêu cầu tới backend để đặt địa chỉ mặc định
            const response = await axios.put(
                `http://localhost:8080/api/user/address/setDefault/${addressId}`,
                {}, // Không cần dữ liệu body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            // Backend phản hồi thành công, cập nhật lại state
            setAddresses((prevAddresses) =>
                prevAddresses.map((address) =>
                    address.addressId === addressId
                        ? { ...address, isDefault: true } // Địa chỉ được chọn là mặc định
                        : { ...address, isDefault: false } // Các địa chỉ khác không phải mặc định
                )
            );
    
            showNotification("success", "Địa chỉ mặc định đã được cập nhật.");
        } catch (error) {
            // Xử lý lỗi nếu API thất bại
            if (error.response) {
                console.error("Lỗi từ server:", error.response.data);
            } else if (error.request) {
                console.error("Không nhận được phản hồi từ server:", error.request);
            } else {
                console.error("Lỗi khi gửi yêu cầu:", error.message);
            }
            showNotification("error", "Lỗi khi đặt địa chỉ mặc định.");
        }
    };
    
    
    



    const deleteAddress = async (id) => {
        console.log("Address ID to delete:", id);  // Log ID để kiểm tra

        // Kiểm tra xem ID có hợp lệ không
        if (!id || id <= 0) {
            showNotification('error', 'ID địa chỉ không hợp lệ.');
            console.error('Invalid address ID:', id);  // In ra ID để kiểm tra lỗi
            return;
        }

        try {
            // Gửi yêu cầu DELETE tới backend với ID đúng
            const response = await axios.delete(`http://localhost:8080/api/user/address/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            console.log('Delete response:', response);  // Log phản hồi từ backend

            // Cập nhật danh sách địa chỉ sau khi xóa
            setAddresses((prevAddresses) => prevAddresses.filter((addr) => addr.addressId !== id));

            showNotification('success', 'Đã xóa địa chỉ.');
        } catch (error) {
            showNotification('error', 'Lỗi khi xóa địa chỉ.');
            console.error('Error deleting address:', error);  // In ra lỗi để kiểm tra
        }
    };


    // Chỉnh sửa địa chỉ
    const startEditing = (address) => {
        setIsAdding(true);
        setEditId(address.id);
        setNewAddress(address);
        const selectedCity = cities.find((city) => city.name === address.city);
        setDistricts(selectedCity ? selectedCity.districts : []);
    };

    // Mở modal thêm địa chỉ
    const openAddModal = () => {
        setIsAdding(true);
        setNewAddress({ address: '', city: '', district: '', isDefault: false });
        setEditId(null);
        setDistricts([]);
    };

    // Đóng modal thêm địa chỉ
    const closeAddModal = () => {
        setIsAdding(false);
        setNewAddress({ address: '', city: '', district: '', isDefault: false });
        setEditId(null);
        setDistricts([]);
    };

    // Hiển thị thông báo
    const showNotification = (type, message) => {
        notification[type]({
            message: type === 'error' ? 'Lỗi' : 'Thông báo',
            description: message,
            duration: 2,
        });
    };

    return (
        <div className="address-container">
            <div className="address-title">
                <h4>Thông Tin Địa Chỉ</h4>
                <Button onClick={openAddModal} type="primary">
                    + Thêm Địa Chỉ
                </Button>
            </div>
            <hr />
            <div className="address-body">
                {addresses.length === 0 ? (
                    <p>Không có địa chỉ nào.</p>
                ) : (
                    // addresses.map((address) => (
                    //     <div key={address.addressId} className="address-item">
                    //         <div className="address-details">
                    //             <p className="address-content">
                    //                 {address.address ? address.address : 'Không có địa chỉ'}
                    //                 {address.address && address.district && ', '}
                    //                 {address.district ? address.district : 'Không có quận'}
                    //                 {address.district && address.city && ', '}
                    //                 {address.city ? address.city : 'Không có thành phố'}
                    //             </p>

                    //             {address.isDefault && <span className="badge-address">Mặc Định</span>}
                    //         </div>
                    //         <div className="address-actions">
                    //             <Button onClick={() => startEditing(address)} icon={<i className="bi bi-pencil"></i>} />
                    //             <Button
                    //                 key={address.addressId}
                    //                 onClick={() => deleteAddress(address.addressId)}
                    //                 icon={<i className="bi bi-trash"></i>}
                    //                 danger
                    //             />
                    //             <Button
                    //                 onClick={() => setDefaultAddress(address.addressId)}
                    //                 type="primary"
                    //                 icon={<i className="bi bi-check-circle"></i>}
                    //                 disabled={address.isDefault} // Vô hiệu hóa nếu đã là mặc định
                    //             >
                    //                 Đặt Mặc Định
                    //             </Button>
                    //         </div>
                    //     </div>
                    // ))

                    addresses.map((address) => (
                        <div key={address.addressId} className={`address-item ${address.isDefault ? 'default-address' : ''}`}>
                            <div className="address-details">
                                <p className="address-content">
                                    {address.address ? address.address : 'Không có địa chỉ'}
                                    {address.address && address.district && ', '}
                                    {address.district ? address.district : 'Không có quận'}
                                    {address.district && address.city && ', '}
                                    {address.city ? address.city : 'Không có thành phố'}
                                </p>
                                {address.isDefault && (
                                    <span className="badge-address">🌟 Mặc Định</span>
                                )}
                            </div>
                            <div className="address-actions">
                                <Button onClick={() => startEditing(address)} icon={<i className="bi bi-pencil"></i>} />
                                <Button
                                    onClick={() => deleteAddress(address.addressId)}
                                    icon={<i className="bi bi-trash"></i>}
                                    danger
                                />
                                <Button
                                    onClick={() => setDefaultAddress(address.addressId)}
                                    type="primary"
                                    icon={<i className="bi bi-check-circle"></i>}
                                    disabled={address.isDefault} // Vô hiệu hóa nếu đã là mặc định
                                >
                                    Đặt Mặc Định
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                title={editId ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ'}
                open={isAdding}
                onCancel={closeAddModal}
                footer={[
                    <Button key="cancel" onClick={closeAddModal}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={saveAddress}>
                        Lưu
                    </Button>,
                ]}
            >
                <div className="form-group">
                    <label>Tỉnh/Thành Phố:</label>
                    <select
                        value={newAddress.city}
                        onChange={handleCityChange}
                        className="form-control"
                    >
                        <option value="">Chọn Tỉnh/Thành Phố</option>
                        {cities.map((city) => (
                            <option key={city.name} value={city.name}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Quận/Huyện:</label>
                    <select
                        value={newAddress.district}
                        onChange={handleDistrictChange}
                        className="form-control"
                    >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map((district) => (
                            <option key={district.name} value={district.name}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Địa Chỉ Cụ Thể:</label>
                    <textarea
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        className="form-control"
                    />
                </div>

                {/* <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={newAddress.isDefault}
                            onChange={() =>
                                setNewAddress({ ...newAddress, isDefault: !newAddress.isDefault })
                            }
                        />{' '}
                        Đặt làm địa chỉ mặc định
                    </label>
                </div> */}
            </Modal>
        </div>
    );
};

export default Address;
