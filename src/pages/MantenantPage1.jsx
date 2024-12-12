import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Checkbox,
  Radio,
  DatePicker,
  message,
} from "antd";
import { FileOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import SearchBoxRM from "../components/SearchBoxRM";
import DateIsoToThai from "../components/DateIsoToThai";
import RepairReportTable from "../components/RepairReportTable";
import FilteredMaintenanceTable from "../components/FilteredMaintenanceTable";
import MaintenancePage3 from "./MaintenancePage3";
import { useAuth } from '../context/AuthContext';

const { Option } = Select;

const MantenantPage1 = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [dataMaintenance, setDataMaintenance] = useState([]);
  const [isRepairActive, setIsRepairActive] = useState(true);
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);
  const [statusRepair_inventoryOptions, setStatusRepair_inventoryOptions] =
    useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRepairReportId, setSelectedRepairReportId] = useState(null);

  // New state for maintenance modal
  const [isModalOpenMan, setIsModalOpenMan] = useState(false);
  const [form] = Form.useForm();
  const [fileList2, setFileList2] = useState([]);
  const [isNextAppointment, setIsNextAppointment] = useState(false);
  const [isMaintenanceDate, setIsMaintenanceDate] = useState(false);
  const [dateInputType, setDateInputType] = useState(null);
  const [formType, setFormType] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedMaintenanceReportId, setSelectedMaintenanceReportId] =
    useState(null);
  const [searchParams, setSearchParams] = useState({});

  const { user } = useAuth();

  const isAdmin = user?.role_in_web?.RoleName === "Admin";

  const handleSearch = (searchData) => {
    setSearchParams(searchData);
  };

  useEffect(() => {
    fetchData();
    fetchCompanyData();
  }, []);

  const fetchData = async () => {
    try {
      const statusRepairResponse = await fetch(`${API_URL}/api/status-repairs`);
      const statusRepairData = await statusRepairResponse.json();
      setStatusRepair_inventoryOptions(
        statusRepairData.data.map((item) => ({
          id: item.id,
          name: item.attributes.nameStatusRepair,
        }))
      );
    } catch (error) {
      console.error("Error Fetching data:", error);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const companyResponse = await fetch(`${API_URL}/api/company-inventories`);
      const companyData = await companyResponse.json();
      setCompanyOptions(
        companyData.data.map((item) => ({
          id: item.id,
          name:
            item.attributes.contactName +
            " / " +
            item.attributes.Cname +
            (item?.attributes?.role ? ` (${item.attributes.role})` : ""),
        }))
      );
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    const fetchDataR = async () => {
      try {
        let url = `${API_URL}/api/repair-reports?populate=*`;

        // เพิ่มพารามิเตอร์การค้นหาใน URL
        if (searchParams.id_inv) {
          url += `&filters[inventory][id_inv][$containsi]=${searchParams.id_inv}`;
        }
        if (searchParams.name) {
          url += `&filters[inventory][name][$containsi]=${searchParams.name}`;
        }
        // แก้ให้ผู้ดูแลค้นได้เฉพาะตัวเองเท่านั้น
        // if (searchParams.reportedBy) {
        //   url += `&filters[reportedBy][id]=${searchParams.reportedBy}`;
        // }
        // ถ้าไม่ใช่ Admin ให้ดูได้แค่ข้อมูลของตัวเอง
        if (!isAdmin) {
          url += `&filters[reportedBy][id]=${user?.responsible?.id}`;
        } 
        // ถ้าเป็น Admin และมีการค้นหาด้วย reportedBy
        else if (searchParams.reportedBy) {
          url += `&filters[reportedBy][id]=${searchParams.reportedBy}`;
        }
        if (searchParams.NumberRepairFaculty) {
          url += `&filters[NumberRepairFaculty][$containsi]=${searchParams.NumberRepairFaculty}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data && data.data) {
          const formattedData = data.data
            .filter((item) => !item.attributes.isDone)
            .map((item) => {
              const inventory = item.attributes.inventory?.data?.attributes;
              const inventoryId = item.attributes.inventory?.data?.id;
              const user =
                item.attributes.users_permissions_user?.data?.attributes;
              const statusRepair =
                item.attributes.status_repair?.data?.attributes;
              const currentStatus = item.attributes.status_repair?.data?.id;

              let subInventoryData = null;
              if (item.attributes.isSubInventory) {
                const idSubInventory = item.attributes.sub_inventory.data.id;
                subInventoryData =
                  item.attributes.inventory?.data?.attributes?.sub_inventories?.data?.find(
                    (subInv) => subInv.id === idSubInventory
                  );
              }

              return {
                key: item.id,
                // date: <DateIsoToThai isoDate={item.attributes.createdAt} typeTime={1} />,
                date: item.attributes.createdAt,
                numberRepairFaculty:
                  item.attributes.NumberRepairFaculty ?? " - ",
                id:
                  (
                    <Link to={`/UserDetailInventory/${inventoryId}`}>
                      {item.attributes.isSubInventory ? (
                        <>
                          {inventory?.id_inv}{" "}
                          <span className="text-red-500">
                            {
                              item?.attributes?.sub_inventory?.data?.attributes
                                ?.id_inv
                            }
                          </span>
                        </>
                      ) : (
                        <> {inventory?.id_inv}</>
                      )}
                    </Link>
                  ) ?? " - ",
                name:
                  (
                    <Link to={`/UserDetailInventory/${inventoryId}`}>
                      {item.attributes.isSubInventory ? (
                        <>
                          {
                            item?.attributes?.sub_inventory?.data?.attributes
                              ?.name
                          }
                        </>
                      ) : (
                        <> {inventory?.name} </>
                      )}
                    </Link>
                  ) ?? " - ",
                reportedBy:
                  item?.attributes?.reportedBy?.data?.attributes
                    ?.responsibleName || " - ",
                description: item.attributes.RepairReasonByResponsible ?? " - ",
                FileReport: (
                  <a
                    href={`${API_URL}${item?.attributes?.ReportFileByResponsible?.data?.[0]?.attributes?.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileOutlined />
                    <span className="ml-2">
                      {item?.attributes?.ReportFileByResponsible?.data?.[0]
                        ?.attributes?.name || "ไฟล์"}
                    </span>
                  </a>
                ),
                appointmentDate: "DueDateRepair",
                maintenanceType: "repair",
                status: (
                  <select
  className="select select-bordered w-40 mr-4"
  onChange={(e) => handleStatusChange(e, item.id)}
  value={selectedStatus[item.id] || currentStatus}
>
  {statusRepair_inventoryOptions
    .map((status) => (
      <option
        key={status.id}
        value={status.id}
        disabled={
          (currentStatus === 1 && status.id <= 1) ||
          (currentStatus === 2 && status.id <= 2) ||
          (currentStatus === 3 && (status.id !== 4 && status.id !== currentStatus))
        }
      >
        {status.name}
      </option>
    ))}
</select>
                ),
                action: (
                  <Button
                    className="bg-gray-300"
                    type="primary"
                    onClick={() => {
                      setSelectedRepairReportId(item.id);
                      setModalVisible(true);
                    }}
                    disabled={!isStatusChanged(item.id, currentStatus)}
                  >
                    กรอกข้อมูล
                  </Button>
                ),
              };
            });
          setData(formattedData);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataR();
  }, [searchParams, statusRepair_inventoryOptions, selectedStatus]);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        let url = `${API_URL}/api/maintenance-reports?populate=*`;

        // เพิ่มพารามิเตอร์การค้นหาใน URL
        if (searchParams.id_inv) {
          url += `&filters[inventory][id_inv][$containsi]=${searchParams.id_inv}`;
        }
        if (searchParams.name) {
          url += `&filters[inventory][name][$containsi]=${searchParams.name}`;
        }
        // ไม่ต้องใส่ reportedBy และ NumberRepairFaculty สำหรับ maintenance

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data) {
          const formattedData = data.data
            .filter((item) => !item.attributes.isDone)
            .map((item) => {
              const inventory = item.attributes.inventory?.data?.attributes;
              const inventoryId = item.attributes.inventory?.data?.id;

              return {
                key: item.id,
                date: (
                  <DateIsoToThai
                    isoDate={item.attributes.createdAt}
                    typeTime={1}
                  />
                ),
                appointmentDate: (
                  <DateIsoToThai
                    isoDate={item.attributes.DueDate}
                    typeTime={1}
                  />
                ),
                id:
                  (
                    <Link to={`/UserDetailInventory/${inventoryId}`}>
                      {item.attributes.isSubInventory ? (
                        <>
                          {inventory?.id_inv}{" "}
                          <span className="text-red-500">
                            {
                              item?.attributes?.sub_inventory?.data?.attributes
                                ?.id_inv
                            }
                          </span>
                        </>
                      ) : (
                        <> {inventory?.id_inv}</>
                      )}
                    </Link>
                  ) ?? " - ",
                name:
                  (
                    <Link to={`/UserDetailInventory/${inventoryId}`}>
                      {item.attributes.isSubInventory ? (
                        <>
                          {
                            item?.attributes?.sub_inventory?.data?.attributes
                              ?.name
                          }
                        </>
                      ) : (
                        <> {inventory?.name} </>
                      )}
                    </Link>
                  ) ?? " - ",
                description: item.attributes.DetailMaintenance ?? " - ",
                action: (
                  <Button
                    className="bg-green-400 hover:bg-green-500 text-white"
                    type="secondary"
                    onClick={() => openModalMan(item.id)}
                  >
                    บำรุงรักษา
                  </Button>
                ),
              };
            });
          setDataMaintenance(formattedData);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
      }
    };

    fetchMaintenanceData();
  }, [searchParams]);

  const handleStatusChange = (e, id) => {
    const newStatus = e.target.value;
    setSelectedStatus({ ...selectedStatus, [id]: newStatus });
  };

  const isStatusChanged = (id, currentStatus) => {
    return selectedStatus[id] && selectedStatus[id] !== currentStatus;
  };

  const openModalMan = (id) => {
    setSelectedMaintenanceReportId(id);
    setIsModalOpenMan(true);
    setFormType("saveMaintenance"); // Add this line
  };

  const closeModalMan = () => {
    setIsModalOpenMan(false);
    form.resetFields();
    setFormType(null);
  };

  const handleFileChange2 = ({ fileList }) => setFileList2(fileList);

  const handleSaveMaintenance = async (values) => {
    try {
      const formData = new FormData();
      const currentDate = new Date();
      const dateToDo = values.dateToDo
        ? new Date(values.dateToDo)
        : currentDate;

      let newDueDate = null;
      if (values.newDueDateType === "formInput" && values.formInputDate) {
        newDueDate = new Date(
          dateToDo.getTime() +
            parseInt(values.formInputDate) * 24 * 60 * 60 * 1000
        );
      } else if (
        values.newDueDateType === "datePicker" &&
        values.datePickerDate
      ) {
        newDueDate = new Date(values.datePickerDate);
      }

      const maintenanceData = {
        maintenance_report: selectedMaintenanceReportId,
        company_inventory: values.companyInventory,
        NameMaintenance: values.nameMaintenance,
        DetailMaintenance: values.detailMaintenance,
        prize: values.prize,
        DateToDo: dateToDo.toISOString(),
        newDueDate: newDueDate ? newDueDate.toISOString() : null,
      };

      formData.append("data", JSON.stringify(maintenanceData));

      fileList2.forEach((file) => {
        formData.append("files.FileMaintenanceByAdmin", file.originFileObj);
      });

      const response = await fetch(
        `${API_URL}/api/maintenance-reports/${selectedMaintenanceReportId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Response not OK: ${response.status}`);
      }

      message.success("บันทึกข้อมูลบำรุงรักษาสำเร็จแล้ว");
      closeModalMan();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error(
        `เกิดข้อผิดพลาดในการบันทึกข้อมูลบำรุงรักษา: ${error.message}`
      );
    }
  };

  const handleAddAppointment = async (values) => {
    try {
      const currentDate = new Date();

      let dueDate = null;
      if (values.newDueDateType === "formInput" && values.formInputDate) {
        dueDate = new Date(
          currentDate.getTime() +
            parseInt(values.formInputDate) * 24 * 60 * 60 * 1000
        );
      } else if (
        values.newDueDateType === "datePicker" &&
        values.datePickerDate
      ) {
        dueDate = new Date(values.datePickerDate);
      }

      if (!dueDate) {
        throw new Error("กรุณาระบุวันนัดหมาย");
      }

      const appointmentData = {
        maintenance_report: selectedMaintenanceReportId,
        DetailMaintenance: values.DetailMaintenance,
        DueDate: dueDate.toISOString(),
      };

      const response = await fetch(
        `${API_URL}/api/maintenance-reports/${selectedMaintenanceReportId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: appointmentData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Response not OK: ${response.status} - ${errorData.error.message}`
        );
      }

      message.success("เพิ่มนัดหมายบำรุงรักษาสำเร็จแล้ว");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      closeModalMan();
    } catch (error) {
      message.error(`เกิดข้อผิดพลาดในเพิ่มนัดหมายบำรุงรักษา: ${error.message}`);
    }
  };

  return (
    <>
      <div className="">
        <div className="border-b-2 border-black mb-10 flex justify-between items-center">
          <h1 className="text-3xl text-blue-800">ดูแลครุภัณฑ์</h1>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 mb-2">
          {isRepairActive && (
            <>
            
                <SearchBoxRM onSearch={handleSearch} mode="repair" />
            
            </>
          )}
          {isMaintenanceActive && (
            <>
              
                <SearchBoxRM onSearch={handleSearch} mode="maintenance" />
              
            </>
          )}
        </div>

        <div className="flex flex-row justify-end align-middle">
        {isAdmin && (
          <div>
            <Button
              className={`text-md text-gray-700 ${
                isRepairActive ? "bg-blue-500 text-white" : "bg-gray-300"
              } h-[40px] mr-2`}
              type="primary"
              onClick={() => {
                setIsRepairActive(true);
                setIsMaintenanceActive(false);
              }}
            >
              แสดงคำร้องซ่อมแซมครุภัณฑ์
            </Button>

            
            <Button
              className={`text-md text-gray-700 ${
                isMaintenanceActive ? "bg-blue-500 text-white" : "bg-gray-300"
              } h-[40px]`}
              type="primary"
              onClick={() => {
                setIsRepairActive(false);
                setIsMaintenanceActive(true);
              }}
            >
              แสดงแจ้งเตือนบำรุงรักษาครุภัณฑ์
            </Button>
          </div>
        )}
        </div>

        {isRepairActive && <RepairReportTable data={data} />}
        {isMaintenanceActive && (
          <FilteredMaintenanceTable data={dataMaintenance} />
        )}

        <MaintenancePage3
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          repairReportId={selectedRepairReportId}
          selectedStatus={selectedStatus[selectedRepairReportId]}
        />

        <Modal
          title="เพิ่มข้อมูลบำรุงรักษา"
          visible={isModalOpenMan}
          onCancel={closeModalMan}
          footer={null}
          width={1200}
        >
          {/* {dataRepairReport ? (
            dataRepairReport.attributes.isSubInventory ? (
              <CardSubInventoryDetail data={dataInv} idSubInventory={idSubInventory} />
            ) : (
              <CardInventoryDetail data={dataInv} />
            )
          ) : (
            <p>Loading data...</p>
          )} */}

          {formType === "saveMaintenance" && (
            <Form
              form={form}
              name="maintenance-form"
              layout="vertical"
              onFinish={handleSaveMaintenance}
            >
              <Form.Item
                name="companyInventory"
                label="ตัวแทน/บริษัท"
                rules={[{ required: true, message: "กรุณาเลือกบริษัท" }]}
              >
                <Select
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
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
                rules={[
                  { required: false, message: "กรุณากรอกชื่อการบำรุงรักษา" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="detailMaintenance"
                label="รายละเอียดการบำรุงรักษา"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรายละเอียดการบำรุงรักษา",
                  },
                ]}
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
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e.fileList)}
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
                <Checkbox
                  onChange={(e) => setIsMaintenanceDate(e.target.checked)}
                >
                  ต้องการกำหนดวันที่ทำการบำรุงรักษา
                </Checkbox>
              </Form.Item>

              {isMaintenanceDate && (
                <Form.Item name="dateToDo" label="วันที่บำรุงรักษา">
                  <DatePicker />
                </Form.Item>
              )}

              <Form.Item name="nextAppointmentCheckbox" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsNextAppointment(e.target.checked)}
                >
                  มีนัดหมายบำรุงรักษารอบถัดไป
                </Checkbox>
              </Form.Item>

              {isNextAppointment && (
                <>
                  <Form.Item
                    name="newDueDateType"
                    label="วันบำรุงรักษารอบถัดไป"
                  >
                    <Radio.Group
                      onChange={(e) => setDateInputType(e.target.value)}
                    >
                      <Radio value="formInput">
                        กรอกจำนวนวันในการบำรุงรักษารอบถัดไป (วัน)
                      </Radio>
                      <Radio value="datePicker">เลือกวันที่</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {dateInputType === "formInput" && (
                    <Form.Item
                      name="formInputDate"
                      label="กรอกจำนวนวันในการบำรุงรักษารอบถัดไป (วัน)"
                    >
                      <Input placeholder="ใส่จำนวนวัน" />
                    </Form.Item>
                  )}

                  {dateInputType === "datePicker" && (
                    <Form.Item name="datePickerDate" label="เลือกวันที่">
                      <DatePicker />
                    </Form.Item>
                  )}
                </>
              )}

              <div className="flex justify-end">
                <Form.Item>
                  <Button
                    className=" bg-blue-500 text-white"
                    type="default"
                    htmlType="submit"
                  >
                    ยืนยัน
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button onClick={closeModalMan}>ยกเลิก</Button>
                </Form.Item>
              </div>
            </Form>
          )}
        </Modal>
      </div>
    </>
  );
};

export default MantenantPage1;
