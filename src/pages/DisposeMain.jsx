import React from 'react'
import ForSellComponent from '../components/ForSellComponent'
import { Input, Button, Select } from 'antd';

const { Option } = Select;

function DisposeMain() {
  return (
    <>
      
      
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">การทำจำหน่ายครุภัณฑ์</h1>

       {/* searchBox */}

    <div className="grid grid-cols-3 gap-4">
  <div>
    
    {/* 01 */}

  </div>
        {/* <div className='border-2 p-10 w-full border-black rounded-md'>
                  <div className='grid grid-rows-2 gap-10'>
                  <div className='flex flex-col mt-2'>
                  <label className='text-lg'>ค้นหารายการครุภัณฑ์</label>
                  <Search placeholder="หมายเลขครุภัณฑ์หรือชื่อครุภัณฑ์" 
                  onSearch={onSearch} enterButton 
                  size="large"
                  style={{
                    width: 350,
                  }}  

                  />
                </div>
                </div>


          </div> */}

          <div className="flex flex-col items-center justify-center p-4">
                <div className="border p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-end space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <div>
                      <label htmlFor="asset-number" className="block text-sm font-medium text-gray-700">หมายเลขครุภัณฑ์</label>
                      <Input placeholder="หมายเลขครุภัณฑ์" id="asset-number" style={{ width: 200 }} />
                    </div>
                    <div>
                      <label htmlFor="asset-name" className="block text-sm font-medium text-gray-700">ชื่อครุภัณฑ์</label>
                      <Input placeholder="ชื่อครุภัณฑ์" id="asset-name" style={{ width: 200 }} />
                    </div>
                    <div>
                      <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700">สถานะครุภัณฑ์</label>
                      <Select defaultValue="ทั้งหมด" id="asset-type" style={{ width: 200 }}>
                        <Option value="ทั้งหมด">ทั้งหมด</Option>
                        <Option value="option1">Option 1</Option>
                        <Option value="option2">Option 2</Option>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="text-gray-800 bg-gray-300" type="primary" icon={<i className="fas fa-search"></i>}>ค้นหา</Button>
                  </div>
                </div>
              </div>

          
          <div>
            
            {/* 03 */}

          </div>
        </div>
      <ForSellComponent />
    </div>



    </>
  )
}

export default DisposeMain