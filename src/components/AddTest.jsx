import React, { useState } from 'react';
import { Form, Input, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddInventoryItem = ({ index, remove }) => (
  <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
    <Form.Item
      name={[index, 'inventoryNumber']}
      rules={[{ required: false, message: 'กรุณากรอกเลขครุภัณฑ์' }]}
    >
      <Input placeholder="หมายเลขครุภัณฑ์" />
    </Form.Item>
    <Form.Item
      name={[index, 'name']}
      rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
    >
      <Input placeholder="ชื่อครุภัณฑ์" />
    </Form.Item>

    <Form.Item
      name={[index, 'numberSN']}
      rules={[{ required: false, message: 'กรุณากรอกหมายเลขSN' }]}
    >
      <Input placeholder="หมายเลข SN" />
    </Form.Item>

    <Form.Item
      name={[index, 'brand2']}
      rules={[{ required: false, message: 'กรุณากรอกจำนวน' }]}
    >
      <Input placeholder="ยี่ห้อ" />
    </Form.Item>

    <Form.Item
      name={[index, 'model2']}
      rules={[{ required: false, message: 'กรุณากรอกจำนวน' }]}
    >
      <Input placeholder="รุ่น" />
    </Form.Item>

    <Form.Item
      name={[index, 'detail']}
      rules={[{ required: false, message: 'กรุณากรอกจำนวน' }]}
    >
      <Input placeholder="รายละเอียด" />
    </Form.Item>
    <Button onClick={() => remove(index)} type="danger" className='bg-red-500'>
      ลบ
    </Button>
  </Space>
);

const AddTest = ({ items: initialItems, setItems: setItemsProp, removeItem: removeItemProp }) => {
  const [items, setItems] = useState(initialItems);

  const addItem = () => {
    setItems([...items, { inventoryNumber: '', name: '', amount: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => index !== i));
  };

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <>
      {items.map((item, index) => (
        <AddInventoryItem key={index} index={index} remove={removeItem} />
      ))}
      <Button className="mb-10" type="dashed" onClick={addItem} block icon={<PlusOutlined />}>
        เพิ่ม
      </Button>
    </>
  );
};

export default AddTest;
