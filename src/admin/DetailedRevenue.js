import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/admin/DetailedRevenue.css";

const DetailedRevenue = () => {
  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');

  const data = [
    { ngay: '2/8/2024', tongHoaDon: 1, doanhThu: 888480.000 },
    { ngay: '5/6/2024', tongHoaDon: 1, doanhThu: 300000.000 },
    { ngay: '25/5/2024', tongHoaDon: 1, doanhThu: 230000.000 }
  ];

  const handleTimKiem = () => {
    // Logic tìm kiếm theo ngày sẽ được thêm vào đây
    console.log('Từ ngày:', tuNgay, 'Đến ngày:', denNgay);
  };


  return (
    <div>
      <h1 className="font-detailedrevenue">Thống Kê Doanh Thu</h1>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div className="row-detail">
          <label className="lable-detail">Từ ngày</label>
          <input
            type="date"
            value={tuNgay}
            onChange={(e) => setTuNgay(e.target.value)}
            className="input-detail"
          />
        </div>
        <div className="row-detail">
          <label className="lable-detail">Đến ngày</label>
          <input
            type="date"
            value={denNgay}
            onChange={(e) => setDenNgay(e.target.value)}
            className="input-detail"
          />
        </div>
        <button className="btn btn-detail-search" onClick={handleTimKiem}>Tìm Kiếm</button>
      </div>
      <table border="1" width="100%" className="table-detail">
        <thead>
          <tr className="tr-detail">
            <th className="th-detail">Ngày</th>
            <th className="th-detail">Tổng số hóa đơn</th>
            <th className="th-detail">Doanh thu</th>
            <th className="th-detail">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="tr-detail">
              <td className="td-detail">{item.ngay}</td>
              <td className="td-detail">{item.tongHoaDon}</td>
              <td className="td-detail">{item.doanhThu.toLocaleString('vi-VN')}</td>
              <td className="td-detail">
                <button className="btn btn-search-detail" onClick={() => alert(`Xem chi tiết cho ${item.ngay}`)}>Tìm Kiếm</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DetailedRevenue;
