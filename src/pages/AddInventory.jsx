import React, { useState, useEffect, useCallback,useRef } from "react";
import { Form, Input, Button, DatePicker, Select, Upload, Space, message,InputNumber  } from "antd";
import { UploadOutlined, PlusOutlined, PrinterOutlined, DeleteOutlined } from "@ant-design/icons";
import AddTest from "../components/AddTest";
import debounce from 'lodash/debounce';
const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function AddInventory() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form] = Form.useForm();

  const [companyOptions, setCompanyOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [responsibleOptions, setResponsibleOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [howToGetOptions, setHowToGetOptions] = useState([]);
  const [yearMoneyGetOptions, setYearMoneyGetOptions] = useState([]);
  const [sourceMoneyOptions, setSourceMoneyOptions] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  // const [inventoryCount, setInventoryCount] = useState(1); // Number of inventories
  // const [startInventoryNumber, setStartInventoryNumber] = useState(""); // Starting inventory number

  const [activeButton, setActiveButton] = useState("single");
  const [idInvExists, setIdInvExists] = useState(false);

  // ใหม่ AddCheck
  const [inventoryCount, setInventoryCount] = useState(1);
  const [idInvInput, setIdInvInput] = useState("");
  const [inventoryPrefix, setInventoryPrefix] = useState({ number: 0, suffix: '' });

  const [endInventoryNumber, setEndInventoryNumber] = useState("");
  const [selectedResponsibles, setSelectedResponsibles] = useState([]);

  // Create refs for each input field
  const nameRef = useRef(null);
  const countRef = useRef(null);
  const idInvRef = useRef(null);
  const assetCodeRef = useRef(null);
  const categoryRef = useRef(null);
  const buildingRef = useRef(null);
  const floorRef = useRef(null);
  const roomRef = useRef(null);
  const responsibleRef = useRef(null);
  const imgInvRef = useRef(null);
  const howToGetRef = useRef(null);
  const yearMoneyGetRef = useRef(null);
  const companyInventoryRef = useRef(null);
  const dateOrderRef = useRef(null);
  const dateReceiveRef = useRef(null);
  const serialNumberRef = useRef(null);
  const brandRef = useRef(null);
  const modelRef = useRef(null);
  const prizeRef = useRef(null);
  const quantityRef = useRef(null);
  const unitRef = useRef(null);
  const ageUseRef = useRef(null);
  const informationRef = useRef(null);

  // Function to handle Enter key press
  const handleEnterKey = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const splitInventoryNumber = (invNumber) => {
    const match = invNumber.match(/^(\d+)(.*)$/);
    if (match) {
      return { number: parseInt(match[1]), suffix: match[2] };
    }
    return { number: 0, suffix: invNumber };
  };

  const checkIdInv = useCallback(
    debounce(async (id_inv) => {
      try {
        const response = await fetch(`${API_URL}/api/inventories/check-id-inv?id_inv=${id_inv}`);
        const data = await response.json();
        setIdInvExists(data.exists);
      } catch (error) {
        console.error("Error checking id_inv:", error);
      }
    }, 300),
    []
  );

  // NEW CHECK ID ยังไม่ได้ลอง แล้วก็มันต้องไปสร้าง API Endpoit   (check-id-inv-range) ที่สามารถตรวจสอบช่วงของหมายเลขครุภัณฑ์ได้
  // const checkIdInv = useCallback(
  //   debounce(async (id_inv) => {
  //     try {
  //       if (activeButton === "many") {
  //         const { number, suffix } = splitInventoryNumber(id_inv);
  //         const endNumber = number + parseInt(inventoryCount) - 1;
  //         const endId = `${endNumber}${suffix}`;
  //         const response = await fetch(`${API_URL}/api/inventories/check-id-inv-range?start=${id_inv}&end=${endId}`);
  //         const data = await response.json();
  //         setIdInvExists(data.exists);
  //       } else {
  //         const response = await fetch(`${API_URL}/api/inventories/check-id-inv?id_inv=${id_inv}`);
  //         const data = await response.json();
  //         setIdInvExists(data.exists);
  //       }
  //     } catch (error) {
  //       console.error("Error checking id_inv:", error);
  //     }
  //   }, 300),
  //   [activeButton, inventoryCount]
  // );

  const handleInventoryInputChange = (e) => {
    const value = e.target.value;
    setIdInvInput(value);
    const { number, suffix } = splitInventoryNumber(value);
    setInventoryPrefix({ number, suffix });
    if (activeButton === "single") {
      form.setFieldsValue({ id_inv: value });
    } else {
      form.setFieldsValue({ inventory_number_m_start: value });
      updateEndInventoryNumber(number, suffix);
    }
    if (value) {
      checkIdInv(value);
    } else {
      setIdInvExists(false);
    }
  };

  const updateEndInventoryNumber = (startNumber, suffix) => {
    const endNumber = startNumber + inventoryCount - 1;
    const formattedEndNumber = `${endNumber}${suffix}`;
    setEndInventoryNumber(formattedEndNumber);
    form.setFieldsValue({ inventory_number_m_end: formattedEndNumber });
  };

  useEffect(() => {
    // เมื่อโหลดข้อมูลครั้งแรก
    const initialResponsibles = form.getFieldValue('responsibles') || [];
    setSelectedResponsibles(initialResponsibles);
  }, [form]);
  
  useEffect(() => {
    if (activeButton === "many") {
      const { number, suffix } = splitInventoryNumber(idInvInput);
      updateEndInventoryNumber(number, suffix);
    }
  }, [inventoryCount, idInvInput, activeButton]);


  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch companies
        const companyResponse = await fetch(`${API_URL}/api/company-inventories`);
        const companyData = await companyResponse.json();
        setCompanyOptions(companyData.data.map((item) => ({
          id: item.id,
          name: item.attributes.contactName + " / " + item.attributes.Cname + (item?.attributes?.role ? ` (${item.attributes.role})` : ''),
        })));

        // Fetch responsibles
        const responsibleResponse = await fetch(`${API_URL}/api/responsibles`);
        const responsibleData = await responsibleResponse.json();
        setResponsibleOptions(responsibleData.data.map((item) => ({
          id: item.id,
          name: item.attributes.responsibleName,
        })));

        // Fetch categories
        const categoryResponse = await fetch(`${API_URL}/api/categories`);
        const categoryData = await categoryResponse.json();
        setCategoryOptions(categoryData.data.map((item) => ({
          id: item.id,
          name: item.attributes.CategoryName,
        })));

        // Fetch unit
        const unitResponse = await fetch(`${API_URL}/api/units`);
        const unitData = await unitResponse.json();
        setUnitOptions(unitData.data.map((item) => ({
          id: item.id,
          name: item.attributes.name_unit,
        })));

        // Fetch buildings
        const buildingResponse = await fetch(`${API_URL}/api/buildings`);
        const buildingData = await buildingResponse.json();
        setBuildingOptions(buildingData.data.map((item) => ({
          id: item.id,
          name: item.attributes.buildingName,
        })));

        // Fetch howToGet
        const howToGetResponse = await fetch(`${API_URL}/api/how-to-gets`);
        const howToGetData = await howToGetResponse.json();
        setHowToGetOptions(howToGetData.data.map((item) => ({
          id: item.id,
          name: item.attributes.howToGetName,
        })));

        // Fetch sourceMoney
        const sourceMoneyResponse = await fetch(`${API_URL}/api/source-monies`);
        const sourceMoneyData = await sourceMoneyResponse.json();
        setSourceMoneyOptions(sourceMoneyData.data.map((item) => ({
          id: item.id,
          name: item.attributes.sourceMoneyName,
        })));

        // Fetch yearMoneyGet options
        const yearMoneyGetResponse = await fetch(`${API_URL}/api/year-money-gets`);
        const yearMoneyGetData = await yearMoneyGetResponse.json();

        // Sort yearMoneyGet options by name
        const sortedYearMoneyGetOptions = yearMoneyGetData.data
          .map((item) => ({
            id: item.id,
            name: item.attributes.yearMoneyGetName,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Set sorted options to state
        setYearMoneyGetOptions(sortedYearMoneyGetOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const onFinish = async (values) => {
    const subInventoryIds = [];
    console.log('Received values of form:', values);
    console.log('item-s:',items)
    for (const item of items) {
      console.log('item:',item)
      const subInventoryId = await postSubInventoryData(item);
      if (subInventoryId) {
        subInventoryIds.push(subInventoryId);
      } else {
        message.error("Failed to save sub-inventory item.");
        return;
      }
    }
    const { number, suffix } = splitInventoryNumber(idInvInput);

    for (let i = 0; i < inventoryCount; i++) {
      const currentNumber = number + i;
      const formattedIdInv = `${currentNumber}${suffix}`;

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          name: values.name,
          id_inv: formattedIdInv,
          category: values.category,
          building: values.building,
          floor: values.floor,
          room: values.room,
          responsibles: values.responsibles, // เปลี่ยนจาก responsible เป็น responsibles
          how_to_get: values.howToGet,
          sourceMoney: values.sourceMoney,
          year_money_get: values.YearMoneyGet,
          DateOrder: values.DateOrder ? values.DateOrder.format("YYYY-MM-DD") : null,
          DateRecive: values.DateRecive ? values.DateRecive.format("YYYY-MM-DD") : null,
          company_inventory: values.company_inventory,
          serialNumber: values.serialNumber,
          model: values.model,
          brand: values.brand,
          prize: values.prize,
          asset_code: values.asset_code,
          quantity: values.quantity,
          unit: values.unit,
          status_inventory: 1,
          allowedRepair: true,
          age_use: values["age-use"],
          information: values.information,
          sub_inventories: subInventoryIds,
        })
      );

      if (values.img_inv && values.img_inv.length > 0) {
        formData.append("files.img_inv", values.img_inv[0].originFileObj);
      }

      try {
        const response = await fetch(`${API_URL}/api/inventories`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Response not OK");
        const responseData = await response.json();
        console.log("Response:", responseData);
        message.success(`บันทึกข้อมูลสำเร็จ: ${formattedIdInv}`);
      } catch (error) {
        console.error("Error:", error);
        message.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${formattedIdInv}`);
      }
    }
    form.resetFields();
  };

  // OnFinish OLD
  // const onFinish = async (values) => {
   
  //   const subInventoryIds = [];
  //   console.log('Received values of form:', values);
  //   console.log('item-s:',items)
  //   for (const item of items) {
  //     console.log('item:',item)
  //     const subInventoryId = await postSubInventoryData(item);
  //     if (subInventoryId) {
  //       subInventoryIds.push(subInventoryId);
  //     } else {
  //       message.error("Failed to save sub-inventory item.");
  //       return;
  //     }
  //   }

  //   for (let i = 0; i < inventoryCount; i++) {
  //     const formData = new FormData();
  //     formData.append(
  //       "data",
  //       JSON.stringify({
  //         name: values.name,
  //         id_inv: (
  //           (parseInt(startInventoryNumber) || parseInt(values.id_inv)) + i
  //         ).toString(),
  //         category: values.category,
  //         building: values.building,
  //         floor: values.floor,
  //         room: values.room,
  //         responsible: values.responsible,
  //         how_to_get: values.howToGet,
  //         sourceMoney: values.sourceMoney,
  //         year_money_get: values.YearMoneyGet,
  //         DateOrder: values.DateOrder ? values.DateOrder.format("YYYY-MM-DD") : null,
  //         DateRecive: values.DateRecive ? values.DateRecive.format("YYYY-MM-DD") : null,
  //         company_inventory: values.company_inventory,
  //         serialNumber: values.serialNumber,
  //         model: values.model,
  //         brand: values.brand,
  //         prize: values.prize,
  //         asset_code: values.asset_code,
  //         quantity: values.quantity,
  //         unit: values.unit,
  //         status_inventory: 1,
  //         allowedRepair: true,
  //         age_use: values["age-use"],
  //         information: values.information,
  //         sub_inventories: subInventoryIds,
  //       })
  //     );

  //     if (values.img_inv && values.img_inv.length > 0) {
  //       formData.append("files.img_inv", values.img_inv[0].originFileObj);
  //     }

  //     const response = await postInventoryData(formData);
  //     if (response) {
  //       message.success("บันทึกข้อมูลสำเร็จ");
  //       form.resetFields();
  //     } else {
  //       message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  //     }
  //   }
  // };

  const postSubInventoryData = async (subItem) => {
    try {
      const response = await fetch(`${API_URL}/api/sub-inventories`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: subItem })
      });
      if (!response.ok) throw new Error("Response not OK");
      const responseData = await response.json();
      console.log("subItem:",subItem)
      console.log("responseData.data.id:",responseData.data.id)
      return responseData.data.id;
    } catch (error) {
      console.error("Error:", error);
      console.log("responseData.data.id:",responseData.data.id)

      return null;
    }
  };

  const postInventoryData = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/inventories`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Response not OK");
      const responseData = await response.json();
      console.log("Response:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleClickMenuAdd = (buttonName) => {
    setActiveButton(buttonName);
  };

  const [daysPassed, setDaysPassed] = useState(0);

  useEffect(() => {
    const startDate = new Date("2024-02-14");
    const currentDate = new Date();
    const timeDiff = currentDate - startDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    setDaysPassed(daysDiff);
  }, []);

  const [count, setCount] = useState(1);
  const [items, setItems] = useState([]);

  const removeItem = (index) => {
    setItems(items.filter((_, i) => index !== i));
  };

  return (
    <>
      <button
        className={`py-2 px-4 rounded ${
          activeButton === "single"
            ? "bg-blue-500 text-white"
            : "bg-transparent text-blue-700 hover:bg-blue-500 hover:text-white"
        } border border-blue-500`}
        onClick={() => handleClickMenuAdd("single")}
      >
        เพิ่มครุภัณฑ์รายการเดียว
      </button>

      <button
        className={`py-2 px-4 rounded ${
          activeButton === "many"
            ? "bg-blue-500 text-white"
            : "bg-transparent text-blue-700 hover:bg-blue-500 hover:text-white"
        } border border-blue-500`}
        onClick={() => handleClickMenuAdd("many")}
      >
        เพิ่มครุภัณฑ์หลายรายการ
      </button>

      <div className="App">
        <Form
          form={form}
          name="equipment-form"
          onFinish={onFinish}
          layout="vertical"
          className="m-4"
          initialValues={{
            quantity: "1/1", 
            responsibles: [], // เริ่มต้นด้วยอาร์เรย์ว่าง
           
          }}
        >
          <div className="border-b-2 border-black mb-10 mt-10">
            <h1 className="text-lg text-blue-800">ข้อมูลครุภัณฑ์</h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mt-5">
              {/* คอลัมน์ซ้าย */}

              <Form.Item
                name="name"
                label="ชื่อครุภัณฑ์"
                rules={[{ required: true, message: "กรุณากรอกชื่ออุปกรณ์" }]}
                
              >
                 <Input
    ref={nameRef}
    onKeyDown={(e) => {
      if (activeButton === "many") {
        handleEnterKey(e, countRef);
      } else {
        handleEnterKey(e, idInvRef);
      }
    }}
  />
              </Form.Item>

              {activeButton === "many" && (
              <Form.Item name="inventory_count" label="จำนวนครุภัณฑ์">
                <Input
                  ref={countRef}
                  type="number"
                  value={inventoryCount}
                  onChange={(e) => setInventoryCount(parseInt(e.target.value) || 1)}
                  onKeyDown={(e) => handleEnterKey(e, idInvRef)}
                />
              </Form.Item>
            )}

              <Form.Item
              name={activeButton === "single" ? "id_inv" : "inventory_number_m_start"}
              label={activeButton === "single" ? "หมายเลขครุภัณฑ์" : "หมายเลขครุภัณฑ์เริ่มต้น"}
              validateStatus={idInvExists ? "error" : ""}
              help={idInvExists ? "หมายเลขครุภัณฑ์นี้มีอยู่แล้ว" : ""}
              
            >
              <Input 
              ref={idInvRef}
              onChange={handleInventoryInputChange} 
              onKeyDown={(e) => handleEnterKey(e, assetCodeRef)}
              />
            </Form.Item>

            {activeButton === "many" && (
                 <Form.Item name="inventory_number_m_end" label="ถึง: หมายเลข">
      <Input disabled value={endInventoryNumber} />
    </Form.Item>
            )}

          
<Form.Item
                name="asset_code"
                label="รหัสสินทรัพย์"
                rules={[{ required: false, message: "กรุณากรอกรหัสสินทรัพย์" }]}
              >
                 <Input ref={assetCodeRef} onKeyDown={(e) => handleEnterKey(e, categoryRef)} />
              </Form.Item>

<Form.Item
  name="category"
  label="หมวดหมู่ครุภัณฑ์"
  rules={[{ required: false, message: "กรุณาเลือกหมวดหมู่" }]}
>
  <Select
    ref={categoryRef}
    showSearch
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    onKeyDown={(e) => handleEnterKey(e, buildingRef)}

  >
    {categoryOptions.map((category) => (
      <Option key={category.id} value={category.id}>
        {category.name}
      </Option>
    ))}
  </Select>
</Form.Item>


            </div>
            <div>
              {/* คอลัมน์ขวา */}
              <label>ที่ตั้งครุภัณฑ์</label>

              <div className="flex space-x-2">
              <Form.Item
  name="building"
  label="อาคาร"
  className="w-full"
  rules={[{ required: false, message: "กรุณาเลือกอาคาร" }]}
>
  <Select
    ref={buildingRef}
    showSearch
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    onKeyDown={(e) => handleEnterKey(e, floorRef )}
  >
    {buildingOptions.map((building) => (
      <Option key={building.id} value={building.id}>
        {building.name}
      </Option>
    ))}
  </Select>
</Form.Item>

                <Form.Item
                  name="floor"
                  label="ชั้น"
                  className="w-full"
                  // rules={[{ required: false, message: "กรุณาเลือกชั้น" }]}
                >
                  <Input ref={floorRef} onKeyDown={(e) => handleEnterKey(e, roomRef)} />
                </Form.Item>

                <Form.Item name="room" label="ห้อง" className="w-full">
                <Input ref={roomRef} onKeyDown={(e) => handleEnterKey(e, responsibleRef )} />
                </Form.Item>
              </div>

              <Form.Item
  name="responsibles"
  label="ผู้ดูแล"
  rules={[{ required: false, message: "กรุณาเลือกผู้รับผิดชอบ" }]}
>
  <Select
    ref={responsibleRef}
    mode="multiple"
    showSearch
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    onChange={(values) => {
      let newValues = [...values];
      if (newValues.includes(1) && newValues.length > 1) {
        // ถ้ามีการเลือก 1 และมีตัวเลือกอื่นด้วย ให้ลบ 1 ออก
        newValues = newValues.filter(v => v !== 1);
      } else if (newValues.includes(1)) {
        // ถ้าเลือกแค่ 1 ให้เหลือแค่ 1
        newValues = [1];
      }
      setSelectedResponsibles(newValues);
      form.setFieldsValue({ responsibles: newValues });
    }}
    value={selectedResponsibles}
    onKeyDown={(e) => handleEnterKey(e, howToGetRef )}
  >
    {responsibleOptions.map((responsible) => (
      <Option 
        key={responsible.id} 
        value={responsible.id}
        disabled={responsible.id === 1 && selectedResponsibles.length > 0 && !selectedResponsibles.includes(1)}
      >
        {responsible.name}
      </Option>
    ))}
  </Select>
</Form.Item>

              <Form.Item
                name="img_inv"
                label="รูปครุภัณฑ์"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  name="img_inv"
                  listType="picture-card"
                  beforeUpload={() => false}
                >
                  <button
                    style={{
                      border: 0,
                      background: "none",
                    }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>อัปโหลด</div>
                  </button>
                </Upload>
              </Form.Item>
            </div>
          </div>

          <div className="border-b-2 border-black mb-10 mt-10">
            <h1 className="text-lg text-blue-800">วิธีได้มา</h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* คอลัมน์ซ้าย */}
              <Form.Item
                name="howToGet"
                label="วิธีได้มา"
                className="w-full"
                rules={[{ required: false, message: "กรุณาเลือกวิธีได้มา" }]}
              >
                <Select
                ref={howToGetRef}
                onKeyDown={(e) => handleEnterKey(e, yearMoneyGetRef)}
                >
                  {howToGetOptions.map((howToget) => (
                    <Option key={howToget.id} value={howToget.id}>
                      {howToget.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* <Form.Item name="sourceMoney" label="แหล่งงบประมาณ" className="w-full" rules={[{ required: false, message: 'กรุณาเลือกแหล่งงบประมาณ' }]}>
              <Select>
              {sourceMoneyOptions.map(sourceMoney => (
                            <Option key={sourceMoney.id} value={sourceMoney.id}>{sourceMoney.name}</Option>
                        ))}
              </Select>
            </Form.Item> */}

              <Form.Item
                name="YearMoneyGet"
                label="ปีงบประมาณ"
                className="w-full"
                rules={[{ required: false, message: "กรุณาเลือกปีงบประมาณ" }]}
              >
                <Select
                ref={yearMoneyGetRef}
                onKeyDown={(e) => handleEnterKey(e, dateOrderRef)}
                >
                  {yearMoneyGetOptions.map((yearMoneyGet) => (
                    <Option key={yearMoneyGet.id} value={yearMoneyGet.id}>
                      {yearMoneyGet.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div>
              {/* คอลัมน์ขวา */}

              <Form.Item
                label="วันที่สั่งซื้อ"
                name="DateOrder"
                rules={[
                  {
                    required: false,
                    message: "Please input!",
                  },
                ]}
              >
                <DatePicker 
                ref={dateOrderRef}
                onKeyDown={(e) => handleEnterKey(e, dateReceiveRef)}
                />
              </Form.Item>

              <Form.Item
                label="วันที่ตรวจรับ/วันที่รับโอน"
                name="DateRecive"
                rules={[
                  {
                    required: false,
                    message: "Please input!",
                  },
                ]}
              >
                <DatePicker
                 ref={dateReceiveRef}
                 onKeyDown={(e) => handleEnterKey(e, companyInventoryRef)}
                />
              </Form.Item>
              
            </div>
          </div>

          <Form.Item
            name="company_inventory"
            label="ตัวแทนบริษัท"
            className="w-full"
            rules={[{ required: false, message: "กรุณาเลือกตัวแทน" }]}
          >
            <Select
              ref={companyInventoryRef}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              optionFilterProp="children"
              showSearch
              onSearch={setSearchValue}
              value={searchValue}
              onChange={(value) => {
                setSearchValue(value);
              }}
              onKeyDown={(e) => handleEnterKey(e, serialNumberRef )}
            >
              {companyOptions.map((company) => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="border-b-2 border-black mb-10 mt-10">
            <h1 className="text-lg text-blue-800">รายละเอียดครุภัณฑ์</h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* คอลัมน์ซ้าย */}
              <Form.Item name="serialNumber" label="หมายเลข SN">
                <Input  ref={serialNumberRef } onKeyDown={(e) => handleEnterKey(e, brandRef)} />
              </Form.Item>

              <Form.Item name="brand" label="ยี่ห้อ">
                <Input ref={brandRef } onKeyDown={(e) => handleEnterKey(e, modelRef )} />
              </Form.Item>

              <Form.Item name="model" label="รุ่น">
              <Input ref={modelRef } onKeyDown={(e) => handleEnterKey(e, prizeRef  )} />
              </Form.Item>

              <Form.Item name="prize" label="ราคาที่ซื้อ (บาท)">
                <Input  ref={prizeRef } onKeyDown={(e) => handleEnterKey(e, quantityRef   )} />
              </Form.Item>
            </div>
            <div>
              {/* คอลัมน์ขวา */}

              <div className="flex flex-row gap-2">
              <Form.Item 
    name="quantity" 
    label="จำนวนรายการตามทะเบียน/ตรวจสอบ" 
    className="w-4/12"
    rules={[{ required: false , message: 'กรุณาระบุจำนวน' }]}
  >
    <Input
  ref={quantityRef}
  onKeyDown={(e) => handleEnterKey(e, unitRef)}
  style={{ width: '100%' }}
/>
  </Form.Item>
                <Form.Item
                  name="unit"
                  label="หน่วยนับ"
                  className="w-6/12"
                  rules={[{ required: false, message: "กรุณาเลือกหน่วยรับ" }]}
                >
                  <Select
                    ref={unitRef }
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onKeyDown={(e) => handleEnterKey(e, ageUseRef)}
                  >
                    {unitOptions.map((unit) => (
                      <Option key={unit.id} value={unit.id}>
                        {unit.name}
                      </Option>
                    ))}
                   
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
               
                name="age-use"
                label="อายุการใช้งานโดยประเมิน"
                className="w-full"
                rules={[
                  { required: false, message: "กรุณาเลือกเลือกอายุการใช้งาน" },
                ]}
              >
                <Select
                 ref={ageUseRef }
                 onKeyDown={(e) => handleEnterKey(e, informationRef )}
                >
                  <Option value="1">1 ปี</Option>
                  <Option value="2">2 ปี</Option>
                  <Option value="3">3 ปี</Option>
                  <Option value="4">4 ปี</Option>
                  <Option value="6">5 ปี</Option>
                  <Option value="7">7 ปี</Option>
                  <Option value="8">8 ปี</Option>
                  <Option value="9">9 ปี</Option>
                  <Option value="10">10 ปี</Option>
                  <Option value="11">11 ปี</Option>
                  <Option value="12">12 ปี</Option>
                  <Option value="13">13 ปี</Option>
                  <Option value="14">14 ปี</Option>
                  <Option value="15">15 ปี</Option>
                  <Option value="16">16 ปี</Option>
                  <Option value="17">17 ปี</Option>
                  <Option value="18">18 ปี</Option>
                  <Option value="19">19 ปี</Option>
                  <Option value="20">20 ปี</Option>
                  <Option value="20++">20 ปี++</Option>

                  {/* ... ตัวเลือกอื่นๆ */}
                </Select>
              </Form.Item>

              {/* <div className=" mb-2">
              <span className="text-sm font-medium">อายุการใช้งานเครื่อง</span>
            </div>
            <div className="flex items-center border-1  border-black rounded-lg bg-gray-200 p-2  w-48">
              <span className="text-sm font-medium">{daysPassed} วัน 0 เดือน 0 ปี</span>
            </div> */}

              <Form.Item name="information" label="รายละเอียดเพิ่มเติม">
                <Input ref={informationRef} className="pb-10" />
              </Form.Item>
            </div>
          </div>

          <div className="border-b-2 border-black mb-6 mt-10">
            <h1 className="text-lg text-blue-800">
            ข้อมูลองค์ประกอบในชุดครุภัณฑ์
            </h1>
          </div>
          
          <AddTest items={items} setItems={setItems} count={count} setCount={setCount}  />

{/* <div>
        {items.map((item, index) => (
          <div key={index} className="item">
            <span>{item.testName}</span>
            <button onClick={() => removeItem(index)}>Remove</button>
          </div>
        ))}
      </div> */}


          <div className="flex justify-center space-x-2">
            <Form.Item>
              <Button
                className="bg-blue-300 px-10 "
                type="primary"
                htmlType="submit"
                icon={<PrinterOutlined />}
              >
                บันทึก
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                className="bg-red-500 text-white px-10"
                onClick={handleReset}
                icon={<DeleteOutlined />}
              >
                ยกเลิก
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
}

export default AddInventory;
