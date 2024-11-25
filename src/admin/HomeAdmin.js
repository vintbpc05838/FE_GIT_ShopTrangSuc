import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Bar } from "react-chartjs-2"; // Importing Bar chart from react-chartjs-2
import "chart.js/auto"; // Required for chart.js
import "../css/admin/homeAdmin.css";

// Định nghĩa component chính cho biểu đồ (PopulationChart).
const PopulationChart = () => {
  const data = {
    labels: ["Sản phẩm", "Đơn hàng", "Thống kê", "Tài khoản"],
    datasets: [
      {
        label: "Doanh thu",
        data: [1000, 800, 500, 100],
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "RGBA( 169, 169, 169, 1 )",
          "rgba(75, 192, 192, 0.5)",
        ],
      },
    ],
  };

  const options = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Allow the chart to fill the container
    scales: {
      y: {
        beginAtZero: true,
        // Trục Y bắt đầu từ giá trị 0.
        max: 2000,
        // Giới hạn giá trị tối đa trên trục Y là 2000.
      },
    },
    plugins: {
      legend: {
        onClick: null, // Disable click on the legend - do click là bị ẩn
      },
    },
  };

  return (
    <div className="homeAdmin-container">
      <div className="headerHomeAdmin bg-light p-3 mb-4 rounded">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="HomeAdmin" className="text-decoration-none">
                Thống kê doanh thu
              </a>
            </li>
          </ol>
        </nav>
      </div>
      <div className="navbar">
        <button className="navbar-item" style={{ backgroundColor: "#4B87FF" }}>
          <i className="bi bi-handbag"></i> Sản phẩm{" "}
          <span className="badge">1000</span>
        </button>
        <button className="navbar-item" style={{ backgroundColor: "#F3CA37" }}>
          <i className="bi bi-truck-front"></i> Đơn hàng{" "}
          <span className="badge">800</span>
        </button>
        <button className="navbar-item" style={{ backgroundColor: "#A5A5A5" }}>
          <i className="bi bi-bar-chart"></i> Thống kê{" "}
          <span className="badge">500</span>
        </button>
        <button className="navbar-item" style={{ backgroundColor: "#56E0E0" }}>
          <i className="bi bi-person"></i> Tài khoản{" "}
          <span className="badge">100</span>
        </button>
      </div>
      <div className="chart-container" style={{ position: "relative", height: "50vh", maxWidth: "1000px", width: "100%", margin: "0 auto" }}>
        <Bar data={data} options={options} />
        {/* Biểu đồ dạng cột (Bar chart) với dữ liệu và tùy chọn đã cấu hình */}
      </div>
    </div>
  );
};

// Data Parent Component
const HomeAdminRun = () => {
  return (
    <div className="homeAdmin">
      <PopulationChart />{/* Hiển thị component biểu đồ PopulationChart */}
    </div>
  );
};

export default HomeAdminRun;
