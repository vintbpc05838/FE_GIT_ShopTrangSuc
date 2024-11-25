import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/admin/customer.css"; // Đảm bảo đường dẫn này đúng
import { Modal } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Sử dụng import đúng

const BlogPost = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [cardTypeFilter, setCardTypeFilter] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const itemsPerPage = 5;



    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/accounts/customer");
                console.log("Dữ liệu nhận được từ API:", response.data);
    
                if (Array.isArray(response.data)) {
                    // Dùng Set để loại bỏ các địa chỉ trùng lặp
                    const uniqueCustomers = response.data.map(customer => {
                        // Lọc địa chỉ mặc định
                        const defaultAddress = customer.addresses.find(address => address.isDefault);
    
                        return {
                            ...customer,
                            // Lọc lại địa chỉ không bị lặp lại (nếu cần)
                            addresses: Array.from(new Set(customer.addresses.map(a => JSON.stringify(a))))
                                .map(e => JSON.parse(e)),
                            defaultAddress: defaultAddress || null // Chỉ lưu địa chỉ mặc định
                        };
                    });
    
                    setCustomers(uniqueCustomers); // Gán dữ liệu đã xử lý
                } else {
                    console.error("Dữ liệu trả về không phải là mảng", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
    
        fetchCustomers();
    }, []);
    
    


    const filterCustomers = () => {
        if (!Array.isArray(customers)) return []; // Nếu không phải mảng, trả về mảng rỗng
    
        return customers.filter((customer) => {
            const username = customer.username ? customer.username.toLowerCase() : "";
            const email = customer.email ? customer.email.toLowerCase() : "";
            const accountId = String(customer.accountId);
    
            const matchesSearch =
                username.includes(searchTerm.toLowerCase()) ||
                email.includes(searchTerm.toLowerCase()) ||
                accountId.includes(searchTerm);
    
            const matchesCardType = cardTypeFilter
                ? customer.cardType === cardTypeFilter
                : true;
    
            return matchesSearch && matchesCardType;
        });
    };
    

    const filteredCustomers = filterCustomers();
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const currentCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleRowClick = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedCustomer(null);
        setShowModal(false);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    return (
        <div className="customer-container-customer">
            <div className="customer-card-customer">
                <div className="card-header-customer">
                    <h2 className="customer-title-customer">Danh sách khách hàng</h2>
                </div>
                <div className="card-body-customer">
                    <div className="filter-controls-customer mb-3">
                        <select
                            className="filter-select-customer-custom"
                            value={cardTypeFilter}
                            onChange={(e) => setCardTypeFilter(e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            <option value="Thường">Khách hàng thường</option>
                            <option value="Vip">Khách hàng VIP</option>
                        </select>

                        <input
                            type="text"
                            className="filter-search-customer-custom"
                            placeholder="Tìm kiếm theo Tên, email hoặc ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <table className="customer-table-customer table table-striped">
                        <thead className="table-header">
                            <tr>
                                <th>Tên khách hàng</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Giới tính</th>
                                <th>Thẻ</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentCustomers.map((customer) => (
                                <tr
                                    key={customer.accountId}
                                    onClick={() => handleRowClick(customer)}
                                >
                                    <td>{customer.username}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    {/* <td>{customer.address}</td> */}
                                    {/* <td>{customer.address || "Chưa cập nhật"}</td> */}
                                    {/* <td>{customer.addressName}, {customer.district}, {customer.city}</td> */}
                                    <td>{customer.addresses && customer.addresses.length > 0 ? customer.addresses[0].address : "Chưa cập nhật"}</td>
                                    <td>{customer.gender === true ? "Nam" : "Nữ"}</td>
                                    <td>{customer.cardType}</td>
                                    <td
                                        className={
                                            customer.status === "Đang hoạt động"
                                                ? "status-active-customer"
                                                : "status-inactive-customer"
                                        }
                                    >
                                        {customer.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="customer-nav-customer">
                    <nav>
                        <div className="pagination-controls-customer">
                            <ul className="pagination-customer">
                                <li
                                    className={`page-item-customer ${currentPage === 1 ? "disabled" : ""
                                        }`}
                                >
                                    <button
                                        className="page-link-customer"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        &laquo;
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item-customer ${currentPage === index + 1 ? "active" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link-customer"
                                            onClick={() => paginate(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li
                                    className={`page-item-customer ${currentPage === totalPages ? "disabled" : ""
                                        }`}
                                >
                                    <button
                                        className="page-link-customer"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Modal chi tiết khách hàng */}
            {showModal && selectedCustomer && (
                <Modal show={showModal} onHide={closeModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <h5>
                                <strong>Chi tiết Khách hàng</strong>
                            </h5>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="customer-details-customer">
                            <div className="detail-section-customer">
                                <p>
                                    <strong>ID:</strong> <em>{selectedCustomer.accountId}</em>
                                </p>
                                <p>
                                    <strong>Tên khách hàng:</strong>{" "}
                                    <em>{selectedCustomer.username}</em>
                                </p>
                                <p>
                                    <strong>Email:</strong> <em>{selectedCustomer.email}</em>
                                </p>
                                <p>
                                    <strong>Số điện thoại:</strong>{" "}
                                    <em>{selectedCustomer.phone}</em>
                                </p>
                            </div>
                            <div className="detail-section-customer">
                                <p>
                                    <strong>Giới tính:</strong>{" "}
                                    <em>{selectedCustomer.gender === true ? "Nam" : "Nữ"}</em>
                                </p>
                                <p>
                                    <strong>Loại thẻ:</strong>{" "}
                                    <em>{selectedCustomer.cardType}</em>
                                </p>
                                <p>
                                    <strong>Trạng thái:</strong>{" "}
                                    <em>{selectedCustomer.status}</em>
                                </p>
                                <p>
                                    <strong>Địa chỉ:</strong> <em>{selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? selectedCustomer.addresses[0].address : "Chưa cập nhật"}</em>
                                </p>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default BlogPost;
