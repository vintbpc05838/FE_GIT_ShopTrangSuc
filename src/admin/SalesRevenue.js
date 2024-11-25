import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/admin/SalesRevenue.css";

const SalesRevenue = () => {
  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const dataDoanhThu = [
    { id: 13, ngay: '18/6/2024', tongTien: 360000.00 },
    { id: 14, ngay: '18/6/2024', tongTien: 414000.00 },
    { id: 15, ngay: '18/6/2024', tongTien: 450000.00 },
    { id: 16, ngay: '18/6/2024', tongTien: 900000.00 },
    { id: 17, ngay: '18/6/2024', tongTien: 207000.00 },
    { id: 18, ngay: '17/6/2024', tongTien: 3588480.00 },
    { id: 19, ngay: '17/6/2024', tongTien: 486000.00 },
    { id: 20, ngay: '18/6/2024', tongTien: 888480.00 },
    { id: 21, ngay: '5/6/2024', tongTien: 300000.00 },
  ];

  const handleTimKiem = () => {
    if (!tuNgay || !denNgay) {
      alert("Vui lòng nhập đầy đủ thông tin ngày!");
      return;
    }

    const startDate = new Date(tuNgay);
    const endDate = new Date(denNgay);

    if (startDate > endDate) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
      return;
    }

    const filtered = dataDoanhThu.filter(item => {
      const date = new Date(item.ngay.split('/').reverse().join('-'));
      return date >= startDate && date <= endDate;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleXuatFile = () => {
    alert('Xuất file thành công!');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (filteredData.length > 0 ? filteredData : dataDoanhThu).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredData.length > 0 ? filteredData.length : dataDoanhThu.length) / itemsPerPage);

  return (
    <div className="sales-container">
      <h1 className="sales-font-title">Thống Kê Doanh Thu Bán Hàng</h1>

      <div className="sales-input-group">
        <div>
          <label className="sales-label"><strong>Từ Ngày</strong></label>
          <input
            type="date"
            className="sales-input"
            value={tuNgay}
            onChange={(e) => setTuNgay(e.target.value)}
          />
        </div>
        <div>
          <label className="sales-label"><strong>Đến Ngày</strong></label>
          <input
            type="date"
            className="sales-input"
            value={denNgay}
            onChange={(e) => setDenNgay(e.target.value)}
          />
        </div>
        <div className="sales-search-button">
          <button className="sales-button" onClick={handleTimKiem}>Tìm Kiếm</button>
          <button className="sales-button" onClick={handleXuatFile}>Xuất File</button>
        </div>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr className="sales-tr">
              <th className="sales-th">ID Hóa Đơn</th>
              <th className="sales-th">Ngày Xuất</th>
              <th className="sales-th">Tổng Tiền</th>
              <th className="sales-th">Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr className="sales-tr" key={item.id}>
                <td className="sales-td">{item.id}</td>
                <td className="sales-td">{item.ngay}</td>
                <td className="sales-td">{item.tongTien.toLocaleString('vi-VN')}</td>
                <td className="sales-td">
                  <button className="sales-detail-button" onClick={() => alert(`Xem chi tiết cho ID: ${item.id}`)}>Chi Tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sales-pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default SalesRevenue;
