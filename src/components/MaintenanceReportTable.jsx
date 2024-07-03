import React from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router-dom';

const columns = [
  { title: 'วันที่', dataIndex: 'date', key: 'date' },
  { title: 'วันที่บำรุงรักษารอบถัดไป', dataIndex: 'appointmentDate', key: 'appointmentDate' },
  { title: 'หมายเลขครุภัณฑ์', dataIndex: 'id', key: 'id' },
  { title: 'ชื่อครุภัณฑ์', dataIndex: 'name', key: 'name' },
//   { title: 'แจ้งโดย', dataIndex: 'reportedBy', key: 'reportedBy' },
  { title: 'รายละเอียดการแจ้งเตือน', dataIndex: 'description', key: 'description' },
//   { title: 'ประเภทการดูแล', dataIndex: 'maintenanceType', key: 'maintenanceType' },
//   { title: 'สถานะการดูแลครุภัณฑ์', dataIndex: 'status', key: 'status' },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <Button className='bg-gray-300' type={ 'primary'}>
        ดำเนินการต่อ
      </Button>
    ),
  },
];



const MaintenanceReportTable = ({ data }) => (
  <Table columns={columns} dataSource={data} pagination={false} />
);

export default MaintenanceReportTable;
