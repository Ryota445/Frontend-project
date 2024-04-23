import React, { useState,useEffect } from 'react';
import { Form, Input, Button ,Select } from 'antd';
import { 
SearchOutlined,
CloseOutlined

} from '@ant-design/icons';

const { Option } = Select;

function SearchBox({ onSearch }) {
    const [responsibleOptions, setResponsibleOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [formData, setFormData] = useState({
        id_inv: '',
        name: '',
        responsible: '',
        category: ''
    });

    useEffect(() => {
        async function fetchData() {
            try {
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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearch = () => {
        const searchData = {
          id_inv: formData.id_inv,
          name: formData.name,
          responsible: formData.responsible,
          category: formData.category,
        };
        onSearch(searchData); // Send the searchData object to parent component
      };

    return (
        <>
            <div className='grid grid-cols-8 gap-4'>
                <div className='col-span-1'></div>
                <div className='col-span-6'>
                    <div className='border-4 rounded-lg'>
                        <div className="flex flex-col m-4 mt-4 md:flex-row  space-y-2 md:space-y-0 md:space-x-2">
                            <div>
                                <label htmlFor="asset-number" className="block text-sm font-medium text-gray-700 mb-2  mx-1">หมายเลขครุภัณฑ์</label>
                                <Input placeholder="หมายเลขครุภัณฑ์" id="id_inv" name="id_inv" value={formData.assetNumber} onChange={handleInputChange} style={{ width: 250 }} />
                            </div>
                            <div>
                                <label htmlFor="asset-name" className="block text-sm font-medium text-gray-700 mb-2 mx-1">ชื่อครุภัณฑ์</label>
                                <Input placeholder="ชื่อครุภัณฑ์" id="name" name="name" value={formData.assetName} onChange={handleInputChange} style={{ width: 250 }} />
                            </div>
                            <div>
                                <label htmlFor="responsible" className="block text-sm font-medium text-gray-700 mb-2 mx-1">ผู้ดูแล</label>
                                <Select 
                                    placeholder="เลือกผู้ดูแล" 
                                    id="responsible" 
                                    name="responsible" 
                                    value={formData.responsible} 
                                    onChange={(value) => setFormData({ ...formData, responsible: value })} 
                                    style={{ width: 250 }}
                                    suffixIcon={ // ใช้เงื่อนไขเพื่อตรวจสอบค่าที่ถูกเลือก
                                        formData.responsible ? ( // ถ้ามีค่าที่ถูกเลือก
                                            <Button 
                                                type="text" 
                                                onClick={() => setFormData({ ...formData, responsible: '' })} // กำหนดให้ค่า responsible เป็นค่าว่างเมื่อคลิก
                                                icon={<CloseOutlined />} // เลือก icon ที่ต้องการใช้สำหรับลบค่าที่เลือก
                                            />
                                        ) : null // ถ้าไม่มีค่าที่ถูกเลือกก็ไม่แสดงเครื่องหมายลบ
                                    }
                                >
                                    {responsibleOptions.map(responsible => (
                                        <Option key={responsible.id} value={responsible.id}>{responsible.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between m-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2 mx-1">ประเภทครุภัณฑ์</label>
                                <Select 
                                    placeholder="เลือกประเภทครุภัณฑ์" 
                                    id="category" 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={(value) => setFormData({ ...formData, category: value })} 
                                    style={{ width: 250 }}
                                    suffixIcon={ // เพิ่ม suffixIcon เป็นเครื่องหมายการกระทำสำหรับลบค่าที่เลือก
                                        formData.category ? ( // ถ้ามีค่าที่ถูกเลือก
                                        <Button 
                                            type="text" 
                                            onClick={() => setFormData({ ...formData, category: '' })} // กำหนดให้ค่า category เป็นค่าว่างเมื่อคลิก
                                            icon={<CloseOutlined />} // เลือก icon ที่ต้องการใช้สำหรับลบค่าที่เลือก
                                        />
                                      ) : null // ถ้าไม่มีค่าที่ถูกเลือกก็ไม่แสดงเครื่องหมายลบ
                                }
                                >
                                    {categoryOptions.map(category => (
                                        <Option key={category.id} value={category.id}>{category.name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className='border-4 border-gray-200 p-2 rounded-md'>
                            <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700 ">ที่ตั้ง</label>
                                <div className='flex flex-row'>
                                    <div className='flex flex-col mr-2'>
                                    <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700 ">อาคาร</label>
                                        <Select defaultValue="ทั้งหมด" id="asset-type" style={{ width: 100 }}>
                                            <Option value="ทั้งหมด">ทั้งหมด</Option>
                                            <Option value="option1">MHMK</Option>
                                            <Option value="option2">MHVH</Option>
                                        </Select>
                                    </div>
                                    <div className='flex flex-col mr-2'>
                                    <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700">ชั้น</label>
                                        <Select defaultValue="ทั้งหมด" id="asset-type" style={{ width: 100 }}>
                                            <Option value="ทั้งหมด">ทั้งหมด</Option>
                                            <Option value="option1">1</Option>
                                            <Option value="option2">2</Option>
                                        </Select>
                                    </div>
                                    <div className='flex flex-col mr-2'>
                                    <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700">ห้อง</label>
                                    <Input placeholder="" id="room" name="room" value={formData.assetName}  style={{ width: 80 }} />
                                    </div>

                                </div>
                                
                                
                                </div>

                                <div className='flex flex-col mr-2'>
                                    <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700 ">สถานะครุภัณฑ์</label>
                                        <Select defaultValue="ทั้งหมด" id="asset-type" style={{ width: 100 }}>
                                            <Option value="ทั้งหมด">ทั้งหมด</Option>
                                            <Option value="option1">ปกติ</Option>
                                            <Option value="option2">เสีย</Option>
                                            <Option value="option2">ไม่ได้ใช้งาน   </Option>
                                        </Select>
                                    </div>



                            <div className='flex items-center'>
                                <Button className="text-gray-800 bg-gray-300 px-10" type="primary" onClick={handleSearch}>
                                    <SearchOutlined className='text-base' /> <span className="hidden md:inline">ค้นหา</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-1'></div>
            </div>
        </>
    );
}

export default SearchBox;
