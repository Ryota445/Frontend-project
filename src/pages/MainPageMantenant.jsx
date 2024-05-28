import React from 'react';
import { Table, Button, Card, Input } from 'antd';

const { TextArea } = Input;

const equipmentData = {
  equipmentNumber: '110213213',
  category: 'เครื่องใช้ไฟฟ้า',
  name: 'เครื่องอบแห้งแช่แข็งสูญญากาศ Vacuum Freeze Dryer รุ่น FSF series',
  location: 'อาคาร MHMK ชั้น 12 ห้อง 1205',
  owner: 'ดร.สมชาย โชติ',
  acquisitionMethod: 'e-bidding แผ่นดิน',
  acquisitionDate: '27-07-2565',
  receptionDate: '29-07-2565',
  budgetYear: '2566',
  supplier: 'นางสาวมยุรา สุขใจ บริษัท เคมีโฮม จำกัด',
  price: '20,000 บาท',
  details: [
    {
      serialNumber: 'FA131KXN',
      brand: 'FAITHFUL',
      model: 'FSF-N Series',
      usageYears: 5,
      status: 'อายุการใช้งานจริง',
      price: '20,000 บาท'
    }
  ],
  maintenanceHistory: [
    {
      date: '20-09-2566',
      equipmentNumber: '12331312',
      equipmentName: 'เครื่องทำความเย็น',
      detail: 'เช็คสภาพ',
      cost: '200.00 บาท'
    }
  ],
  attachments: [
    {
      equipmentNumber: '110213213/1',
      name: 'Liquid nitrogen'
    }
  ]
};


function MainPageMantenant() {

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'หมายเลขครุภัณฑ์',
      dataIndex: 'equipmentNumber',
      key: 'equipmentNumber'
    },
    {
      title: 'ชื่อครุภัณฑ์',
      dataIndex: 'equipmentName',
      key: 'equipmentName'
    },
    {
      title: 'รายละเอียดการบำรุงรักษา',
      dataIndex: 'detail',
      key: 'detail'
    },
    {
      title: 'ราคา (บาท)',
      dataIndex: 'cost',
      key: 'cost'
    }
  ];




  return (
    <>
        
        <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300">
        <h1 className="text-2xl font-bold mb-4">จัดการครุภัณฑ์</h1>

        <Card title="ข้อมูลครุภัณฑ์" className="shadow-lg border border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-lg">{equipmentData.name}</p>
            <p>หมายเลขครุภัณฑ์: {equipmentData.equipmentNumber}</p>
            <p>หมวดหมู่ครุภัณฑ์: {equipmentData.category}</p>
          </div>
          <img
            src="https://via.placeholder.com/150"
            alt="Equipment"
            className="w-24 h-24 object-cover rounded-lg border border-gray-300"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p>ที่ตั้งครุภัณฑ์: {equipmentData.location}</p>
            <p>ผู้ดูแล: {equipmentData.owner}</p>
          </div>
          <Button className="md:justify-self-end bg-blue-500 text-white border-none">
            แจ้งซ่อมครุภัณฑ์นี้
          </Button>
        </div>
      </Card>


          <Card title="วิธีได้มา" className="shadow-lg border border-gray-300">
            <p>วิธีได้มา: {equipmentData.acquisitionMethod}</p>
            <p>ปีงบประมาณ: {equipmentData.budgetYear}</p>
            <p>วันสั่งซื้อ: {equipmentData.acquisitionDate}</p>
            <p>วันตรวจรับ/วันที่รับโอน: {equipmentData.receptionDate}</p>
            <p>ตัวแทนบริษัท: {equipmentData.supplier}</p>
          </Card>
          <Card title="รายละเอียดครุภัณฑ์" className="shadow-lg border border-gray-300">
            {equipmentData.details.map((detail, index) => (
              <div key={index}>
                <p>หมายเลข SN: {detail.serialNumber}</p>
                <p>ยี่ห้อ: {detail.brand}</p>
                <p>รุ่น: {detail.model}</p>
                <p>ราคา: {detail.price}</p>
              </div>
            ))}
          </Card>
      


        <Card title="องค์ประกอบในชุดครุภัณฑ์" className="shadow-lg border border-gray-300 mb-4">
          {equipmentData.attachments.map((attachment, index) => (
            <div key={index} className="flex justify-between mb-2">
              <p>หมายเลขครุภัณฑ์: {attachment.equipmentNumber}</p>
              <p>ชื่อครุภัณฑ์: {attachment.name}</p>
              <Button className="bg-blue-500 text-white border-none">แจ้งซ่อมแซม</Button>
            </div>
          ))}
        </Card>
        <Card title="ประวัติการบำรุงรักษา" className="shadow-lg border border-gray-300">
          <Table
            columns={columns}
            dataSource={equipmentData.maintenanceHistory}
            pagination={false}
            rowKey="equipmentNumber"
          />
        </Card>
      </div>
    </div>
        
       
    </>
  )
}

export default MainPageMantenant