import React from 'react'
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  
  
} from '@ant-design/icons';
import {Link} from 'react-router-dom';

import { Button } from 'antd';

function AddInformationCompany() {
  return (
    <>
      
      <div className='border-b-2 border-black mb-10'>
        <h1 className='text-3xl text-blue-800'>ข้อบริษัท</h1>
        </div>



        <div className="overflow-x-auto border-2 border-black rounded-md p-2 m-4">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>ชื่อบริษัท</th>
        <th>ชื่อตัวแทน</th>
        <th>การจัดการ</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr>
        <th>1</th>
        <td>บริษัท เดอะวันเคมี</td>
        <td>นายประกอบ สร้างฐาน</td>
        <td>
            
        <div className='flex flex-row space-x-4'>
        <EyeOutlined  className='text-xl'/>
        <EditOutlined className='text-xl'/>
        <DeleteOutlined className='text-xl'/>
        </div>


        </td>
      </tr>
     
    </tbody>
  </table>
</div>


<div>
            {/* ปุ่มเพิ่มครุภัณฑ์ */}
            <Link to="/AddCompany"><button className="btn btn-outline btn-success">เพิ่มข้อมูลบริษัท</button></Link>
            </div>


    </>
  )
}

export default AddInformationCompany