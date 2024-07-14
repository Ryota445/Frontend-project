import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

function Register() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // ทำการลงทะเบียนผู้ใช้ใหม่ที่นี่
            // ตัวอย่าง:
            const response = await fetch(`${API_URL}/api/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                notification.success({
                    message: 'ลงทะเบียนสำเร็จ',
                    description: 'บัญชีของคุณถูกสร้างเรียบร้อยแล้ว!',
                });
                navigate('/login');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            notification.error({
                message: 'ลงทะเบียนไม่สำเร็จ',
                description: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">ลงทะเบียน</h2>
                <Form
                    name="register"
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
                        name="email"
                        rules={[
                            { required: true, message: 'กรุณากรอกอีเมล!' },
                            { type: 'email', message: 'กรุณากรอกอีเมลที่ถูกต้อง!' }
                        ]}
                    >
                        <Input placeholder="อีเมล (Email)" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
                    >
                        <Input.Password placeholder="รหัสผ่าน (Password)" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'กรุณายืนยันรหัสผ่าน!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="ยืนยันรหัสผ่าน (Confirm Password)" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} className="w-full bg-blue-500">
                            ลงทะเบียน
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="link" onClick={() => navigate('/login')} className="w-full">
                            กลับไปหน้าเข้าสู่ระบบ
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Register;