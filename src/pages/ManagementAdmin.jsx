import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import TableViewInventory from '../components/TableViewInventory';
import { useAuth } from '../context/AuthContext';
import { saveToLocalStorage, getFromLocalStorage, clearLocalStorage } from  '../utils/localStorage';

function ManagementAdmin() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [searchData, setSearchData] = useState(null);
    const [filteredInventoryList, setFilteredInventoryList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const [foundDataNumber, setFoundDataNumber] = useState(0);
    const [totalDataNumber, setTotalDataNumber] = useState(0);
    const [showSubInventoryColumns, setShowSubInventoryColumns] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isAdmin = user?.role_in_web?.RoleName === "Admin";

//   if (user) {
//     console.log("user.responsible :",user.responsible);
//     console.log("user.RoleInWeb :",user.RoleInWeb);
//   }

 // กำหนด key สำหรับ localStorage
 const localStorageKey = 'managementAdminSelected'; // หรือ 'exportFilePageSelected' สำหรับ ExportFilePage


useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page);
    fetchItems(page, searchParams);
}, [location.search]);


useEffect(() => {
    // โหลดข้อมูลที่เลือกจาก localStorage เมื่อคอมโพเนนต์โหลด
    const savedSelectedItems = getFromLocalStorage(localStorageKey);
    if (savedSelectedItems) {
      setSelectedItems(savedSelectedItems.items);
      setSelectedRows(savedSelectedItems.rows);
    }

    // เคลียร์ข้อมูลใน localStorage เมื่อออกจากหน้า
    return () => clearLocalStorage(localStorageKey);
  }, []);

const fetchItems = async (page, searchParams) => {
    try {
        let url = `${API_URL}/api/inventories?populate=responsibles,category,company_inventory,building,status_inventory,sub_inventories&pagination[page]=${page}&pagination[pageSize]=20`;
        
        // เพิ่มเงื่อนไขนี้เพื่อไม่รวมครุภัณฑ์ที่มี status_inventory เป็น 3
        url += '&filters[status_inventory][id][$ne]=3';

        // Add search parameters to the URL
        for (let [key, value] of searchParams) {
            if (value && key !== 'page') {
                switch(key) {
                    case 'id_inv':
                    case 'name':
                    case 'floor':
                    case 'room':
                        url += `&filters[${key}][$containsi]=${encodeURIComponent(value)}`;
                        break;
                    case 'responsible':
                        url += `&filters[responsibles][id][$eq]=${value}`;
                        break;
                    case 'category':
                        url += `&filters[category][id][$eq]=${value}`;
                        break;
                    case 'building':
                        url += `&filters[building][id][$eq]=${value}`;
                        break;
                    case 'statusInventory':
                        url += `&filters[status_inventory][id][$eq]=${value}`;
                        break;
                    case 'searchSubInventory':
                        if (value === 'true') {
                            url += '&filters[sub_inventories][id][$notNull]=true';
                        }
                        break;
                    case 'sub_inventory':
                        if (searchParams.get('searchSubInventory') === 'true') {
                            url += `&filters[sub_inventories][name][$containsi]=${encodeURIComponent(value)}`;
                        }
                        break;
                    // Add more cases as needed
                }
            }
        }

        // Handle searchData if it's not included in URL parameters
        if (searchData) {
            if (searchData.id_inv) {
                url += `&filters[id_inv][$containsi]=${encodeURIComponent(searchData.id_inv)}`;
            }
            if (searchData.name) {
                url += `&filters[name][$containsi]=${encodeURIComponent(searchData.name)}`;
            }
            if (searchData.responsible) {
                url += `&filters[responsibles][id][$eq]=${searchData.responsible}`;
            }
            if (searchData.category) {
                url += `&filters[category][id][$eq]=${searchData.category}`;
            }
            if (searchData.building) {
                url += `&filters[building][id][$eq]=${searchData.building}`;
            }
            if (searchData.floor) {
                url += `&filters[floor][$containsi]=${encodeURIComponent(searchData.floor)}`;
            }
            if (searchData.room) {
                url += `&filters[room][$containsi]=${encodeURIComponent(searchData.room)}`;
            }
            if (searchData.statusInventory) {
                url += `&filters[status_inventory][id][$eq]=${searchData.statusInventory}`;
            }
            if (searchData.searchSubInventory === 'true') {
                url += '&filters[sub_inventories][id][$notNull]=true';
                if (searchData.sub_inventory) {
                    url += `&filters[sub_inventories][name][$containsi]=${encodeURIComponent(searchData.sub_inventory)}`;
                }
            }
        }

        console.log("Fetching URL:", url); // For debugging

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลครุภัณฑ์');
        }
        const result = await response.json();

        setFilteredInventoryList(result.data);
        setInventoryList(result.data);
        setFoundDataNumber(result.meta.pagination.total);
        setTotalDataNumber(result.meta.pagination.total);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    // หลังจากดึงข้อมูลใหม่ ตรวจสอบและอัปเดต selectedItems และ selectedRows
    const savedSelectedItems = getFromLocalStorage(localStorageKey);
    if (savedSelectedItems) {
      const updatedSelectedItems = savedSelectedItems.items.filter(id => 
        result.data.some(item => item.id === id)
      );
      const updatedSelectedRows = savedSelectedItems.rows.filter(row => 
        result.data.some(item => item.id === row.id)
      );
      setSelectedItems(updatedSelectedItems);
      setSelectedRows(updatedSelectedRows);
      saveToLocalStorage(localStorageKey, { items: updatedSelectedItems, rows: updatedSelectedRows });
    }
};

const handleSearch = (searchData) => {
    setSearchData(searchData);
    const searchParams = new URLSearchParams();
    for (let [key, value] of Object.entries(searchData)) {
        if (value) {
            searchParams.append(key, value);
        }
    }
    searchParams.set('page', '1');
    navigate(`?${searchParams.toString()}`);
};

const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page.toString());
    navigate(`?${searchParams.toString()}`);
};

const updateSelectedItems = (newItems, newRows) => {
    setSelectedItems(newItems);
    setSelectedRows(newRows);
    // บันทึกข้อมูลที่เลือกลง localStorage
    saveToLocalStorage(localStorageKey, { items: newItems, rows: newRows });
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
            <div className="bg-white shadow-md rounded-lg p-4 ">
            <SearchBox 
                onSearch={handleSearch} 
                mode={"management"} 
                onSubInventorySearchChange={handleSubInventorySearchChange}
            />
            </div>

            <div className='flex flex-row'>
                {isAdmin && (
                    <div className='ml-5 my-5'>
                        <Link to="/AddInventory">
                            <button className="bg-green-500 bg-opacity-50 rounded-lg w-32 h-12 text-white py-2 px-4 transition duration-300 hover:bg-green-700 hover:bg-opacity-100">
                                เพิ่มครุภัณฑ์
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            <TableViewInventory
                inventoryList={filteredInventoryList}
                onDeleteSuccess={fetchItems}
                foundDataNumber={foundDataNumber}
                totalDataNumber={totalDataNumber}
                selectedItems={selectedItems}
                selectedRows={selectedRows}
                onSelectionChange={updateSelectedItems}
                showSubInventoryColumns={showSubInventoryColumns}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />
        </>
    );
}

export default ManagementAdmin;