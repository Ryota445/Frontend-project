import React, { useState } from 'react';
import { Select, Button, DatePicker, Upload, Image, message, Input, Checkbox, Form } from 'antd';
import { UploadOutlined, InboxOutlined, FileOutlined } from '@ant-design/icons';

const { TextArea } = Input;

function MaintenanceState3({ onFormDataChange, onFormDataChangeFile }) {
  const [componentDisabled, setComponentDisabled] = useState(false);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  
  const handleFileChange = ({ fileList }) => {
    onFormDataChangeFile({ FileRepairDone: fileList });
  };


  return (
    <>
      <div className='grid grid-cols-5'>
        <div>{/* ขอบซ้าย */}</div>
        <div className='col-span-3'>
          <h1 className='text-2xl text-gray-500 my-2 mb-2'>บันทึกผลพิจารณาซ่อมแซมครุภัณฑ์</h1>

          <div className='border-2 border-blue-500 rounded-md px-4 pb-4 mb-2'>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">ผลการพิจารณาซ่อมแซมครุภัณฑ์จากคณะฯ</label>
              <Input name="ResultConsider" placeholder="ผลการพิจารณา" onChange={handleInputChange} />
            </div>
            {/* <h1 className='text-2xl text-gray-500'>รายละเอียดและเอกสารเพิ่มเติมโดยเจ้าหน้าที่ (หากมี)</h1> */}
              <Form
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 14,
                }}
                layout="horizontal"
                // disabled={!componentDisabled}
              >
                <Form.Item>
                  <div className='mt-2'>
                    <label className="block text-lg font-medium">รายละเอียดเพิ่มเติมสำหรับผลการพิจารณา (หากมี)</label>
                    <TextArea
                      name="DetailConsider"
                      rows={2}
                      placeholder="รายละเอียดในการทำเรื่องพิจารณาซ่อมเพิ่มเติมโดยเจ้าหน้าที่"
                      onChange={handleInputChange}
                    />
                  </div>
                </Form.Item>

                <Form.Item
                  name="FileConsider" 
                 
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <label className="block text-lg font-medium">เอกสารเพิ่มเติมสำหรับผลการพิจารณา (หากมี)</label>
                  <Upload
                    name="FileConsider"
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

          {/* <div>
            <Checkbox
              checked={componentDisabled}
              onChange={(e) => setComponentDisabled(e.target.checked)}
            >
              <p className='text-lg'>มีรายละเอียดที่ต้องการเพิ่ม</p>
            </Checkbox>
          </div> */}

          {/* {componentDisabled && ( */}
            {/* <div className='border-2 border-blue-500 rounded-md px-4 mt-2'>
              
            </div> */}
          {/* )} */}
        </div>
        <div>{/* ขอบขวา */}</div>
      </div>
    </>
  );
}

export default MaintenanceState3;
