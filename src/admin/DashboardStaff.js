import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/admin/dashboardStaff.css';
import HomeAdmin from './HomeAdmin';
import CreateOrders from "./CreateOrders";   
import Order_admin from "./Order_admin";
import Cancellation_list from "./Cancellation_list";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import StaffInformation from "./StaffInformation";

const DashboardStaff = () => {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [isAdminMenuOpen, setAdminMenuOpen] = useState(false);
    const [isOrderMenuOpen, setOrderMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") !== null
    );
    const [userName, setUserName] = useState(
        localStorage.getItem("username") || ""
    );


    const handleMenuClick = (component) => {
        setSelectedComponent(component);
    };

    const toggleAdminMenu = () => {
        setAdminMenuOpen(!isAdminMenuOpen);
        setOrderMenuOpen(false);
    };

    const toggleOrderMenu = () => {
        setOrderMenuOpen(!isOrderMenuOpen);
        setAdminMenuOpen(false);
    };

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            // Gọi API đăng xuất từ backend (nếu cần thiết)
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Xóa token từ cookies và localStorage
            Cookies.remove('token');
            localStorage.removeItem('token');
            localStorage.removeItem('userName');

            // Cập nhật trạng thái đăng nhập và điều hướng về trang đăng nhập
            setIsLoggedIn(false);
            navigate('/login'); // Điều hướng tới trang login
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };




    return (
        <div className="dashboard-container-staff">
            <div className="dashboard-menu-staff">
                <div className="logo fs-2">MARNI.Store</div>
                <hr className="hr"></hr>
                <div className="thongtin-staff">
                    <ul class="nav justify-content-end">
                        <li class="nav-item-thongtin-staff">
                        <div className={`${selectedComponent === 'staff-info' ? '' : ''}`} onClick={() => handleMenuClick('staff-info')}>
                        <p><a class="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Thông tin tài khoản <i class="bi bi-emoji-sunglasses"></i></a></p>
                    </div>
                        </li>
                    </ul>
                </div>
                <hr className="hr"></hr>
                <div className="menu">
                    <div className="font">
                        <p>Quản lý <i className="bi bi-bookmarks-fill"></i> </p>
                    </div>
                    <div className={`menu-item ${selectedComponent === 'home' ? 'active' : ''}`} onClick={() => handleMenuClick('home')}>
                        <i className="bi bi-houses-fill"></i> Trang chủ
                    </div>
                    <div className={`menu-item ${selectedComponent === 'order' ? 'active' : ''}`} onClick={toggleOrderMenu}>
                        <i className="bi bi-clipboard-check-fill"></i> Đơn hàng
                        <span className="caret-icon">
                            {isOrderMenuOpen ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>}
                        </span>
                    </div>
                    {isOrderMenuOpen && (
                        <div className="submenu">
                            <div className={`submenu-item ${selectedComponent === 'create-order' ? 'active' : ''}`} onClick={() => handleMenuClick('create-order')}>
                                <i className="bi bi-journal-check"></i>  Tạo đơn hàng
                            </div>
                            <div className={`submenu-item ${selectedComponent === 'list-order' ? 'active' : ''}`} onClick={() => handleMenuClick('list-order')}>
                                <i className="bi bi-journal-check"></i>  Danh sách
                            </div>
                            <div className={`submenu-item ${selectedComponent === 'cancellation_list' ? 'active' : ''}`} onClick={() => handleMenuClick('cancellation_list')}>
                                <i className="bi bi-journal-x"></i> Danh sách đơn hàng hủy
                            </div>
                        </div>
                    )}
                    <hr className="hr"></hr>
                    <div className="font">
                        <p>Cài đặt <i className="bi bi-gear-fill"></i></p>
                    </div>
                    <div className={`menu-item ${selectedComponent === 'background_color' ? 'active' : ''}`} onClick={() => handleMenuClick('background_color')}>
                        <i className="bi bi-palette-fill"></i> Màu nền
                    </div>
                    <div className={`menu-item ${selectedComponent === 'language' ? 'active' : ''}`} onClick={() => handleMenuClick('language')}>
                        <i className="bi bi-globe2"></i> Ngôn ngữ
                    </div>
                    <div className={`menu-item ${selectedComponent === 'log_out' ? 'active' : ''}`} onClick={() => handleMenuClick(handleLogout)}>
                        <i className="bi bi-arrow-bar-left"></i> Đăng xuất
                    </div>
                </div>
            </div>
            <div className="content">
                {selectedComponent === 'home' && <HomeAdmin />}
                {selectedComponent === 'list-order' && <Order_admin />}
                {selectedComponent === 'create-order' && <CreateOrders />}
                {selectedComponent === 'cancellation_list' && <Cancellation_list />}
                {selectedComponent === 'staff-info' && <StaffInformation />}
            </div>
        </div>
    );
};


export default DashboardStaff;