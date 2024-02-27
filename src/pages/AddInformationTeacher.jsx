import React from 'react';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

function AddInformationTeacher() {
  

  return (
    <>
       <div className='border-b-2 border-black mb-10'>
        <h1 className='text-3xl text-blue-800'>ข้อมูลผู้รับผิดชอบ</h1>
      </div>

      <div className="overflow-x-auto border-2 border-black rounded-md p-2 m-4">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>ชื่อผู้รับผิดชอบ</th>
              <th>เบอร์โทร</th>
              <th>อีเมล</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>นายประกอบ สร้างฐาน</td>
              <td>0812345678</td>
              <td>prakob@example.com</td>
              <td>
                <div className='flex flex-row space-x-4'>
                  <EyeOutlined className='text-xl' />
                  <EditOutlined className='text-xl' />
                  <DeleteOutlined className='text-xl' />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        {/* ปุ่มเพิ่มข้อมูลผู้รับผิดชอบ */}
        <Link to="/AddTeacherPage">
          <button className="btn btn-outline btn-success">เพิ่มข้อมูลผู้รับผิดชอบ</button>
        </Link>
      </div>
    </>
  );
}

export default AddInformationTeacher;
