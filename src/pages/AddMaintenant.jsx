import React from 'react';
import { Form, Input, Button, Select, Upload, Card } from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';


const { TextArea } = Input;
const { Option } = Select;



function AddMaintenant() {
    const onFinish = values => {
        console.log('Received values:', values);
      };


  return (
    <>

<div className="m-4">
      <Card  title="การเพิ่มรายการครุภัณฑ์" bordered={false}>

      <Card title="รายการครุภัณฑ์" extra={<Button icon={<EditOutlined />} />}>
        {/* Place your table or list component here */}
      </Card>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="ชื่อการบำรุงรักษาหรือซ่อมแซม" name="itemName" rules={[{ required: true, message: 'กรุณาชื่อการบำรุงรักษาหรือซ่อมแซม!' }]}>
            <Input className="h-20" placeholder="กรอกชื่อการบำรุงรักษาหรือซ่อมแซม" />
          </Form.Item>
          <Form.Item label="ประเภทการดำเนินการ" name="actionType">
            <Select placeholder="เลือกประเภทการดำเนินการ">
              <Option value="repair">ซ่อมเสีย</Option>
              <Option value="check">บำรุงรักษา</Option>
              {/* ...other options... */}
            </Select>
          </Form.Item>
          <Form.Item label="รายละเอียดการดำเนินการ" name="actionDetail">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="จำนวนเงิน (บาท)" name="cost">
            <Input addonAfter="บาท" type="number" />
          </Form.Item>
          <Form.Item>
            <Button className="bg-blue-300" type="primary" htmlType="submit" icon={<SaveOutlined />}>
              บันทึก
            </Button>
            <Button type="default" htmlType="button" icon={<DeleteOutlined />} className="ml-2">
              ยกเลิก
            </Button>
          </Form.Item>
        </Form>
      </Card>

      
    </div>
    
    </>
  )
}

export default AddMaintenant