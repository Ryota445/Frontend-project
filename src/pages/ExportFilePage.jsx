import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import TableExportFile from '../components/TableExportFile';
import { saveToLocalStorage, getFromLocalStorage, clearLocalStorage } from '../utils/localStorage';

function ExportFilePage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [searchData, setSearchData] = useState(null);
    const [filteredInventoryList, setFilteredInventoryList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const [foundDataNumber, setFoundDataNumber] = useState(0);
    const [totalDataNumber, setTotalDataNumber] = useState(0);
    const [showSubInventoryColumns, setShowSubInventoryColumns] = useState(false);
    const [showDisposalColumns, setShowDisposalColumns] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    // กำหนด key สำหรับ localStorage (ต้องแตกต่างกันระหว่างสองหน้า)
  const localStorageKey = 'exportFilePageSelected';

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

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get('page')) || 1;
        setCurrentPage(page);
        fetchItems(page, searchParams);
    }, [location.search]);

    const fetchItems = async (page, searchParams) => {
        try {
            let url = `${API_URL}/api/inventories?populate=responsibles,category,company_inventory,building,status_inventory,sub_inventories,how_to_get,year_money_get,request_disposal.FileReasonDisposal&pagination[page]=${page}&pagination[pageSize]=20`;

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
                            if (value === '3') {
                                url += `&filters[isDisposal][$eq]=true`;
                            } else {
                                url += `&filters[status_inventory][id][$eq]=${value}`;
                            }
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
                    }
                }
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลครุภัณฑ์');
            }
            const result = await response.json();

            setFilteredInventoryList(result.data);
            setInventoryList(result.data);
            setFoundDataNumber(result.meta.pagination.total);

                // ถ้า API สามารถให้จำนวนรายการทั้งหมดโดยไม่มีการกรอง
            if (result.meta.totalUnfiltered) {
                setTotalDataNumber(result.meta.totalUnfiltered);
            } else {
                // ถ้าไม่มี ให้ใช้ค่าเดียวกับ foundDataNumber
                setTotalDataNumber(result.meta.pagination.total);
            }

            setShowDisposalColumns(searchParams.get('statusInventory') === '3');
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

    const handleDeleteSuccess = () => {
        fetchItems(currentPage, new URLSearchParams(location.search));
    };

    const handleSubInventorySearchChange = (isChecked) => {
        setShowSubInventoryColumns(isChecked);
    };

    const updateSelectedItems = (newItems, newRows) => {
        setSelectedItems(newItems);
        setSelectedRows(newRows);
        // บันทึกข้อมูลที่เลือกลง localStorage
        saveToLocalStorage(localStorageKey, { items: newItems, rows: newRows });
      };

    return (
        <>
            <div className='border-b-2 border-black mb-10 flex justify-between items-center'>
                <h1 className='text-3xl text-blue-800'>ออกรายงาน</h1>
            </div>
            
            <SearchBox 
                className=""
                onSearch={handleSearch} 
                mode={"Disposal"} 
                onSubInventorySearchChange={handleSubInventorySearchChange}
            />
            <div className='h-[50px]'>
                {/*  gap*/}
            </div>

            <TableExportFile
                inventoryList={filteredInventoryList}
                onDeleteSuccess={handleDeleteSuccess}
                foundDataNumber={foundDataNumber}
                totalDataNumber={totalDataNumber}
                selectedItems={selectedItems}
                selectedRows={selectedRows}
                onSelectionChange={updateSelectedItems}
                showSubInventoryColumns={showSubInventoryColumns}
                showDisposalColumns={showDisposalColumns}
                onPageChange={handlePageChange}
                currentPage={currentPage}
            />
        </>
    );
}

export default ExportFilePage;