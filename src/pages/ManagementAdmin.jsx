import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import TableViewInventory from '../components/TableViewInventory';

function ManagementAdmin() {
    const [searchData, setSearchData] = useState(null);
    const [filteredInventoryList, setFilteredInventoryList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]); // เพิ่ม state สำหรับรายการทั้งหมด

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:1337/api/inventories?populate=responsible,category");
            if (!response.ok) {
                throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลครุภัณฑ์');
            }
            const result = await response.json();
            setFilteredInventoryList(result.data); // เซ็ตรายการทั้งหมดเป็นรายการที่ถูกกรองแล้ว
            setInventoryList(result.data); // เซ็ตรายการทั้งหมด
            console.log(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = (searchData) => {
        setSearchData(searchData); // เซ็ตข้อมูลการค้นหา
        filterInventoryList(searchData); // กรองรายการโดยใช้ข้อมูลการค้นหา
    };

    const filterInventoryList = (searchData) => {
        if (!searchData) {
            // หากไม่มีข้อมูลการค้นหา ให้ใช้รายการทั้งหมด
            setFilteredInventoryList(inventoryList);
            return;
        }
    
        const filteredList = inventoryList.filter(inventory => {
            // กรองรายการตามเงื่อนไขของการค้นหา
            return (
                (searchData.id_inv ? inventory.attributes.id_inv.includes(searchData.id_inv) : true) &&
                (searchData.name ? inventory.attributes.name.includes(searchData.name) : true) &&
                (searchData.responsible ? inventory.attributes.responsible && inventory.attributes.responsible.data.attributes.responsibleName === searchData.responsible : true) &&
                (searchData.category ? inventory.attributes.category && inventory.attributes.category.data.attributes.CategoryName === searchData.category : true)
            );
        });
        
    
        setFilteredInventoryList(filteredList); // เซ็ตรายการที่ถูกกรอง
    };

    const handleDeleteSuccess = () => {
        fetchItems(); // เมื่อลบสำเร็จให้ดึงข้อมูลใหม่
    };

    const handleViewInventory = (inventoryData) => {
        // เปิด DetailInventory component และส่งข้อมูลของครุภัณฑ์ไปยัง props ชื่อว่า inventoryData
        // โดยการเรียกใช้ props ที่ชื่อว่า onViewInventory ซึ่งเป็นฟังก์ชันที่ถูกส่งมาจาก parent component
        onViewInventory(inventoryData);
    };
    

    return (
        <>
            <h1 className='text-2xl mb-8'>การจัดการครุภัณฑ์</h1>
            <SearchBox onSearch={handleSearch} />

            <div className='flex flex-row'>

            <div className='ml-5 my-5'>
            {/* ปุ่มเพิ่มครุภัณฑ์ */}
            <Link to="/AddInventory"><button className="btn btn-outline btn-success">เพิ่มครุภัณฑ์</button></Link>
            </div>

            {/* <div className='ml-5 my-5'> */}
            {/* ปุ่มบำรุงรักษา */}
            {/* <Link to=""><button className="btn btn-outline btn-info">บำรุงรักษา</button></Link>
            </div> */}

            {/* <div className='ml-5 my-5'> */}
            {/* ปุ่มซ่อมแซม */}
            {/* <Link to=""><button className="btn btn-outline btn-error">ซ่อมแซม</button></Link>
            </div> */}

            <div className='ml-5 my-5'>
            {/* ปุ่มทำจำหน่าย */}
            {/* <Link to=""><button className="btn btn-outline ">ทำจำหน่าย</button></Link> */}
            </div>

            <div className='ml-5 my-5'>
            {/* ปุ่มซ่อมแซม */}
            {/* <Link to=""><button className="btn btn-outline btn-warning">เปลี่ยนที่ตั้ง</button></Link> */}
            </div>

            </div>

            {filteredInventoryList.length > 0 ? (
                <TableViewInventory
                inventoryList={filteredInventoryList}
                onDeleteSuccess={handleDeleteSuccess}
                onView={handleViewInventory} // ส่ง handleViewInventory ไปยัง TableViewInventory เพื่อให้สามารถเรียกใช้งาน handleView ได้
            />
            
            ) : (
                <div className='flex flex-col justify-center items-center h-full mt-10'>
                <p className='text-xl'> -ไม่พบข้อมูล- </p>
                </div>
               
            )}
        </>
    );
}

export default ManagementAdmin;
