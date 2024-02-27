import React, { useState } from 'react';
import { Form, Input, Button, Space, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

function ForSellComponent() {


    const [items, setItems] = useState([]);

  const columns = [
    {
      title: 'เลขครุภัณฑ์',
      dataIndex: 'inventoryNumber',
      key: 'inventoryNumber',
    },
    {
      title: 'ชื่อ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'จำนวน',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(index)} />
      ),
    },
  ];

  const handleDelete = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleAdd = () => {
    setItems([...items, { inventoryNumber: '', name: '', amount: '' }]);
  };



  return (
    <>
    
    
    <div className="p-4">
      <Button onClick={handleAdd} type="primary" className="mb-4 bg-blue-300" icon={<PlusOutlined />}>
        เพิ่ม
      </Button>
      <Table
        dataSource={items}
        columns={columns}
        pagination={false}
        rowKey={(record, index) => index}
      />
    </div>
    
    
    </>
  )
}

export default ForSellComponent