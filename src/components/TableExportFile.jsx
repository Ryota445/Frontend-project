import React, { useState, useEffect } from "react";
import { useNavigate ,useLocation } from "react-router-dom";
import { message, Checkbox, Space, Button, Table, Modal, Dropdown, Menu, Select ,Input ,Popconfirm  } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, CloseOutlined, SettingOutlined,DownloadOutlined ,StopOutlined  } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import DateDifferenceCalculator from "../components/DateDifferenceCalculator";


function TableExportFile({ 
  inventoryList, 
  onDeleteSuccess, 
  foundDataNumber, 
  totalDataNumber, 
  selectedItems, 
  selectedRows, 
  onSelectionChange,
  showSubInventoryColumns,
  showDisposalColumns,
  onPageChange,
  currentPage
}) {
  const API_URL = import.meta.env.VITE_API_URL;
    const [sortedInventoryList, setSortedInventoryList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(['id_inv', 'name', 'responsible', 'category', 'location', 'action', 'status_inventory']);
    const [fileName, setFileName] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const [exportType, setExportType] = useState('1');
    const location = useLocation();
    



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
          render: (text) => (
            <div style={{ textAlign: text ? 'left' : 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'ชื่อครุภัณฑ์',
          width: 200,
          dataIndex: ['attributes', 'name'],
          key: 'name',
          render: (text) => (
            <div style={{ textAlign: text ? 'left' : 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'เลของค์ประกอบในชุดครุภัณฑ์',
          key: 'sub_inventories_id',
          width: 100,
          align: 'center',
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
          align: 'center',
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
          key: 'responsible',
          align: 'center',
          render: (text, record) => {
            const responsibles = record.attributes?.responsibles?.data;
            if (!responsibles || responsibles.length === 0) {
              return "-";
            }
            const columns = [
              {
                title: 'ชื่อผู้ดูแล',
                dataIndex: ['attributes', 'responsibleName'],
                key: 'responsibleName',
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
                dataSource={responsibles}
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
          title: 'หมวดหมู่',
          dataIndex: ['attributes', 'category', 'data', 'attributes', 'CategoryName'],
          key: 'category',
          align: 'center',
          render: (text, record) => (
            <div style={{ textAlign: 'center' }}>
              {record.attributes?.category?.data?.attributes?.CategoryName || '-'}
            </div>
          ),
        },
        {
          title: 'ที่ตั้ง',
          key: 'location',
          align: 'center',
          children: [
            {
              title: 'อาคาร',
              dataIndex: ['attributes', 'building', 'data', 'attributes', 'buildingName'],
              key: 'building',
              align: 'center',
              render: (text, record) => (
                <div style={{ textAlign: 'center' }}>
                  {record.attributes?.building?.data?.attributes?.buildingName || '-'}
                </div>
              ),
            },
            {
              title: 'ชั้น',
              dataIndex: ['attributes', 'floor'],
              key: 'floor',
              align: 'center',
              render: (text) => (
                <div style={{ textAlign: 'center' }}>
                  {text || '-'}
                </div>
              ),
            },
            {
              title: 'ห้อง',
              dataIndex: ['attributes', 'room'],
              key: 'room',
              align: 'center',
              render: (text) => (
                <div style={{ textAlign: 'center' }}>
                  {text || '-'}
                </div>
              ),
            },
          ],
        },
        {
          title: 'สถานะครุภัณฑ์',
          dataIndex: ['attributes', 'status_inventory', 'data', 'attributes', 'StatusInventoryName'],
          key: 'status_inventory',
          align: 'center',
          render: (text, record) => (
            <div style={{ textAlign: 'center' }}>
              {record.attributes?.status_inventory?.data?.attributes?.StatusInventoryName || '-'}
            </div>
          ),
        },
        {
          title: 'วิธีได้มา',
          dataIndex: ['attributes', 'how_to_get', 'data', 'attributes', 'howToGetName'],
          key: 'howToGet',
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'ปีงบประมาณ',
          dataIndex: ['attributes', 'year_money_get', 'data', 'attributes', 'yearMoneyGetName'],
          key: 'yearMoneyGet',
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'ตัวแทนบริษัท/ผู้บริจาค',
          key: 'companyContact',
          align: 'center',
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
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'วันที่ตรวจรับ/วันที่รับโอน',
          dataIndex: ['attributes', 'DateRecive'],
          key: 'dateReceive',
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'ยี่ห้อ',
          dataIndex: ['attributes', 'brand'],
          key: 'brand',
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'รุ่น',
          dataIndex: ['attributes', 'model'],
          key: 'model',
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'หมายเลข SN',
          dataIndex: ['attributes', 'serialNumber'],
          key: 'serialNumber',
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'ราคาที่ซื้อ (บาท)',
          dataIndex: ['attributes', 'prize'],
          key: 'price',
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'จำนวนรายการ/หน่วยนับ',
          key: 'quantityUnit',
          align: 'center',
          render: (text, record) => {
            const quantity = record.attributes.quantity || '';
            const unit = record.attributes?.unit?.data?.attributes?.name_unit || '';
            return `${quantity} ${unit}`;
          },
        },
        {
          title: 'รายละเอียดเพิ่มเติม',
          dataIndex: ['attributes', 'information'],
          key: 'information',
          align: 'center',
          render: (text) => (
            <div style={{ textAlign: 'center' }}>
              {text || '-'}
            </div>
          ),
        },
        {
          title: 'อายุการใช้งานโดยประเมิน',
          dataIndex: ['attributes', 'age_use'],
          key: 'estimatedAge',
          align: 'center',
          render: (text) => {
            if(text){
              return(<div>
                `${text} ปี`
              </div>);
            }
            else{
              return '-';
            }
          },
        },
        {
          title: 'อายุการใช้งานจริง',
          key: 'actualAge',
          align: 'center',
          render: (text, record) => <DateDifferenceCalculator dateReceive={record.attributes.DateRecive} />,
        },
        {
          title: 'วันที่ทำจำหน่าย',
          key: 'disposalDate',
          align: 'center',
          render: (text, record) => {
            if (record.attributes.request_disposal?.data) {
              const date = new Date(record.attributes.request_disposal.data.attributes.createdAt);
              return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }
            return '-';
          },
        },
        {
          title: 'ปีที่ทำจำหน่าย',
          key: 'disposalYear',
          align: 'center',
          render: (text, record) => {
            if (record.attributes.request_disposal?.data) {
              const date = new Date(record.attributes.request_disposal.data.attributes.createdAt);
              return date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
            }
            return '-';
          },
        },
        {
          title: 'รายละเอียดการทำจำหน่าย',
          key: 'disposalReason',
          align: 'center',
          render: (text, record) => {
            if (record.attributes.request_disposal?.data) {
              return record.attributes.request_disposal.data.attributes.ReasonDisposal;
            }
            return '-';
          },
        },
        {
          title: 'ไฟล์ทำจำหน่าย',
          key: 'disposalFile',
          align: 'center',
          render: (text, record) => {
            const fileData = record.attributes.request_disposal?.data?.attributes?.FileReasonDisposal?.data;
            if (fileData) {
              const fileUrl = fileData.attributes.url;
              const fileName = fileData.attributes.name;
              const truncatedFileName = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
              return (
                <a onClick={() => handleViewDisposalReason(fileUrl)} title={fileName}>
                  {truncatedFileName}
                </a>
              );
            }
            return '-';
          },
        },
        {
          title: 'ยกเลิกทำจำหน่าย',
          key: 'cancelDisposal',
          render: (text, record) => {
            if (record.attributes.status_inventory?.data?.id === 3 && record.attributes.isDisposal) {
              return (
                <Popconfirm
                  title="คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการทำจำหน่ายนี้?"
                  onConfirm={() => handleCancelDisposal(record.id, record.attributes.request_disposal?.data?.id)}
                  okButtonProps={{ className: "bg-blue-300 hover:bg-blue-600 text-white" }}
                  okText="ยืนยัน"
                  cancelText="ยกเลิก"
                >
                  <Button type="primary" danger icon={<StopOutlined />}>
                    ยกเลิกทำจำหน่าย
                  </Button>
                </Popconfirm>
              );
            }
            return null;
          },
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
    
      const columns = allColumns.filter(col => {
        if (['disposalDate', 'disposalYear', 'disposalReason', 'disposalFile', 'cancelDisposal'].includes(col.key)) {
          return showDisposalColumns;
        }
        return visibleColumns.includes(col.key);
      });
    
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

    const handleViewDisposalReason = (fileUrl) => {
      if (fileUrl) {
        window.open(`${API_URL}${fileUrl}`, '_blank');
      } else {
        message.info("ไม่พบไฟล์แนบ");
      }
    };

    const handleCancelDisposal = async (inventoryId, disposalId) => {
      try {
        // อัพเดท request-disposal โดยลบครุภัณฑ์ออกจากรายการ
        if (disposalId) {
          const getDisposalResponse = await fetch(`${API_URL}/api/request-disposals/${disposalId}?populate=*`);
          if (!getDisposalResponse.ok) throw new Error("ไม่สามารถดึงข้อมูลการทำจำหน่ายได้");
          const disposalData = await getDisposalResponse.json();
    
          // ลบ inventoryId ออกจากรายการ inventories
          const updatedInventories = disposalData.data.attributes.inventories.data
            .filter(inv => inv.id !== inventoryId)
            .map(inv => inv.id);
    
          const updateDisposalResponse = await fetch(`${API_URL}/api/request-disposals/${disposalId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                inventories: updatedInventories
              },
            }),
          });
    
          if (!updateDisposalResponse.ok) throw new Error("ไม่สามารถอัพเดทข้อมูลการทำจำหน่ายได้");
        }
    
        // อัพเดท inventory
        const updateInventoryResponse = await fetch(`${API_URL}/api/inventories/${inventoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              isDisposal: false,
              status_inventory: 1,
              request_disposal: null // ลบการอ้างอิงถึง request_disposal
            },
          }),
        });
    
        if (!updateInventoryResponse.ok) throw new Error("ไม่สามารถอัพเดทสถานะครุภัณฑ์ได้");
    
        message.success("ยกเลิกการทำจำหน่ายสำเร็จ");
        // รีโหลดข้อมูล
        // ตรงนี้คุณอาจต้องเรียกฟังก์ชันที่ดึงข้อมูลครุภัณฑ์ใหม่
        // เช่น fetchInventoryData();
      } catch (error) {
        console.error("Error:", error);
        message.error("เกิดข้อผิดพลาดในการยกเลิกการทำจำหน่าย");
      }
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
          title: 'รหัสสินทรัพย์',
          dataIndex: ['attributes', 'asset_code'],
          key: 'asset_code',
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
          key: 'responsible',
          render: (record) => {
            const responsibles = record.attributes.responsibles?.data;
            if (responsibles && responsibles.length > 0) {
              return responsibles.map(resp => resp.attributes.responsibleName).join(', ');
            }
            return '-';
          },
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
          title: 'จำนวนรายการ/หน่วยนับ',
          key: 'quantityUnit',
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
        {
          title: 'วันที่ทำจำหน่าย',
          key: 'disposalDate',
          render: (record) => {
            if (record.attributes.request_disposal?.data) {
              const date = new Date(record.attributes.request_disposal.data.attributes.createdAt);
              return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }
            return '';
          },
        },
        {
          title: 'ปีที่ทำจำหน่าย',
          key: 'disposalYear',
          render: (record) => {
            if (record.attributes.request_disposal?.data) {
              const date = new Date(record.attributes.request_disposal.data.attributes.createdAt);
              return date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
            }
            return '';
          },
        },
        {
          title: 'รายละเอียดการทำจำหน่าย',
          key: 'disposalReason',
          render: (record) => {
            return record.attributes.request_disposal?.data?.attributes.ReasonDisposal || '';
          },
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
      worksheet = workbook.addWorksheet('ข้อมูลครุภัณฑ์ทุกคอลัมน์');
      
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
      if (col.key === 'responsible') {
        const responsibles = row.attributes.responsibles?.data;
        if (responsibles && responsibles.length > 0) {
          return responsibles.map(resp => resp.attributes.responsibleName).join(', ');
        }
        return '-';
      }
      if (col.key === 'companyContact') {
        const contactName = row.attributes.company_inventory?.data?.attributes?.contactName || '';
        const companyName = row.attributes.company_inventory?.data?.attributes?.Cname || '';
        return `${contactName}/${companyName}`;
      }
      if (col.key === 'quantityUnit') {
        const quantity = row.attributes.quantity || '';
        const unit = row.attributes?.unit?.data?.attributes?.name_unit || '';
        return `${quantity} ${unit}`;
      }
      if (col.key === 'estimatedAge') {
        return `${row.attributes.age_use} ปี`;
      }
      if (col.key === 'actualAge') {
        return calculateAgeDifference(row.attributes.DateRecive);
      }
       // เพิ่มเงื่อนไขสำหรับคอลัมน์ใหม่
      if (col.key === 'disposalDate' || col.key === 'disposalYear' || col.key === 'disposalReason') {
        return col.render(row);
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
          if (col.key === 'responsible') {
            const responsibles = row.attributes.responsibles?.data;
            if (responsibles && responsibles.length > 0) {
              return responsibles.map(resp => resp.attributes.responsibleName).join(', ');
            }
            return '-';
          }
          if (col.key === 'companyContact') {
            const contactName = row.attributes.company_inventory?.data?.attributes?.contactName || '';
            const companyName = row.attributes.company_inventory?.data?.attributes?.Cname || '';
            return `${contactName}/${companyName}`;
          }
          if (col.key === 'quantityUnit') {
            const quantity = row.attributes.quantity || '';
            const unit = row.attributes?.unit?.data?.attributes?.name_unit || '';
            return `${quantity} ${unit}`;
          }
          if (col.key === 'estimatedAge') {
            return `${row.attributes.age_use} ปี`;
          }
          if (col.key === 'actualAge') {
            // ใช้ฟังก์ชันคำนวณอายุแทนการใช้ component โดยตรง
            return calculateAgeDifference(row.attributes.DateRecive);
          }
           // เพิ่มเงื่อนไขสำหรับคอลัมน์ใหม่
          if (col.key === 'disposalDate' || col.key === 'disposalYear' || col.key === 'disposalReason') {
            return col.render(row);
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
const defaultFileName = `รายงานข้อมูลครุภัณฑ์ทุกคอลัมน์ - ${thaiDate}`;
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



  return (
    <>
    
    <div>
        <div className="flex justify-between mr-4">
          <h2 className="ml-4 text-xl font-bold ">
            ค้นพบ {foundDataNumber} รายการ 
            {/* จากทั้งหมด {totalDataNumber} รายการ */}
          </h2>
          
          <Button
  className="bg-gray-400 w-[150px] h-[50px]"
  type="primary"
  onClick={openModal}
>
  <span>
    เลือกข้อมูล
    <br className="hidden md:inline" />
    {selectedItems.length} รายการ
  </span>
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
    <Option value="1">1. นำออกทุกคอลัมน์</Option>
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
  pagination={{
    pageSize: 20,
    total: foundDataNumber,
    current: currentPage,
    onChange: onPageChange,
    showSizeChanger: false, // ปิดการแสดงปุ่มเลือก PageSize
  }}  
  scroll={{ x: 'max-content' }}
  rowKey="id"
  rowSelection={{
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys, selectedRows) => {
      onSelectionChange(selectedRowKeys, selectedRows);
    },
    preserveSelectedRowKeys: true, // เพิ่มบรรทัดนี้
  }}  
  className="w-full overflow-x-auto"
/>  
    
    
    </>
  )
}

export default TableExportFile