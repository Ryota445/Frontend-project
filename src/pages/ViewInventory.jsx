import React from 'react';
import { Card, Descriptions, Image } from 'antd';

// สมมติว่านี่คือข้อมูลที่ได้จากฟอร์ม AddInventory ที่คุณได้ส่งข้อมูล
const inventoryData = {
  name: "เครื่องวัดความแรงแสง UV-2600 (Spectrophotometer UV-2600)",
  id_inv: "1000001141/42",
  dateOrder: "30/12/31",
  category: "เครื่องมือวิทยาศาสตร์",
  brand: "SHIMK",
  model: "UV-2600",
  serialNumber: "1042",
  responsible: "สมหมาย",
  building: "อาคาร 14",
  floor: "ชั้น 1",
  room: "1402",
  ageUse: "3 ปี",
  // สมมติว่านี่คือลิงก์ของรูปภาพที่อัปโหลด
  img_inv: "path/to/your/image.jpg",
};

function ViewInventory() {
  return (
    <div className="container mx-auto p-4">
      <Card title="ข้อมูลครุภัณฑ์" bordered={false}>
        <Descriptions bordered>
          <Descriptions.Item label="ชื่ออุปกรณ์" span={3}>{inventoryData.name}</Descriptions.Item>
          <Descriptions.Item label="หมายเลขครุภัณฑ์">{inventoryData.id_inv}</Descriptions.Item>
          <Descriptions.Item label="วันที่สั่งซื้อ">{inventoryData.dateOrder}</Descriptions.Item>
          <Descriptions.Item label="หมวดหมู่ครุภัณฑ์" span={2}>{inventoryData.category}</Descriptions.Item>
          <Descriptions.Item label="ยี่ห้อ">{inventoryData.brand}</Descriptions.Item>
          <Descriptions.Item label="รุ่น">{inventoryData.model}</Descriptions.Item>
          <Descriptions.Item label="หมายเลข SN">{inventoryData.serialNumber}</Descriptions.Item>
          <Descriptions.Item label="ผู้รับผิดชอบ">{inventoryData.responsible}</Descriptions.Item>
          <Descriptions.Item label="อาคาร">{inventoryData.building}</Descriptions.Item>
          <Descriptions.Item label="ชั้น">{inventoryData.floor}</Descriptions.Item>
          <Descriptions.Item label="ห้อง">{inventoryData.room}</Descriptions.Item>
          <Descriptions.Item label="อายุการใช้งาน">{inventoryData.ageUse}</Descriptions.Item>
          <Descriptions.Item label="รูปครุภัณฑ์" span={3}>
            <Image
              width={200}
              src={inventoryData.img_inv}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

export default ViewInventory;
