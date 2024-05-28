import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { message, Input, Form, Upload, Image } from "antd";
import {
  SettingOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import TableDetailMantenant from "../components/TableDetailMantenant";
import TableDetailRepair from "../components/TableDetailRepair";
import Modal from "react-modal";
import ModalDetailCompany from "../components/ModalDetailCompany";
import ModalFeedbackRepair from "../components/ModalFeedbackRepair";
import ModalSentBack from "../components/ModalSentBack";
import DateDifferenceCalculator from "../components/DateDifferenceCalculator";
import ThaiDateFormat from "../components/ThaiDateFormat";
import no_image from "../assets/img/Image.png";
const { TextArea } = Input;
function UserDetail() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [statusBTN, setStatusBTN] = useState("mantenant");
  const [dataInv, setDataInv] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repairReason, setRepairReason] = useState("");
  const [file, setFile] = useState(null);

  const [status_inventoryOptions, setStatus_inventoryOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [initialStatus, setInitialStatus] = useState("");
  const [statusInventoryId, setStatusInventoryId] = useState(null);
  const [allowedRepair, setallowedRepair] = useState(null);
  const [isVisibleModalFeedbackRepair, setIsVisibleModalFeedbackRepair] = useState(false)
  const [isVisibleModalSentBack, setIsVisibleModalSentBack] = useState(false)

 


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
      // Fetch categories
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

      const response = await fetch(
        `http://localhost:1337/api/inventories/${id}?populate=*`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error status :${response.status}`);
      }
      const dataA = await response.json();
      setDataInv(dataA.data);
    } catch (error) {
      console.error("Error Fetching data :", error);
    } finally {
      setIsLoading(false);
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
      formData.append("repairReason", values.repairReason);
      if (values.file_repair) {
        // กรณีมีการอัปโหลดไฟล์
        formData.append("file_repair", values.file_repair[0].originFileObj);
      }

      // ส่งข้อมูลไปยังเซิร์ฟเวอร์
      const response = await fetch(
        `http://localhost:1337/api/inventories/${id}/repair`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Response not OK");
      }

      // อัปเดตสถานะหลังจากซ่อมแซมสำเร็จ
      await putStatusInventory(id, 2);

      // แสดงข้อความแจ้งเตือนว่าซ่อมแซมสำเร็จ
      message.success("แจ้งซ่อมสำเร็จแล้ว");

      // ปิด Modal
      closeModal();

      // รีโหลดหน้าเพื่อให้แสดงข้อมูลที่อัปเดตแล้ว
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);

      // แสดงข้อความแจ้งเตือนว่าเกิดข้อผิดพลาดในการแจ้งซ่อม
      message.error("เกิดข้อผิดพลาดในการแจ้งซ่อม");
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRepairReason("");
    setFile(null);
  };

  const handleRepairReasonChange = (e) => {
    setRepairReason(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <div className="w-full ">
        <div className="flex  justify-between mx-20">
          <h1 className="text-4xl font-semibold">รายละเอียดครุภัณฑ์</h1>
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
                      <p className="my-2 text-lg  text-red-500"><a onClick={(e)=>{e.preventDefault; 
                        openModalFeedbackRepair();}}>***ครุภัณฑ์นี้ไม่ได้รับอนุมัติการซ่อมเนื่องจาก...*** :คลิกเพื่ออ่าน</a></p>
                      <p className="my-2 text-lg  text-red-500">โปรดทำเรื่องส่งคืนครุภัณฑ์</p>
                      <button onClick={openModalSentBack}
                        className="font-bold rounded-lg text-sm mt-2 w-32 h-8 bg-red-500 text-white"
                    
                      >
                        แจ้งส่งคืนครุภัณฑ์
                      </button>
                    </div>
                   
                  )}

                  {statusInventoryId === 2 &&allowedRepair&& (
                    <div className="flex justify-center mr-20">
                      <button
                        className=" mr-20 mt-5 font-bold rounded-lg text-base w-32 h-8 bg-[#276ff4] text-[#ffffff] justify-center"
                        onClick={openModal}
                      >
                        แจ้งซ่อมแซม <SettingOutlined />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-row mt-4">
                    {/* Render the modal */}
                    {/* Modal sentback */}
                    <ModalSentBack
                    isVisible={isVisibleModalSentBack}
                    onClose={closeModalSentBack}
                    >
                             {/* content สำหรับSentback  */}
                             <h2 className="text-lg font-bold mb-4">แจ้งส่งคืนครุภัณฑ์</h2>
                            <div className="h-[500px]"></div>
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
                          <Form.Item>
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
                              limit={1}
                            >
                              <button
                                style={{
                                  border: 0,
                                  background: "none",
                                }}
                                type="button"
                              >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>เพิ่มไฟล์</div>
                              </button>
                            </Upload>
                          </Form.Item>
                        </div>

                        <div className="flex justify-end">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                            htmlType="submit"
                            icon={<PrinterOutlined />}
                          >
                            ยืนยัน
                          </button>
                          <button
                            onClick={closeModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </Form>
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
                  <h1 className="text-lg text-gray-400 mr-4">
                    อายุการใช้งานจริง
                  </h1>

                  {dataInv?.attributes?.DateRecive ? (
                    <h1 className="text-lg">
                      <DateDifferenceCalculator
                        dateReceive={dataInv?.attributes?.DateReceive}
                      />
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
              องค์ประกอบในชุดครุภัณฑ์
            </h1>
          </div>

          {/* ซ่อนรายละเอียดครุภัณฑ์ไว้ก่อน */}

          {/* <div className=" flex flex-row border-2 border-blue-500 rounded-md m-4 p-2 ">
            <h1 className="text-lg text-gray-400 mr-4">หมายเลขครุภัณฑ์</h1>{" "}
            <h1 className="text-lg">110231213/1</h1>
            <h1 className="text-lg text-gray-400 mx-4">ชื่อครุภัณฑ์</h1>{" "}
            <h1 className="text-lg">Liquid nitrogen</h1>
            <h1 className="text-lg text-gray-400 mx-4">หมายเลขSN</h1>{" "}
            <h1 className="text-lg">-</h1>
            {statusInventoryId === 2 && (
              <div className="flex justify-center">
                <button
                  className="ml-20  font-bold rounded-lg text-base w-32 h-8 bg-[#276ff4] text-[#ffffff] justify-center"
                  onClick={openModal}
                >
                  แจ้งซ่อมแซม
                </button>
              </div>
            )}
          </div> */}
        </div>
        <div className=""></div>
      </div>

      <div className="w-full h-[100px]"></div>

      <div className=" w-full  grid grid-cols-5 ">
        <div>{/* col-1 */}</div>

        <div className=" col-span-3">
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
        </div>

        <div>{/* col-3 */}</div>
      </div>
    </>
  );
}

export default UserDetail;
