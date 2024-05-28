import React, { useState } from 'react';
import { Button, Dropdown, Badge, Card, List } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined, ToolOutlined, ToolFilled, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import logo_1 from '../assets/img/logo_1.jpg';

function NavComponent({ collapsed, setCollapsed }) {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'การแจ้งเตือนซ่อมบำรุงคอมพิวเตอร์', category: 'maintenance' },
    { id: 2, message: 'การแจ้งเตือนการซ่อมคอมพิวเตอร์', category: 'repair' },
    { id: 3, message: 'การแจ้งเตือนการเปลี่ยนที่ตั้ง', category: 'location' },
    { id: 4, message: 'การแจ้งเตือนการทำลายคอมพิวเตอร์', category: 'decommission' },
    // เพิ่มการแจ้งเตือนเพิ่มเติมตามต้องการ
  ]);
  const [acknowledgedNotifications, setAcknowledgedNotifications] = useState([]);

  const handleNotificationClick = (id) => {
    console.log(`การแจ้งเตือนที่มี ID ${id} ถูกคลิก.`);
    setAcknowledgedNotifications([...acknowledgedNotifications, id]);
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleAcknowledge = (id) => {
    console.log(`การแจ้งเตือนที่มี ID ${id} ได้รับการรับทราบ.`);
    setAcknowledgedNotifications(acknowledgedNotifications.filter(notificationId => notificationId !== id));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'maintenance':
        return <ToolOutlined style={{ color: '#1890ff', marginRight: '10px' }} />;
      case 'repair':
        return <ToolFilled style={{ color: '#52c41a', marginRight: '10px' }} />;
      case 'location':
        return <SyncOutlined style={{ color: '#eb2f96', marginRight: '10px' }} />;
      case 'decommission':
        return <DeleteOutlined style={{ color: '#fadb14', marginRight: '10px' }} />;
      default:
        return null;
    }
  };

  const menu = (
    <List
      dataSource={notifications}
      renderItem={notification => (
        <List.Item key={notification.id}>
          <Card
            style={{
              marginBottom: 10,
              cursor: 'pointer',
              backgroundColor: acknowledgedNotifications.includes(notification.id) ? '#f5f5f5' : '#d3d3d3',
              border: '1px solid #ddd'
            }}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {getCategoryIcon(notification.category)}
              <p>{notification.message}</p>
            </div>
            {!acknowledgedNotifications.includes(notification.id) && (
              <Button type="primary" onClick={() => handleAcknowledge(notification.id)} style={{ marginTop: '10px' }}>
                รับทราบ
              </Button>
            )}
          </Card>
        </List.Item>
      )}
    />
  );

  const imgStyle = {
    width: '120px',
    height: 'auto',
    borderRadius: '5px'
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              marginRight: 20 // เพิ่มระยะห่างของปุ่มเมนู
            }}
          />
        </div>

        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">
            <img src={logo_1} alt="โลโก้" style={imgStyle} />
          </a>
        </div>

        <div className="navbar-end" style={{ marginRight: 20 }}> {/* เพิ่มระยะห่างของ Navbar ด้านขวา */}
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <Badge count={notifications.length}>
              <Button type="ghost" shape="circle" icon={<BellOutlined />} style={{ fontSize: '20px' }} /> {/* เพิ่มระยะห่างรอบๆปุ่ม */}
            </Badge>
          </Dropdown>
        </div>
      </div>
    </>
  );
}

export default NavComponent;
