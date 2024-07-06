import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  message,
  Input,
  Form,
  Upload,
  Image,
  Button,
  Select,
  Table,
  Space,
  Checkbox,
  DatePicker,
  Radio,
  Modal as AntdModal,
} from "antd"; // แก้ไขส่วน import เพื่อเพิ่ม AntdModal

import {
  SettingOutlined,
  PlusOutlined,
  PrinterOutlined,
  WarningOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import TableDetailMantenant from "../components/TableDetailMantenant";
import TableDetailRepair from "../components/TableDetailRepair";
import Modal from "react-modal";
import ModalDetailCompany from "../components/ModalDetailCompany";
import ModalFeedbackRepair from "../components/ModalFeedbackRepair";
import ModalSentBack from "../components/ModalSentBack";
import DateDifferenceCalculator from "../components/DateDifferenceCalculator"
import ThaiDateFormat from "../components/ThaiDateFormat";
import InventoryMaintenanceHistory from "../components/InventoryMaintenanceHistory "
import no_image from "../assets/img/Image.png";
import { differenceInDays } from 'date-fns';
const { TextArea } = Input;




function UserDetail() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [statusBTN, setStatusBTN] = useState("mantenant");
  const [dataInv, setDataInv] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenMan, setIsModalOpenMan] = useState(false);
  const [repairReason, setRepairReason] = useState("");
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [status_inventoryOptions, setStatus_inventoryOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [initialStatus, setInitialStatus] = useState("");
  const [statusInventoryId, setStatusInventoryId] = useState(null);
  const [allowedRepair, setallowedRepair] = useState(null);
  const [isVisibleModalFeedbackRepair, setIsVisibleModalFeedbackRepair] =
    useState(false);
  const [isVisibleModalSentBack, setIsVisibleModalSentBack] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false); // เพิ่มสถานะสำหรับ Modal เปลี่ยนที่ตั้งครุภัณฑ์
  const [newLocation, setNewLocation] = useState({
    building: "",
    floor: "",
    room: "",
  }); // เพิ่มสถานะสำหรับที่ตั้งใหม่
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [clickedButton, setClickedButton] = useState(""); // Track which button was clicked
  const [clickedButtonM, setClickedButtonM] = useState(""); // Track which button was clicked
  const [selectedSubInventoryId, setSelectedSubInventoryId] = useState(null); // Track selected sub-inventory ID
  const [selectedSubInventoryIdM, setSelectedSubInventoryIdM] = useState(null); // Track selected sub-inventory ID



  const [selectedForm, setSelectedForm] = useState(null);
  const [fileList2, setFileList2] = useState([]);
  const [isNextAppointment, setIsNextAppointment] = useState(false);
  const [isMaintenanceDate, setIsMaintenanceDate] = useState(false);
  const [dateInputType, setDateInputType] = useState(null);
  const [formType, setFormType] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [subInventoriesM, setSubInventoriesM] = useState([]);
  // forModal reportMaintenance

  useEffect(() => {
    async function fetchDataC() {
      try {
    // Fetch companies
    const companyResponse = await fetch("http://localhost:1337/api/company-inventories");
    const companyData = await companyResponse.json();
    setCompanyOptions(companyData.data.map((item) => ({
      id: item.id,
      name: item.attributes.contactName + " / " + item.attributes.Cname + (item?.attributes?.role ? ` (${item.attributes.role})` : ''),
    })));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
fetchDataC();
}, []);
 

  const handleFileChange2 = ({ fileList }) => setFileList2(fileList);

  const handleSaveMaintenance = async (values) => {
    try {
      const formData = new FormData();
      const currentDate = new Date();
      const dateToDo = values.dateToDo ? new Date(values.dateToDo) : currentDate;
  
      let newDueDate = null;
      if (values.newDueDateType === 'formInput' && values.formInputDate) {
        // คำนวณวันที่จากจำนวนวันที่ใส่
        newDueDate = new Date(dateToDo.getTime() + parseInt(values.formInputDate) * 24 * 60 * 60 * 1000);
      } else if (values.newDueDateType === 'datePicker' && values.datePickerDate) {
        newDueDate = new Date(values.datePickerDate);
      }
      
  
      const maintenanceData = {
        inventory: id,
        isSubInventory: clickedButtonM === "sub",
        sub_inventory: clickedButtonM === "sub" ? selectedSubInventoryIdM : null,
        isDone: true,
        company_inventory: values.companyInventory,
        NameMaintenance: values.nameMaintenance,
        DetailMaintenance: values.detailMaintenance,
        prize: values.prize,
        DateToDo: dateToDo.toISOString(),
        newDueDate: newDueDate ? newDueDate.toISOString() : null,
      };
  
      formData.append("data", JSON.stringify(maintenanceData));
  
      fileList2.forEach(file => {
        formData.append('files.FileMaintenanceByAdmin', file.originFileObj);
      });
  
      const response = await fetch(`http://localhost:1337/api/maintenance-reports`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Response not OK: ${response.status}`);
      }
  
      // สร้างการนัดหมายใหม่ถ้ามี newDueDate
      if (newDueDate) {
        const appointmentData = {
          inventory: id,
          isSubInventory: clickedButtonM === "sub",
          sub_inventory: clickedButtonM === "sub" ? selectedSubInventoryIdM : null,
          isDone: false,
          DetailMaintenance: values.detailMaintenance,
          DueDate: newDueDate.toISOString(),
        };
  
        const appointmentResponse = await fetch(`http://localhost:1337/api/maintenance-reports`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: appointmentData }),
        });
  
        if (!appointmentResponse.ok) {
          throw new Error(`Appointment creation failed: ${appointmentResponse.status}`);
        }
      }
  
      message.success("เพิ่มข้อมูลบำรุงรักษาสำเร็จแล้ว");
      closeModalMan();
      // window.location.reload();
    } catch (error) {
      message.error(`เกิดข้อผิดพลาดในเพิ่มข้อมูลบำรุงรักษา: ${error.message}`);
    }
  };


  const handleAddAppointment = async (values) => {
    try {
      const currentDate = new Date();
  
      let dueDate = null;
      if (values.newDueDateType === 'formInput' && values.formInputDate) {
        // คำนวณวันที่จากจำนวนวันที่ใส่
        dueDate = new Date(currentDate.getTime() + parseInt(values.formInputDate) * 24 * 60 * 60 * 1000);
      } else if (values.newDueDateType === 'datePicker' && values.datePickerDate) {
        dueDate = new Date(values.datePickerDate);
      }
  
      if (!dueDate) {
        throw new Error('กรุณาระบุวันนัดหมาย');
      }
  
      const appointmentData = {
        inventory: id,
        isSubInventory: clickedButtonM === "sub",
        sub_inventory: clickedButtonM === "sub" ? selectedSubInventoryIdM : null,
        isDone: false,
        DetailMaintenance: values.DetailMaintenance,
        DueDate: dueDate.toISOString(),
      };
  
      const response = await fetch(`http://localhost:1337/api/maintenance-reports`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: appointmentData }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Response not OK: ${response.status} - ${errorData.error.message}`);
      }
  
      message.success("เพิ่มนัดหมายบำรุงรักษาสำเร็จแล้ว");
      closeModalMan();
      // window.location.reload();
    } catch (error) {
      message.error(`เกิดข้อผิดพลาดในเพิ่มนัดหมายบำรุงรักษา: ${error.message}`);
    }
  };

  // forModal change location
  const openModal2 = () => {
    setIsModalVisible2(true);
  };

  const closeModal2 = () => {
    setIsModalVisible2(false);
  };
  

  const handleLocationInputChange = (field, value) => {
    setNewLocation((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleLocationChange = async () => {
    const data = {
      data: {
        NewLocationRoom: newLocation.room,
        NewLocationFloor: newLocation.floor,
        building: newLocation.building,
        inventories: id,
        isDone: false,
      },
    };

    try {
      const response = await fetch(
        "http://localhost:1337/api/request-change-locations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("ไม่สามารถเปลี่ยนที่ตั้งได้");

      const responseData = await response.json();
      console.log("Change Location Success:", responseData);
      message.success("เปลี่ยนที่ตั้งสำเร็จ");
    } catch (error) {
      console.error("Error:", error);
      message.error("เกิดข้อผิดพลาดในการเปลี่ยนที่ตั้ง");
    }
  };

  // forModal FeedbackRepair
  const openModalSentBack = () => {
    setIsVisibleModalSentBack(true);
  };

  const closeModalSentBack = () => {
    setIsVisibleModalSentBack(false);
  };

  // forModal FeedbackRepair
  const openModalFeedbackRepair = () => {
    setIsVisibleModalFeedbackRepair(true);
  };

  const closeModalFeedbackRepair = () => {
    setIsVisibleModalFeedbackRepair(false);
  };

  // forModal Company
  const [isVisible, setIsVisible] = useState(false);
  const openModalCompany = () => {
    setIsVisible(true);
  };

  const closeModalCompany = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch staustInventory
      const statusInventoryResponse = await fetch(
        "http://localhost:1337/api/status-inventories"
      );
      const statusInventoryData = await statusInventoryResponse.json();
      setStatus_inventoryOptions(
        statusInventoryData.data.map((item) => ({
          id: item.id,
          name: item.attributes.StatusInventoryName,
        }))
      );
      //  Fetch buildOptions
      const buildingResponse = await fetch(
        "http://localhost:1337/api/buildings"
      );
      const buildingData = await buildingResponse.json();
      setBuildingOptions(
        buildingData.data.map((item) => ({
          id: item.id,
          name: item.attributes.buildingName,
        }))
      );

      const response = await fetch(
        `http://localhost:1337/api/inventories/${id}?populate=*`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error status :${response.status}`);
      }
      const dataA = await response.json();
      setDataInv(dataA.data);
      console.log("dataInv?.attributes?.DateReceive:",dataInv?.attributes?.DateReceive)

     
      // Check and fetch subInventories if they exist
      const subInventoriesData = dataA?.data?.attributes?.sub_inventories?.data;
      if (subInventoriesData && subInventoriesData.length > 0) {
        const subInventoryIds = subInventoriesData.map(sub => sub.id);
        fetchSubInventoriesM(subInventoryIds);
      } else {
        console.log('No sub-inventories found');
      }

    } catch (error) {
      console.error("Error Fetching data :", error);
    } finally {
      setIsLoading(false);

    }
  };


  const fetchSubInventoriesM = async (ids) => {
    try {
      const promises = ids.map(id => fetch(`http://localhost:1337/api/sub-inventories/${id}?populate=*`).then(res => res.json()));
      const results = await Promise.all(promises);
      setSubInventoriesM(results.map(result => result.data));
    } catch (error) {
      console.error('Error fetching sub-inventories:', error);
    }
  };

  useEffect(() => {
    setInitialStatus(dataInv?.attributes?.status_inventory?.data?.id);
    setSelectedStatus(dataInv?.attributes?.status_inventory?.data?.id);
    setStatusInventoryId(dataInv?.attributes?.status_inventory?.data?.id);
    setallowedRepair(dataInv?.attributes?.allowedRepair);
  }, [dataInv]);

  const handleChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleSave = async (selected) => {
    await putStatusInventory(id, selected); // แก้จาก inventoryId เป็น id
    await setSelectedStatus(
      dataInv.attributes.status_inventory.data.attributes.id
    );
    window.location.reload();
  };
  const putStatusInventory = async (inventoryId, newStatusInventoryId) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          status_inventory: newStatusInventoryId,
        })
      );

      const response = await fetch(
        `http://localhost:1337/api/inventories/${inventoryId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Response not OK");

      const responseData = await response.json();
      console.log("Response:", responseData);

      // ย้ายข้อความแจ้งเตือนไปที่นี่
      await message.success("บันทึกข้อมูลสำเร็จ");

      return responseData; // คืนค่า response data
    } catch (error) {
      console.error("Error:", error);

      // ย้ายข้อความแจ้งเตือนไปที่นี่
      await message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");

      return null; // คืนค่า null ในกรณีมีข้อผิดพลาด
    }
  };

  const onFinish = async (values) => {
    try {
      // เตรียมข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          inventory: id,
          RepairReasonByResponsible: values.repairReason,
          status_repair: 1,
          isDone: false,
          isSubInventory: clickedButton === "sub", // Check which button was clicked
          sub_inventory:
            clickedButton === "sub" ? selectedSubInventoryId : null, // Include sub-inventory ID if applicable
        })
      );
      if (values.file_repair) {
        // กรณีมีการอัปโหลดไฟล์
        formData.append(
          "files.ReportFileByResponsible",
          values.file_repair[0].originFileObj
        );
      }

      // ส่งข้อมูลไปยังเซิร์ฟเวอร์
      const response = await fetch(`http://localhost:1337/api/repair-reports`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `Response not OK: ${response.status} - ${errorResponse.message}`
        );
      }

      // แสดงข้อความแจ้งเตือนว่าซ่อมแซมสำเร็จ
      await message.success("แจ้งซ่อมสำเร็จแล้ว");

      // ปิด Modal
      await closeModal();

      // รีโหลดหน้าเพื่อให้แสดงข้อมูลที่อัปเดตแล้ว
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);

      // แสดงข้อความแจ้งเตือนว่าเกิดข้อผิดพลาดในการแจ้งซ่อม
      message.error(`เกิดข้อผิดพลาดในการแจ้งซ่อม: ${error.message}`);
    }
  };

  const openModalMan = (buttonType, subInventoryId = null) => {
    setClickedButtonM(buttonType); // Set the clicked button type
    setSelectedSubInventoryIdM(subInventoryId); // Set the selected sub-inventory ID
    setIsModalOpenMan(true);
    
  };

  const closeModalMan = () => { 
    setIsModalOpenMan(false);
    setRepairReason("");
    setFileList([]);
    
  };



  const onFinishSentBack = async (values) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          ReasonSentBack: values.repairReason, // เปลี่ยนจาก RepairReasonByResponsible เป็น ReasonSentBack
          inventory: id,
          isDone: false,
        })
      );
      if (values.file_repair) {
        formData.append(
          "files.FileReasonSentBack", // เปลี่ยนจาก ReportFileByResponsible เป็น FileReasonSentBack
          values.file_repair[0].originFileObj
        );
      }

      const response = await fetch(
        `http://localhost:1337/api/request-sent-backs`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `Response not OK: ${response.status} - ${errorResponse.message}`
        );
      }

      await message.success("แจ้งส่งคืนสำเร็จแล้ว");
      await closeModalSentBack();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      message.error(`เกิดข้อผิดพลาดในการแจ้งส่งคืน: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  if (!dataInv) {
    return <div>Loading data error </div>;
  }

  const handelMantenantBTN = () => {
    setStatusBTN("mantenant");
  };

  const handelRepairBTN = () => {
    setStatusBTN("repair");
  };

  const openModal = (buttonType, subInventoryId = null) => {
  setClickedButton(buttonType); // Set the clicked button type
  setSelectedSubInventoryId(subInventoryId); // Set the selected sub-inventory ID
  setIsModalOpen(true);
 
};

  const closeModal = () => {
    setIsModalOpen(false);
    setRepairReason("");
    setFileList([]);
  };
  const handleRepairReasonChange = (e) => {
    setRepairReason(e.target.value);
  };

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFile(selectedFile);
  // };
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };




  // ตรวจสอบข้อมูล
  const subInventories = dataInv?.attributes?.sub_inventories?.data;

  return (
    <>
      <div className="w-full ">
        <div className="flex  justify-between ">
          <h1 className="text-4xl font-semibold">รายละเอียดครุภัณฑ์</h1>
          <button
            onClick={openModalSentBack}
            className="font-bold rounded text-sm mt-2 w-40 h-10 bg-red-500 text-white"
          >
            <WarningOutlined /> แจ้งส่งคืนครุภัณฑ์นี้
          </button>
        </div>

        <div className=" w-full h-[300px] mt-5 grid grid-cols-8 ">
          <div></div>

          <div className=" col-span-6 grid grid-cols-6 gap-1 border-2 border-blue-500 rounded-md">
            <div className=" col-span-2 flex justify-center items-center">
              <Image
                src={
                  dataInv?.attributes?.img_inv?.data?.attributes?.url
                    ? `http://localhost:1337${dataInv.attributes.img_inv.data.attributes.url}`
                    : no_image
                }
                alt="รูปครุภัณฑ์"
                className=" w-[250px] h-[250px]"
              />
            </div>

            <div className=" col-span-4">
              <div className="mt-4 ">
                <div className="flex flex-row justify-between"> 
                <div>
                {dataInv?.attributes?.name && (
                  <h1 className="text-2xl font-semibold text-blue-600 my-2">
                    {dataInv?.attributes?.name}
                  </h1>
                )}
