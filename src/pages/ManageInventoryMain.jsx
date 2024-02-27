import React from 'react';
import { useState,useEffect } from 'react';
import {Link} from 'react-router-dom';

// ant design
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import TableViewInventory from '../components/TableViewInventory';
const { Search } = Input;
import { Button } from 'antd';
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
const onSearch = (value, _e, info) => console.log(info?.source, value);

function ManageInventoryMain() {
  const [isTable,setIsTable] = useState(true)

  const [InventoryList, setInventoryList] = useState([]);



    useEffect(() => {
      fetch("http://localhost:1337/api/inventories?populate=img_inv")
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
      fetch("http://localhost:1337/api/inventories?populate=img_inv")
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

    

    <div className="grid grid-cols-3 gap-4">
  <div>
    
    {/* 01 */}

  </div>
  <div className='border-2 p-10 w-full border-black rounded-md'>
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


          </div>

          
          <div>
            
            {/* 03 */}

          </div>
        </div>

        <div>
            {/* ปุ่มเพิ่มครุภัณฑ์ */}
            <Link to="/AddInventory"><button className="btn btn-outline btn-success">เพิ่มครุภัณฑ์</button></Link>
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