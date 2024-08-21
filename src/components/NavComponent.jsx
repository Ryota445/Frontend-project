import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Badge, Card, List } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined, ToolOutlined, ToolFilled, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import logo_1 from '../assets/img/logo_1.jpg';
import { Link } from 'react-router-dom';

function NavComponent({ collapsed, setCollapsed }) {
  // const [notifications, setNotifications] = useState([]);
  const [acknowledgedNotifications, setAcknowledgedNotifications] = useState([]);

  // useEffect(() => {
  //   fetch('/api/notifications')
  //     .then(response => response.json())
  //     .then(data => {
  //       setNotifications(data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching notifications:', error);
  //       setNotifications([
  //         {
  //           "id": 1,
  //           "message": "การแจ้งเตือนซ่อมบำรุงคอมพิวเตอร์",
  //           "category": "maintenance",
  //           "link": "/MantenantPage1/"
  //         },
  //         {
  //           "id": 2,
  //           "message": "การแจ้งเตือนการซ่อมคอมพิวเตอร์",
  //           "category": "repair",
  //           "link": "/MantenantPage1/"
  //         },
  //         {
  //           "id": 3,
  //           "message": "การแจ้งเตือนการเปลี่ยนที่ตั้ง",
  //           "category": "location",
  //           "link": "/location"
  //         },
  //         {
  //           "id": 4,
  //           "message": "การแจ้งเตือนการทำลายคอมพิวเตอร์",
  //           "category": "decommission",
  //           "link": "/decommission"
  //         }
  //       ]);
  //     });
  // }, []);
  const [notifications, setNotifications] = useState([
    // {
    //   "id": 1,
    //   "message": "การแจ้งเตือนซ่อมบำรุงคอมพิวเตอร์",
    //   "category": "maintenance",
    //   "link": "/MantenantPage1/"
    // },
    // {
    //   "id": 2,
    //   "message": "การแจ้งเตือนการซ่อมคอมพิวเตอร์",
    //   "category": "repair",
    //   "link": "/MantenantPage1/"
    // },
    // {
    //   "id": 3,
    //   "message": "การแจ้งเตือนการเปลี่ยนที่ตั้ง",
    //   "category": "location",
    //   "link": "/location"
    // },
    // {
    //   "id": 4,
    //   "message": "การแจ้งเตือนการทำลายคอมพิวเตอร์",
    //   "category": "decommission",
    //   "link": "/decommission"
    // }
  ]);
  

  const handleNotificationClick = (id) => {
    console.log(`การแจ้งเตือนที่มี ID ${id} ถูกคลิก.`);
    const clickedNotification = notifications.find(notification => notification.id === id);
    setAcknowledgedNotifications([...acknowledgedNotifications, clickedNotification]);
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleAcknowledge = (id) => {
    console.log(`การแจ้งเตือนที่มี ID ${id} ได้รับการรับทราบ.`);
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'maintenance':
        return <ToolOutlined className="mr-2 text-blue-500" />;
      case 'repair':
        return <ToolFilled className="mr-2 text-green-500" />;
      case 'location':
        return <SyncOutlined className="mr-2 text-pink-500" />;
      case 'decommission':
        return <DeleteOutlined className="mr-2 text-yellow-500" />;
      default:
        return null;
    }
  };

  const renderNotificationActions = (notification) => {
    if (['location', 'decommission'].includes(notification.category)) {
      return (
        <Button type="primary" onClick={() => handleAcknowledge(notification.id)} className="mt-2">
          อนุญาต
        </Button>
      );
    }
    return null;
  };

  const acknowledgedNotificationIds = acknowledgedNotifications.map(notification => notification.id);
  const filteredNotifications = notifications.filter(notification => !acknowledgedNotificationIds.includes(notification.id));

  const menu = (
    <List
      dataSource={filteredNotifications}
      renderItem={notification => (
        <List.Item key={notification.id}>
          <Card
            className="mb-2 cursor-pointer border border-gray-300 bg-gray-200"
            onClick={() => handleNotificationClick(notification.id)}
          >
            <Link to={notification.link} className="no-underline text-inherit">
              <div className="flex items-center">
                {getCategoryIcon(notification.category)}
                <p className="m-0">{notification.message}</p>
              </div>
            </Link>
            {renderNotificationActions(notification)}
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
    <div className="navbar bg-base-100" style={{ padding: '0' }}>
      <div className="navbar-start">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl w-16 h-16 mr-5"
        />
      </div>

      <div className="navbar-center">
    <a className="btn btn-ghost p-0">  
      <img src={logo_1} alt="โลโก้" style={{
        width: '120px',
        height: 'auto',
        borderRadius: '5px',
        maxHeight: '64px'  // เพิ่มบรรทัดนี้
      }} />
    </a>
  </div>

      <div className="navbar-end mr-5">
        {/* <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Badge count={filteredNotifications.length}>
            <Button type="ghost" shape="circle" icon={<BellOutlined />} className="text-2xl" />
          </Badge>
        </Dropdown> */}
      </div>
    </div>
  );
}

export default NavComponent;
