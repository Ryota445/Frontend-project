import React, { useState, useEffect } from 'react';
import { Input, Select, Button, DatePicker, Upload ,Image,message  } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import no_image from "../assets/img/Image.png";

const { TextArea } = Input;

function MantenantPage2() {

  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [statusBTN, setStatusBTN] = useState("mantenant");
  const [dataInv, setDataInv] = useState(null);
  const [dataRepairReport, setDataRepairReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('รออนุมัติ');
  const [statusRepair_inventoryOptions, setStatusRepair_inventoryOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [initialStatus, setInitialStatus] = useState("");
  const [statusInventoryId, setStatusInventoryId] = useState(null);
  

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
       // Fetch StatusRepiar
       const statusRepairResponse = await fetch(
        `${API_URL}/api/status-repairs`
      );
      const statusRepairData = await statusRepairResponse.json();
      setStatusRepair_inventoryOptions(
        statusRepairData.data.map((item) => ({
          id: item.id,
          name: item.attributes.nameStatusRepair,
        }))
      );
  
      // Fetch Repair Report data
      const response = await fetch(
        `${API_URL}/api/repair-reports/${id}?populate=*`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error status :${response.status}`);
      }
      const repairReportData = await response.json();
      setDataRepairReport(repairReportData.data);
  
      // Fetch Inventory data
      const inventoryId = repairReportData.data.attributes.inventory.data.id;
      const inventoryResponse = await fetch(
        `${API_URL}/api/inventories/${inventoryId}?populate=*`
      );
      if (!inventoryResponse.ok) {
        throw new Error(`HTTP Error status :${inventoryResponse.status}`);
      }
      const inventoryData = await inventoryResponse.json();
      setDataInv(inventoryData.data);
    } catch (error) {
      console.error("Error Fetching data :", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    setInitialStatus(dataInv?.attributes?.status_repair?.data?.attributes?.id);
    setSelectedStatus(dataInv?.attributes?.status_repair?.data?.attributes?.id);
    setStatusInventoryId(dataInv?.attributes?.status_repair?.data?.attributes?.id);
  }, [dataInv]);
  
  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  if (!dataInv) {
    return <div>Loading data error </div>;
  }


  const handleChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleSave = async (selected) => {
     if(selected==5){
    await putStatusInventory2(id, selected ); // แก้จาก inventoryId เป็น id
  }
    console.log("selected :",selected," selected===5 :",selected==5)
    await putStatusInventory(id, selected ); // แก้จาก inventoryId เป็น id
    await setSelectedStatus(dataInv.attributes.status_repair.data.attributes.id);
 
    // await setSelectedStatus2(dataInv.attributes.status_repair.data.attributes.id);
    // window.location.reload();
  };

  const putStatusInventory = async (inventoryId, newStatusInventoryId) => {
    try {
      const formData = new FormData();
      const dataToUpdate = {
        status_repair: newStatusInventoryId,
        // allowedRepair: false,
      };

     

      formData.append("data", JSON.stringify(dataToUpdate));
      console.log("formData before sent",dataToUpdate )

      const response = await fetch(`${API_URL}/api/inventories/${inventoryId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Response not OK");

      const responseData = await response.json();
      console.log("Response:", responseData);

      await message.success("บันทึกข้อมูลสำเร็จ");

      return responseData;
    } catch (error) {
      console.error("Error:", error);
      await message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      return null;
    }
  };

  const putStatusInventory2 = async (inventoryId, newStatusId) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          // status_repair: newStatusId,
          allowedRepair: false,
        })
      );
  
      const response = await fetch(
        `${API_URL}/api/inventories/${inventoryId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      
  
      if (!response.ok) {
        throw new Error("Response not OK");
      }
  
      const responseData = await response.json();
      console.log("Response:", responseData);
  
      // แสดงข้อความแจ้งเตือน
      // await message.success("บันทึกข้อมูลสำเร็จ");
  
      return responseData;
    } catch (error) {
      console.error("Error:", error);
  
      // แสดงข้อความแจ้งเตือน
      // await message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  
      return null;
    }
  };

  return (

    <>


<div className="p-8">
      <h1 className="text-2xl font-bold mb-8">ซ่อมแซมครุภัณฑ์</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
      <div className=" col-span-6 grid grid-cols-6 gap-1 border-2 border-blue-500 rounded-md p-4 mb-4">
            <div className=" col-span-2 flex justify-center items-center">
              <Image
                src={
                  dataInv?.attributes?.img_inv?.data?.attributes?.url
                    ? `${API_URL}${dataInv.attributes.img_inv.data.attributes.url}`
                    : no_image
                }
                alt="รูปครุภัณฑ์"
                className=" w-[200px] h-[200px]"
              />
            </div>

            <div className=" col-span-4">
              <div className="mt-4">
                {dataInv?.attributes?.name && (
                  <h1 className="text-2xl font-semibold text-blue-600 my-2">
                    {dataInv?.attributes?.name}
                  </h1>
                )}
                <div>
                  <div className="flex flex-row">
                    <h1 className="text-lg text-gray-400 mr-4">
                      หมายเลขครุภัณฑ์
                    </h1>
                    {dataInv?.attributes?.id_inv &&
                    !isNaN(dataInv.attributes.id_inv) ? (
                      <h1 className="text-lg">{dataInv.attributes.id_inv}</h1>
                    ) : (
                      <h1 className="text-lg">-</h1>
                    )}
                    <h1 className="text-lg text-gray-400 mx-4">
                      หมวดหมู่ครุภัณฑ์
                    </h1>{" "}
                    {dataInv?.attributes?.category?.data?.attributes
                      ?.CategoryName ? (
                      <h1 className="text-lg">
                        {
                          dataInv?.attributes?.category?.data?.attributes
                            ?.CategoryName
                        }
                      </h1>
                    ) : (
                      <h1 className="text-lg">-</h1>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-col w-3/4 mt-2 border-2 border-blue-500 rounded-md">
                      <h1 className="text-lg text-gray-400 ">
                        ที่ตั้งครุภัณฑ์
                      </h1>
                      <div className="flex flex-row">
                        <h1 className="text-lg text-gray-400 mr-2 ">อาคาร</h1>{" "}
                        {dataInv?.attributes?.building?.data?.attributes
                          ?.buildingName ? (
                          <h1 className="text-lg">
                            {
                              dataInv?.attributes?.building?.data?.attributes
                                ?.buildingName
                            }
                          </h1>
                        ) : (
                          <h1 className="text-lg">-</h1>
                        )}
                        <h1 className="text-lg text-gray-400 mx-4">ชั้น</h1>{" "}
                        {dataInv?.attributes?.floor ? (
                          <h1 className="text-lg">
                            {dataInv?.attributes?.floor}
                          </h1>
                        ) : (
                          <h1 className="text-lg">-</h1>
                        )}
                        <h1 className="text-lg text-gray-400 mx-4">ห้อง</h1>{" "}
                        {dataInv?.attributes?.room ? (
                          <h1 className="text-lg">
                            {dataInv?.attributes?.room}
                          </h1>
                        ) : (
                          <h1 className="text-lg">-</h1>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row mt-4">
                      <h1 className="text-lg text-gray-400 ">ผู้ดูแล</h1>{" "}
                      {dataInv?.attributes?.responsible?.data?.attributes
                        ?.responsibleName ? (
                        <h1 className="text-lg ml-2">
                          {
                            dataInv?.attributes?.responsible?.data?.attributes
                              ?.responsibleName
                          }
                        </h1>
                      ) : (
                        <h1 className="text-lg">-</h1>
                      )}
                    </div>
                  </div>

                  

                 

                  
                </div>
              </div>
            </div>
          </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">ตัวแทน/บริษัท</label>
          <Select className="w-full" showSearch placeholder="ค้นหาชื่อตัวแทน/บริษัท">
            {/* Add Select options here */}
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">ชื่อการซ่อมแซม</label>
          <Input placeholder="ชื่อการซ่อมแซม" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">รายละเอียดการซ่อมแซม</label>
          <TextArea rows={4} placeholder="รายละเอียดการซ่อมแซม" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">ราคา</label>
          <Input placeholder="ราคา" addonAfter="บาท" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">เอกสาร</label>
          <Upload>
            <Button icon={<UploadOutlined />}>อัพโหลดเอกสาร</Button>
          </Upload>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">สถานะ</label>
          <select
                        className="select select-bordered w-1/3 mr-4"
                        onChange={handleChange}
                        value={selectedStatus}
                      >
                        {statusRepair_inventoryOptions
                          .filter((status) => status.id !== 1) // กรองรายการที่ไม่ต้องการแสดง
                          .map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                      </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">วันที่</label>
          <DatePicker className="w-full" />
        </div>

        <div className="flex justify-end">
        <button
                        className={`font-bold rounded-lg text-sm mt-2 mr-24 w-24 h-8 bg-blue-500  justify-center ${
                          selectedStatus === initialStatus
                            ? "opacity-50 "
                            : "opacity-100"
                        }`}
                        disabled={selectedStatus === initialStatus}
                        onClick={() => handleSave(selectedStatus)}
                      >
                        บันทึก
                      </button>
          <Button type="default">ยกเลิก</Button>
        </div>
      </div>
    </div>
      
        
     </>
  )
}

export default MantenantPage2