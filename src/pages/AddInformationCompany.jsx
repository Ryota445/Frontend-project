import React, { useState, useEffect } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Table, Button, Input, Space, Modal, Form, Checkbox, Dropdown, Menu, message } from 'antd';

const { Search } = Input;

function AddInformationCompany() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [columnSettings, setColumnSettings] = useState({
    Cname: true,
    taxId: true,
    contactName: true,
    Cphone: true,
    Cemail: true,
    Caddress: true,
    role: true,
  });

  useEffect(() => {
    fetch(`${API_URL}/api/company-inventories`)
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
    item.attributes?.Cname?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.attributes?.contactName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddCompany = () => {
    form.validateFields().then(values => {
      fetch(`${API_URL}/api/company-inventories`, {
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

  const handleEditCompany = () => {
    form.validateFields().then(values => {
      fetch(`${API_URL}/api/company-inventories/${editingRecord.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: values })
      })
        .then(response => response.json())
        .then(updatedData => {
          setData(prevData => prevData.map(item => 
            item.id === editingRecord.id ? updatedData.data : item
          ));
          setIsEditModalVisible(false);
          form.resetFields();
          message.success('แก้ไขข้อมูลบริษัทสำเร็จแล้ว');
        })
        .catch(error => {
          console.error('Error updating company:', error);
          message.error('แก้ไขข้อมูลบริษัทไม่สำเร็จ');
        });
    });
  };

  const handleDeleteCompany = id => {
    fetch(`${API_URL}/api/company-inventories/${id}`, {
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
      <Menu.Item key="role">
      <Checkbox checked={columnSettings.role}>หน้าที่</Checkbox>
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
    columnSettings.role && {
      title: 'หน้าที่',
      dataIndex: ['attributes', 'role'],
      key: 'role'
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
          <EditOutlined 
            className='text-xl' 
            onClick={() => {
              setEditingRecord(record);
              form.setFieldsValue(record.attributes);
              setIsEditModalVisible(true);
            }}
          />
          <DeleteOutlined 
            className='text-xl' 
            onClick={() => handleDeleteCompany(record.id)}
            style={{ color: record.id === 1 ? 'gray' : undefined }}
          />
        </Space>
      )
    }
  ].filter(Boolean);

  return (
    <>
      <div className='border-b-2 border-black mb-10 flex justify-between items-center'>
        <h1 className='text-3xl text-blue-800'>ข้อมูลตัวแทนบริษัท</h1>
      </div>
      
      <div className='flex flex-col'>
      
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="ค้นหาชื่อบริษัท ชื่อตัวแทน"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </Space>

        <Space className='flex flex-row justify-between'>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<SettingOutlined />}>เลือกคอลัมน์</Button>
          </Dropdown>
          <Button className='w-32 h-12 mr-10 mb-2' style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }} onClick={() => setIsModalVisible(true)}>
            เพิ่มข้อมูลบริษัท
          </Button>
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={record => record.id}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRecord ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
        visible={isModalVisible || isEditModalVisible}
        onOk={editingRecord ? handleEditCompany : handleAddCompany}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        okText={editingRecord ? "บันทึกการแก้ไข" : "บันทึก"}
        cancelText="ยกเลิก"
        okButtonProps={{ 
          style: { backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' } 
        }}
        cancelButtonProps={{ 
          style: { borderColor: '#1890ff', color: '#1890ff' } 
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Cname" label="ชื่อบริษัท" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="taxId" label="เลขประจำตัวผู้เสียภาษี" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactName" label="ชื่อตัวแทน" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="หน้าที่" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Cphone" label="เบอร์โทร" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Cemail" label="อีเมล" rules={[{ required: false, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Caddress" label="ที่อยู่บริษัท" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddInformationCompany;
