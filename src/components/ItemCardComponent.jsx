import React from 'react';
import { Card, Image, Button, Space,message } from 'antd';
import image from '../assets/img/Image.png';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

function ItemCardComponent(props) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { data, onDeleteSuccess } = props; // รับ onDeleteSuccess จาก props
  const itemData = data; // เก็บข้อมูล inventory จาก props
  // console.log(itemData)

    // ฟังก์ชันสำหรับการลบ item
    const handleDelete = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventories/${itemData.id}`, {
          method: 'DELETE', // ใช้เมธอด DELETE
        });
        if (!response.ok) throw new Error('ไม่สามารถลบข้อมูลได้');
        const responseData = await response.json();
        console.log('Deleted:', responseData);
        message.success('ลบข้อมูลสำเร็จ');
        onDeleteSuccess(); // เรียกใช้งานหลังจากลบข้อมูลสำเร็จ
        // คุณอาจต้องการเพิ่มโค้ดเพื่อรีเฟรชข้อมูลหรือนำผู้ใช้กลับไปยังหน้าก่อนหน้า
      } catch (error) {
        console.error('Error:', error);
        message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    };


  return (
    <>
  <div className="bg-sky-100 border-2 border-black w-11/12 flex m-2.5 p-2.5 rounded-xl">
      <div className="w-1/3 rounded-2xl flex items-center">
        <Image width={400} src={`${API_URL}${itemData.attributes.img_inv.data.attributes.url}`} placeholder={<Image preview={false} src={image} width={400} />} />
      </div>
      <div className="w-2/3 m-1">
        <h1 className="ml-10 mt-1 text-xl font-sans font-semibold" style={{ color: '#2B3674' }}>
          {itemData.attributes.name}
        </h1>
              <p className='ml-10 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>หมายเลขครุภัณฑ์<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
              {itemData.attributes.id_inv}  
                </span></p>
                <div className='flex'>
                <p className='ml-10 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>ที่อยู่ครุภัณฑ์ อาคาร<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
                   {itemData.attributes.building}
                    </span></p>
                <p className='ml-8 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>ขั้น<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
                {itemData.attributes.floor}
                    </span></p>
                <p className='ml-8 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>ห้อง<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
                  {itemData.attributes.room}
                    </span></p>
                </div>
                <p className='ml-10 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>ชื่อผู้รับผิดชอบ<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
                  {itemData.attributes.teacher}  
                    </span></p>
                <p className='ml-10 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>หมายเลข SN<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
                  {itemData.attributes.serialNumber}
                    </span></p>
                <p className='ml-10 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>บริษัท<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
                    {/* {itemData.companyInv} */}
                    </span></p>
                <p className='ml-10 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>อีเมลสำหรับติดต่อบริษัท<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
                    {/* {itemData.companyMailInv} */}
                    </span></p>
                <p className='ml-10 mt-1 text-base font-sans font-semibold' style ={{color:'#2B3674'}}>เบอร์โทรศัพท์สำหรับติดต่อบริษัท<span className='ml-1 text-sm font-sans font-normal' style ={{color:'#A3AED0'}}>
                    {/* {itemData.companyPhoneInv} */}
                    </span></p>
                  
                    <div className='flex flex-row space-x-4 ml-10 mt-2'>
                    <EyeOutlined  className='text-xl'/>
                    <EditOutlined className='text-xl'/>
                    <DeleteOutlined className='text-xl' onClick={handleDelete} />
                    </div>
      </div>
    </div>
    </>
  )
}

export default ItemCardComponent;
