import React from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DateIsoToThai from '../components/DateIsoToThai';

const columns = [
  {
    title: 'วันที่แจ้งซ่อม',
    dataIndex: 'date',
    key: 'date',
    width: 120,
    sorter: (a, b) => {
      const dateA = a.date || a.attributes?.date;
      const dateB = b.date || b.attributes?.date;
      return moment(dateA).unix() - moment(dateB).unix();
    },
    render: (text) => <DateIsoToThai isoDate={text} typeTime={1} />,
  },
  { title: 'เลขที่ใบแจ้งซ่อม', dataIndex: 'numberRepairFaculty', key: 'numberRepairFaculty', width: 150 },
  { title: 'หมายเลขครุภัณฑ์', dataIndex: 'id', key: 'id', width: 150 },
  { title: 'ชื่อครุภัณฑ์', dataIndex: 'name', key: 'name', width: 200 },
  { title: 'แจ้งโดย', dataIndex: 'reportedBy', key: 'reportedBy', width: 120 },
  { title: 'รายละเอียดการแจ้งซ่อม', dataIndex: 'description', key: 'description', width: 200 },
  { title: 'ไฟล์แจ้งซ่อม', dataIndex: 'FileReport', key: 'FileReport', width: 150, ellipsis: true },
  { title: 'สถานะการซ่อม', dataIndex: 'status', key: 'status', width: 200 },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    width: 150,
  },
];

const RepairReportTable = ({ data }) => (
  <>
    <div>
      <h1 className='text-2xl font-semibold'>แจ้งเตือนซ่อมแซมครุภัณฑ์</h1>
      <p className='text-lg'>มีทั้งหมด {data.length} รายการ</p>
    </div>
    <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false} 
        rowKey={(record) => record.key || record.id} // ใช้ key หรือ id ที่ไม่ซ้ำกัน
      />
  </>
);

export default RepairReportTable;