</div>
<div className="flex justify-self-end ">
                      <button
                        className=" my-2 mx-2 font-bold rounded text-base w-48 h-12 bg-[#4de83f] text-[#ffffff] justify-center"
                        onClick={() => openModalMan("main")}
                      >
                        <SafetyOutlined className="text-xl " /> บำรุงรักษา<span className="flex justify-center">(ครุภัณฑ์หลัก)</span> 
                      </button>
                    </div>
                    </div>
                <div>
                  <div className="flex flex-row">
                    <h1 className="text-lg text-gray-400 mr-4">
                      หมายเลขครุภัณฑ์
                    </h1>
                    {dataInv?.attributes?.id_inv !== null &&
                    dataInv?.attributes?.id_inv !== undefined ? (
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
                        <Button
                          className="w-2/5  m-2 bg-blue-400 text-white"
                          onClick={() => openModal2()}
                        >
                          เปลี่ยนที่ตั้ง
                        </Button>
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

                  {allowedRepair ? (
                    <div className="mt-4 flex flex-row">
                      <h1 className="text-lg text-gray-400 mr-4 mt-2">
                        สถานะครุภัณฑ์
                      </h1>

                      <select
                        className="select select-bordered w-1/3 mr-4"
                        onChange={handleChange}
                        value={selectedStatus}
                      >
                        {status_inventoryOptions
                          .filter((status) => status.id !== 4) // กรองรายการที่ไม่ต้องการแสดง
                          .map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                      </select>

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
                    </div>
                  ) : (
                    <div>
                      <p className="my-2 text-lg  text-red-500">
                        <a
                          onClick={(e) => {
                            e.preventDefault;
                            openModalFeedbackRepair();
                          }}
                        >
                          ***ครุภัณฑ์นี้ไม่ได้รับอนุมัติการซ่อมเนื่องจาก...***
                          :คลิกเพื่ออ่าน
                        </a>
                      </p>
                      <p className="my-2 text-lg  text-red-500">
                        โปรดทำเรื่องส่งคืนครุภัณฑ์
                      </p>
                    </div>
                  )}


                  <div className="flex flex-row justify-center mr-36  ">
                  {statusInventoryId === 2 && allowedRepair && (
                    <div className="flex  ">
                      <button
                        className="  mt-5 font-bold rounded-lg text-base w-36 h-10 bg-[#276ff4] text-[#ffffff] justify-center"
                        onClick={() => openModal("main")}
                      >
                        แจ้งซ่อม <SettingOutlined />
                      </button>
                    </div>
                  )}

                   
                    </div>


                  <div className="flex flex-row mt-4">
                    {/* Render the modal */}
                    {/* ModalChange Location */}
                    <AntdModal
                      title="เปลี่ยนที่ตั้งครุภัณฑ์"
                      visible={isModalVisible2}
                      onCancel={closeModal2}
                      footer={[
                        <Button key="cancel" onClick={closeModal2}>
                          ยกเลิก
                        </Button>,
                        <Button
                          key="submit"
                          type="primary"
                          onClick={handleLocationChange}
                        >
                          ยืนยัน
                        </Button>,
                      ]}
                    >
                      <Form>
                        <h2 className="text-lg font-bold">ที่ตั้งใหม่</h2>
                        <Form.Item label="อาคาร">
                          <Select
                            placeholder="อาคาร"
                            onChange={(value) =>
                              handleLocationInputChange("building", value)
                            }
                          >
                            {buildingOptions.map((building) => (
                              <Option key={building.id} value={building.id}>
                                {building.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item label="ชั้น">
                          <Input
                            value={newLocation.floor}
                            onChange={(e) =>
                              handleLocationInputChange("floor", e.target.value)
                            }
                          />
                        </Form.Item>
                        <Form.Item label="ห้อง">
                          <Input
                            value={newLocation.room}
                            onChange={(e) =>
                              handleLocationInputChange("room", e.target.value)
                            }
                          />
                        </Form.Item>
                      </Form>
                    </AntdModal>

                    {/* Modal sentback */}
                    {/* Modal sentback */}
                    <ModalSentBack
                      isVisible={isVisibleModalSentBack}
                      onClose={closeModalSentBack}
                    >
                      <h2 className="text-lg font-bold mb-4">
                        แจ้งส่งคืนครุภัณฑ์
                      </h2>
                      <Form
                        form={form}
                        name="sentback-form" // เปลี่ยนชื่อฟอร์มเป็น sentback-form
                        onFinish={onFinishSentBack} // ใช้ฟังก์ชันใหม่
                        layout="vertical"
                        className="m-4"
                      >
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            เหตุผลในการแจ้งส่งคืนครุภัณฑ์:
                          </label>
                          <Form.Item
                            name="repairReason"
                            rules={[
                              {
                                required: true,
                                message:
                                  "กรุณาระบุเหตุผลในการแจ้งส่งคืนครุภัณฑ์",
                              },
                            ]}
                          >
                            <TextArea rows={4} />
                          </Form.Item>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            อัปโหลดไฟล์ (ถ้ามี)
                          </label>
                          <Form.Item
                            name="file_repair"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[
                              {
                                validator: (rule, value) =>
                                  value && value.length === 1
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        "กรุณาอัปโหลดไฟล์เพียงหนึ่งไฟล์เท่านั้น"
                                      ),
                              },
                            ]}
                          >
                            <Upload
                              name="file_repair" // ใช้ชื่อเหมือนกับใน Modal แจ้งซ่อม
                              listType="picture-card"
                              beforeUpload={() => false}
                              onChange={handleFileChange}
                            >
                              <button
                                style={{ border: 0, background: "none" }}
                                type="button"
                              >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>เพิ่มไฟล์</div>
                              </button>
                            </Upload>
                          </Form.Item>
                          <p className="text-red-500">***กรุณาอัปโหลดไฟล์เพียงหนึ่งไฟล์เท่านั้น***</p>
                        </div>
                        <div className="flex justify-end">
                          <Form.Item>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                              htmlType="submit"
                            >
                              ยืนยัน
                            </button>
                          </Form.Item>
                          <Form.Item>
                            <button
                              onClick={closeModalSentBack}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                              ยกเลิก
                            </button>
                          </Form.Item>
                        </div>
                      </Form>
                    </ModalSentBack>

                    {/* Modal Feedback */}
                    <ModalFeedbackRepair
                      isVisible={isVisibleModalFeedbackRepair}
                      onClose={closeModalFeedbackRepair}
                    >
                      {/* content สำหรับFeedbackrepair  */}
                      <div className="h-[500px]"></div>
                    </ModalFeedbackRepair>
                    <Modal
                      isOpen={isModalOpen}
                      onRequestClose={closeModal}
                      contentLabel="แจ้งซ่อม"
                    >
                      <h2 className="text-lg font-bold mb-4">แจ้งซ่อม</h2>
                      <Form
                        form={form}
                        name="equipment-form"
                        onFinish={onFinish}
                        layout="vertical"
                        className="m-4"
                      >
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            เหตุผลในการแจ้งซ่อม:
                          </label>
                          <Form.Item
                            name="repairReason"
                            rules={[
                              {
                                required: true,
                                message: "กรุณาระบุเหตุผลในการแจ้งซ่อม",
                              },
                            ]}
                          >
                            <TextArea rows={4} />
                          </Form.Item>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            อัปโหลดไฟล์
                          </label>
                          <Form.Item
                            name="file_repair"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[
                              {
                                validator: (rule, value) =>
                                  value && value.length === 1
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        "กรุณาอัปโหลดไฟล์เพียงหนึ่งไฟล์เท่านั้น"
                                      ),
                              },
                            ]}
                          >
                            <Upload
                              name="file_repair"
                              listType="picture-card"
                              beforeUpload={() => false}
                              onChange={handleFileChange}
                            >
                              <button
                                style={{ border: 0, background: "none" }}
                                type="button"
                              >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>เพิ่มไฟล์</div>
                              </button>
                            </Upload>
                          </Form.Item>
                          <p className="text-red-500">***กรุณาอัปโหลดไฟล์เพียงหนึ่งไฟล์เท่านั้น***</p>
                        </div>
                        <div className="flex justify-end">
                          <Form.Item>
                            <button
                              className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                              htmlType="submit"
                            >
                              ยืนยัน
                            </button>
                          </Form.Item>
                          <Form.Item>
                            <button
                              onClick={closeModal}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                              ยกเลิก
                            </button>
                          </Form.Item>
                        </div>
                      </Form>
                    </Modal>


                    {/* modal addMantenant */}
                    <Modal
      isOpen={isModalOpenMan}
      onRequestClose={closeModalMan}
      contentLabel="เพิ่มข้อมูลบำรุงรักษา"
    >
      <h2 className="text-lg font-bold mb-4">เพิ่มข้อมูลบำรุงรักษา</h2>

     
       <div className="mb-4">
        <Button onClick={() => setFormType('saveMaintenance')} className={formType === 'saveMaintenance' ? 'btn-primary text-blue-500' : 'default'}>
          บันทึกข้อมูลบำรุงรักษา
        </Button>
        <Button onClick={() => setFormType('addAppointment')} className={formType === 'addAppointment' ? 'btn-primary text-blue-500' : 'default'}>
          เพิ่มนัดหมายบำรุ่งรักษา
        </Button>
      </div>

      {formType === 'saveMaintenance' && (
  <Form
    form={form}
    name="maintenance-form"
    layout="vertical"
    className="m-4"
    onFinish={handleSaveMaintenance}
  >
    <Form.Item
      name="companyInventory"
      label="ตัวแทน/บริษัท"
      rules={[{ required: true, message: "กรุณาเลือกบริษัท" }]}
    >
             <Select
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="ค้นหาชื่อตัวแทน/บริษัท"
            optionFilterProp="children"
            showSearch
            onSearch={setSearchValue}
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value);
            }}
          >
            {companyOptions.map((company) => (
              <Option key={company.id} value={company.id}>
                {company.name}
              </Option>
            ))}
          </Select>
          </Form.Item>

          <Form.Item
      name="nameMaintenance"
      label="ชื่อการบำรุงรักษา"
      rules={[{ required: false, message: "กรุณากรอกชื่อการบำรุงรักษา" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="detailMaintenance"
      label="รายละเอียดการบำรุงรักษา"
      rules={[{ required: true, message: "กรุณากรอกรายละเอียดการบำรุงรักษา" }]}
    >
      <Input.TextArea rows={4} />
    </Form.Item>

    <Form.Item
      name="prize"
      label="ค่าใช้จ่าย (บาท)"
      rules={[{ required: true, message: "กรุณากรอกค่าใช้จ่าย" }]}
    >
      <Input addonAfter="บาท" />
    </Form.Item>

    <Form.Item
      name="fileMaintenanceByAdmin"
      label="ไฟล์"
      valuePropName="fileList"
      getValueFromEvent={e => (Array.isArray(e) ? e : e.fileList)}
    >
      <Upload
        name="fileMaintenanceByAdmin"
        listType="picture"
        beforeUpload={() => false}
        onChange={handleFileChange2}
      >
        <Button icon={<PlusOutlined />}>อัปโหลดไฟล์</Button>
      </Upload>
    </Form.Item>

    <Form.Item name="maintenanceDateCheckbox" valuePropName="checked">
      <Checkbox onChange={(e) => setIsMaintenanceDate(e.target.checked)}>ต้องการกำหนดวันที่ทำการบำรุงรักษา</Checkbox>
    </Form.Item>

    {isMaintenanceDate && (
      <Form.Item name="dateToDo" label="วันที่บำรุงรักษา">
        <DatePicker />
      </Form.Item>
    )}

    {/* <Form.Item name="nextAppointmentCheckbox" valuePropName="checked">
      <Checkbox onChange={(e) => setIsNextAppointment(e.target.checked)}>มีนัดหมายบำรุงรักษารอบถัดไป</Checkbox>
    </Form.Item>


          {isMaintenanceDate && (
            <Form.Item name="dateToDo" label="วันที่บำรุงรักษา">
              <DatePicker />
            </Form.Item>
          )} */}

          <Form.Item name="nextAppointmentCheckbox" valuePropName="checked">
            <Checkbox onChange={(e) => setIsNextAppointment(e.target.checked)}>มีนัดหมายบำรุงรักษารอบถัดไป</Checkbox>
          </Form.Item>

          {isNextAppointment && (
  <>
    <Form.Item name="newDueDateType" label="วันบำรุงรักษารอบถัดไป">
      <Radio.Group onChange={(e) => setDateInputType(e.target.value)}>
        <Radio value="formInput">กรอกจำนวนวันในการบำรุงรักษารอบถัดไป (วัน)</Radio>
        <Radio value="datePicker">เลือกวันที่</Radio>
      </Radio.Group>
    </Form.Item>

    {dateInputType === 'formInput' && (
      <Form.Item name="formInputDate" label="กรอกจำนวนวันในการบำรุงรักษารอบถัดไป (วัน)">
        <Input placeholder="ใส่จำนวนวัน" />
      </Form.Item>
    )}

    {dateInputType === 'datePicker' && (
      <Form.Item name="datePickerDate" label="เลือกวันที่">
        <DatePicker />
      </Form.Item>
    )}
  </>
)}

          <div className="flex justify-end">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                ยืนยัน
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={closeModalMan}>
                ยกเลิก
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}

{formType === 'addAppointment' && (
    <Form
    form={form}
    name="appointment-form"
    layout="vertical"
    className="m-4"
    onFinish={handleAddAppointment}
  >
    <Form.Item
      name="DetailMaintenance"
      label="รายละเอียดการบำรุงรักษา"
      rules={[{ required: true, message: "กรุณากรอกรายละเอียดการบำรุงรักษา" }]}
    >
      <Input.TextArea rows={4} />
    </Form.Item>

    <Form.Item name="newDueDateType" label="นัดหมายรอบถัดไป" rules={[{ required: true, message: "กรุณาเลือกวิธีกำหนดวันนัดหมาย" }]}>
      <Radio.Group onChange={(e) => setDateInputType(e.target.value)}>
        <Radio value="formInput">กรอกจำนวนวันในการบำรุงรักษารอบถัดไป (วัน)</Radio>
        <Radio value="datePicker">เลือกวันที่</Radio>
      </Radio.Group>
    </Form.Item>

    {dateInputType === 'formInput' && (
      <Form.Item name="formInputDate" label="กรอกจำนวนวันในการบำรุงรักษารอบถัดไป (วัน)" rules={[{ required: true, message: "กรุณากรอกจำนวนวัน" }]}>
        <Input placeholder="ใส่จำนวนวัน" type="number" />
      </Form.Item>
    )}

    {dateInputType === 'datePicker' && (
      <Form.Item name="datePickerDate" label="เลือกวันที่" rules={[{ required: true, message: "กรุณาเลือกวันที่" }]}>
        <DatePicker />
      </Form.Item>
    )}

          <div className="flex justify-end">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                ยืนยัน
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={closeModalMan}>
                ยกเลิก
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}
    </Modal>



                  </div>
                </div>
              </div>
            </div>
          </div>

          <div></div>
        </div>

        <div className=" w-full h-[300px] mt-10 grid grid-cols-8 ">
          <div className=""></div>

          <div className="mt-8 col-span-6 border-2 border-blue-500 rounded-md">
            <div className="border-b-2 m-4 ">
              <h1 className="text-xl font-thin text-blue-800 ">วิธีได้มา</h1>
            </div>

            <div className="grid grid-cols-2">
              <div className="flex flex-col ml-8">
                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">วิธีได้มา</h1>
                  {dataInv?.attributes?.how_to_get?.data?.attributes
                    ?.howToGetName ? (
                    <h1 className="text-lg">
                      {
                        dataInv?.attributes?.how_to_get?.data?.attributes
                          ?.howToGetName
                      }
                    </h1>
                  ) : (
                    <h1 className="text-lg">-</h1>
                  )}
                </div>
                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">ปีงบประมาณ</h1>
                  {dataInv?.attributes?.year_money_get?.data?.attributes
                    ?.yearMoneyGetName ? (
                    <h1 className="text-lg">
                      {
                        dataInv?.attributes?.year_money_get?.data?.attributes
                          ?.yearMoneyGetName
                      }
                    </h1>
                  ) : (
                    <h1 className="text-lg">-</h1>
                  )}
                </div>

                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">ตัวแทนบริษัท</h1>
                  {dataInv?.attributes?.company_inventory?.data?.attributes
                    ?.contactName ? (
                    <h1 className="text-lg">
                      {" "}
                      <a
                        onClick={(e) => {
                          event.preventDefault();
                          openModalCompany();
                        }}
                      >
                        {
                          dataInv.attributes?.company_inventory?.data
                            ?.attributes?.contactName
                        }{" "}
                        {
                          dataInv.attributes.company_inventory.data?.attributes
                            ?.Cname
                        }
                      </a>{" "}
                    </h1>
                  ) : (
                    <h1 className="text-lg">-</h1>
                  )}
                  <ModalDetailCompany
                    isVisible={isVisible}
                    onClose={closeModalCompany}
                  >
                    <h2 className="text-lg font-bold mb-4">ข้อมูลบริษัท</h2>
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center">
                        <div className="flex flex-row">
                          <p className="text-lg font-nomal mb-4">
                            ชื่อผู้ติดต่อ:
                          </p>{" "}
                          {dataInv?.attributes?.company_inventory?.data
                            ?.attributes?.contactName ? (
                            <p className="text-lg ml-2">
                              {" "}
                              {
                                dataInv?.attributes?.company_inventory?.data
                                  ?.attributes?.contactName
                              }{" "}
                            </p>
                          ) : (
                            <p className="text-lg ml-2">-</p>
                          )}
                        </div>

                        <div className="flex flex-row">
                          <p className="text-lg font-nomal mb-4">ชื่อบริษัท:</p>{" "}
                          {dataInv?.attributes?.company_inventory?.data
                            ?.attributes?.Cname ? (
                            <p className="text-lg ml-2">
                              {" "}
                              {
                                dataInv?.attributes?.company_inventory.data
                                  ?.attributes?.Cname
                              }{" "}
                            </p>
                          ) : (
                            <p className="text-lg ml-2">-</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeModalCompany}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Close Modal
                    </button>
                  </ModalDetailCompany>
                </div>
              </div>
              <div className="flex flex-col ">
                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">วันที่สั่งซื้อ</h1>
                  {dataInv?.attributes?.DateOrder ? (
                    <h1 className="text-lg">
                      <ThaiDateFormat
                        dateString={dataInv?.attributes?.DateOrder}
                      />
                    </h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>
                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">
                    วันที่ตรวจรับ/วันที่รับโอน
                  </h1>
                  {dataInv?.attributes?.DateRecive ? (
                    <h1 className="text-lg">
                      <ThaiDateFormat
                        dateString={dataInv?.attributes?.DateRecive}
                      />
                    </h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b-2 m-4 ">
              <h1 className="text-xl font-thin text-blue-800 ">
                รายละเอียดครุภัณฑ์
              </h1>
            </div>

            <div className="grid grid-cols-2">
              <div className="flex flex-col ml-8">
                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">หมายเลข SN</h1>
                  {dataInv?.attributes?.serialNumber ? (
                    <h1 className="text-lg">
                      {dataInv?.attributes?.serialNumber}
                    </h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>
                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">ยี่ห้อ</h1>
                  {dataInv?.attributes?.brand ? (
                    <h1 className="text-lg">{dataInv?.attributes?.brand}</h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>

                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">รุ่น</h1>
                  {dataInv?.attributes?.model ? (
                    <h1 className="text-lg">{dataInv?.attributes?.model}</h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>

                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">ราคาที่ซื้อ </h1>

                  {dataInv?.attributes?.prize ? (
                    <h1 className="text-lg">
                      {dataInv?.attributes?.prize} บาท
                    </h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col ">
                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">
                    อายุการใช้งานโดยประเมิน
                  </h1>

                  {dataInv?.attributes?.age_use ? (
                    <h1 className="text-lg">
                      {dataInv?.attributes?.age_use} ปี
                    </h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>

                <div className="flex flex-row my-2">
                <h1 className="text-lg text-gray-400 mr-4">อายุการใช้งานจริง</h1>

                  {dataInv?.attributes?.DateRecive ? (
                    <h1 className="text-lg">
                      
                     <DateDifferenceCalculator dateReceive={dataInv?.attributes?.DateRecive} />
                    </h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>
        
           
          


                <div className="flex flex-row my-2">
                  <h1 className="text-lg text-gray-400 mr-4">
                    รายละเอียดเพิ่มเติม
                  </h1>

                  {dataInv?.attributes?.information ? (
                    <h1 className="text-lg">
                      {dataInv?.attributes?.information}
                    </h1>
                  ) : (
                    <p className="text-lg ml-2">-</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=""></div>
        </div>

        <div className="w-full h-[150px]"></div>
      </div>
      {/* subset */}
      <div className=" w-full h-[100px] mt-10 grid grid-cols-8 ">
        <div className=""></div>
        <div className="col-span-6 border-2 border-blue-500 rounded-md">
          <div className="border-b-2 m-4 ">
            <h1 className="text-xl font-thin text-blue-800 ">
              ข้อมูลครุภัณฑ์ภายในชุด
            </h1>
          </div>

          {/* แสดงรายละเอียดครุภัณฑ์ */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    หมายเลขครุภัณฑ์
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ชื่อครุภัณฑ์
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    หมายเลข SN
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ยี่ห้อ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    รุ่น
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  ></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!subInventories || subInventories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      ไม่มีข้อมูลครุภัณฑ์ภายในชุด
                    </td>
                  </tr>
                ) : (
                  subInventories.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dataInv?.attributes?.id_inv + "  "}
                       <span className="text-red-600"> {item.attributes.id_inv}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.attributes.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.attributes.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.attributes.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.attributes.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {statusInventoryId === 2 && allowedRepair && (
  <button
    className="font-bold rounded-lg text-base w-32 h-8 bg-[#276ff4] text-[#ffffff]"
    onClick={() => openModal("sub", item.id)} // Pass sub-inventory ID when clicked
  >
    แจ้งซ่อม <SettingOutlined />
  </button>
)}

<button
  className="ml-2 font-bold rounded-lg text-base w-32 h-8 bg-[#4de83f] text-[#ffffff]"
  onClick={() => openModalMan("sub", item.id)} // Pass sub-inventory ID when clicked
>
  <SafetyOutlined className="text-xl " />บำรุงรักษา 
</button>
                          
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className=""></div>
      </div>

      <div className="w-full h-[150px]"></div>

      <div className=" w-full  grid grid-cols-5 ">
        <div>{/* col-1 */}</div>

        {/* <div className=" col-span-3">
          <div className=" w-full ">
            <button
              className={`font-bold rounded-t-lg text-lg w-48 h-16 bg-[#8dd15c] text-[#ffffff] justify-center ${
                statusBTN === "mantenant" ? "opacity-100" : "opacity-50"
              }`}
              onClick={handelMantenantBTN}
            >
              ประวัติการบำรุงรักษา
            </button>
            <button
              className={`font-bold rounded-t-lg text-lg w-48 h-16 bg-[#2d6eca] text-[#ffffff] justify-center ${
                statusBTN === "repair" ? "opacity-100" : "opacity-50"
              }`}
              onClick={handelRepairBTN}
            >
              ประวัติการซ่อมแซม
            </button>
          </div>
          {statusBTN === "mantenant" ? (
            <TableDetailMantenant />
          ) : (
            <>
              <TableDetailRepair />
            </>
          )}
        </div> */}
        <InventoryMaintenanceHistory dataInv={dataInv} subInventories={subInventoriesM} />


        <div>{/* col-3 */}</div>
      </div>
    </>
  );
}

export default UserDetail;
