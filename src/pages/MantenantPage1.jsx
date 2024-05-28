import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Table, Checkbox } from 'antd';

import SearchBox from '../components/SearchBox';

const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  { title: 'วันที่', dataIndex: 'date', key: 'date' },
  { title: 'หมายเลขครุภัณฑ์', dataIndex: 'id', key: 'id' },
  { title: 'ชื่อครุภัณฑ์', dataIndex: 'name', key: 'name' },
  { title: 'แจ้งโดย', dataIndex: 'reportedBy', key: 'reportedBy' },
  { title: 'รายละเอียดการแจ้งเตือน', dataIndex: 'description', key: 'description' },
  { title: 'วันที่นัดหมาย', dataIndex: 'appointmentDate', key: 'appointmentDate' },
  { title: 'ประเภทการดูแล', dataIndex: 'maintenanceType', key: 'maintenanceType' },
  { title: 'สถานะการดูแลครุภัณฑ์', dataIndex: 'status', key: 'status' },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <Button type={record.status === 'แจ้งซ่อม' ? 'primary' : 'default'}>
        {record.status === 'แจ้งซ่อม' ? 'แจ้งซ่อม' : 'ยังไม่ได้ดำเนินการ'}
      </Button>
    ),
  },
];

const data = [
  {
    key: '1',
    date: '20-2-2566',
    id: '121212323',
    name: 'เครื่องวิเคราะห์สาร',
    reportedBy: 'ผศ.ดร.สมนาย ใจดี',
    description: 'แจ้งซ่อมเนื่องจากเครื่องวิเคราะห์สารเสียไฟไม่เข้า',
    appointmentDate: '-',
    maintenanceType: 'ซ่อมแซม',
    status: 'แจ้งซ่อม',
  },
  {
    key: '2',
    date: '18-2-2566',
    id: '315432151',
    name: 'เครื่องอบแห้งด้วยความเย็น',
    reportedBy: 'ระบบ',
    description: 'ปรับรักษาเครื่องทำความเย็น',
    appointmentDate: '25-2-2566',
    maintenanceType: 'บำรุงรักษา',
    status: 'ยังไม่ได้ดำเนินการ',
  },
];

function MantenantPage1() {
    const [filter, setFilter] = useState({});

  return (
    <>
    
    <div className="">
      <h1 className="text-2xl font-bold mb-8">ดูแลครุภัณฑ์</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <SearchBox />
        
        
        <div className="grid grid-cols-8 "> 
        <div>
          {/* col-1 */}
        </div>

        <div className='col-span-3 mt-2 m-1  p-3  border-4 border-gray-200 rounded-md'>
        {/* col-2 */}
        
                  <div className="flex items-center space-x-4 mt-4">
                    <Checkbox>ภายใน 7 วัน</Checkbox>
                  
                  </div>
                  <div className="flex items-center space-x-4 mt-4">
                    <Checkbox><RangePicker /></Checkbox>
                  </div>

        </div>

        <div className='col-span-3 grid grid-cols-2 mt-2 border-4 border-gray-200 rounded-md'>
          {/* col-3 */}
          <div className='mt-4 mx-8 '> 
            {/* col-3-1 */}
            <div className='my-2 mb-4 '>
              <h1 className='block text-md font-medium text-gray-700'>ประเภทการดูแล</h1>
            </div>
            
            <div className='my-2  '>
              <h1 className='block text-md font-medium text-gray-700'>สถานะการดูแลครุภัณฑ์</h1>
            </div>
          
          
          </div>
          <div className='mt-4 '> 
          {/* col-3-2 */}
                    <div className='my-1 '>
                      <Select placeholder="ประเภทการดูแล">
                          <Option value="ทั้งหมด">ทั้งหมด</Option>
                          <Option value="ซ่อมแซม">ซ่อมแซม</Option>
                          <Option value="บำรุงรักษา">บำรุงรักษา</Option>
                        </Select>
                    </div>
                    <div>
                        <Select placeholder="สถานะการดูแลครุภัณฑ์">
                          <Option value="ทั้งหมด">ทั้งหมด</Option>
                          <Option value="แจ้งซ่อม">แจ้งซ่อม</Option>
                          <Option value="ยังไม่ได้ดำเนินการ">ยังไม่ได้ดำเนินการ</Option>
                        </Select>
                    </div>
          </div>
          





                      

                        <div>
                        
                        
                        </div>
        </div>
        <div>
          {/* col-4 */}
        </div>


        </div>
        
        
      </div>
      
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
    
    
    </>
  )
}

export default MantenantPage1