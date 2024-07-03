import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate จาก react-router-dom
import logo_ICO from '../assets/img/logo-OICT-TH.png';

function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // ใช้ useNavigate เพื่อเข้าถึงออบเจ็กต์การนำทาง

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:1337/api/auth/local', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: values.username,
                    password: values.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                notification.success({
                    message: 'เข้าสู่ระบบสำเร็จ',
                    description: 'คุณได้เข้าสู่ระบบเรียบร้อยแล้ว!',
                });
                // เก็บโทเค็น JWT หรือทำการกระทำเพิ่มเติมตามที่ต้องการ
                localStorage.setItem('jwt', data.jwt);
                // เปลี่ยนเส้นทางไปที่หน้า /manageInventory
                navigate('/manageInventory');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            notification.error({
                message: 'เข้าสู่ระบบไม่สำเร็จ',
                description: 'ชื่อบัญชีหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <div className="text-center mb-6">
                    <img src={logo_ICO} alt="Logo" className="mx-auto w-1/2" />
                </div>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    className="space-y-6"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'กรุณากรอกชื่อบัญชี!' }]}
                    >
                        <Input placeholder="ชื่อบัญชี (Username)" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
                    >
                        <Input.Password placeholder="รหัสผ่าน" />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>จดจำการล็อกอินนี้ไว้</Checkbox>
                    </Form.Item>

                    <div className='flex flex-row'>
                        <Form.Item className="text-center">
                            <Button type="primary" htmlType="submit" loading={loading} className=" bg-blue-500">
                                เข้าสู่ระบบ
                            </Button>
                        </Form.Item>
                        <Form.Item className="text-center">
                            <Button type="link">ย้อนกลับ</Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
            <div className="fixed bottom-0 w-full text-center p-4 text-white">
                <p>
                    หน้าเว็บนี้ใช้คุกกี้ที่จำเป็นในการจดสถานะการล็อกอินเข้าใช้ระบบด้วยบัญชีมายคอร์สวิลล์แพลตฟอร์มเท่านั้น
                    หากท่านใช้งานส่วนอื่น ๆ ของแพลตฟอร์มการเรียนรู้ท่านสามารถศึกษาเกี่ยวกับการเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลของท่านได้ใน นโยบายคุ้มครองข้อมูลส่วนบุคคลสำหรับแพลตฟอร์มการเรียนรู้อิเล็กทรอนิกส์ โดย ศูนย์นวัตกรรมการเรียนรู้จุฬาลงกรณ์มหาวิทยาลัย และ นโยบายคุ้มครองข้อมูลส่วนบุคคลการใช้งานแอปพลิเคชั่นอื่น ๆ 
                </p>
            </div>
        </div>
    );
}

export default Login;
