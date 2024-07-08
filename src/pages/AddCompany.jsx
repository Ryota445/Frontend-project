import React from 'react';
import { Form, Input, Button } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
function AddCompany() {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
    


    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="max-w-lg m-auto bg-white p-4 shadow rounded"
    >


      <Form.Item
        label="ชื่อผู้ติดต่อ"
        name="contactName"
        rules={[{ required: true, message: 'Please input the contact name!' }]}
      >
        <Input />
      </Form.Item>


      <Form.Item
        label="เลขประจำตัวผู้เสียภาษี"
        name="taxId"
        rules={[{ required: true, message: 'กรุณากรอกเลขประจำตัวผู้เสียภาษีด้วย!' }]}
      >
        <Input type='number'/>
      </Form.Item>


      <Form.Item
        label="ชื่อบริษัท"
        name="company"
        rules={[{ required: false, message: 'กรุณากรอกชื่อบริษัทด้วย!' }]}
      >
        <Input />
      </Form.Item>



      <Form.Item
        label="เบอร์โทร"
        name="phone"
        rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์ด้วย!' }]}
      >
        <Input type='' />
      </Form.Item>

      <Form.Item
        name="email"
        label="อีเมล"
        rules={[
          {
            type: 'email',
            message: 'การกรอกข้อมูลอีเมลไม่ถูกต้อง!',
          },
          {
            required: true,
            message: 'กรุณากรอกอีเมลด้วย!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="ที่อยู่"
        name="address"
        rules={[{ required: false, message: 'Please input your address!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button   type="primary" htmlType="submit" icon={<SaveOutlined />} className="mr-2 bg-blue-300">
          บันทึก
        </Button>
        <Button type="default" htmlType="button" icon={<CloseOutlined />}>
          ยกเลิก
        </Button>
      </Form.Item>
      </Form>
    
    </>
  )
}

export default AddCompany