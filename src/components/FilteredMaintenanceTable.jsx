import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Radio, Button,Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const FilteredMaintenanceTable = ({ data }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [filteredData, setFilteredData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("7");

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/maintenance-reports/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('ลบรายการแจ้งเตือนบำรุงรักษาสำเร็จ');
        setFilteredData(filteredData.filter(item => item.key !== id));
      } else {
        message.error('เกิดข้อผิดพลาดในการลบรายการ');
      }
    } catch (error) {
      console.error('Error deleting maintenance report:', error);
      message.error('เกิดข้อผิดพลาดในการลบรายการ');
    }
  };


  const columns = [
    {
      title: 'วันที่บำรุงรักษารอบถัดไป',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      width: 200, // กำหนดความกว้างคอลัมน์วันที่ให้สม่ำเสมอ
      sorter: (a, b) => moment(a.appointmentDate.props.isoDate).unix() - moment(b.appointmentDate.props.isoDate).unix(),
      defaultSortOrder: 'ascend', // ทำการเรียงลำดับวันที่จากเก่าไปใหม่เมื่อโหลด
    },
    {
      title: 'หมายเลขครุภัณฑ์',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'ชื่อครุภัณฑ์',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
      width: 400,
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '',
      key: 'action3',
      render: (_, record) => (
        <Popconfirm
          title="ยืนยันการลบ"
          description="คุณต้องการลบรายการแจ้งเตือนบำรุงรักษานี้จริงหรือไม่?"
          onConfirm={() => handleDelete(record.key)}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
          okButtonProps={{
            className: 'bg-blue-300 text-white hover:bg-blue-500',
          }}
        >
          <Button 
            icon={<DeleteOutlined />} 
            type="text"
          />
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    let startDate = null;
    let endDate = null;

    if (selectedOption === 'all') {
      // แสดงข้อมูลทั้งหมดที่ยังไม่เสร็จสิ้น
      startDate = moment().subtract(365, 'days').startOf('day'); // ครอบคลุมวันก่อนหน้า
      endDate = null; // ไม่มีการกรองวันสิ้นสุด
    } else {
      // กรองตามช่วงเวลาที่กำหนด (7, 15, 30 วัน)
      const days = parseInt(selectedOption, 10);
      startDate = moment().subtract(365, 'days').startOf('day'); // ครอบคลุมวันก่อนหน้า
      endDate = moment().add(days, 'days').endOf('day'); // จนถึงวันที่กำหนด
    }

    const filtered = data.filter(item => {
      const dueDate = moment(item.appointmentDate.props.isoDate, "YYYY-MM-DD");
      return (
        (!startDate || dueDate.isSameOrAfter(startDate)) &&
        (!endDate || dueDate.isSameOrBefore(endDate)) &&
        !item.isDone // แสดงเฉพาะรายการที่ยังไม่เสร็จสิ้น
      );
    });

    // จัดเรียงข้อมูลตามวันที่จากเก่าไปใหม่
    filtered.sort((a, b) => moment(a.appointmentDate.props.isoDate).unix() - moment(b.appointmentDate.props.isoDate).unix());

    setFilteredData(filtered);
  }, [selectedOption, data]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <div className='flex flex-col border-2 border-gray-400 w-2/5 px-4 py-2 rounded-md mb-2'>
        <h1 className='text-lg font-semibold '>บำรุงรักษาที่ต้องทำ : </h1>
        <div className='flex flex-col items-center'>
          <Radio.Group onChange={handleOptionChange} value={selectedOption}>
            <Radio.Button value="7">ภายใน 7 วัน</Radio.Button>
            <Radio.Button value="15">ภายใน 15 วัน</Radio.Button>
            <Radio.Button value="30">ภายใน 30 วัน</Radio.Button>
            <Radio.Button value="all">ทั้งหมด</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div>
        <h1 className='text-2xl font-semibold'>แจ้งเตือนบำรุงรักษาครุภัณฑ์</h1>
        <p className='text-lg'>มีทั้งหมด {filteredData.length} รายการ</p>
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="key" />
    </div>
  );
};

export default FilteredMaintenanceTable;
