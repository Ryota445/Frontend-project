import React ,{useState,useEffect} from 'react'
import {  Select, Button, DatePicker, Upload ,Image,message,Input, Checkbox , Form } from 'antd';
import { UploadOutlined,InboxOutlined,FileOutlined } from '@ant-design/icons';
const { TextArea } = Input;


function MaintenanceState3() {

  const [componentDisabled, setComponentDisabled] = useState(false);
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };


  return (
    <>
    
    <div className='grid grid-cols-5'>

<div>{/* ขอบซ้าย*/}</div>

<div className='col-span-3'>
{/* ใส่เนื้อหาตรงนี้ */}
<h1 className='text-2xl text-gray-500  my-2 mb-2'> บันทึกผลพิจาณาซ่อมแซมครุภัณฑ์</h1>


<div className='border-2 border-blue-500 rounded-md  px-4 pb-4 mb-2'>
          {/* ข้อมูลฟอร์ม */}


          <div className="mb-4">
          <label className="block text-lg font-medium mb-2">ผลการพิจารณาซ่อมแซมครุภัณฑ์จากคณะฯ</label>
          <Select className="w-full" showSearch placeholder="ผลการพิจารณา">
            {/* Add Select options here */}
          </Select>
        </div>
        
</div>


<div>
  
<Checkbox
  checked={componentDisabled}
  onChange={(e) => setComponentDisabled(e.target.checked)}
>
  <p className='text-lg'>มีรายละเอียดที่ต้องการเพิ่ม</p>
</Checkbox>

</div>

{  componentDisabled&&<div className='border-2 border-blue-500 rounded-md  px-4  mt-2 '>
<h1 className='text-2xl text-gray-500 '>รายละเอียดและเอกสารเพิ่มเติมโดยเจ้าหน้าที่</h1>
<Form
  labelCol={{
    span: 4,
  }}
  wrapperCol={{
    span: 14,
  }}
  layout="horizontal"
  disabled={!componentDisabled}
  
>
    <Form.Item>
        <div className='mt-2'>
        <label className="block text-lg font-medium">รายละเอียดเพิ่มเติมสำหรับผลการพิจารณา (หากมี)</label>
        <TextArea rows={2} placeholder="รายละเอียดในการทำเรื่องพิจารณาซ่อมเพิ่มเติมโดยเจ้าหน้าที่" />
      </div>
    </Form.Item>


    <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
      
    <div >
    <label className="block text-lg font-medium">เอกสารเพิ่มเติมสำหรับผลการพิจารณา (หากมี)</label>
    <Upload>
      <Button icon={<UploadOutlined />}>อัปโหลดเอกสาร</Button>
    </Upload>
  </div>
       </Form.Item>


</Form>


</div>
}



</div>

<div>{/* ขอบขวา*/}</div>




</div>
    
    
    
    </>
  )
}

export default MaintenanceState3