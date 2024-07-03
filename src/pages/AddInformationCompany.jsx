import React, { useState, useEffect } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Table, Button, Input, Space, Modal, Form, Checkbox, Dropdown, Menu, message } from 'antd';

const { Search } = Input;

function AddInformationCompany() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [columnSettings, setColumnSettings] = useState({
    Cname: true,
    taxId: true,
    contactName: true,
    Cphone: true,
    Cemail: true,
    Caddress: true,
  });

  useEffect(() => {
    fetch('http://localhost:1337/api/company-inventories')
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
    item.attributes?.Cname?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddCompany = () => {
    form.validateFields().then(values => {
      fetch('http://localhost:1337/api/company-inventories', {
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
          message.success('บันทึกข้อมูลบริษัทสำเร็จแล้ว');
        })
        .catch(error => {
          console.error('Error adding company:', error);
          message.error('บันทึกข้อมูลบริษัทไม่สำเร็จ');
        });
    });
  };

  const handleDeleteCompany = id => {
    fetch(`http://localhost:1337/api/company-inventories/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        setData(prevData => prevData.filter(item => item.id !== id));
        message.success('ลบข้อมูลบริษัทสำเร็จแล้ว');
      })
      .catch(error => {
        console.error('Error deleting company:', error);
        message.error('ลบข้อมูลบริษัทไม่สำเร็จ');
      });
  };

  const handleMenuClick = ({ key }) => {
    setColumnSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Cname">
        <Checkbox checked={columnSettings.Cname}>ชื่อบริษัท</Checkbox>
      </Menu.Item>
      <Menu.Item key="taxId">
        <Checkbox checked={columnSettings.taxId}>เลขประจำตัวผู้เสียภาษี</Checkbox>
      </Menu.Item>
      <Menu.Item key="contactName">
        <Checkbox checked={columnSettings.contactName}>ชื่อตัวแทน</Checkbox>
      </Menu.Item>
      <Menu.Item key="Cphone">
        <Checkbox checked={columnSettings.Cphone}>เบอร์โทร</Checkbox>
      </Menu.Item>
      <Menu.Item key="Cemail">
        <Checkbox checked={columnSettings.Cemail}>อีเมล</Checkbox>
      </Menu.Item>
      <Menu.Item key="Caddress">
        <Checkbox checked={columnSettings.Caddress}>ที่อยู่บริษัท</Checkbox>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    columnSettings.Cname && {
      title: 'ชื่อบริษัท',
      dataIndex: ['attributes', 'Cname'],
      key: 'Cname'
    },
    columnSettings.taxId && {
      title: 'เลขประจำตัวผู้เสียภาษี',
      dataIndex: ['attributes', 'taxId'],
      key: 'taxId'
    },
    columnSettings.contactName && {
      title: 'ชื่อตัวแทน',
      dataIndex: ['attributes', 'contactName'],
      key: 'contactName'
    },
    columnSettings.Cphone && {
      title: 'เบอร์โทร',
      dataIndex: ['attributes', 'Cphone'],
      key: 'Cphone'
    },
    columnSettings.Cemail && {
      title: 'อีเมล',
      dataIndex: ['attributes', 'Cemail'],
      key: 'Cemail'
    },
    columnSettings.Caddress && {
      title: 'ที่อยู่บริษัท',
      dataIndex: ['attributes', 'Caddress'],
      key: 'Caddress'
    },
    {
      title: 'การจัดการ',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <EyeOutlined className='text-xl' />
          <EditOutlined className='text-xl' />
          <DeleteOutlined className='text-xl' onClick={() => handleDeleteCompany(record.id)} />
        </Space>
      )
    }
  ].filter(Boolean);

  return (
    <>
      <div className='border-b-2 border-black mb-10 flex justify-between items-center'>
        <h1 className='text-3xl text-blue-800'>ข้อมูลบริษัท</h1>
        <Space>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<SettingOutlined />} />
          </Dropdown>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            เพิ่มข้อมูลบริษัท
          </Button>
        </Space>
      </div>
      
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="ค้นหาชื่อบริษัท"
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
        title="เพิ่มข้อมูลบริษัท"
        visible={isModalVisible}
        onOk={handleAddCompany}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Cname" label="ชื่อบริษัท" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="taxId" label="เลขประจำตัวผู้เสียภาษี" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactName" label="ชื่อตัวแทน" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Cphone" label="เบอร์โทร" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Cemail" label="อีเมล" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Caddress" label="ที่อยู่บริษัท" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddInformationCompany;
