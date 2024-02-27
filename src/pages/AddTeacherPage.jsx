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

function AddTeacherPage() {
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
        {/* ส่วนของข้อมูลผู้รับผิดชอบ */}
        <Form.Item
          label="ชื่อผู้รับผิดชอบ"
          name="responsibleName"
          rules={[{ required: true, message: 'กรุณากรอกชื่อผู้รับผิดชอบด้วย!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="เบอร์โทรผู้รับผิดชอบ"
          name="responsiblePhone"
          rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์ผู้รับผิดชอบด้วย!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="อีเมลผู้รับผิดชอบ"
          name="responsibleEmail"
          rules={[
            {
              type: 'email',
              message: 'การกรอกข้อมูลอีเมลผู้รับผิดชอบไม่ถูกต้อง!',
            },
            {
              required: true,
              message: 'กรุณากรอกอีเมลผู้รับผิดชอบด้วย!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* จบส่วนของข้อมูลผู้รับผิดชอบ */}

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className="mr-2 bg-blue-300">
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

export default AddTeacherPage