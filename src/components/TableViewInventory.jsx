import React from 'react'
import { useState,useEffect } from 'react';
import { message } from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    
    
  } from '@ant-design/icons';

function TableViewInventory(props) {
  const { data, onDeleteSuccess } = props;


// ฟังก์ชันสำหรับการลบ item โดยรับ id ของ inventory ที่จะลบ
const handleDelete = async (id) => {
  try {
    const response = await fetch(`http://localhost:1337/api/inventories/${id}`, {
      method: 'DELETE', // ใช้เมธอด DELETE
    });
    if (!response.ok) throw new Error('ไม่สามารถลบข้อมูลได้');
    const responseData = await response.json();
    console.log('Deleted:', responseData);
    message.success('ลบข้อมูลสำเร็จ');
    onDeleteSuccess(); // เรียกใช้งานหลังจากลบข้อมูลสำเร็จ
  } catch (error) {
    console.error('Error:', error);
    message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
  }
};

  

  return (
    <>

<div className="overflow-x-auto border-2 border-black rounded-md p-2 m-4">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>หมายครุภัณฑ์</th>
        <th>ขื่อครุภัณฑ์</th>
        <th>การจัดการ</th>
      </tr>
    </thead>
    <tbody>


    {/* inventorylist */}
      {Array.isArray(data.data) && data.data.map(inventory => (
      <tr key={inventory.id}>
        <th>{inventory.id}</th>
        <td>{inventory.attributes.id_inv}</td>
        <td>{inventory.attributes.name}</td>
        <td>
          <div className='flex flex-row space-x-4'>
            <EyeOutlined className='text-xl' />
            <EditOutlined className='text-xl' />
            <DeleteOutlined className='text-xl' onClick={() => handleDelete(inventory.id)} />
          </div>
        </td>
      </tr>
    ))}
    </tbody>
  </table>
</div>

    </>
  )
}

export default TableViewInventory