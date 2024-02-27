import React from 'react';
import { useState } from 'react';
import { Form, Input, Button, Table, Space, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,BarsOutlined,PictureOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';

function SearchMaintenant() {

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
      <div className="mb-4">
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
      </div>

      <div className="mb-4">
        <Link to="/AddMaintenant"><Button type="primary" icon={<PlusOutlined />} className="bg-green-500">
          เพิ่ม
        </Button></Link>
      </div>



      <div className='flex justify-end m-4'>
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
       </div>

       {isTable && <Table columns={columns} dataSource={data} />}
       {!isTable && <div></div>}

      
    </div>
    
    
    
    
    </>
  );
}

export default SearchMaintenant;
