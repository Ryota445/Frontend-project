import React, { useState, useEffect } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Table, Button, Input, Space, Modal, Form, Checkbox, Dropdown, Menu, message } from 'antd';

const { Search } = Input;

function AddInformationTeacher() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [columnSettings, setColumnSettings] = useState({
    responsibleName: true,
    responsiblePhone: true,
    responsibleEmail: true,
  });

  useEffect(() => {
    fetch('http://localhost:1337/api/responsibles')
      .then(response => response.json())
      .then(data => {
        setData(data.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = value => {
    setSearchText(value);
  };

  const filteredData = data.filter(item => 
    item.attributes?.responsibleName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddResponsible = () => {
    form.validateFields().then(values => {
      fetch('http://localhost:1337/api/responsibles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: values })
      })
        .then(response => response.json())
        .then(newData => {
          setData(prevData => [...prevData, newData.data]);
          setIsModalVisible(false);
          form.resetFields();
          message.success('บันทึกข้อมูลผู้รับผิดชอบสำเร็จแล้ว');
        })
        .catch(error => {
          console.error('Error adding responsible:', error);
          message.error('บันทึกข้อมูลผู้รับผิดชอบไม่สำเร็จ');
        });
    });
  };

  const handleDeleteResponsible = id => {
    fetch(`http://localhost:1337/api/responsibles/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        setData(prevData => prevData.filter(item => item.id !== id));
        message.success('ลบข้อมูลผู้รับผิดชอบสำเร็จแล้ว');
      })
      .catch(error => {
        console.error('Error deleting responsible:', error);
        message.error('ลบข้อมูลผู้รับผิดชอบไม่สำเร็จ');
      });
  };

  const handleMenuClick = ({ key }) => {
    setColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="responsibleName">
        <Checkbox checked={columnSettings.responsibleName}>ชื่อผู้รับผิดชอบ</Checkbox>
      </Menu.Item>
      <Menu.Item key="responsiblePhone">
        <Checkbox checked={columnSettings.responsiblePhone}>เบอร์โทร</Checkbox>
      </Menu.Item>
      <Menu.Item key="responsibleEmail">
        <Checkbox checked={columnSettings.responsibleEmail}>อีเมล</Checkbox>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    columnSettings.responsibleName && {
      title: 'ชื่อผู้รับผิดชอบ',
      dataIndex: ['attributes', 'responsibleName'],
      key: 'responsibleName'
    },
    columnSettings.responsiblePhone && {
      title: 'เบอร์โทร',
      dataIndex: ['attributes', 'responsiblePhone'],
      key: 'responsiblePhone'
    },
    columnSettings.responsibleEmail && {
      title: 'อีเมล',
      dataIndex: ['attributes', 'responsibleEmail'],
      key: 'responsibleEmail'
    },
    {
      title: 'การจัดการ',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <EyeOutlined className='text-xl' />
          <EditOutlined className='text-xl' />
          <DeleteOutlined className='text-xl' onClick={() => handleDeleteResponsible(record.id)} />
        </Space>
      )
    }
  ].filter(Boolean);

  return (
    <>
      <div className='border-b-2 border-black mb-10 flex justify-between items-center'>
        <h1 className='text-3xl text-blue-800'>ข้อมูลผู้รับผิดชอบ</h1>
        <Space>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<SettingOutlined />} />
          </Dropdown>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            เพิ่มข้อมูลผู้รับผิดชอบ
          </Button>
        </Space>
      </div>
      
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="ค้นหาชื่อผู้รับผิดชอบ"
          onSearch={handleSearch}
          enterButton
          style={{ width: 300 }}
        />
      </Space>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={record => record.id}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="เพิ่มข้อมูลผู้รับผิดชอบ"
        visible={isModalVisible}
        onOk={handleAddResponsible}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="responsibleName" label="ชื่อผู้รับผิดชอบ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="responsiblePhone" label="เบอร์โทร" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="responsibleEmail" label="อีเมล" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddInformationTeacher;
