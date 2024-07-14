import React from 'react';
import { useState,useEffect } from 'react';
import {Link} from 'react-router-dom';

// ant design
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space, Button, Select } from 'antd';
import TableViewInventory from '../components/TableViewInventory';
// const { Search } = Input;
import { 
  BarsOutlined, 
  PictureOutlined,
 } from '@ant-design/icons';
import CardViewInventory from '../components/CardViewInventory';

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1677ff',
    }}
  />
);

// for Search
// const onSearch = (value, _e, info) => console.log(info?.source, value);

const { Option } = Select;

function ManageInventoryMain() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isTable,setIsTable] = useState(true)

  const [InventoryList, setInventoryList] = useState([]);



    useEffect(() => {
      fetch(`http://localhost:1337/api/inventories?populate=img_inv`)
        .then(res => res.json())
        .then(
          (result) => {
            setInventoryList(result);
            console.log(result)
          }
        )
    }, [])

    const fetchItems = async () => {
      // รับข้อมูลจาก API และอัปเดต state
      fetch(`http://localhost:1337/api/inventories?populate=img_inv`)
        .then(res => res.json())
        .then(
          (result) => {
            setInventoryList(result);
            console.log(result)
          }
        )
    };
  
    const handleDeleteSuccess = () => {
      // รีเฟชข้อมูลหลังจากลบข้อมูลสำเร็จ
      fetchItems();
    };

  return (
    <div>
    
    <h1 className='text-2xl font-medium m-2'>รายการครุภัณฑ์</h1>

    
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
                      <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700">หมวดหมู่ครุภัณฑ์</label>
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







        <div>
            {/* ปุ่มเพิ่มครุภัณฑ์ */}
            <Link to="/AddInventory"><button className="btn btn-outline btn-success">เพิ่มครุภัณฑ์</button></Link>
            </div>

          {/* ปุ่มเปลี่ยนการแสดงผลแบบตารางและการ์ด */}
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


       {isTable && <TableViewInventory data={InventoryList} onDeleteSuccess={handleDeleteSuccess}/>}
       {!isTable && <CardViewInventory data={InventoryList} onDeleteSuccess={handleDeleteSuccess}/>}
       
    
   

    
    <div className="join flex justify-center ">
    <button className="join-item btn btn-xs btn-active">1</button>
    <button className="join-item btn btn-xs ">2</button>
    <button className="join-item btn btn-xs ">3</button>
    <button className="join-item btn btn-xs ">...</button>
    <button className="join-item btn btn-xs">99</button>
    <button className="join-item btn btn-xs">100</button>
  </div>
    </div>
  )
}

export default ManageInventoryMain