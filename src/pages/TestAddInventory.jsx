import React from 'react';
import { Form, Input, Button, Upload,message } from 'antd';
import { PlusOutlined, PrinterOutlined } from '@ant-design/icons';

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function TestAddInventory() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form] = Form.useForm();
  const fileInput = React.useRef(null); // เพิ่มเพื่อเก็บอ้างอิงไฟล์

  const onFinish = (values) => {
    console.log('ค่าที่ได้จากฟอร์ม: ', values);

    const formData = new FormData();
    formData.append("data", JSON.stringify({
      name: values.name,
      id_inv: values.id_inv,
    }));

    if (values.img_inv && values.img_inv.length > 0) {
      // ตรวจสอบและเพิ่มไฟล์รูปภาพเข้าไปใน formData
      formData.append("files.img_inv", values.img_inv[0].originFileObj);
    }

    // เพิ่ม header "Authorization" ใน request
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer efc09e3a8ca7b7a7b199932623b113604d38c4e0901af95de642b5dbc40ba70da2cf091536d02918ec3303210af6dac783595656966ec386c2d49559e67eec700af420c8003da228cb20d7d24ed1c9473095c231ec3b67e2b994a194f49c528f53765573d95211a73a86e6548a05d7a8ca436874af66932966ad1bf7a947a23f");

    // ปรับฟังก์ชัน postInventoryData เพื่อใช้ formData
    postInventoryData(formData, myHeaders);
    console.log('ค่าก่อนส่ง: ', formData);
  };

  const postInventoryData = async (formData, headers) => {
    try {
      const response = await fetch(`${API_URL}/api/inventories?populate=img_inv`, {
        method: 'POST',
        headers: headers, // headers นี้จะถูกใช้เพื่อส่ง token อื่นๆ ที่ไม่เกี่ยวข้องกับการระบุ content-type เพราะ FormData จะกำหนดเอง
        body: formData,
        redirect: 'follow'
      });
      const responseData = await response.json();
      console.log('Response:', responseData);
       // ล้างฟิลด์ในฟอร์ม
       form.resetFields();
       // แสดงข้อความแจ้งเตือนสำเร็จ
       message.success('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error:', error);
       // แสดงข้อความแจ้งเตือนเมื่อมีข้อผิดพลาด
       message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <Form form={form} name="equipment-form" onFinish={onFinish} layout="vertical" className="m-4">
      <Form.Item name="name" label="ชื่ออุปกรณ์" rules={[{ required: true, message: 'กรุณากรอกชื่ออุปกรณ์' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="id_inv" label="หมายเลขครุภัณฑ์">
        <Input />
      </Form.Item>
      <Form.Item name="img_inv" label="รูปครุภัณฑ์" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload name="img_inv" listType="picture-card" beforeUpload={() => false}>
          <button
            style={{
              border: 0,
              background: 'none',
            }}
            type="button"
          >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>อัพโหลด</div>
          </button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<PrinterOutlined />}>
          บันทึก
        </Button>
      </Form.Item>
    </Form>
  );
}

export default TestAddInventory;
