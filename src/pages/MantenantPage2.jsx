import React, { useState } from 'react';
import { Input, Select, Button, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const { TextArea } = Input;

function MantenantPage2() {
  const [status, setStatus] = useState('รออนุมัติ');
  return (

    <>


<div className="p-8">
      <h1 className="text-2xl font-bold mb-8">ซ่อมแซมครุภัณฑ์</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4 flex items-center border-b pb-4">
          <img
            src="https://via.placeholder.com/100" // Replace with actual image URL
            alt="Vacuum Freeze Dryer"
            className="w-24 h-24 mr-4"
          />
          <div>
            <h2 className="text-xl font-bold text-blue-600">
              เครื่องอบแห้งแช่แข็งสุญญากาศ Vacuum Freeze Dryer รุ่น FSF series
            </h2>
            <p>หมายเลขครุภัณฑ์ 110213213 หมวดหมู่ครุภัณฑ์ เครื่องใช้ไฟฟ้า</p>
            <p>ผู้ดูแล ดร.สมนาย ใจดี</p>
            <p>ที่ตั้งครุภัณฑ์ อาคาร MHMK ชั้น 12 ห้อง 1205</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">ตัวแทน/บริษัท</label>
          <Select className="w-full" showSearch placeholder="ค้นหาชื่อตัวแทน/บริษัท">
            {/* Add Select options here */}
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">ชื่อการซ่อมแซม</label>
          <Input placeholder="ชื่อการซ่อมแซม" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">รายละเอียดการซ่อมแซม</label>
          <TextArea rows={4} placeholder="รายละเอียดการซ่อมแซม" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">ราคา</label>
          <Input placeholder="ราคา" addonAfter="บาท" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">เอกสาร</label>
          <Upload>
            <Button icon={<UploadOutlined />}>อัพโหลดเอกสาร</Button>
          </Upload>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">สถานะ</label>
          <Select className="w-full" value={status} onChange={value => setStatus(value)}>
            <Select.Option value="รออนุมัติ">รออนุมัติ</Select.Option>
            <Select.Option value="อนุมัติแล้ว">อนุมัติแล้ว</Select.Option>
            <Select.Option value="ไม่อนุมัติ">ไม่อนุมัติ</Select.Option>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">วันที่</label>
          <DatePicker className="w-full" />
        </div>

        <div className="flex justify-end">
          <Button type="primary" className="mr-2">บันทึก</Button>
          <Button type="default">ยกเลิก</Button>
        </div>
      </div>
    </div>
      
        
     </>
  )
}

export default MantenantPage2