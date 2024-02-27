import React from 'react';
import { Form, Input, Button, Upload, message, Card } from 'antd';
import { PlusOutlined, PrinterOutlined, DeleteOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function AddMaintenant2() {

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
      };
    
      const uploadProps = {
        beforeUpload: (file) => {
          // Implement file validation or uploading here
          message.error('File upload is mocked in this example.');
          return false;
        },
        multiple: true,
      };


  return (
    <>


<div className="bg-white p-4 shadow rounded-lg">
      <Card bordered={false}>
        <Form {...formItemLayout} onFinish={onFinish}>
          <Form.Item name="itemName" label="ชื่ออุปกรณ์ครุภัณฑ์" rules={[{ required: true }]}>
            <Input placeholder="กรอกชื่ออุปกรณ์ครุภัณฑ์" />
          </Form.Item>

          <Form.Item label="รายละเอียดการดำเนินการ">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="รูปภาพ" valuePropName="fileList">
            <Upload {...uploadProps} listType="picture-card">
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }} className="text-center">
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} className="mr-2">
              เพิ่ม
            </Button>
            <Button type="default" htmlType="button" icon={<PrinterOutlined />} className="mr-2">
              บันทึก
            </Button>
            <Button type="danger" htmlType="button" icon={<DeleteOutlined />}>
              ยกเลิก
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    
    
    </>
  )
}

export default AddMaintenant2