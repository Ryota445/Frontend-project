import React ,{useState,useEffect} from 'react'
import {  Select, Button, DatePicker, Upload ,Image,message,Input ,Checkbox,Form } from 'antd';
import { UploadOutlined,InboxOutlined } from '@ant-design/icons';
const { TextArea } = Input;

function MaintenanceState5() {

  const [componentDisabled, setComponentDisabled] = useState(false);
  const [componentDisabled2, setComponentDisabled2] = useState(false);
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };




  const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};
  return (
    <>
        <div className='grid grid-cols-5'>

<div>{/* ขอบซ้าย*/}</div>

<div className='col-span-3'>
{/* ใส่เนื้อหาตรงนี้ */}
<h1 className='text-2xl text-gray-500  my-2 mb-2'> บันทึกเสร็จสิ้นการซ่อมครุภัณฑ์</h1>
<Checkbox className='my-2'
  checked={componentDisabled2}
  onChange={(e) => setComponentDisabled2(e.target.checked)}
>
  <p className='text-lg'>ต้องการเพิ่มหรือแก้ไขข้อมูลการซ่อมแซมครุภัณฑ์หรือไม่</p>
</Checkbox>


<div className='border-2 border-blue-500 rounded-md  px-4 pb-4 mb-2 '>
          {/* ข้อมูลฟอร์ม */}


          <Form
  labelCol={{
    span: 4,
  }}
  wrapperCol={{
    span: 14,
  }}
  layout="horizontal"
  disabled={!componentDisabled2}
 
  
>

  <Form.Item>
    
    <div className="">
          <label className="block text-lg font-medium">เลขที่ใบแจ้งซ่อมที่ส่งมาจากคณะฯ</label>
          <Input placeholder="เลขที่ใบแจ้งซ่อม" />
        </div>
    </Form.Item>

    <Form.Item>
    <div className="">
          <label className="block text-lg font-medium">ตัวแทน/บริษัท</label>
          <Select className="w-full" showSearch placeholder="ค้นหาชื่อตัวแทน/บริษัท">
            {/* Add Select options here */}
          </Select>
        </div>
    </Form.Item>

    <Form.Item>
    <div className="">
          <label className="block text-lg font-medium">ชื่อการซ่อมแซม</label>
          <Input placeholder="ชื่อการซ่อมแซม" />
        </div>
    </Form.Item>

   


    <Form.Item>
        <div className=''>
        <label className="block text-lg font-medium">รายการซ่อม</label>
        <TextArea rows={2} placeholder="รายละเอียดในการซ่อม" />
      </div>
    </Form.Item>

    <Form.Item>
        <div className="">
          <label className="block text-sm font-medium">ราคา</label>
          <Input placeholder="ราคา" addonAfter="บาท" />
        </div>
    </Form.Item>


    <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
      
    <div >
    <label className="block text-lg font-medium">เอกสารสำหรับการดำเนินการซ่อม</label>
    <Upload>
      <Button icon={<UploadOutlined />}>อัปโหลดเอกสาร</Button>
    </Upload>
  </div>
       </Form.Item>



</Form>
        
</div>


<div>
  
<Checkbox
  checked={componentDisabled}
  onChange={(e) => setComponentDisabled(e.target.checked)}
>
  <p className='text-lg'>ต้องการกำหนดเสร็จสิ้นการซ่อมครุภัณฑ์หรือไม่</p>
</Checkbox>

</div>

{  componentDisabled&&<div className='border-2 border-blue-500 rounded-md  px-4  mt-2 '>
{/* <h1 className='text-2xl text-gray-500 '>รายละเอียดและเอกสารเพิ่มเติมโดยเจ้าหน้าที่</h1> */}

  <div className="mb-4">
          <label className="block text-sm font-medium">วันที่เสร็จสิ้นการซ่อมครุภัณฑ์</label>
          <DatePicker className="w-full" />
        </div>

  </div>
}



</div>

<div>{/* ขอบขวา*/}</div>




</div>
    


    
    
    
    </>
  )
}

export default MaintenanceState5