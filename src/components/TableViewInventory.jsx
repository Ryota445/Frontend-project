import React from 'react';
import { useState,useEffect } from 'react';
import { message,Checkbox } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

function TableViewInventory({ inventoryList, onDeleteSuccess }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortedInventoryList, setSortedInventoryList] = useState([]);


    const handleView = (inventoryData) => {
        onView(inventoryData);
    };

    
    


    useEffect(() => {
        // Sort inventory list by id_inv
        const sortedInventoryList = [...inventoryList].sort((a, b) => {
            return a.attributes.id_inv.localeCompare(b.attributes.id_inv);
        });
        setSortedInventoryList(sortedInventoryList);
    }, [inventoryList]); // Trigger sorting when inventoryList changes

    const handleCheckboxChange = (id) => {
        const updatedSelectedItems = selectedItems.includes(id)
            ? selectedItems.filter(itemId => itemId !== id)
            : [...selectedItems, id];
        setSelectedItems(updatedSelectedItems);
         // Show message when items are selected
         message.info(`เลือกแล้ว ${updatedSelectedItems.length} รายการ`);
    };


    console.log("inventoryList1:", inventoryList);

    // Function for deleting an item by id
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:1337/api/inventories/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('ไม่สามารถลบข้อมูลได้');
            const responseData = await response.json();
            console.log('Deleted:', responseData);
            message.success('ลบข้อมูลสำเร็จ');
            // Callback to update data after deletion
            onDeleteSuccess();
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
                            <th>ผู้ดูแล</th>
                            <th>หมวดหมู่</th>
                            <th>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                            {/* inventorylist */}
                            {Array.isArray(sortedInventoryList) && sortedInventoryList.map(inventory => (
                                    <tr key={inventory.id}>
                                        <th>
                                            <Checkbox
                                                checked={selectedItems.includes(inventory.id)}
                                                onChange={() => handleCheckboxChange(inventory.id)}
                                            />
                                        </th>
                                        <td>{inventory.attributes.id_inv}</td>
                                        <td>{inventory.attributes.name}</td>
                                        {/* Access responsible data */}
                                        <td>{inventory.attributes.responsible && inventory.attributes.responsible.data && inventory.attributes.responsible.data.attributes.responsibleName}</td>
                                        {/* Access category data */}
                                        <td>{inventory.attributes.category && inventory.attributes.category.data && inventory.attributes.category.data.attributes.CategoryName}</td>
                                        <td>
                                            <div className='flex flex-row space-x-4'>
                                                
                                                <EyeOutlined className='text-xl' onClick={() => handleView(inventory)}/>
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
    );
}

export default TableViewInventory;