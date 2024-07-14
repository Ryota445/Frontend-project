import React from 'react';
import { Form, Input, Button, Space } from 'antd';
const API_URL = import.meta.env.VITE_API_URL;

const AddInventoryItem = ({ index, remove, onFinish }) => (
  
  <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
    <Form.Item
      name={['sub_inventory', index, 'inventoryNumber']}
      rules={[{ required: false, message: 'กรุณากรอกเลขครุภัณฑ์' }]}
    >
      <Input placeholder="หมายเลขครุภัณฑ์" />
    </Form.Item>
    <Form.Item
      name={['sub_inventory', index, 'name']}
      rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
    >
      <Input placeholder="ชื่อครุภัณฑ์" />
    </Form.Item>

    <Form.Item
      name={['sub_inventory', index, 'numberSN']}
      rules={[{ required: false, message: 'กรุณากรอกหมายเลขSN' }]}
    >
      <Input placeholder="หมายเลข SN" />
    </Form.Item>

    <Form.Item
      name={['sub_inventory', index, 'brand2']}
      rules={[{ required: false, message: 'กรุณากรอกจำนวน' }]}
    >
      <Input placeholder="ยี่ห้อ" />
    </Form.Item>

    <Form.Item
      name={['sub_inventory', index, 'model2']}
      rules={[{ required: false, message: 'กรุณากรอกจำนวน' }]}
    >
      <Input placeholder="รุ่น" />
    </Form.Item>

    <Form.Item
      name={['sub_inventory', index, 'detail']}
      rules={[{ required: false, message: 'กรุณากรอกจำนวน' }]}
    >
      <Input placeholder="รายละเอียด" />
    </Form.Item>
    <Button onClick={() => remove(index)} type="danger" className='bg-red-500'>
      ลบ
    </Button>
  </Space>
);

export default AddInventoryItem;
