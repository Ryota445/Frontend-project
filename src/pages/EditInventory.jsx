import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, Upload, message,InputNumber } from "antd";
import { UploadOutlined, PlusOutlined, PrinterOutlined, DeleteOutlined,FileOutlined } from "@ant-design/icons";
import AddTest from "../components/AddTest";
import { useParams } from "react-router-dom"; // Import useParams for getting ID from route
import moment from 'moment';

const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function EditInventory() {
  const { id } = useParams(); // Get ID from route
  const [form] = Form.useForm();
  const API_URL = import.meta.env.VITE_API_URL;
  const [companyOptions, setCompanyOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [responsibleOptions, setResponsibleOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [howToGetOptions, setHowToGetOptions] = useState([]);
  const [yearMoneyGetOptions, setYearMoneyGetOptions] = useState([]);
  const [sourceMoneyOptions, setSourceMoneyOptions] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const [inventoryCount, setInventoryCount] = useState(1); // Number of inventories
  const [startInventoryNumber, setStartInventoryNumber] = useState(""); // Starting inventory number
  const [subInventories, setSubInventories] = useState([]);

  const [activeButton, setActiveButton] = useState("single");

  const [selectedResponsibles, setSelectedResponsibles] = useState([]);

  const [fileList, setFileList] = useState([]);
  const [haveImg, setHaveImg] = useState(false)

  useEffect(() => {
    const endInventoryNumber = parseInt(startInventoryNumber) + parseInt(inventoryCount) - 1; 
    form.setFieldsValue({
      inventory_number_m_start: startInventoryNumber,
      inventory_number_m_end: endInventoryNumber.toString(),
    });
  }, [inventoryCount, startInventoryNumber]);

  useEffect(() => {
    // เมื่อโหลดข้อมูลครั้งแรก
    const initialResponsibles = form.getFieldValue('responsibles') || [];
    setSelectedResponsibles(initialResponsibles);
  }, [form]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch companies
        const companyResponse = await fetch(`${API_URL}/api/company-inventories`);
        const companyData = await companyResponse.json();
        setCompanyOptions(companyData.data.map((item) => ({
          id: item.id,
          name: item.attributes.contactName + " / " + item.attributes.Cname +(item?.attributes?.role ? ` (${item.attributes.role})` : ''),
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
        
        // Fetch inventory data to edit
        const inventoryResponse = await fetch(`${API_URL}/api/inventories/${id}?populate=*`);
        const inventoryData = await inventoryResponse.json();
        form.setFieldsValue({
          name: inventoryData.data.attributes.name,
          id_inv: inventoryData.data.attributes.id_inv,
          category: inventoryData.data.attributes?.category?.data?.id,
          building: inventoryData.data.attributes.building?.data?.id,
          floor: inventoryData.data.attributes.floor,
          room: inventoryData.data.attributes.room,
          responsibles: inventoryData.data.attributes.responsibles?.data?.map(resp => resp.id) || [],
          howToGet: inventoryData.data.attributes?.how_to_get?.data?.id,
          sourceMoney: inventoryData.data.attributes.sourceMoney,
          YearMoneyGet: inventoryData.data.attributes?.year_money_get?.data?.id,
          DateOrder: inventoryData.data.attributes.DateOrder ? moment(inventoryData.data.attributes.DateOrder) : null,
          DateRecive: inventoryData.data.attributes.DateRecive ? moment(inventoryData.data.attributes.DateRecive) : null,
          company_inventory: inventoryData.data.attributes?.company_inventory?.data?.id,
          serialNumber: inventoryData.data.attributes.serialNumber,
          model: inventoryData.data.attributes.model,
          brand: inventoryData.data.attributes.brand,
          prize: inventoryData.data.attributes.prize,
          asset_code: inventoryData.data.attributes.asset_code,
          quantity: inventoryData.data.attributes.quantity,
          unit: inventoryData.data.attributes.unit?.data?.id,
          information: inventoryData.data.attributes.information,
          age_use: inventoryData.data.attributes?.age_use +'ปี',
          // Add other fields as needed
        });
        if (inventoryData.data.attributes.img_inv?.data) {
          setFileList({name:inventoryData.data.attributes.img_inv?.data.attributes.name,url:API_URL+inventoryData.data.attributes.img_inv?.data.attributes.url});
          setHaveImg(true)
        }
        setSubInventories(inventoryData?.data?.attributes?.sub_inventories?.data)
      
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [id, form]);

  useEffect(() => {
    console.log("name-file : ",fileList.name)
    console.log("name-url : ",fileList.url)
  
  
  }, [fileList])
  


// subsetInventory 
const addSubInventory = () => {
  setSubInventories([...subInventories, { id_inv: '', name: '', serialNumber: '', brand: '', model: '', detail: '', status_inventory: 1 }]);
};

const updateSubInventory = (index, field, value) => {
    const updatedSubInventories = subInventories.map((subInventory, i) => 
      i === index ? { ...subInventory, [field]: value } : subInventory
    );
    setSubInventories(updatedSubInventories);
  };

 const removeSubInventory = (index) => {
    const updatedSubInventories = [...subInventories];
    updatedSubInventories.splice(index, 1);
    setSubInventories(updatedSubInventories);
  };



  const handleChange = (index, field, value) => {
    const newSubInventories = [...subInventories];
    newSubInventories[index] = {
      ...newSubInventories[index],
      attributes: {
        ...newSubInventories[index].attributes,
        [field]: value,
      },
    };
    setSubInventories(newSubInventories);
  };






    const onFinish = async (values) => {
    const subInventoryIds = [];
    for (const subInventory of subInventories) {
      const subInventoryId = await saveSubInventoryData(subInventory);
      if (subInventoryId) {
        subInventoryIds.push(subInventoryId);
      } else {
        message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูลครุภัณฑ์ภายในชุด");
        return;
      }
    }
    console.log('value :',values)

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        name: values.name,
        id_inv: values.id_inv,
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
        information: values.information,
        age_use: values.age_use ? parseInt(values.age_use) : 0,
        inventory_number_m_start: values.inventory_number_m_start,
        inventory_number_m_end: values.inventory_number_m_end,
        sub_inventories: subInventoryIds,
      })
    );

    if (values.img_inv && values.img_inv.length > 0) {
      formData.append("files.img_inv", values.img_inv[0].originFileObj);
    }



      // Log the formData for inspection
    try {
      const response = await fetch(`${API_URL}/api/inventories/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        message.success("แก้ไขข้อมูลครุภัณฑ์สำเร็จ");
      } else {
        message.error("แก้ไขข้อมูลครุภัณฑ์ไม่สำเร็จ",formData);
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูลครุภัณฑ์");
      
    }
  };

  const saveSubInventoryData = async (subInventory) => {
    const formDataSub = new FormData();
    formDataSub.append("data", JSON.stringify({
      id_inv: subInventory?.attributes?.id_inv,
      name: subInventory?.attributes?.name,
      serialNumber: subInventory?.attributes?.serialNumber,
      brand: subInventory?.attributes?.brand,
      model: subInventory?.attributes?.model,
      detail: subInventory?.attributes?.detail,
    }));
  
    try {
      const response = await fetch(`${API_URL}/api/sub-inventories/${subInventory.id}`, {
        method: "PUT",
        // Do not set the Content-Type header manually when using FormData
        body: formDataSub,
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.data.id;
      } else {
        console.error("เกิดข้อผิดพลาดในแก้ข้อมูลครุภัณฑ์ภายในชุด.", formDataSub);
        return null;
      }
    } catch (error) {
      console.error("Error saving sub-inventory data:", error);
      return null;
    }
  };
  

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
      return responseData.data.id;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const postInventoryData = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/inventories/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Response not OK");
      const responseData = await response.json();
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
    const startDate = form.getFieldValue('DateRecive');
    if (startDate) {
      const currentDate = moment();
      const diff = currentDate.diff(startDate, 'days');
      setDaysPassed(diff);
      form.setFieldsValue({
        'age-use': `${diff} วัน`,
      });
    }
  }, [form, form.getFieldValue('DateRecive')]);

  return (
    <>
        <div className=" mx-4 mb-10 mt-10">
          <h1 className="text-3xl text-blue-800">แก้ไขข้อมูลครุภัณฑ์</h1>
        </div>

    <div className="App">
      <Form
        form={form}
        name="equipment-form"
        onFinish={onFinish}
        layout="vertical"
        className="m-4"
       
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
              <Input />
            </Form.Item>

            {/* ตรวจสอบสถานะของ activeButton เพื่อแสดงฟอร์มที่ถูกต้อง */}
            {activeButton === "single" ? (
              <Form.Item name="id_inv" label="หมายเลขครุภัณฑ์">
                <Input />
              </Form.Item>
            ) : (
              <>
                <Form.Item name="inventory_count" label="จำนวนครุภัณฑ์">
                  <Input
                    value={inventoryCount}
                    onChange={(e) => setInventoryCount(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name="inventory_number_m_start"
                  label="หมายเลขครุภัณฑ์ ตั้งแต่ ->"
                >
                  <Input
                    value={startInventoryNumber}
                    onChange={(e) => setStartInventoryNumber(e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="inventory_number_m_end" label="ถึง: หมายเลข">
                  <Input disabled />
                </Form.Item>
              </>
            )}

            {/* <Form.Item name="Inventory_number_faculty" label="รหัสสินทรัพย์">
            <Input />
          </Form.Item> */}

<Form.Item
  name="category"
  label="หมวดหมู่ครุภัณฑ์"
  rules={[{ required: false, message: "กรุณาเลือกหมวดหมู่" }]}
>
  <Select
    showSearch
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    {categoryOptions.map((category) => (
      <Option key={category.id} value={category.id}>
        {category.name}
      </Option>
    ))}
  </Select>
</Form.Item>

<Form.Item
                name="asset_code"
                label="รหัสสินทรัพย์"
                rules={[{ required: false, message: "กรุณากรอกรหัสสินทรัพย์" }]}
              >
                <Input />
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
    showSearch
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
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
                <Input />
              </Form.Item>

              <Form.Item name="room" label="ห้อง" className="w-full">
                <Input />
              </Form.Item>
            </div>

            <Form.Item
  name="responsibles"
  label="ผู้ดูแล"
  rules={[{ required: false, message: "กรุณาเลือกผู้รับผิดชอบ" }]}
>
  <Select
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
            {haveImg && <a href={fileList.url} target="_blank" rel="noopener noreferrer"><FileOutlined /><span className='ml-2'>รูปเดิม :{fileList.name}</span></a>}
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
              <Select>
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
              <Select>
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
              <DatePicker />
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
              <DatePicker />
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
              <Input />
            </Form.Item>

            <Form.Item name="brand" label="ยี่ห้อ">
              <Input />
            </Form.Item>

            <Form.Item name="model" label="รุ่น">
              <Input />
            </Form.Item>

            <Form.Item name="prize" label="ราคาที่ซื้อ (บาท)">
              <Input type="number" />
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
    <InputNumber min={1} style={{ width: '100%' }} />
  </Form.Item>
                <Form.Item
                  name="unit"
                  label="หน่วยนับ"
                  className="w-6/12"
                  rules={[{ required: false, message: "กรุณาเลือกหน่วยรับ" }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
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
              name="age_use"
              label="อายุการใช้งานโดยประเมิน"
              className="w-full"
              rules={[
                { required: false, message: "กรุณาเลือกเลือกอายุการใช้งาน" },
              ]}
            >
              <Select>
                <Option value="1">1ปี</Option>
                <Option value="2">2ปี</Option>
                <Option value="3">3ปี</Option>
                <Option value="4">4ปี</Option>
                <Option value="6">5ปี</Option>
                <Option value="7">7ปี</Option>
                <Option value="8">8ปี</Option>
                <Option value="9">9ปี</Option>
                <Option value="10">10ปี</Option>
                <Option value="10++">10ปี++</Option>

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
              <Input className="pb-10" />
            </Form.Item>
          </div>
        </div>

        <div className="border-b-2 border-black mb-6 mt-10">
          <h1 className="text-lg text-blue-800">
            ข้อมูลองค์ประกอบในชุดครุภัณฑ์
          </h1>
        </div>
{/* 
        <AddTest items={items} setItems={setItems} count={count} setCount={setCount} />

<div>
      {items.map((item, index) => (
        <div key={index} className="item">
          <span>{item.testName}</span>
          <button onClick={() => removeItem(index)}>Remove</button>
        </div>
      ))}
    </div> */}




<table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          หมายเลขต่อท้าย
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ชื่อครุภัณฑ์
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            หมายเลข SN
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ยี่ห้อ
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            รุ่น
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {!subInventories || subInventories.length === 0 ? (
          <tr>
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
              ไม่มีข้อมูลองค์ประกอบในชุดครุภัณฑ์
            </td>
          </tr>
        ) : (
          subInventories.map((item, index) => (
       
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Input
                  value={item?.attributes?.id_inv}
                  onChange={(e) => handleChange(index, 'id_inv', e.target.value)}
                />
                   {console.log("item in sub inventory map :",item)}
                   {console.log("index in sub inventory map :",index)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Input
                  value={item?.attributes?.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Input
                  value={item?.attributes?.serialNumber}
                  onChange={(e) => handleChange(index, 'serialNumber', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Input
                  value={item?.attributes?.brand}
                  onChange={(e) => handleChange(index, 'brand', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Input
                  value={item?.attributes?.model}
                  onChange={(e) => handleChange(index, 'model', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Button
                  className="font-bold rounded-lg text-base w-32 h-8 bg-red-600 text-white"
                  onClick={() => removeSubInventory(index)}
                >
                  ลบ
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>



<Button type="dashed" icon={<PlusOutlined />} onClick={addSubInventory}>
  เพิ่มข้อมูลครุภัณฑ์ภายในชุด
</Button>


        <div className="flex justify-center space-x-2">
          <Form.Item>
            <Button
              className="bg-blue-300 px-4 "
              type="primary"
              htmlType="submit"
              icon={<PrinterOutlined />}
            >
              บันทึกการแก้ไข
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

export default EditInventory;
