import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Checkbox, Space, Button, Table, Modal, Dropdown, Menu, Select } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, CloseOutlined, SettingOutlined,DownloadOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


function TableExportFile({ 
  inventoryList, 
  onDeleteSuccess, 
  foundDataNumber, 
  selectedItems, 
  selectedRows, 
  onSelectionChange,
  showSubInventoryColumns 
}) {

    const [sortedInventoryList, setSortedInventoryList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(['id_inv', 'name', 'responsible', 'category', 'location', 'action', 'status_inventory']);
    const navigate = useNavigate();





    useEffect(() => {
        async function fetchData() {
          try {
            const buildingResponse = await fetch("http://localhost:1337/api/buildings");
            const buildingData = await buildingResponse.json();
            setBuildingOptions(
              buildingData.data.map((item) => ({
                id: item.id,
                name: item.attributes.buildingName,
              }))
            );
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        fetchData();
      }, []);
    
      useEffect(() => {
        if (showSubInventoryColumns) {
            setVisibleColumns(prev => [...prev, 'sub_inventories_name', 'sub_inventories_id']);
        } else {
            setVisibleColumns(prev => prev.filter(col => col !== 'sub_inventories_name' && col !== 'sub_inventories_id'));
        }
    }, [showSubInventoryColumns]);
    
      const handleView = (inventoryId) => {
        navigate(`/UserDetailInventory/${inventoryId}`);
      };
    
      const handleEdit = (inventoryId) => {
        navigate(`/EditInventory/${inventoryId}`);
      };
    
      





      const openModal = () => {
        setIsModalVisible(true);
      };
    
      const closeModal = () => {
        setIsModalVisible(false);
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };


      const allColumns = [
        {
          title: 'หมายเลขครุภัณฑ์',
          dataIndex: ['attributes', 'id_inv'],
          key: 'id_inv',
        },
        {
          title: 'ชื่อครุภัณฑ์',
          width: 200,
          dataIndex: ['attributes', 'name'],
          key: 'name',
        },
        {
          title: 'เลของค์ประกอบในชุดครุภัณฑ์',
          key: 'sub_inventories_id',
          width: 100,
          render: (text, record) => {
            const subInventories = record.attributes.sub_inventories?.data;
            if (!subInventories || subInventories.length === 0) {
              return "- ";
            }
            const columns = [
              {
                title: 'เลขครุภัณฑ์',
                dataIndex: ['attributes', 'id_inv'],
                key: 'id_inv',
                render: (text) => (
                  <div className="max-w-[150px] whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {text}
                  </div>
                ),
              },
            ];
            return (
              <Table
                columns={columns}
                dataSource={subInventories}
                pagination={false}
                showHeader={false}
                size="small"
                rowKey="id"
                className="w-full"
              />
            );
          },
        },
        {
          title: 'ชื่อองค์ประกอบในชุดครุภัณฑ์',
          key: 'sub_inventories_name',
         
          render: (text, record) => {
            const subInventories = record.attributes.sub_inventories?.data;
            if (!subInventories || subInventories.length === 0) {
              return "-";
            }
            const columns = [
              {
                title: 'ชื่อครุภัณฑ์',
                dataIndex: ['attributes', 'name'],
                key: 'name',
                render: (text) => (
                  <div className="max-w-[150px] whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {text}
                  </div>
                ),
              },
            ];
            return (
              <Table
                columns={columns}
                dataSource={subInventories}
                pagination={false}
                showHeader={false}
                size="small"
                rowKey="id"
                className="w-full"
              />
            );
          },
        },
    
    
    
    
    
        {
          title: 'ผู้ดูแล',
          dataIndex: ['attributes', 'responsible', 'data', 'attributes', 'responsibleName'],
          key: 'responsible',
        },  
        {
          title: 'หมวดหมู่',
          dataIndex: ['attributes', 'category', 'data', 'attributes', 'CategoryName'],
          key: 'category',
        },
        {
          title: 'ที่ตั้ง',
          key: 'location',
          children: [
            { title: 'อาคาร', dataIndex: ['attributes', 'building', 'data', 'attributes', 'buildingName'], key: 'building' },
            { title: 'ชั้น', dataIndex: ['attributes', 'floor'], key: 'floor' },
            { title: 'ห้อง', dataIndex: ['attributes', 'room'], key: 'room' },
          ],
        },
        {
          title: 'สถานะครุภัณฑ์',
          dataIndex: ['attributes', 'status_inventory', 'data', 'attributes', 'StatusInventoryName'],
          key: 'status_inventory',
        },
        {
          title: 'ดู/แก้ไข',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
              <EyeOutlined
                className="text-xl"
                onClick={() => handleView(record.id)}
              />
              <EditOutlined 
              className="text-xl" 
              onClick={() => handleEdit(record.id)}
              />
            </Space>
          ),
        },
        {
          title: 'ลบ',
          key: 'delete',
          render: (text, record) => (
            <Space size="middle">
              <DeleteOutlined
                className="text-xl"
                onClick={() => handleDelete(record.id)}
              />
            </Space>
          ),
        },
      ];
    
      const filteredColumns = allColumns.filter(col => col.key !== 'action' && col.key !== 'delete');
    
      const modalColumns = filteredColumns.filter(col => visibleColumns.includes(col.key)).concat({
        title: 'การจัดการ',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <CloseOutlined
              className="text-xl text-gray-600 opacity-50 hover:opacity-100 cursor-pointer"
              onClick={() => handleDeleteFromSelected(record.id)}
            />
          </Space>
        ),
      });
    
      const columns = allColumns.filter(col => visibleColumns.includes(col.key));
    
      useEffect(() => {
        const sortedInventoryList = [...inventoryList].sort((a, b) => {
          return a.attributes.id_inv.localeCompare(b.attributes.id_inv);
        });
        setSortedInventoryList(sortedInventoryList);
      }, [inventoryList]);
    
      const handleCheckboxChange = (id, inventory) => {
        let updatedSelectedItems, updatedSelectedRows;
    
        if (selectedItems.includes(id)) {
            updatedSelectedItems = selectedItems.filter((itemId) => itemId !== id);
            updatedSelectedRows = selectedRows.filter((row) => row.id !== id);
        } else {
            updatedSelectedItems = [...selectedItems, id];
            updatedSelectedRows = [...selectedRows, inventory];
        }
    
        onSelectionChange(updatedSelectedItems, updatedSelectedRows);
        message.info(`เลือกแล้ว ${updatedSelectedItems.length} รายการ`);
    };
    
      const handleDeleteFromSelected = (id) => {
        const updatedSelectedItems = selectedItems.filter((itemId) => itemId !== id);
        const updatedSelectedRows = selectedRows.filter((row) => row.id !== id);
    
        setSelectedItems(updatedSelectedItems);
        setSelectedRows(updatedSelectedRows);
    
        message.info(`ลบรายการออกจากที่เลือกแล้ว`);
      };
    
      const handleDelete = async (id) => {
        try {
          const response = await fetch(`http://localhost:1337/api/inventories/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("ไม่สามารถลบข้อมูลได้");
          const responseData = await response.json();
          console.log("Deleted:", responseData);
          message.success("ลบข้อมูลสำเร็จ");
          onDeleteSuccess();
        } catch (error) {
          console.error("Error:", error);
          message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      };
    
      const menu = (
        <Menu
          multiple
          onClick={({ key }) => {
            if (visibleColumns.includes(key)) {
              setVisibleColumns(visibleColumns.filter(col => col !== key));
            } else {
              setVisibleColumns([...visibleColumns, key]);
            }
          }}
        >
          {allColumns.map(col => (
            <Menu.Item key={col.key}>
              <Checkbox checked={visibleColumns.includes(col.key)}>{col.title}</Checkbox>
            </Menu.Item>
          ))}
        </Menu>
      );
    




      const [exportType, setExportType] = useState('1');

  const handleExportTypeChange = (value) => {
    setExportType(value);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ข้อมูลครุภัณฑ์');

    // กำหนดสไตล์สำหรับหัวข้อคอลัมน์
    const headerStyle = {
      font: { bold: true, size: 14 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
    };

    // เพิ่มหัวข้อคอลัมน์
    const headers = columns.map(col => col.title);
    worksheet.addRow(headers);
    worksheet.getRow(1).eachCell(cell => {
      cell.style = headerStyle;
    });

    // เพิ่มข้อมูล
    selectedRows.forEach(row => {
      const rowData = columns.map(col => {
        if (col.key === 'sub_inventories_id' || col.key === 'sub_inventories_name') {
          const subInventories = row.attributes.sub_inventories?.data;
          if (subInventories && subInventories.length > 0) {
            return subInventories.map(subInv => 
              col.key === 'sub_inventories_id' ? subInv.attributes.id_inv : subInv.attributes.name
            ).join('\n');
          }
          return '-';
        }
        if (col.dataIndex) {
          return col.dataIndex.reduce((obj, key) => obj && obj[key], row) || '';
        }
        return '';
      });
      worksheet.addRow(rowData);
    });

    // ปรับความกว้างคอลัมน์ให้พอดีกับเนื้อหา
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // สร้างไฟล์ Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'รายงานครุภัณฑ์.xlsx');
  };



  return (
    <>
    
    <div>
        <div className="flex justify-between mr-4">
          <h2 className="ml-4 text-xl font-bold ">
            ค้นพบ {foundDataNumber} รายการ
          </h2>
          
          <Button
            className="bg-gray-400 w-[120px] h-[40px]"
            type="primary"
            onClick={openModal}
          >
             เลือก ({selectedItems.length})
          </Button>
        </div>
      </div>

      <Modal
        title="รายการที่เลือก"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="w-3/4 max-w-screen-lg"
        width={1000}
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold">เลือก ({selectedItems.length}) รายการ</h2>
        </div>
        <div className="mb-4">
          <Select
            style={{ width: 300 }}
            placeholder="เลือกประเภทรายงาน"
            onChange={handleExportTypeChange}
            value={exportType}
          >
            <Option value="1">1. นำออกไฟล์ Excel ตามคอลัมน์ที่เลือก</Option>
            <Option value="2">2. นำออกไฟล์ Excel การบำรุงรักษา</Option>
            <Option value="3">3. นำออกไฟล์ Excel การซ่อมแซม</Option>
            <Option value="4">4. นำออกไฟล์ Excel นำออกรายการข้อมูลทั่วไปครุภัณฑ์</Option>
          </Select>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportToExcel}
            className="ml-2"
          >
            นำออกไฟล์ Excel
          </Button>
        </div>
        <Table
          columns={modalColumns}
          dataSource={selectedRows}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 240 ,x: 'max-content'}}
          rowKey="id"
          className="w-full overflow-x-auto"
        />
      </Modal>

      <div className="flex flex-row justify-start mt-2">
        <Dropdown overlay={menu} trigger={['click']}>
        <Button icon={<SettingOutlined />}>เลือกคอลัมน์</Button>
        </Dropdown>
      </div>

      <Table
  columns={columns}
  dataSource={sortedInventoryList}
  pagination={{ pageSize: 10 }}
  scroll={{ x: 'max-content' }}
  rowKey="id"
  rowSelection={{
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys, selectedRows) => {
      onSelectionChange(selectedRowKeys, selectedRows);
    },
  }}
  className="w-full overflow-x-auto"
/>  
    
    
    </>
  )
}

export default TableExportFile