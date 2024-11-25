import React, { useState } from 'react';
import Information from './Information'; // Import Information component
import '../css/information.css'; // Đảm bảo đường dẫn đúng đến tệp CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Order from './Order';
import Address from './Addess';

const Dashboard_User = () => {
  const [selectedComponent, setSelectedComponent] = useState('Information'); // Mặc định là 'Information'

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="dashboard-user-bg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div className="dashboard-user-container">
        <h1 className="dashboard-user-title">Trang Tài Khoản</h1>
        <div className="dashboard-user-items">
          <div 
            className={`dashboard-user-item ${selectedComponent === 'Information' ? 'actives' : ''}`} 
            onClick={() => handleSelectComponent('Information')}
          >
            <p>Trang Cá Nhân</p>
          </div>
          <div 
            className={`dashboard-user-item ${selectedComponent === 'Order' ? 'actives' : ''}`} 
            onClick={() => handleSelectComponent('Order')}
          >
            <p>Lịch Sử Đơn Hàng</p>
          </div>
          <div 
            className={`dashboard-user-item ${selectedComponent === 'Address' ? 'actives' : ''}`} 
            onClick={() => handleSelectComponent('Address')}
          >
            <p>Địa Chỉ</p>
          </div>
        </div>
      </div>
      <div className="selectedComponent" style={{ marginLeft: '20px', flex: 1 }}>
        {selectedComponent === 'Information' && <Information />}
        {selectedComponent === 'Order' && <Order />}
        {selectedComponent === 'Address' && <Address />}
      </div>
    </div>
  );
};

export default Dashboard_User;