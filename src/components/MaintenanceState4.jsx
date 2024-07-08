import React, { useState,useEffect } from 'react';
import { Select, Button, DatePicker, Upload, Input, Checkbox, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { TextArea } = Input;

function MaintenanceState4({ onFormDataChange ,onFormDataChangeFile}) {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [companyOptions, setCompanyOptions] = useState([]);


  useEffect(() => {
    async function fetchData() {
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
fetchData();
}, []);
  

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFormChange = (changedValues, allValues) => {
    onFormDataChange(allValues);
  };

  const handleFileChange = ({ fileList }) => {
    onFormDataChangeFile({ FileRepairDone: fileList });
  };

  return (
    <>
      <div className='grid grid-cols-5'>
        <div>{/* ขอบซ้าย*/}</div>
        <div className='col-span-3'>
          <h1 className='text-2xl text-gray-500 my-2 mb-2'>ดำเนินการซ่อมแซมครุภัณฑ์</h1>

          <div className='border-2 border-blue-500 rounded-md px-4 pb-4 mb-2'>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onValuesChange={handleFormChange}
            >
              <Form.Item name="NumberRepairFaculty" label="เลขที่ใบแจ้งซ่อมที่ส่งมาจากคณะฯ">
                <Input placeholder="เลขที่ใบแจ้งซ่อม" />
              </Form.Item>

              <Form.Item name="company_inventory" label="ตัวแทน/บริษัท">
                
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

              <Form.Item name="NameRepair" label="ชื่อการซ่อมแซม">
                <Input placeholder="ชื่อการซ่อมแซม" />
              </Form.Item>

              <Form.Item name="ListDetailRepair" label="รายการซ่อม">
                <TextArea rows={2} placeholder="รายละเอียดในการซ่อม" />
              </Form.Item>

              <Form.Item name="RepairPrice" label="ค่าใช้จ่าย">
                <Input placeholder="ค่าใช้จ่าย" addonAfter="บาท" />
              </Form.Item>


              <Form.Item
                  name="FileRepairDone" 
                  label="เอกสารการซ่อม"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    name="FileRepairDone"
                    listType="picture-card"
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                  >
                    <button
                      style={{
                        border: 0,
                        background: "none",
                      }}
                      type="button"
                    >
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>อัปโหลด</div>
                    </button>
                  </Upload>
                </Form.Item>
            </Form>
          </div>

          <Checkbox
            checked={componentDisabled}
            onChange={(e) => setComponentDisabled(e.target.checked)}
          >
            <p className='text-lg'>ต้องการกำหนดวันที่ดำเนินการซ่อมหรือไม่</p>
          </Checkbox>

          {componentDisabled && (
            <div className='border-2 border-blue-500 rounded-md px-4 mt-2'>
              <Form onValuesChange={handleFormChange}>
                <Form.Item name="dateDoingRepair" label="วันที่ดำเนินการซ่อมแซมครุภัณฑ์">
                  <DatePicker className="w-full" />
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
        <div>{/* ขอบขวา*/}</div>
      </div>
    </>
  );
}

export default MaintenanceState4;