import React, { useState } from 'react';
import { Input, Select, Button, Table, Pagination, Modal } from 'antd';

import SearchBox from '../components/SearchBox';

const { Option } = Select;

const columns = [
  {
    title: 'หมายเลขครุภัณฑ์',
    dataIndex: 'id',
    key: 'id',
  },
  { title: 'ชื่อครุภัณฑ์', dataIndex: 'name', key: 'name' },
  { title: 'ประเภทครุภัณฑ์', dataIndex: 'type', key: 'type' },
  { title: 'ที่ตั้ง', dataIndex: 'location', key: 'location' },
  { title: 'ผู้ดูแล', dataIndex: 'caretaker', key: 'caretaker' },
  { title: 'สถานะครุภัณฑ์', dataIndex: 'status', key: 'status' },
  {
    title: 'จัดการครุภัณฑ์',
    dataIndex: 'action',
    key: 'action',
    render: () => <Button className='bg-blue-200' type="primary">เลือก</Button>,
  },
];

const data = Array.from({ length: 35 }, (_, i) => ({
  key: i,
  id: '13152131/21',
  name: 'คอมพิวเตอร์',
  type: 'เครื่องใช้ไฟฟ้า',
  location: 'อาคาร mhmk ชั้น 2 ห้อง 201/1',
  caretaker: 'ผศ.ดร.สมนาย ใจดี',
  status: 'ปกติ',
}));

const selectedColumns = [
  { title: 'หมายเลขครุภัณฑ์', dataIndex: 'id', key: 'id' },
  { title: 'ชื่อครุภัณฑ์', dataIndex: 'name', key: 'name' },
  { title: 'ที่ตั้ง', dataIndex: 'location', key: 'location' },
  { title: 'สถานะครุภัณฑ์', dataIndex: 'status', key: 'status' },
];

function ManagePage1() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showLocationFields, setShowLocationFields] = useState(false);
  const [newLocation, setNewLocation] = useState({
    building: '',
    floor: '',
    room: '',
  });

  const handleSelect = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setShowLocationFields(false);
    setIsLocationModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowLocationFields(false);
    setIsLocationModalVisible(false);
  };

  const handleLocationChange = () => {
    const updatedData = data.map((item) =>
      selectedRows.some((row) => row.key === item.key)
        ? { ...item, location: `อาคาร ${newLocation.building} ชั้น ${newLocation.floor} ห้อง ${newLocation.room}` }
        : item
    );
    setSelectedRows(updatedData.filter((item) => selectedRows.some((row) => row.key === item.key)));
    setShowLocationFields(false);
    setIsLocationModalVisible(false);
  };

  const handleLocationInputChange = (key, value) => {
    setNewLocation({ ...newLocation, [key]: value });
  };

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">จัดการครุภัณฑ์</h1>
        <SearchBox />

        <div className='flex flex-row justify-between p-10'>
          <div className="mb-4">
            <h2 className="text-lg font-bold">ค้นพบ 35 รายการ</h2>
          </div>
          <div>
            <Button className='bg-gray-400 w-[150px] h-[50px]' type="primary" onClick={showModal}>เลือก</Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            onChange: handleSelect,
          }}
        />

        <div className="flex justify-between items-center mt-4">
          <Button type="primary" onClick={showModal}>เลือก</Button>
          <Pagination defaultCurrent={1} total={35} pageSize={5} />
        </div>
      </div>

      <Modal title="จัดการครุภัณฑ์" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <div className="mb-4">
          <h2 className="text-lg font-bold">เลือก {selectedRows.length} รายการ</h2>
        </div>
        <Table columns={selectedColumns} dataSource={selectedRows} pagination={{ pageSize: 10 }} scroll={{ y: 240 }} />
        {!showLocationFields && (
          <div className="flex justify-end mt-4 space-x-2">
            <Button className='bg-blue-200' type="primary" onClick={() => setShowLocationFields(true)}>เปลี่ยนที่ตั้งครุภัณฑ์</Button>
            <Button type="primary" danger>ทำจำหน่ายครุภัณฑ์</Button>
          </div>
        )}
        {showLocationFields && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold">เปลี่ยนที่ตั้งครุภัณฑ์</h2>
            </div>
            <div className="flex flex-col space-y-4">
              <Select placeholder="อาคาร" onChange={(value) => handleLocationInputChange('building', value)}>
                <Option value="1">อาคาร 1</Option>
                <Option value="2">อาคาร 2</Option>
                <Option value="3">อาคาร 3</Option>
              </Select>
              <Select placeholder="ชั้น" onChange={(value) => handleLocationInputChange('floor', value)}>
                <Option value="1">ชั้น 1</Option>
                <Option value="2">ชั้น 2</Option>
                <Option value="3">ชั้น 3</Option>
              </Select>
              <Input placeholder="ห้อง" onChange={(e) => handleLocationInputChange('room', e.target.value)} />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button className='bg-blue-200' type="primary" onClick={handleLocationChange}>บันทึก</Button>
              <Button onClick={handleCancel}>ยกเลิก</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default ManagePage1;
