import React from 'react';
import { useState } from 'react';
import { Form, Input, Button, Table, Space, Tag ,Select} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,BarsOutlined,PictureOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';

function SearchMaintenant() {
  const { Option } = Select;

    const [isTable,setIsTable] = useState(true)
    const columns = [
        {
          title: 'วันที่ดำเนินการ',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'ชื่อการดำเนินการ/รายละเอียด',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'ประเภทการดำเนินการ',
          dataIndex: 'type',
          key: 'type',
          render: tag => (
            <Tag color="green" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ),
        },
        {
          title: 'สถานะ',
          key: 'status',
          dataIndex: 'status',
          render: (_, { status }) => (
            <>
              {status.map(tag => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'การจัดการ',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button icon={<EditOutlined />} />
              <Button icon={<DeleteOutlined />} />
            </Space>
          ),
        },
      ];
    
      const data = [
        {
          key: '1',
          date: '20 ม.ค. 2566',
          description: 'บำรุงรักษาเครื่องวิเคราะห์หัวUV-2600',
          type: 'บำรุงรักษา',
          status: ['เสร็จสิ้น'],
        },
        // ...เพิ่มข้อมูลเพิ่มเติมตามต้องการ
      ];


  return (
    <>
    
    
    <div className="container mx-auto px-4">

      {/* old seachbox */}
      {/* <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-700">การบำรุงรักษา</h1>
        <Form layout="inline" className="mt-4">
          <Form.Item label="หมายเลขครุภัณฑ์">
            <Input placeholder="กรอกหมายเลขครุภัณฑ์" />
          </Form.Item>
          <Form.Item label="ชื่อครุภัณฑ์">
            <Input placeholder="กรอกชื่อครุภัณฑ์" />
          </Form.Item>
          <Form.Item label="ขื่อการดำเนินการ">
            <Input placeholder="กรอกการดำเนินการ" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} className='bg-blue-300'>
              ค้นหา
            </Button>
          </Form.Item>
        </Form>
      </div> */}



      {/* searchBox */}

    <div className="grid grid-cols-3 gap-4">
  <div>
    
    {/* 01 */}

  </div>
        {/* <div className='border-2 p-10 w-full border-black rounded-md'>
                  <div className='grid grid-rows-2 gap-10'>
                  <div className='flex flex-col mt-2'>
                  <label className='text-lg'>ค้นหารายการครุภัณฑ์</label>
                  <Search placeholder="หมายเลขครุภัณฑ์หรือชื่อครุภัณฑ์" 
                  onSearch={onSearch} enterButton 
                  size="large"
                  style={{
                    width: 350,
                  }}  

                  />
                </div>
                </div>


          </div> */}

          <div className="flex flex-col items-center justify-center p-4">
                <div className="border p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-end space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <div>
                      <label htmlFor="asset-number" className="block text-sm font-medium text-gray-700">หมายเลขครุภัณฑ์</label>
                      <Input placeholder="หมายเลขครุภัณฑ์" id="asset-number" style={{ width: 200 }} />
                    </div>
                    <div>
                      <label htmlFor="asset-name" className="block text-sm font-medium text-gray-700">ชื่อครุภัณฑ์</label>
                      <Input placeholder="ชื่อครุภัณฑ์" id="asset-name" style={{ width: 200 }} />
                    </div>
                    <div>
                      <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700">สถานะครุภัณฑ์</label>
                      <Select defaultValue="ทั้งหมด" id="asset-type" style={{ width: 200 }}>
                        <Option value="ทั้งหมด">ทั้งหมด</Option>
                        <Option value="option1">Option 1</Option>
                        <Option value="option2">Option 2</Option>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="text-gray-800 bg-gray-300" type="primary" icon={<i className="fas fa-search"></i>}>ค้นหา</Button>
                  </div>
                </div>
              </div>

          
          <div>
            
            {/* 03 */}

          </div>
        </div>








      <div className="mb-4">
        <Link to="/AddMaintenant"><Button type="primary" icon={<PlusOutlined />} className="bg-green-500">
          เพิ่ม
        </Button></Link>
      </div>


      {/* ปุ่มเปลียนการแสดงผล */}
      {/* <div className='flex justify-end m-4'>
        <Button
            type="text"
            icon={isTable ? <BarsOutlined  /> : <PictureOutlined />}
            onClick={() => setIsTable(!isTable)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
       </div> */}

       {isTable && <Table columns={columns} dataSource={data} />}
       {!isTable && <div></div>}

      
    </div>
    
    
    
    
    </>
  );
}

export default SearchMaintenant;
