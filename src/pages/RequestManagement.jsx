import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { FileOutlined } from "@ant-design/icons"; // Ensure this import is present

const RequestManagement = () => {
  const [showChangeLocation, setShowChangeLocation] = useState(true);
  const [showReturnEquipment, setShowReturnEquipment] = useState(false);
  const [dataChangeLocation, setDataChangeLocation] = useState([]);
  const [dataReturnEquipment, setDataReturnEquipment] = useState([]);

  useEffect(() => {
    const fetchChangeLocationData = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/request-change-locations?populate[inventories][populate]=building&populate=building"
        );
        const result = await response.json();
        const formattedData = result.data
          .filter((item) => !item.attributes.isDone) // filter out items where isDone is true
          .map((item) => {
            const inventoryData = item.attributes.inventories.data.map(
              (inventory) => ({
                key: inventory.id,
                equipmentName: inventory.attributes.name,
                equipmentNumber: inventory.attributes.id_inv,
                oldLocation: {
                  building:
                    inventory.attributes.building?.data?.attributes
                      ?.buildingName || "N/A",
                  floor: inventory.attributes.floor || "N/A",
                  room: inventory.attributes.room || "N/A",
                },
                newLocation: {
                  building:
                    item.attributes.building.data.attributes.buildingName,
                  floor: item.attributes.NewLocationFloor,
                  room: item.attributes.NewLocationRoom,
                },
              })
            );
            return {
              key: item.id,
              date: new Date(item.attributes.createdAt), // ใช้ Date object สำหรับการเรียงลำดับ
              reportedBy: "N/A", // เปลี่ยนตามข้อมูลที่มีใน response
              inventoryData,
              formattedDate: new Date(
                item.attributes.createdAt
              ).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            };
          });

        // เรียงลำดับข้อมูลตามวันที่ล่าสุด
        const sortedData = formattedData.sort((a, b) => b.date - a.date);

        setDataChangeLocation(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("ไม่สามารถดึงข้อมูลได้");
      }
    };

    const fetchReturnEquipmentData = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/request-sent-backs?populate[inventory][populate]=*"
        );
        const result = await response.json();
        const formattedData = result.data
          .filter((item) => !item.attributes.isDone)
          .map((item) => {
            const inventoryData = item.attributes.inventory.data;
            const fileData = item.attributes.FileReasonSentBack?.data?.[0]?.attributes;
            return {
              key: item.id,
              date: new Date(item.attributes.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              reportedBy: item.attributes.reportedBy || "N/A", // เปลี่ยนตามข้อมูลที่มีใน response
              id_backend_inventory: inventoryData.id, // ใช้ id ของ inventory
              equipmentNumber: inventoryData.attributes.id_inv,
              equipmentName: inventoryData.attributes.name,
              returnReason: item.attributes.ReasonSentBack,
              file: fileData ? (
                <a
                  href={`http://localhost:1337${fileData.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  <FileOutlined />
                  <span className='ml-2'>{fileData.name || "ไฟล์"}</span>
                </a>
              ) : "ไม่มีไฟล์",
            };
          });
    
        setDataReturnEquipment(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("ไม่สามารถดึงข้อมูลการส่งคืนครุภัณฑ์ได้");
      }
    };

    fetchChangeLocationData();
    fetchReturnEquipmentData();
  }, []);

  const handleToggleChangeLocation = () => {
    setShowChangeLocation(true);
    setShowReturnEquipment(false);
  };

  const handleToggleReturnEquipment = () => {
    setShowChangeLocation(false);
    setShowReturnEquipment(true);
  };

  const handleApprove = async (key, inventoryData) => {
    try {
      for (const inventory of inventoryData) {
        const formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            building: inventory.newLocation.buildingId,
            floor: inventory.newLocation.floor,
            room: inventory.newLocation.room,
          })
        );

        await fetch(`http://localhost:1337/api/inventories/${inventory.key}`, {
          method: "PUT",
          body: formData,
        });
      }

      const data = {
        data: {
          isDone: true,
        },
      };

      await fetch(`http://localhost:1337/api/request-change-locations/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      message.success(`อนุญาตคำร้องหมายเลข ${key}`);
      window.location.reload();
    } catch (error) {
      console.error("Error approving request:", error);
      message.error("เกิดข้อผิดพลาดในการอนุญาตคำร้อง");
    }
  };

  const handleApproveReturnEquipment = async (key, id_backend_inventory) => {
    try {
      if (!id_backend_inventory) {
        throw new Error('Invalid inventory ID');
      }
  
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          responsible: 1, // ตั้งค่า responsible เป็น 1 หรือค่าที่ต้องการ
        })
      );
  
      await fetch(`http://localhost:1337/api/inventories/${id_backend_inventory}`, {
        method: "PUT",
        body: formData,
      });
  
      const data = {
        data: {
          isDone: true,
        },
      };
  
      await fetch(`http://localhost:1337/api/request-sent-backs/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      message.success(`อนุมัติคำร้องหมายเลข ${key}`);
      window.location.reload();
    } catch (error) {
      console.error("Error approving return equipment request:", error);
      message.error("เกิดข้อผิดพลาดในการอนุมัติคำร้องส่งคืนครุภัณฑ์");
    }
  };

  const handleDisapprove = (key) => {
    message.error(`ไม่อนุญาตคำร้องหมายเลข ${key}`);
  };

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "ชื่อครุภัณฑ์",
        dataIndex: "equipmentName",
        key: "equipmentName",
      },
      {
        title: "หมายเลขครุภัณฑ์",
        dataIndex: "equipmentNumber",
        key: "equipmentNumber",
      },
      {
        title: "ที่ตั้งเดิม",
        children: [
          {
            title: "อาคาร",
            dataIndex: ["oldLocation", "building"],
            key: "oldLocationBuilding",
          },
          {
            title: "ชั้น",
            dataIndex: ["oldLocation", "floor"],
            key: "oldLocationFloor",
          },
          {
            title: "ห้อง",
            dataIndex: ["oldLocation", "room"],
            key: "oldLocationRoom",
          },
        ],
      },
      {
        title: "ที่ตั้งใหม่",
        children: [
          {
            title: "อาคาร",
            dataIndex: ["newLocation", "building"],
            key: "newLocationBuilding",
          },
          {
            title: "ชั้น",
            dataIndex: ["newLocation", "floor"],
            key: "newLocationFloor",
          },
          {
            title: "ห้อง",
            dataIndex: ["newLocation", "room"],
            key: "newLocationRoom",
          },
        ],
      },
    ];
    return (
      <div className="bg-sky-100 px-2 pb-2 rounded">
        <Table
          columns={columns}
          dataSource={record.inventoryData}
          pagination={false}
        />
      </div>
    );
  };

  const columnsChangeLocation = [
    {
      title: "วันที่แจ้ง",
      dataIndex: "formattedDate",
      key: "formattedDate",
    },
    {
      title: "แจ้งโดย",
      dataIndex: "reportedBy",
      key: "reportedBy",
    },
    {
      title: "การกระทำ",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            className="bg-blue-500 text-white"
            onClick={() => handleApprove(record.key, record.inventoryData)}
          >
            เปลี่ยนที่ตั้ง
          </Button>
          {/* <Popconfirm
              title="คุณแน่ใจหรือไม่ที่จะไม่อนุญาตรายการนี้?"
              onConfirm={() => handleDisapprove(record.key)}
            >
              <Button type="danger" className="bg-red-500 text-white">
                ไม่อนุญาต
              </Button>
            </Popconfirm> */}
        </div>
      ),
    },
  ];

  const columnsReturnEquipment = [
    {
      title: "วันที่แจ้ง",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "แจ้งโดย",
      dataIndex: "reportedBy",
      key: "reportedBy",
    },
    {
      title: "หมายเลขครุภัณฑ์",
      dataIndex: "equipmentNumber",
      key: "equipmentNumber",
    },
    {
      title: "ชื่อครุภัณฑ์",
      dataIndex: "equipmentName",
      key: "equipmentName",
    },
    {
      title: "เหตุผลการส่งคืน",
      dataIndex: "returnReason",
      key: "returnReason",
    },
    {
      title: "ไฟล์",
      dataIndex: "file",
      key: "file",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            className="bg-blue-500 text-white"
            onClick={() => handleApproveReturnEquipment(record.key, record.id_backend_inventory)}
          >
            อนุมัติ
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
            onConfirm={() => handleDisapprove(record.key)}
          >
            <Button type="danger" className="bg-red-500 text-white">
              ไม่อนุมัติ
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          className="btn bg-blue-500 mx-2 text-white"
          onClick={handleToggleChangeLocation}
        >
          แสดงคำร้องขอเปลี่ยนที่ตั้ง
        </Button>
        <Button
          type="secondary"
          className="btn bg-blue-500 mx-2 text-white"
          onClick={handleToggleReturnEquipment}
        >
          แสดงคำร้องขอส่งคืนครุภัณฑ์
        </Button>
      </div>

      {showChangeLocation ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">คำร้องขอเปลี่ยนที่ตั้ง</h2>
          {dataChangeLocation.length > 0 ? (
            <Table
              columns={columnsChangeLocation}
              dataSource={dataChangeLocation}
              expandable={{
                expandedRowRender,
                defaultExpandAllRows: true,
              }}
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50 border-2 border-blue-500" : "bg-white"
              }
            />
          ) : (
            <p>ไม่มีข้อมูลคำร้องขอเปลี่ยนที่ตั้ง</p>
          )}
        </div>
      ) : null}

      {showReturnEquipment ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">คำร้องขอส่งคืนครุภัณฑ์</h2>
          {dataReturnEquipment.length > 0 ? (
            <Table
              columns={columnsReturnEquipment}
              dataSource={dataReturnEquipment}
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50 border-2 border-red-500" : "bg-white"
              }
            />
          ) : (
            <p>ไม่มีข้อมูลคำร้องขอส่งคืนครุภัณฑ์</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default RequestManagement;
