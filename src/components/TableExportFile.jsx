import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Checkbox, Space, Button, Table, Modal, Dropdown, Menu, Select ,Input  } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, CloseOutlined, SettingOutlined,DownloadOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import DateDifferenceCalculator from "../components/DateDifferenceCalculator";


function TableExportFile({ 
  inventoryList, 
  onDeleteSuccess, 
  foundDataNumber, 
  selectedItems, 
  selectedRows, 
  onSelectionChange,
  showSubInventoryColumns 
}) {
  const API_URL = import.meta.env.VITE_API_URL;
    const [sortedInventoryList, setSortedInventoryList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(['id_inv', 'name', 'responsible', 'category', 'location', 'action', 'status_inventory']);
    const [fileName, setFileName] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const [exportType, setExportType] = useState('1');



    const handleExportTypeChange = (value) => {
      setExportType(value);
    };





    // useEffect(() => {
    //     async function fetchData() {
    //       try {
    //         const buildingResponse = await fetch("${API_URL}/api/buildings");
    //         const buildingData = await buildingResponse.json();
    //         setBuildingOptions(
    //           buildingData.data.map((item) => ({
    //             id: item.id,
    //             name: item.attributes.buildingName,
    //           }))
    //         );
    //       } catch (error) {
    //         console.error("Error fetching data:", error);
    //       }
    //     }
    //     fetchData();
    //   }, []);
    
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
          title: 'วิธีได้มา',
          dataIndex: ['attributes', 'how_to_get', 'data', 'attributes', 'howToGetName'],
          key: 'howToGet',
        },
        {
          title: 'ปีงบประมาณ',
          dataIndex: ['attributes', 'year_money_get', 'data', 'attributes', 'yearMoneyGetName'],
          key: 'yearMoneyGet',
        },
        {
          title: 'ตัวแทนบริษัท/ผู้บริจาค',
          key: 'companyContact',
          render: (text, record) => {
            const contactName = record.attributes.company_inventory?.data?.attributes?.contactName || '';
            const companyName = record.attributes.company_inventory?.data?.attributes?.Cname || '';
            return `${contactName}/${companyName}`;
          },
        },
        {
          title: 'วันที่สั่งซื้อ',
          dataIndex: ['attributes', 'DateOrder'],
          key: 'dateOrder',
        },
        {
          title: 'วันที่ตรวจรับ/วันที่รับโอน',
          dataIndex: ['attributes', 'DateRecive'],
          key: 'dateReceive',
        },
        {
          title: 'ยี่ห้อ',
          dataIndex: ['attributes', 'brand'],
          key: 'brand',
        },
        {
          title: 'รุ่น',
          dataIndex: ['attributes', 'model'],
          key: 'model',
        },
        {
          title: 'หมายเลข SN',
          dataIndex: ['attributes', 'serialNumber'],
          key: 'serialNumber',
        },
        {
          title: 'ราคาที่ซื้อ (บาท)',
          dataIndex: ['attributes', 'prize'],
          key: 'price',
        },
        {
          title: 'รายละเอียดเพิ่มเติม',
          dataIndex: ['attributes', 'information'],
          key: 'information',
        },
        {
          title: 'อายุการใช้งานโดยประเมิน',
          dataIndex: ['attributes', 'age_use'],
          key: 'estimatedAge',
          render: (text) => `${text} ปี`,
        },
        {
          title: 'อายุการใช้งานจริง',
          key: 'actualAge',
          render: (text, record) => <DateDifferenceCalculator dateReceive={record.attributes.DateRecive} />,
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
          const response = await fetch(`${API_URL}/api/inventories/${id}`, {
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


      const handleMenuClick = (e) => {
        e.domEvent.stopPropagation();
      };

      const handleVisibleChange = (flag) => {
        setDropdownVisible(flag);
      };
    
      const menu = (
        <Menu
          onClick={handleMenuClick}
          style={{ maxHeight: '300px', overflow: 'auto' }}
        >
          {allColumns.map(col => (
            <Menu.Item key={col.key}>
              <Checkbox
                checked={visibleColumns.includes(col.key)}
                onChange={(e) => {
                  e.stopPropagation();
                  if (visibleColumns.includes(col.key)) {
                    setVisibleColumns(visibleColumns.filter(key => key !== col.key));
                  } else {
                    setVisibleColumns([...visibleColumns, col.key]);
                  }
                }}
              >
                {col.title}
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu>
      );

    
      const excelColumns = [
        {
          title: 'หมายเลขครุภัณฑ์',
          dataIndex: ['attributes', 'id_inv'],
          key: 'id_inv',
        },
        {
          title: 'ชื่อครุภัณฑ์',
          dataIndex: ['attributes', 'name'],
          key: 'name',
        },
        {
          title: 'เลของค์ประกอบในชุดครุภัณฑ์',
          key: 'sub_inventories_id',
        },
        {
          title: 'ชื่อองค์ประกอบในชุดครุภัณฑ์',
          key: 'sub_inventories_name',
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
          title: 'อาคาร',
          dataIndex: ['attributes', 'building', 'data', 'attributes', 'buildingName'],
          key: 'building',
        },
        {
          title: 'ชั้น',
          dataIndex: ['attributes', 'floor'],
          key: 'floor',
        },
        {
          title: 'ห้อง',
          dataIndex: ['attributes', 'room'],
          key: 'room',
        },
        {
          title: 'สถานะครุภัณฑ์',
          dataIndex: ['attributes', 'status_inventory', 'data', 'attributes', 'StatusInventoryName'],
          key: 'status_inventory',
        },
        {
          title: 'วิธีได้มา',
          dataIndex: ['attributes', 'how_to_get', 'data', 'attributes', 'howToGetName'],
          key: 'howToGet',
        },
        {
          title: 'ปีงบประมาณ',
          dataIndex: ['attributes', 'year_money_get', 'data', 'attributes', 'yearMoneyGetName'],
          key: 'yearMoneyGet',
        },
        {
          title: 'ตัวแทนบริษัท/ผู้บริจาค',
          key: 'companyContact',
        },
        {
          title: 'วันที่สั่งซื้อ',
          dataIndex: ['attributes', 'DateOrder'],
          key: 'dateOrder',
        },
        {
          title: 'วันที่ตรวจรับ/วันที่รับโอน',
          dataIndex: ['attributes', 'DateRecive'],
          key: 'dateReceive',
        },
        {
          title: 'ยี่ห้อ',
          dataIndex: ['attributes', 'brand'],
          key: 'brand',
        },
        {
          title: 'รุ่น',
          dataIndex: ['attributes', 'model'],
          key: 'model',
        },
        {
          title: 'หมายเลข SN',
          dataIndex: ['attributes', 'serialNumber'],
          key: 'serialNumber',
        },
        {
          title: 'ราคาที่ซื้อ (บาท)',
          dataIndex: ['attributes', 'prize'],
          key: 'price',
        },
        {
          title: 'รายละเอียดเพิ่มเติม',
          dataIndex: ['attributes', 'information'],
          key: 'information',
        },
        {
          title: 'อายุการใช้งานโดยประเมิน',
          dataIndex: ['attributes', 'age_use'],
          key: 'estimatedAge',
        },
        {
          title: 'อายุการใช้งานจริง',
          key: 'actualAge',
        },
      ];



      

  

  const exportToExcel = async () => {
    // กำหนดสไตล์สำหรับหัวข้อคอลัมน์
    const headerStyle = {
      font: { bold: true, size: 14 },
      alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
      border: {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      }
    };
  
    // กำหนดสไตล์สำหรับเนื้อหา
    const contentStyle = {
      font: { size: 12 },
      alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
      border: {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      }
    };
    let workbook = new ExcelJS.Workbook();
  let worksheet;
  let fileName;
  let finalFileName; // ประกาศตัวแปรนี้ที่นี่

  switch (exportType) {
    case '1':
    default:
      // นำออกไฟล์ Excel ข้อมูลทั่วไปครุภัณฑ์ (ทุก column)
      workbook = new ExcelJS.Workbook();
      worksheet = workbook.addWorksheet('ข้อมูลทั่วไปครุภัณฑ์');
      
      // ใช้ทุก column
      const allHeaders = excelColumns.map(col => col.title);
      const allHeaderRow = worksheet.addRow(allHeaders);
      allHeaderRow.eachCell((cell) => {
        cell.style = headerStyle;
      });
      
      // เพิ่มข้อมูล
      selectedRows.forEach(row => {
        const rowData = excelColumns.map(col => {
      // ใช้ลอจิกเดิมในการดึงข้อมูลแต่ละ column
      if (col.key === 'sub_inventories_id' || col.key === 'sub_inventories_name') {
        const subInventories = row.attributes.sub_inventories?.data;
        if (subInventories && subInventories.length > 0) {
          return subInventories.map(subInv => 
            col.key === 'sub_inventories_id' ? subInv.attributes.id_inv : subInv.attributes.name
          ).join(', ');
        }
        return '-';
      }
      if (col.key === 'companyContact') {
        const contactName = row.attributes.company_inventory?.data?.attributes?.contactName || '';
        const companyName = row.attributes.company_inventory?.data?.attributes?.Cname || '';
        return `${contactName}/${companyName}`;
      }
      if (col.key === 'estimatedAge') {
        return `${row.attributes.age_use} ปี`;
      }
      if (col.key === 'actualAge') {
        return calculateAgeDifference(row.attributes.DateRecive);
      }
      if (col.dataIndex) {
        return col.dataIndex.reduce((obj, key) => obj && obj[key], row) || '';
      }
      return '';
    });
    worksheet.addRow(rowData);
  });

  // ปรับความกว้างคอลัมน์และความสูงแถว
  worksheet.columns.forEach(column => {
    column.width = 30;
  });
  worksheet.getRow(1).height = 50;
  break;

case '2':
      // นำออกไฟล์ Excel ตามคอลัมน์ที่เลือก
      workbook = new ExcelJS.Workbook();
      worksheet = workbook.addWorksheet('ข้อมูลครุภัณฑ์');

  
    
  
    // เพิ่มหัวข้อคอลัมน์
    const headers = excelColumns.map(col => col.title);
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.style = headerStyle;
    });

    
  
      // เพิ่มข้อมูล
      selectedRows.forEach(row => {
        const rowData = excelColumns.map(col => {
          if (col.key === 'sub_inventories_id' || col.key === 'sub_inventories_name') {
            const subInventories = row.attributes.sub_inventories?.data;
            if (subInventories && subInventories.length > 0) {
              return subInventories.map(subInv => 
                col.key === 'sub_inventories_id' ? subInv.attributes.id_inv : subInv.attributes.name
              ).join(', ');
            }
            return '-';
          }
          if (col.key === 'companyContact') {
            const contactName = row.attributes.company_inventory?.data?.attributes?.contactName || '';
            const companyName = row.attributes.company_inventory?.data?.attributes?.Cname || '';
            return `${contactName}/${companyName}`;
          }
          if (col.key === 'estimatedAge') {
            return `${row.attributes.age_use} ปี`;
          }
          if (col.key === 'actualAge') {
            // ใช้ฟังก์ชันคำนวณอายุแทนการใช้ component โดยตรง
            return calculateAgeDifference(row.attributes.DateRecive);
          }
          if (col.dataIndex) {
            return col.dataIndex.reduce((obj, key) => obj && obj[key], row) || '';
          }
          return '';
        });
        worksheet.addRow(rowData);
      });
  
   // ปรับความกว้างคอลัมน์และความสูงแถว
  worksheet.columns.forEach(column => {
    column.width = 30; // กำหนดความกว้างคอลัมน์เป็น 20
  });
  worksheet.getRow(1).height = 50; // กำหนดความสูงแถวหัวข้อ

  
  break;
}

// สร้างชื่อไฟล์
const thaiDate = new Date().toLocaleDateString('th-TH', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const defaultFileName = `รายงานข้อมูลทั่วไปครุภัณฑ์ - ${thaiDate}`;
finalFileName = `${fileName || defaultFileName}.xlsx`;

  // สร้างไฟล์ Excel
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), finalFileName);
};



const calculateAgeDifference = (dateReceive) => {
  if (!dateReceive) return "ไม่มีข้อมูลวันที่";

  const today = new Date();
  const receivedDate = new Date(dateReceive);
   
  let years = today.getFullYear() - receivedDate.getFullYear();
  let months = today.getMonth() - receivedDate.getMonth();
  let days = today.getDate() - receivedDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  let result = [];
  if (years > 0) result.push(`${years} ปี`);
  if (months > 0) result.push(`${months} เดือน`);
  if (days > 0) result.push(`${days} วัน`);

  return result.length === 0 ? "0 วัน" : result.join(" ");
};


// const exportMaintenanceAndRepairHistory = (worksheet) => {
//   // กำหนดหัวข้อคอลัมน์
//   worksheet.columns = [
//     { header: 'วันที่', key: 'date', width: 15 },
//     { header: 'หมายเลขครุภัณฑ์', key: 'id_inv', width: 20 },
//     { header: 'ชื่อครุภัณฑ์', key: 'name', width: 30 },
//     { header: 'รายละเอียด', key: 'details', width: 40 },
//     { header: 'ค่าใช้จ่าย (บาท)', key: 'price', width: 15 },
//     { header: 'ประเภท', key: 'type', width: 15 }
//   ];

//   // สร้างข้อมูลรายงาน
//   const reportData = generateMaintenanceRepairReport(selectedRows);

//   // เพิ่มข้อมูลลงในแผ่นงาน
//   worksheet.addRows(reportData);

//   // จัดรูปแบบหัวข้อคอลัมน์
//   worksheet.getRow(1).font = { bold: true };
//   worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
// };

// const generateMaintenanceRepairReport = (selectedRows) => {
//   let reportData = [];

//   selectedRows.forEach(inventory => {
//     // ตรวจสอบว่า inventory และ attributes มีอยู่จริง
//     if (inventory && inventory.attributes) {
//       // ข้อมูลซ่อมแซมของครุภัณฑ์หลัก
//       if (inventory.attributes.repair_reports && inventory.attributes.repair_reports.data) {
//         inventory.attributes.repair_reports.data.forEach(report => {
//           if (report && report.attributes && report.attributes.isDone && report.attributes.isCanRepair) {
//             reportData.push({
//               date: report.attributes.dateFinishRepair,
//               id_inv: inventory.attributes.id_inv,
//               name: inventory.attributes.name,
//               details: report.attributes.ListDetailRepair,
//               price: report.attributes.RepairPrice,
//               type: 'ซ่อมแซม'
//             });
//           }
//         });
//       }

//       // ข้อมูลบำรุงรักษาของครุภัณฑ์หลัก
//       if (inventory.attributes.maintenance_reports && inventory.attributes.maintenance_reports.data) {
//         inventory.attributes.maintenance_reports.data.forEach(report => {
//           if (report && report.attributes && report.attributes.isDone) {
//             reportData.push({
//               date: report.attributes.DateToDo,
//               id_inv: inventory.attributes.id_inv,
//               name: inventory.attributes.name,
//               details: report.attributes.DetailMaintenance,
//               price: report.attributes.prize,
//               type: 'บำรุงรักษา'
//             });
//           }
//         });
//       }

//       // ข้อมูลซ่อมแซมและบำรุงรักษาของครุภัณฑ์ย่อย
//       if (inventory.attributes.sub_inventories && inventory.attributes.sub_inventories.data) {
//         inventory.attributes.sub_inventories.data.forEach(subInventory => {
//           if (subInventory && subInventory.attributes) {
//             if (subInventory.attributes.repair_reports && subInventory.attributes.repair_reports.data) {
//               subInventory.attributes.repair_reports.data.forEach(report => {
//                 if (report && report.attributes && report.attributes.isDone && report.attributes.isCanRepair) {
//                   reportData.push({
//                     date: report.attributes.dateFinishRepair,
//                     id_inv: `${inventory.attributes.id_inv} ${subInventory.attributes.id_inv}`,
//                     name: `(องค์ประกอบในชุดครุภัณฑ์) ${subInventory.attributes.name}`,
//                     details: report.attributes.ListDetailRepair,
//                     price: report.attributes.RepairPrice,
//                     type: 'ซ่อมแซม'
//                   });
//                 }
//               });
//             }

//             if (subInventory.attributes.maintenance_reports && subInventory.attributes.maintenance_reports.data) {
//               subInventory.attributes.maintenance_reports.data.forEach(report => {
//                 if (report && report.attributes && report.attributes.isDone) {
//                   reportData.push({
//                     date: report.attributes.DateToDo,
//                     id_inv: `${inventory.attributes.id_inv} ${subInventory.attributes.id_inv}`,
//                     name: `(องค์ประกอบในชุดครุภัณฑ์) ${subInventory.attributes.name}`,
//                     details: report.attributes.DetailMaintenance,
//                     price: report.attributes.prize,
//                     type: 'บำรุงรักษา'
//                   });
//                 }
//               });
//             }
//           }
//         });
//       }
//     }
//   });

//   // เรียงข้อมูลตามวันที่
//   reportData.sort((a, b) => new Date(b.date) - new Date(a.date));

//   return reportData;
// };




  //  // เพิ่มข้อมูล
  //  selectedRows.forEach(row => {
  //   const rowData = columns.map(col => {
  //     if (col.key === 'sub_inventories_id' || col.key === 'sub_inventories_name') {
  //       const subInventories = row.attributes.sub_inventories?.data;
  //       if (subInventories && subInventories.length > 0) {
  //         return subInventories.map(subInv => 
  //           col.key === 'sub_inventories_id' ? subInv.attributes.id_inv : subInv.attributes.name
  //         ).join('\n');
  //       }
  //       return '-';
  //     }
  //     if (col.dataIndex) {
  //       return col.dataIndex.reduce((obj, key) => obj && obj[key], row) || '';
  //     }
  //     return '';
  //   });
  //   worksheet.addRow(rowData);
  // });



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
        width="95%"
        style={{ maxWidth: '1200px' }}
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
    <Option value="1">1. ข้อมูลทั่วไปครุภัณฑ์</Option>
    <Option value="2">2. ตามคอลัมน์ที่เลือก</Option>
  </Select>

  <Input 
  placeholder="ชื่อไฟล์ (ไม่ต้องใส่นามสกุลไฟล์)" 
  value={fileName}
  onChange={(e) => setFileName(e.target.value)}
  style={{ width: 300, marginRight: 10 }}
/>

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
          scroll={{ x: 'max-content', y: 400 }}
          rowKey="id"
          className="w-full overflow-x-auto"
        />
      </Modal>

      <div className="flex flex-row justify-start mt-2">
      <Dropdown 
  overlay={menu} 
  trigger={['click']} 
  placement="bottomLeft"
  visible={dropdownVisible}
  onVisibleChange={handleVisibleChange}
>
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