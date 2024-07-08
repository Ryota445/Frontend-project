import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import TableExportFile from '../components/TableExportFile';



function ExportFilePage() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchData, setSearchData] = useState(null);
    const [filteredInventoryList, setFilteredInventoryList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const [foundDataNumber, setFoundDataNumber] = useState(0)
    const [showSubInventoryColumns, setShowSubInventoryColumns] = useState(false);
    const [modeSelected, setModeSelected] = useState('mode1'); // initial mode

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
            const response = await fetch("http://localhost:1337/api/inventories?populate=responsible,category,company_inventory,building,status_inventory,sub_inventories,how_to_get,year_money_get");
            if (!response.ok) {
                throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลครุภัณฑ์');
            }
            const result = await response.json();
            
            const filteredData = result.data.filter(inventory => !inventory.attributes.isDisposal);
            
            setFilteredInventoryList(filteredData);
            setInventoryList(filteredData);
            setFoundDataNumber(filteredData.length);
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

            return (
                (searchData.id_inv && inventory.attributes.id_inv
                    ? inventory.attributes.id_inv.toLowerCase().includes(searchData.id_inv.toLowerCase())
                    : true) &&
                (searchData.name && inventory.attributes.name
                    ? inventory.attributes.name.toLowerCase().includes(searchData.name.toLowerCase())
                    : true) &&
                (searchData.responsible && inventory?.attributes?.responsible?.data
                    ? inventory.attributes.responsible.data.id === searchData.responsible
                    : true) &&
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
        fetchItems();
    };

    const handleSubInventorySearchChange = (isChecked) => {
        setShowSubInventoryColumns(isChecked);
    };
  return (
    <>
    <div className='border-b-2 border-black mb-10 flex justify-between items-center'>
        <h1 className='text-3xl text-blue-800'>ออกรายงาน</h1>
    </div>

    
            
    <SearchBox  className=""
        onSearch={handleSearch} 
        mode={"Disposal"} 
        onSubInventorySearchChange={handleSubInventorySearchChange}
    />
    <div className='h-[50px]'>
        {/*  gap*/}
    </div>

    

    {filteredInventoryList.length > 0 ? (
        <TableExportFile
            inventoryList={filteredInventoryList}
            onDeleteSuccess={handleDeleteSuccess}
            foundDataNumber={foundDataNumber}
            selectedItems={selectedItems}
            selectedRows={selectedRows}
            onSelectionChange={updateSelectedItems}
            showSubInventoryColumns={showSubInventoryColumns}
        />
    ) : (
        <div className='flex flex-col justify-center items-center h-full mt-10'>
            <p className='text-xl'> -ไม่พบข้อมูล- </p>
        </div>
    )}
</>

  )
}

export default ExportFilePage