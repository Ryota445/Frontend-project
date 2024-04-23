import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import { Form, Input, Button, Select, Upload, Card, Modal,DatePicker } from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableDetailMantenant from '../components/TableDetailMantenant';
import TableDetailRepair from '../components/TableDetailRepair';
const imageUrl ='https://www.scilution.co.th/wp-content/uploads/2019/08/Scilution-FAITHFUL-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%9A%E0%B9%81%E0%B8%AB%E0%B9%89%E0%B8%87%E0%B9%81%E0%B8%8A%E0%B9%88%E0%B9%81%E0%B8%82%E0%B9%87%E0%B8%87%E0%B8%AA%E0%B8%B8%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8-Vacuum-Freeze-Dryer-FSF-10N.jpg'



const { TextArea } = Input;
const { Option } = Select;


const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};


function AddMaintenant() {

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const onFinish = values => {
        console.log('Received values:', values);
      };

      const showModal = () => {
        setIsModalVisible(true);
      };
      
      const handleOk = () => {
        // You can add search logic here if needed
        setIsModalVisible(false);
      };
      
      const handleCancel = () => {
        setIsModalVisible(false);
      };


      const [statusBTN,setStatusBTN] =useState('mantenant')


    const handelMantenantBTN = ()=>{
        setStatusBTN('mantenant')
    }
    const handelRepairBTN = ()=>{
        setStatusBTN('repair')
    }
      



  return (
    <>



<div className=' w-full  grid grid-cols-5 '>
            <div>
                {/* col-1 */}
            </div>

            <div className=' col-span-3'>
                <div className=' w-full '>
                <button className={`font-bold rounded-t-lg text-lg w-48 h-16 bg-[#8dd15c] text-[#ffffff] justify-center ${
                                    statusBTN === 'mantenant' ? 'opacity-100' : 'opacity-50'
                                }`} onClick={handelMantenantBTN}>ประวัติการบำรุงรักษา</button>
                <button className={`font-bold rounded-t-lg text-lg w-48 h-16 bg-[#2d6eca] text-[#ffffff] justify-center ${
                                    statusBTN === 'repair' ? 'opacity-100' : 'opacity-50'
                                }`} onClick={handelRepairBTN}>ประวัติการซ่อมแซม</button>
                </div>
                { statusBTN === 'mantenant' ?(
                <TableDetailMantenant/>
                ):(
                    <>
                    <TableDetailRepair/>
                    </>
                )
}

            </div>

            <div >     
                {/* col-3 */}
             </div>


            

        </div>

<div className="m-4">
      <Card  title="รายการครุภัณฑ์ที่ต้องบำรุงรักษา" bordered={false}>


      <div className=' col-span-6 grid grid-cols-6 gap-1 border-2 border-blue-500 rounded-md'>
                        <div className=' col-span-2 flex justify-center items-center'>
                        
                        <div className='bg-gray-400 w-[200px] h-[250px] rounded-md bg-cover bg-center' style={{ backgroundImage: `url("${imageUrl}")` }}></div>
                        </div>

                        <div className=' col-span-4'>
                            <div className='mt-4'>
                            <h1 className='text-2xl font-thin text-blue-600 my-2'>เครื่องอบแห้งแช่แข็งสุญญากาศ Vacuum Freeze Dryer ร่น FSF Serie</h1>
                            <div >
                                <div className='flex flex-row'>
                                    <h1 className='text-lg text-gray-400 mr-4'>หมายเลขครุภัณฑ์</h1>  <h1 className='text-lg'>110231213</h1>

                                    <h1 className='text-lg text-gray-400 mx-4'>หมวดหมู่ครุภัณฑ์</h1>  <h1 className='text-lg'>เครื่องใช้ไฟฟ้า</h1>

                                </div>

                                <div className='flex flex-row'>
                                <div className='flex flex-col w-1/2 mt-2 border-2 border-gray-300 rounded-md'>
                                    <h1 className='text-lg text-gray-400 '>ที่ตั้งครุภัณฑ์</h1>
                                    <div className='flex flex-row'>
                                        <h1 className='text-lg text-gray-400 mr-4 '>อาคาร</h1> <h1 className='text-lg'>MHMK</h1> 
                                        <h1 className='text-lg text-gray-400 mx-4'>ชั้น</h1> <h1 className='text-lg'>4</h1> 
                                        <h1 className='text-lg text-gray-400 mx-4'>ห้อง</h1> <h1 className='text-lg'>408</h1>
             

                                    </div>
                                    
                                </div>



                                <div className='flex flex-row mt-9'>
                                    <h1 className='text-lg text-gray-400 mx-4 '>ผู้ดูแล</h1> <h1 className='text-lg'>ดร.สมชาย ใจดี</h1>
                                </div>

                                </div>

                            
                                <div className='border-2 border-gray-300 rounded-md   p-2 mt-4 flex  w-3/4'>

                                    {/* <button class="font-bold rounded-lg text-sm   mt-2 mr-24 w-24 h-8 bg-[#92abd9] hover:bg-[#1161f5] text-[#ffffff] justify-center">บันทึก</button> */}
 

                                   

                                    <h1 className='text-lg text-gray-400 mr-4 mt-2  '>สถานะครุภัณฑ์</h1>  
                                    <h1 className='text-lg mt-2'>ดร.สมชาย ใจดี</h1>
                                </div>
                                

                                


                                {/* <div className='flex flex-row mt-4'>  
                                <button class="font-bold rounded-lg text-base  w-32 h-8 bg-[#c9190d] text-[#ffffff] justify-center mr-20">ทำจำหน่าย</button>
                                <button class="font-bold rounded-lg text-base  w-32 h-8 bg-[#58c90d] text-[#ffffff] justify-center ml-28 mr-4">บำรุงรักษา</button>
                                <button class="font-bold rounded-lg text-base  w-32 h-8 bg-[#276ff4] text-[#ffffff] justify-center ">ซ่อมแซม</button>

                                </div> */}
                              
                            </div>
                            </div>
                            
                        </div>
                    </div>

      {/* <Card title="รายการครุภัณฑ์" extra={<Button icon={<EditOutlined />} />}>
       
        <div className="grid grid-cols-3 gap-4">

        <div>   </div>



        <div>
    
       
              <div className="mb-4 flex flex-col items-center justify-center">
                  <Button type="primary" icon={<PlusOutlined />} className="bg-green-500" onClick={showModal}>
                      เพิ่ม
                    </Button>
                </div>

        </div>




        <div>       </div>
          </div>

          <Modal
              title="ค้นหาครุภัณฑ์"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="ยืนยัน"
              cancelText="ยกเลิก"
            >
              <Input.Search placeholder="ค้นหาครุภัณฑ์" onSearch={value => console.log(value)} enterButton />
       
            </Modal>


                  
      </Card> */}



        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="ชื่อการบำรุงรักษา" name="itemName" rules={[{ required: true, message: 'กรุณากรอกชื่อการบำรุงรักษา!' }]}>
            <Input className="h-20" placeholder="กรอกชื่อการบำรุงรักษาหรือซ่อมแซม" />
          </Form.Item>
        
          <Form.Item label="รายละเอียดการบำรุงรักษา" name="actionDetail" rules={[{ required: true, message: 'กรุณากรอกรายละเอียดการบำรุงรักษา!' }]} >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
                label="วันที่บำรุงรักษา"
                name="DateMatenant"
                rules={[
                  {
                    required: false,
                    message: 'Please input!',
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>


              <Form.Item label="ตัวแทนบริษัท" name="actionType">
            <Select placeholder="เลือกชื่อตัวแทนบริษัท">
              <Option value="done">นางสาวสมพร ศรีพันธ์ / The one chem</Option>
              <Option value="doing">นายสมชาย ใจดี  / All Chem</Option>
            
              {/* ...other options... */}
            </Select>
          </Form.Item>

              

          <Form.Item label="จำนวนเงิน " name="cost">
            <Input addonAfter="บาท" type="number" />
          </Form.Item>
          
          {/* <Form.Item label="สถานะการบำรุงรักษา" name="actionType">
            <Select placeholder="เลือกประเภทการดำเนินการ">
              <Option value="done">เสร็จสิ้น</Option>
              <Option value="doing">อยู่ระหว่างการบำรุงรักษา</Option>
              <Option value="notyet">ยังไม่ได้รับการบำรุงรักษา</Option>
            
            </Select>
          </Form.Item> */}

          <Form.Item name="file" label="เอกสาร" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload name="flie" listType="picture-card" beforeUpload={() => false}>
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

          <Form.Item>
            <Button className="bg-blue-300" type="primary" htmlType="submit" icon={<SaveOutlined />}>
              บันทึก
            </Button>
            <Button type="default" htmlType="button" icon={<DeleteOutlined />} className="ml-2">
              ยกเลิก
            </Button>
          </Form.Item>
        </Form>
      </Card>

      
    </div>
    
    </>
  )
}

export default AddMaintenant