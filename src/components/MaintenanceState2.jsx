import React, { useState, useEffect } from 'react';
import { Select, Button, DatePicker, Upload, Image, message, Input, Checkbox, Form } from 'antd';
import { UploadOutlined, InboxOutlined, FileOutlined } from '@ant-design/icons';
const { TextArea } = Input;
import CardInventoryDetail from './CardInventoryDetail';
import CardSubInventoryDetail from './CardSubInventoryDetail';

function MaintenanceState2({ dataInvForCard, dataRepairReport, onFormDataChange, onFormDataChangeFile, initialFormData, initialFormDataFile  }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form] = Form.useForm();
  const [dataInv, setDataInv] = useState(dataInvForCard);
  const [idSubInventory, setIdSubInventory] = useState(null);
  const [componentDisabled, setComponentDisabled] = useState(false);

  const fileUrl = dataRepairReport?.attributes?.ReportFileByResponsible?.data?.[0]?.attributes?.url 
    ? `${API_URL}${dataRepairReport.attributes.ReportFileByResponsible.data[0].attributes.url}`
    : null;

  const fileName = dataRepairReport?.attributes?.ReportFileByResponsible?.data?.[0]?.attributes?.name || "ไฟล์";

  useEffect(() => {
    if (dataInvForCard) {
      setDataInv(dataInvForCard);
      if (dataRepairReport?.attributes?.sub_inventory?.data) {
        setIdSubInventory(dataRepairReport?.attributes?.sub_inventory.data.id);
      }
    }
  }, [dataInvForCard, dataRepairReport]);

  useEffect(() => {
    console.log("initialFormDataFile.FileRepairByAdmin: ",initialFormDataFile?.FileRepairByAdmin);
    console.log("initialFormData: ",initialFormData);
    if (initialFormData) {
      form.setFieldsValue({
        
        DetailRepairByAdmin: initialFormData.DetailRepairByAdmin || '', // ตั้งค่าเริ่มต้นเป็น string ว่างถ้าไม่มีค่า
        // เพิ่ม field อื่นๆ ตามที่ต้องการ
      });
    }
  }, [initialFormData, form]);

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
    onFormDataChangeFile({ FileRepairByAdmin: fileList });
  };

  return (
    <>
      <div className='grid grid-cols-5'>
        <div>{/* ขอบซ้าย*/}</div>
        <div className='col-span-3'>
          <h1 className='text-2xl text-gray-500 my-2 mb-2'>บันทึกข้อมูลการทำเรื่องพิจาณาซ่อมแซมครุภัณฑ์</h1>

          {dataRepairReport ? (
            dataRepairReport.attributes.isSubInventory ? (
              <CardSubInventoryDetail data={dataInv} idSubInventory={idSubInventory} />
            ) : (
              <CardInventoryDetail data={dataInv} />
            )
          ) : (
            <p>Loading data...</p>
          )}
        
          <div className='border-2 border-blue-500 rounded-md px-4 pb-4 mb-2'>
            <h1 className='text-2xl text-gray-500 mb-3'>เหตุผลและเอกสารในการแจ้งซ่อมจากผู้รับผิดชอบ : </h1>
            <h1 className='text-lg text-gray-500 my-2'>เหตุผลในการแจ้งซ่อม : </h1>
            <p>{dataRepairReport?.attributes?.RepairReasonByResponsible}</p>
            <h1 className='text-lg text-gray-500 my-2'>ไฟล์แจ้งซ่อมโดย :<span className='text-black'>{dataRepairReport?.attributes?.reportedBy?.data?.attributes?.responsibleName }</span></h1>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <FileOutlined /><span className='ml-2'>{fileName}</span>
            </a>
            <Form
                form={form} // เพิ่มบรรทัดนี้
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                // disabled={!componentDisabled}
                onValuesChange={(changedValues, allValues) => onFormDataChange(allValues)}
              >
<div className='mt-2'> <label className="block text-lg font-medium">รายละเอียดเพิ่มเติม (หากมี)</label></div>
               
                <Form.Item name="DetailRepairByAdmin">
                
                    
                    <TextArea
                      rows={2}
                      placeholder="รายละเอียดในการทำเรื่องพิจารณาซ่อมเพิ่มเติมโดยเจ้าหน้าที่"
                      onChange={handleInputChange}
                    />
                  
                </Form.Item>

                <Form.Item
                  name="FileRepairByAdmin"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    name="FileRepairByAdmin"
                    listType="picture-card"
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    defaultFileList={initialFormDataFile?.FileRepairByAdmin || []}
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

          
        </div>
        <div>{/* ขอบขวา*/}</div>
      </div>
    </>
  );
}

export default MaintenanceState2;
