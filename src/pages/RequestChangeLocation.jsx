import React from 'react';
import { Table, Button } from 'antd';

const RequestChangeLocation = () => {
  const data = [
    {
      key: '1',
      equipmentId: '12345',
      equipmentName: 'เครื่องปรับอากาศ',
      caretaker: 'สมชายใจดี',
      category: 'อุปกรณ์ไฟฟ้า',
      management: 'รายละเอียด',
      currentLocation: 'อาคาร MHMK ชั้น 11 ห้อง 1101',
      newLocation: 'อาคาร MHMK ชั้น 12 ห้อง 1202',
    },
    // Add more mock data objects as needed
  ];

  const columns = [
    {
      title: 'หมายเลขครุภัณฑ์',
      dataIndex: 'equipmentId',
      key: 'equipmentId',
    },
    {
      title: 'ชื่อครุภัณฑ์',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    },
    {
      title: 'ผู้ดูแล',
      dataIndex: 'caretaker',
      key: 'caretaker',
    },
    {
      title: 'หมวดหมู่',
      dataIndex: 'category',
      key: 'category',
    },
    // {
    //   title: 'การจัดการ',
    //   dataIndex: 'management',
    //   key: 'management',
    // },
    {
      title: 'ที่ตั้งเดิม\nอาคาร ชั้น ห้อง',
      dataIndex: 'currentLocation',
      key: 'currentLocation',
    },
    {
      title: 'ที่ตั้งใหม่ที่ขอเปลี่ยน\nอาคาร ชั้น ห้อง',
      dataIndex: 'newLocation',
      key: 'newLocation',
    },
  ];

  return (
    <div className="request-change-location p-4 bg-gray-100 rounded-lg">
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false} 
        locale={{ emptyText: 'No data' }} 
      />
      <div className="flex justify-end mt-4">
        <Button type="primary" className="bg-blue-500 text-white mr-2">อนุมัติ</Button>
        <Button type="primary" className="bg-red-500 text-white">ไม่อนุมัติ</Button>
      </div>
    </div>
  );
};

export default RequestChangeLocation;
 