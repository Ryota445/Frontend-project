import React from 'react'
import { useState, useEffect } from 'react';
import FormAddInventory from '../components/FormAddInventory'
import { Form, Input, Button, DatePicker, Select, Upload, Space ,message } from 'antd';
import { UploadOutlined , PlusOutlined ,PrinterOutlined ,DeleteOutlined} from '@ant-design/icons';
import AddTest from '../components/AddTest';
const { Option } = Select;


const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};






function AddInventory() {

  const [form] = Form.useForm();

  const [companyOptions, setCompanyOptions] = useState([]);
  const [responsibleOptions, setResponsibleOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [howToGetOptions, setHowToGetOptions] = useState([]);
  const [yearMoneyGetOptions, setYearMoneyGetOptions] = useState([]);
  const [sourceMoneyOptions, setSourceMoneyOptions] = useState([]);

  const [searchValue, setSearchValue] = useState('');


  const [inventoryCount, setInventoryCount] = useState(1); // เก็บจำนวนครุภัณฑ์
  const [startInventoryNumber, setStartInventoryNumber] = useState(''); // เก็บหมายเลขครุภัณฑ์เริ่มต้น

  const [activeButton,setActiveButton] = useState('single');


  useEffect(() => {
    // สร้างหมายเลขครุภัณฑ์ตามจำนวนที่ระบุ
    const endInventoryNumber = parseInt(startInventoryNumber) + parseInt(inventoryCount) - 1; // เปลี่ยนเป็น parseInt(inventoryCount)
    form.setFieldsValue({
      inventory_number_m_start: startInventoryNumber,
      inventory_number_m_end: endInventoryNumber.toString(),
    });
  }, [inventoryCount, startInventoryNumber]);
  


  useEffect(() => {
    async function fetchData() {
        try {
            // Fetch companies
            const companyResponse = await fetch('http://localhost:1337/api/company-inventories');
            const companyData = await companyResponse.json();
            setCompanyOptions(companyData.data.map(item => ({
                id: item.id,
                name: item.attributes.contactName   + " / " + item.attributes.Cname,
            })));

            // Fetch responsibles
            const responsibleResponse = await fetch('http://localhost:1337/api/responsibles');
            const responsibleData = await responsibleResponse.json();
            setResponsibleOptions(responsibleData.data.map(item => ({
                id: item.id,
                name: item.attributes.responsibleName,
            })));

            // Fetch categories
            const categoryResponse = await fetch('http://localhost:1337/api/categories');
            const categoryData = await categoryResponse.json();
            setCategoryOptions(categoryData.data.map(item => ({
                id: item.id,
                name: item.attributes.CategoryName,
            })));

            // Fetch buildings
            const buildingResponse = await fetch('http://localhost:1337/api/buildings');
            const buildingData = await buildingResponse.json();
            setBuildingOptions(buildingData.data.map(item => ({
                id: item.id,
                name: item.attributes.buildingName,
            })));
            
            // Fetch howToGet
            const howToGetResponse = await fetch('http://localhost:1337/api/how-to-gets');
            const howToGetData = await howToGetResponse.json();
            setHowToGetOptions(howToGetData.data.map(item => ({
                id: item.id,
                name: item.attributes.howToGetName,
            })));

            // Fetch howToGet
            const sourceMoneyResponse = await fetch('http://localhost:1337/api/source-monies');
            const sourceMoneyData = await sourceMoneyResponse.json();
            setSourceMoneyOptions(sourceMoneyData.data.map(item => ({
                id: item.id,
                name: item.attributes.sourceMoneyName,
            })));
            
            // Fetch yearMoneyGet options
            const yearMoneyGetResponse = await fetch('http://localhost:1337/api/year-money-gets');
            const yearMoneyGetData = await yearMoneyGetResponse.json();
            
            // Sort yearMoneyGet options by name
            const sortedYearMoneyGetOptions = yearMoneyGetData.data.map(item => ({
                id: item.id,
                name: item.attributes.yearMoneyGetName,
            })).sort((a, b) => a.name.localeCompare(b.name));
            
            // Set sorted options to state
            setYearMoneyGetOptions(sortedYearMoneyGetOptions);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchData();
  }, []);



    

  const onFinish = async (values) => {
    for (let i = 0; i < inventoryCount; i++) {
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        name: values.name,
        id_inv: ((parseInt(startInventoryNumber) || parseInt(values.id_inv) ) + i).toString(), // Use parseInt and fallback to 0 if NaN
        // เพิ่มข้อมูลอื่น ๆ ที่ต้องการส่งไปยังเซิร์ฟเวอร์
        // inventory_number_m_start: values.inventory_number_m_start,
        // inventory_number_m_end: values.inventory_number_m_end,
        // Inventory_number_faculty: values.Inventory_number_faculty,
        category: values.category,
        building: values.building,
        floor: values.floor,
        rooms: values.room,
        responsible: values.responsible,
        how_to_get: values.howToGet,
        sourceMoney:values.sourceMoney,
        year_money_get: values.YearMoneyGet,
        DateOrder: values.DateOrder ? values.DateOrder.format('YYYY-MM-DD') : null, // ตรวจสอบว่ามีการเลือกวันที่
        DateRecive: values.DateRecive ? values.DateRecive.format('YYYY-MM-DD') : null, // ตรวจสอบว่ามีการเลือกวันที่
        company_inventory: values.company_inventory,
        serialNumber: values.serialNumber,
        model: values.model,
        brand: values.brand,
        prize: values.prize,
        age_use: values["age-use"],
        information: values.information,
        // อื่นๆ ตามที่มีในฟอร์ม
      }));
  
      if (values.img_inv && values.img_inv.length > 0) {
        // ตรวจสอบและเพิ่มไฟล์รูปภาพเข้าไปใน formData
        formData.append("files.img_inv", values.img_inv[0].originFileObj);
      }
  
      // ส่งข้อมูลฟอร์มไปยัง API
      const response = await postInventoryData(formData); // ใช้ formData แทน object
      if (response) {
        message.success('บันทึกข้อมูลสำเร็จ');
        form.resetFields(); // เคลียร์ฟอร์มหลังจากการส่งข้อมูลสำเร็จ
      } else {
        message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    }
  }; // Add this closing brace

  // ฟังก์ชัน postInventoryData แก้ไขให้รองรับ FormData
  const postInventoryData = async (formData) => {
    try {
      const response = await fetch('http://localhost:1337/api/inventories', {
        method: 'POST',
        body: formData, // ไม่ต้องตั้งค่า headers ที่นี่ เพราะ FormData จะกำหนด Content-Type ให้เอง
      });
      if (!response.ok) throw new Error('Response not OK');
      const responseData = await response.json();
      console.log('Response:', responseData);
      return responseData; // คืนค่า response data
    } catch (error) {
      console.error('Error:', error);
      return null; // คืนค่า null ในกรณีมีข้อผิดพลาด
    }
  };

   // ฟังก์ชันสำหรับเคลียร์ฟอร์ม
   const handleReset = () => {
    form.resetFields();
  };



  const handleClickMenuAdd = (buttonName)=> {
    setActiveButton(buttonName)
  }


  const [daysPassed, setDaysPassed] = useState(0);

  useEffect(() => {
    const startDate = new Date('2024-02-14');
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
          activeButton === 'single' ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-700 hover:bg-blue-500 hover:text-white'
        } border border-blue-500`}
        onClick={() => handleClickMenuAdd('single')}
      >
        เพิ่มครุภัณฑ์รายการเดียว
      </button>

      <button
        className={`py-2 px-4 rounded ${
          activeButton === 'many' ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-700 hover:bg-blue-500 hover:text-white'
        } border border-blue-500`}
        onClick={() => handleClickMenuAdd('many')}
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
      >
        
        <div className='border-b-2 border-black mb-10 mt-10'>
        <h1 className='text-lg text-blue-800'>ข้อมูลครุภัณฑ์</h1>
        </div>


        <div className="grid grid-cols-2 gap-4">
          <div className='mt-5'>
            {/* คอลัมน์ซ้าย */}
            
            <Form.Item name="name" label="ชื่อครุภัณฑ์" rules={[{ required: true, message: 'กรุณากรอกชื่ออุปกรณ์' }]}>
              <Input />
            </Form.Item>

          {/* ตรวจสอบสถานะของ activeButton เพื่อแสดงฟอร์มที่ถูกต้อง */}
            {activeButton === 'single' ? (
            <Form.Item name="id_inv" label="หมายเลขครุภัณฑ์">
              <Input />
            </Form.Item>
          ) : ( 
            <>
              <Form.Item name="inventory_count" label="จำนวนครุภัณฑ์">
                <Input value={inventoryCount} onChange={(e) => setInventoryCount(e.target.value)} />
              </Form.Item>

              <Form.Item name="inventory_number_m_start" label="หมายเลขครุภัณฑ์ ตั้งแต่ ->">
                <Input value={startInventoryNumber} onChange={(e) => setStartInventoryNumber(e.target.value)} />
              </Form.Item>

              <Form.Item name="inventory_number_m_end" label="ถึง: หมายเลข">
                <Input disabled />
              </Form.Item>

            </>
          )}

            {/* <Form.Item name="Inventory_number_faculty" label="รหัสสินทรัพย์">
              <Input />
            </Form.Item> */}

            <Form.Item name="category" label="หมวดหมู่ครุภัณฑ์" rules={[{ required: false, message: 'กรุณาเลือกหมวดหมู่' }]}>
              <Select>
                      {categoryOptions.map(category => (
                            <Option key={category.id} value={category.id}>{category.name}</Option>
                        ))}
              </Select>
            </Form.Item>
          </div>
          <div>
            {/* คอลัมน์ขวา */}
            <label>ที่ตั้งครุภัณฑ์</label>

            <div className="flex space-x-2">

            <Form.Item name="building" label="อาคาร" className="w-full" rules={[{ required: false, message: 'กรุณาเลือกอาคาร' }]}>
              <Select>
                  {buildingOptions.map(building => (
                                <Option key={building.id} value={building.id}>{building.name}</Option>
                            ))}
              </Select>
            </Form.Item>
            
          
            <Form.Item name="floor" label="ชั้น" className="w-full" rules={[{ required: false, message: 'กรุณาเลือกชั้น' }]}>
              <Select>
                <Option value="B">B</Option>
                <Option value="G">G</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
                <Option value="6">6</Option>
                <Option value="7">7</Option>
                <Option value="8">8</Option>
                <Option value="9">9</Option>
                <Option value="10">10</Option>
                <Option value="11">11</Option>
                <Option value="12">12</Option>
                <Option value="13">13</Option>
                <Option value="14">14</Option>
                <Option value="15">15</Option>
                <Option value="16">16</Option>
                <Option value="17">17</Option>
                <Option value="18">18</Option>
                <Option value="19">19</Option>
                <Option value="20">20</Option>
                
                {/* ... ตัวเลือกอื่นๆ */}
              </Select>
            </Form.Item>

            <Form.Item name ="room" label="ห้อง" className="w-full">
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="responsible" label="ผู้ดูแล" rules={[{ required: false, message: 'กรุณาเลือกผู้รับผิดชอบ' }]}>
              <Select>
                        {responsibleOptions.map(responsible => (
                            <Option key={responsible.id} value={responsible.id}>{responsible.name}</Option>
                        ))}
              </Select>
          </Form.Item>
          


            <Form.Item name="img_inv" label="รูปครุภัณฑ์" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload name="img_inv" listType="picture-card" beforeUpload={() => false}>
          <button
            style={{
              border: 0,
              background: 'none',
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



        <div className='border-b-2 border-black mb-10 mt-10'>
        <h1 className='text-lg text-blue-800'>วิธีได้มา</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            {/* คอลัมน์ซ้าย */}
            <Form.Item name="howToGet" label="วิธีได้มา" className="w-full" rules={[{ required: false, message: 'กรุณาเลือกวิธีได้มา' }]}>
              <Select>
              {howToGetOptions.map(howToget => (
                            <Option key={howToget.id} value={howToget.id}>{howToget.name}</Option>
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

            <Form.Item name="YearMoneyGet" label="ปีงบประมาณ" className="w-full" rules={[{ required: false, message: 'กรุณาเลือกปีงบประมาณ' }]}>
              <Select>
                    {yearMoneyGetOptions.map(yearMoneyGet => (
                                  <Option key={yearMoneyGet.id} value={yearMoneyGet.id}>{yearMoneyGet.name}</Option>
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
                    message: 'Please input!',
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
                    message: 'Please input!',
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
                rules={[{ required: false, message: 'กรุณาเลือกตัวแทน' }]}
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


        <div className='border-b-2 border-black mb-10 mt-10'>
        <h1 className='text-lg text-blue-800'>รายละเอียดครุภัณฑ์</h1>
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
              <Input type='number'/>
            </Form.Item>

          </div>
          <div>
            {/* คอลัมน์ขวา */}

            <Form.Item name="age-use" label="อายุการใช้งานโดยประเมิน" className="w-full" rules={[{ required: false, message: 'กรุณาเลือกเลือกอายุการใช้งาน' }]}>
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
              <Input className='pb-10'/>
            </Form.Item>
          
           </div>
          </div> 


        <div className='border-b-2 border-black mb-6 mt-10'>


        <h1 className='text-lg text-blue-800'>เพิ่มข้อมูลครุภัณฑ์ภายในชุด</h1>
        </div>

       

        <AddTest items={items} setItems={setItems} removeItem={removeItem} />
        
          


          <div className="flex justify-center space-x-2">
          <Form.Item>
            <Button className='bg-blue-300 px-10 ' type="primary" htmlType="submit" icon={<PrinterOutlined />}>
              บันทึก
            </Button>
          </Form.Item>

          <Form.Item>
            <Button className='bg-red-500 text-white px-10' onClick={handleReset} icon={<DeleteOutlined />}>
              ยกเลิก
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>


    </>
  )
}

export default AddInventory