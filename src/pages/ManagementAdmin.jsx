import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import TableViewInventory from '../components/TableViewInventory';
import { useAuth } from '../context/AuthContext';

function ManagementAdmin() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [selectedItems, setSelectedItems] = useState([]);
const [selectedRows, setSelectedRows] = useState([]);
    const [searchData, setSearchData] = useState(null);
    const [filteredInventoryList, setFilteredInventoryList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]); // เพิ่ม state สำหรับรายการทั้งหมด
    const [foundDataNumber, setFoundDataNumber] = useState(0)
    const [showSubInventoryColumns, setShowSubInventoryColumns] = useState(false);

    const { user } = useAuth();

    const isAdmin = user?.role_in_web?.RoleName === "Admin";

  if (user) {
    console.log("user.responsible :",user.responsible);
    console.log("user.RoleInWeb :",user.RoleInWeb);
  }



    useEffect(() => {
        fetchItems();
    }, []);

     // mode1
     const updateSelectedItems = (newItems, newRows) => {
     
        setSelectedItems(prevItems => {
            const updatedItems = newItems.filter(item => !prevItems.includes(item));
            return [...prevItems.filter(item => newItems.includes(item)), ...updatedItems];
        });
        setSelectedRows(prevRows => {
            const updatedRows = newRows.filter(row => !prevRows.some(prevRow => prevRow.id === row.id));
            return [...prevRows.filter(row => newRows.some(newRow => newRow.id === row.id)), ...updatedRows];
        });
};


    // mode2

// const updateSelectedItems = (newItems, newRows) => {
//         setSelectedItems(prevItems => {
//             const uniqueItems = [...new Set([...prevItems, ...newItems])];
//             return uniqueItems;
//         });
//         setSelectedRows(prevRows => {
//             const uniqueRows = [...prevRows, ...newRows].reduce((acc, current) => {
//                 const x = acc.find(item => item.id === current.id);
//                 if (!x) {
//                     return acc.concat([current]);
//                 } else {
//                     return acc;
//                 }
//             }, []);
//             return uniqueRows;
//         });
// };


    const fetchItems = async () => {
        try {
            const response = await fetch(`${API_URL}/api/inventories?populate=responsible,category,company_inventory,building,status_inventory,sub_inventories&pagination[pageSize]=100`);
            if (!response.ok) {
                throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลครุภัณฑ์');
            }
            const result = await response.json();


            
            // กรองรายการที่ isDisposal เป็น false ส่วนนี้
            const filteredData = result.data.filter(inventory => 
                inventory.attributes.isDisposal === false || inventory.attributes.isDisposal === null
            );



            setFilteredInventoryList(filteredData); // เซ็ตรายการทั้งหมดเป็นรายการที่ถูกกรองแล้ว
            setInventoryList(filteredData); // เซ็ตรายการทั้งหมด
            setFoundDataNumber(filteredData.length); // อัปเดตจำนวนรายการที่พบ
            console.log("InventoryData :", filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = (searchData) => {
        setSearchData(searchData);
        const tempSelectedItems = [...selectedItems];
        const tempSelectedRows = [...selectedRows];
        filterInventoryList(searchData);
        setTimeout(() => {
            updateSelectedItems(tempSelectedItems, tempSelectedRows);
        }, 0);
    };
    const filterInventoryList = (searchData) => {
        if (!searchData) {
            setFilteredInventoryList(inventoryList);
            setFoundDataNumber(inventoryList.length);
            return;
        }
    
        const filteredList = inventoryList.filter(inventory => {
            const subInventoryMatch = searchData.searchSubInventory
                ? inventory.attributes.sub_inventories.data.length > 0 &&
                  (searchData.sub_inventory
                    ? inventory.attributes.sub_inventories.data.some(subInv => 
                        subInv.attributes.name.toLowerCase().includes(searchData.sub_inventory.toLowerCase())
                      )
                    : true)
                : true;
                
            const responsibleMatch = searchData.responsible
            ? inventory?.attributes?.responsible?.data?.id === parseInt(searchData.responsible)
            : true;

            return (
                (searchData.id_inv && inventory.attributes.id_inv
                    ? inventory.attributes.id_inv.toLowerCase().includes(searchData.id_inv.toLowerCase())
                    : true) &&
                (searchData.name && inventory.attributes.name
                    ? inventory.attributes.name.toLowerCase().includes(searchData.name.toLowerCase())
                    : true) &&
                    responsibleMatch &&
                (searchData.category && inventory?.attributes?.category?.data
                    ? inventory.attributes.category.data.id === searchData.category
                    : true) &&
                (searchData.building && inventory?.attributes?.building?.data
                    ? inventory.attributes.building.data.id === searchData.building
                    : true) &&
                (searchData.statusInventory && inventory?.attributes?.status_inventory?.data
                    ? inventory.attributes.status_inventory.data.id === searchData.statusInventory
                    : true) &&
                (searchData.floor && inventory.attributes.floor
                    ? inventory.attributes.floor.toLowerCase().includes(searchData.floor.toLowerCase())
                    : true) &&
                (searchData.room && inventory.attributes.room
                    ? inventory.attributes.room.toLowerCase().includes(searchData.room.toLowerCase())
                    : true) &&
                subInventoryMatch
            );
        });
    
        setFilteredInventoryList(filteredList);
        setFoundDataNumber(filteredList.length);
    };

    const handleDeleteSuccess = () => {
        fetchItems(); // เมื่อลบสำเร็จให้ดึงข้อมูลใหม่
    };

    const handleViewInventory = (inventoryData) => {
        // เปิด DetailInventory component และส่งข้อมูลของครุภัณฑ์ไปยัง props ชื่อว่า inventoryData
        // โดยการเรียกใช้ props ที่ชื่อว่า onViewInventory ซึ่งเป็นฟังก์ชันที่ถูกส่งมาจาก parent component
        onViewInventory(inventoryData);
    };
    
    const handleSubInventorySearchChange = (isChecked) => {
        setShowSubInventoryColumns(isChecked);
    };

    return (
        <>
            
            <div className='border-b-2 border-black mb-10 flex justify-between items-center'>
        <h1 className='text-3xl text-blue-800'>การจัดการครุภัณฑ์</h1>
        
      </div>
            <SearchBox 
            onSearch={handleSearch} 
            mode={"management"} 
            onSubInventorySearchChange={handleSubInventorySearchChange}
            />

            <div className='flex flex-row'>

            {isAdmin ? (
            <div className='ml-5 my-5'>
            {/* ปุ่มเพิ่มครุภัณฑ์ */}
            <Link to="/AddInventory"><button className="btn btn-outline btn-success">เพิ่มครุภัณฑ์</button></Link>
            </div>
            ):(null)}

          

            </div>

            {/* {filteredInventoryList.length > 0 ? ( */}
                <TableViewInventory
    inventoryList={filteredInventoryList}
    onDeleteSuccess={handleDeleteSuccess}
    foundDataNumber={foundDataNumber}
    onView={handleViewInventory}
    selectedItems={selectedItems}
    selectedRows={selectedRows}
    onSelectionChange={updateSelectedItems}
    showSubInventoryColumns={showSubInventoryColumns}
/>
            
            {/* ) : (
                <div className='flex flex-col justify-center items-center h-full mt-10'>
                <p className='text-xl'> -ไม่พบข้อมูล- </p>
                </div>
               
            )} */}
        </>
    );
}

export default ManagementAdmin;