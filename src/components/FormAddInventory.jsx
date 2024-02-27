import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function FormAddInventory() {
  return (
    <>

    <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        // disabled={componentDisabled}
        style={{
          maxWidth: 600,
        }}
      >

        <h1 className='text-xl text-blue-800 mb-2'>ข้อมูลครุภัณฑ์</h1>

        <div className='border-t-2  border-black  p-8 w-full '>

        <Form.Item label="เพิ่มครุภัณฑ์แบบ">

          <Radio.Group>
            <Radio className='ml-4' value="AddMultiInventory">แบบรายการเดียว </Radio>
            <Radio value="AddSingleInventory">แบบหลายรายการ </Radio>
          </Radio.Group>
        </Form.Item>

        
        
                <Form.Item label="ชื่อครุภัณฑ์">
                <Input  className="ml-4" type='text' />
                </Form.Item>

                <Form.Item  className='w-4/5' label="จำนวนชิ้น">
                <Input  className="ml-4 w-2/5" type='text' />
                </Form.Item>

                <div className='flex flex-row'>
                <Form.Item label="หมายเลขครุภัณฑ์ ">
                <Input  className="ml-4 w-4/5" type='text' />
                </Form.Item>

                <Form.Item label="ถึง ">
                <Input  className="ml-4 w-4/5" type='text' />
                </Form.Item>
                
                </div>

                <div className='flex flex-row'>

                <Form.Item label="อาคาร" className='w-3/5'>
                    <Select>
                        <Select.Option value="MATH">MATH:อาคารวชิรุณหิศ</Select.Option>
                        <Select.Option value="MHMK">MHMK:อาคารมหามกุฏ</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="ชั้น" className='w-1/5'>
                    <Select className='ml-2'>
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                        <Select.Option value="3">3</Select.Option>
                        <Select.Option value="4">4</Select.Option>
                        <Select.Option value="5">5</Select.Option>
                        <Select.Option value="5++">5++</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="ห้อง" className='w-2/5'>
                    <Input className='ml-2'/>
                </Form.Item>

                
                </div>

                <Form.Item label="ผู้รับผิดชอบ" className='w-4/5'>
                    <Select className='ml-2'>
                        <Select.Option value="ผศ.ดร.สมชาย ใจดี">ผศ.ดร.สมชาย ใจดี</Select.Option>
                        <Select.Option value="ผศ.ดร.คนไทย ใจดี">ผศ.ดร.คนไทย ใจดี</Select.Option>
                      
                    </Select>
                </Form.Item>

                <Form.Item label="รูปครุภัณฑ์" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload action="/upload.do" listType="picture-card">
                        <button
                        style={{
                            border: 0,
                            background: 'none',
                        }}
                        type="button"
                        >
                        <PlusOutlined />
                        <div
                            style={{
                            marginTop: 8,
                            }}
                        >
                            Upload
                        </div>
                        </button>
                    </Upload>
                    </Form.Item>

        </div>


        <h1 className='text-xl text-blue-800 mb-2'>วิธีได้มา</h1>

        <div className='border-t-2  border-black  p-8 w-full '>
        <Form.Item label="วิธีได้มา" className='w-4/5'>
                    <Select className='ml-2'>
                        <Select.Option value="Buy">จัดซื้อ</Select.Option>
                        <Select.Option value="Free">บริจาค</Select.Option>
                      
                    </Select>
                </Form.Item>

                <Form.Item label="ปีงบประมาณ" className='w-4/5'>
                    <Select className='ml-2'>
                        <Select.Option value="2564">2564</Select.Option>
                        <Select.Option value="2565">2565</Select.Option>
                        <Select.Option value="2566">2566</Select.Option>
                        <Select.Option value="2567">2567</Select.Option>
                      
                    </Select>
                </Form.Item>
        </div>
            
                    

    </Form>

    </>
  )
}

export default FormAddInventory