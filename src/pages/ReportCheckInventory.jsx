import React, { useState } from 'react';
import { Table, Select, Space } from 'antd';

const { Option } = Select;

const initialData = [
  {
    key: '1',
    inventoryNumber: '10001',
    name: 'เครื่องคอมพิวเตอร์',
    building: 'อาคาร A',
    floor: 'ชั้น 3',
    room: 'ห้อง 301',
    status: 'อยู่ที่เดิม',
  },
  // สามารถเพิ่มข้อมูลอื่นๆ ตามต้องการ
];

function ReportCheckInventory() { 
  const [data, setData] = useState(initialData);

  const handleStatusChange = (value, record) => {
    const newData = data.map(item => {
      if (item.key === record.key) {
        return { ...item, status: value };
      }
      return item;
    });
    setData(newData);
  };

  const columns = [
    {
      title: 'เลขครุภัณฑ์',
      dataIndex: 'inventoryNumber',
      key: 'inventoryNumber',
    },
    {
      title: 'ชื่อครุภัณฑ์',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ที่อยู่เดิม',
      key: 'originalLocation',
      render: (text, record) => `${record.building}, ${record.floor}, ${record.room}`,
    },
    {
      title: 'สถานะ',
      key: 'status',
      render: (text, record) => (
        <Select value={record.status} style={{ width: 120 }} onChange={(value) => handleStatusChange(value, record)}>
          <Option value="อยู่ที่เดิม">อยู่ที่เดิม</Option>
          <Option value="เปลี่ยนที่อยู่">เปลี่ยนที่อยู่</Option>
          <Option value="ไม่ทราบที่อยู่">ไม่ทราบที่อยู่</Option>
        </Select>
      ),
    },
    {
      title: 'ที่อยู่ปัจจุบัน',
      key: 'currentLocation',
      render: (text, record) => record.status === 'อยู่ที่เดิม' ? `${record.building}, ${record.floor}, ${record.room}` : 'ต้องปรับปรุง',
    },
  ];

  return (
    <Table columns={columns} dataSource={data} />
  );
}

export default ReportCheckInventory