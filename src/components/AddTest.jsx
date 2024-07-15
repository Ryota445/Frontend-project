import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddInventoryItem = ({ index, item, handleInputChange, remove }) => (
  <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
    <Form.Item
      name={[index, 'id_inv']}
      rules={[{ required: false, message: 'กรุณากรอกหมายเลขครุภัณฑ์' }]}
    >
      
      <Input placeholder="หมายเลขต่อท้าย" value={item.id_inv} onChange={(e) => handleInputChange(e, index, 'id_inv')} />
    </Form.Item>
    <Form.Item
      name={[index, 'name']}
      rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
    >
      <Input placeholder="ชื่อครุภัณฑ์" value={item.name} onChange={(e) => handleInputChange(e, index, 'name')} />
    </Form.Item>
    <Form.Item
      name={[index, 'serialNumber']}
      rules={[{ required: false, message: 'กรุณากรอกหมายเลข SN' }]}
    >
      <Input placeholder="หมายเลข SN" value={item.serialNumber} onChange={(e) => handleInputChange(e, index, 'serialNumber')} />
    </Form.Item>
    <Form.Item
      name={[index, 'brand']}
      rules={[{ required: false, message: 'กรุณากรอกยี่ห้อ' }]}
    >
      <Input placeholder="ยี่ห้อ" value={item.brand} onChange={(e) => handleInputChange(e, index, 'brand')} />
    </Form.Item>
    <Form.Item
      name={[index, 'model']}
      rules={[{ required: false, message: 'กรุณากรอกรุ่น' }]}
    >
      <Input placeholder="รุ่น" value={item.model} onChange={(e) => handleInputChange(e, index, 'model')} />
    </Form.Item>
    <Form.Item
      name={[index, 'detail']}
      rules={[{ required: false, message: 'กรุณากรอกรายละเอียด' }]}
    >
      <Input placeholder="รายละเอียด" value={item.detail} onChange={(e) => handleInputChange(e, index, 'detail')} />
    </Form.Item>
    <Button onClick={() => remove(index)} type="danger" className='bg-red-500'>
      ลบ
    </Button>
  </Space>
);

const AddTest = ({ items = [], setItems, count, setCount, startInventoryNumber }) => {
  const addItem = () => {
    setItems([...items, { id_inv: '', name: '', serialNumber: '', brand: '', model: '', detail: '', status_inventory: 1 }]);
    console.log("items form AddTest additems-function", items);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => index !== i));
  };

  const handleInputChange = (e, index, fieldName) => {
    const { value } = e.target;
    const newItems = [...items];
    newItems[index][fieldName] = value;
    setItems(newItems);
    console.log("Input Change items", items);
  };

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <>
      <Form onFinish={onFinish}>
        {items.map((item, index) => (
          <AddInventoryItem key={index} index={index} item={item} handleInputChange={handleInputChange} remove={removeItem}  />
        ))}
        <Button className="mb-10" type="dashed" onClick={addItem} block icon={<PlusOutlined />}>
          เพิ่ม
        </Button>
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </>
  );
};

export default AddTest;
