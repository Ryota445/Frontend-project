import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { FileOutlined } from "@ant-design/icons"; // Ensure this import is present

const RequestManagement = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showChangeLocation, setShowChangeLocation] = useState(true);
  const [showReturnEquipment, setShowReturnEquipment] = useState(false);
  const [dataChangeLocation, setDataChangeLocation] = useState([]);
  const [dataReturnEquipment, setDataReturnEquipment] = useState([]);

  useEffect(() => {
      const fetchChangeLocationData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/request-change-locations?populate[inventories][populate]=building&populate=building&populate[reportedBy]=*`
        );
        const result = await response.json();
        const formattedData = result.data
          .filter((item) => !item.attributes.isDone)
          .flatMap((item) => 
            item.attributes.inventories.data.map((inventory) => ({
              key: `${item.id}_${inventory.id}`,
              date: new Date(item.attributes.createdAt),
              formattedDate: new Date(item.attributes.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              reportedBy: item?.attributes?.reportedBy?.data?.attributes?.responsibleName || "N/A",
              equipmentName: inventory.attributes.name,
              equipmentNumber: inventory.attributes.id_inv,
              oldLocation: {
                building: item.attributes?.Oldbuilding || "N/A",
                floor: item.attributes.OldLocationFloor || "N/A",
                room: item.attributes.OldLocationRoom || "N/A",
              },
              newLocation: {
                buildingId: item?.attributes?.building?.data?.id,
                building: item.attributes.building.data.attributes.buildingName,
                floor: item.attributes.NewLocationFloor,
                room: item.attributes.NewLocationRoom,
              },
              requestId: item.id,
              inventoryId: inventory.id,
            }))
          );
    
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
          `${API_URL}/api/request-sent-backs?populate[inventory][populate]&populate[reportedBy][populate]&populate[FileReasonSentBack][populate]`
        );
        const result = await response.json();
        const formattedData = result.data
          .filter((item) => !item.attributes.isDone)
          .map((item) => {
            const inventoryData = item.attributes.inventory.data;
            const fileData = item.attributes.FileReasonSentBack?.data?.attributes;
            console.log("item.attributes.FileReasonSentBack",item.attributes.FileReasonSentBack)
            return {
              key: item.id,
              date: new Date(item.attributes.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              reportedBy: item?.attributes?.reportedBy?.data?.attributes?.responsibleName || "N/A", // เปลี่ยนตามข้อมูลที่มีใน response
              id_backend_inventory: inventoryData.id, // ใช้ id ของ inventory
              equipmentNumber: inventoryData.attributes.id_inv,
              equipmentName: inventoryData.attributes.name,
              returnReason: item.attributes.ReasonSentBack,
              file: fileData ? (
                <a
                  href={`${API_URL}${fileData.url}`}
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
      // for (const inventory of inventoryData) {
      //   const formData = new FormData();
      //   formData.append(
      //     "data",
      //     JSON.stringify({
      //       building: inventory.newLocation.buildingId,
      //       floor: inventory.newLocation.floor,
      //       room: inventory.newLocation.room,
      //     })
      //   );

      //   console.log("formData: ",formData)
      //   await fetch(`${API_URL}/api/inventories/${inventory.key}`, {
      //     method: "PUT",
      //     body: formData,
      //   });
      // }

      const data = {
        data: {
          isDone: true,
        },
      };

      await fetch(`${API_URL}/api/request-change-locations/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      message.success(`อนุญาตคำร้องหมายเลข ${key}`);
      setTimeout(() => {
        window.location.reload();
    }, 1000); // หน่วงเวลา 1,000 มิลลิวินาที หรือ 1 วินาที
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
  
      // ดึงข้อมูล request-sent-back
      const requestResponse = await fetch(`${API_URL}/api/request-sent-backs/${key}?populate=reportedBy`);
      const requestData = await requestResponse.json();
      const reportedById = requestData.data.attributes.reportedBy.data.id;
  
      // ดึงข้อมูลครุภัณฑ์ปัจจุบัน
      const inventoryResponse = await fetch(`${API_URL}/api/inventories/${id_backend_inventory}?populate=responsibles`);
      const inventoryData = await inventoryResponse.json();

      // เปลี่ยนผู้รับผิดชอบเป็น 1 เสมอ
      const updatedResponsibles = [1];
      
      // const currentResponsibles = inventoryData.data.attributes.responsibles.data.map(r => r.id);
      // let updatedResponsibles;
      // if (currentResponsibles.length > 1) {
      //   // ถ้ามีผู้ดูแลมากกว่า 1 คน ให้ลบ reportedBy ออกจากรายการ
      //   updatedResponsibles = currentResponsibles.filter(id => id !== reportedById);
      // } else {
      //   // ถ้ามีผู้ดูแลคนเดียว ให้ตั้งค่าเป็น 1
      //   updatedResponsibles = [1];
      // }
  
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          responsibles: updatedResponsibles,
        })
      );
  
      await fetch(`${API_URL}/api/inventories/${id_backend_inventory}`, {
        method: "PUT",
        body: formData,
      });
  
      const data = {
        data: {
          isDone: true,
        },
      };
  
      await fetch(`${API_URL}/api/request-sent-backs/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      message.success(`อนุมัติคำร้องหมายเลข ${key}`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error approving return equipment request:", error);
      message.error("เกิดข้อผิดพลาดในการอนุมัติคำร้องส่งคืนครุภัณฑ์");
    }
  };

  // สำหรับผู้ดูแลคนเดียว ยังไม่ลบเดียวกลับมาดูหากเกิดError
  // const handleApproveReturnEquipment = async (key, id_backend_inventory) => {
  //   try {
  //     if (!id_backend_inventory) {
  //       throw new Error('Invalid inventory ID');
  //     }
  
  //     const formData = new FormData();
  //     formData.append(
  //       "data",
  //       JSON.stringify({
  //         responsible: 1, // ตั้งค่า responsible เป็น 1 หรือค่าที่ต้องการ
  //       })
  //     );
  
  //     await fetch(`${API_URL}/api/inventories/${id_backend_inventory}`, {
  //       method: "PUT",
  //       body: formData,
  //     });
  
  //     const data = {
  //       data: {
  //         isDone: true,
  //       },
  //     };
  
  //     await fetch(`${API_URL}/api/request-sent-backs/${key}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  
  //     message.success(`อนุมัติคำร้องหมายเลข ${key}`);
  //     setTimeout(() => {
  //       window.location.reload();
  //   }, 1000); // หน่วงเวลา 1,000 มิลลิวินาที หรือ 1 วินาที
  //   } catch (error) {
  //     console.error("Error approving return equipment request:", error);
  //     message.error("เกิดข้อผิดพลาดในการอนุมัติคำร้องส่งคืนครุภัณฑ์");
  //   }
  // };




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
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            className="bg-blue-500 text-white"
            onClick={() => handleApprove(record.requestId, [{
              key: record.inventoryId,
              newLocation: record.newLocation,
            }])}
          >
            รับทราบ
          </Button>
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
      ellipsis: true, // เพิ่ม ellipsis ที่นี่เพื่อให้ชื่อไฟล์ยาวเกินไปถูกตัด
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
            รับทราบ
          </Button>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
            onConfirm={() => handleDisapprove(record.key)}
          >
            {/* <Button type="danger" className="bg-red-500 text-white">
              ไม่อนุมัติ
            </Button> */}
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
     <div className='border-b-2 border-black mb-10 flex justify-between items-center'>
 
     <h1 className='text-3xl text-blue-800'>เปลี่ยนที่ตั้ง/ส่งคืนครุภัณฑ์</h1>
      </div>
    
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          className={`text-md text-gray-700 ${showChangeLocation ? 'bg-blue-500 text-white' : 'bg-gray-300'} h-[40px] mx-2`}
          onClick={handleToggleChangeLocation}
        >
          แสดงคำร้องขอเปลี่ยนที่ตั้ง
        </Button>
        <Button
          type="secondary"
          className={`text-md text-gray-700 ${showReturnEquipment ? 'bg-blue-500 text-white' : 'bg-gray-300'} h-[40px] mr-2`}
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
    </>
  );
};

export default RequestManagement;
