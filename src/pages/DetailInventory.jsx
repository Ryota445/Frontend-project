import React, { useState, useEffect } from 'react';
import { Table, Space, Image } from 'antd';



function DetailInventory({ inventoryData2 }) {
    const [inventoryData, setInventoryData] = useState([]);
    

    useEffect(() => {
        if (inventoryData2 && inventoryData2.length > 0) {
            setInventoryData(inventoryData2);
        }
        // เรียกใช้ API หรือข้อมูลจำลองเพื่อดึงข้อมูลครุภัณฑ์
        // ในที่นี้เราจะใช้ข้อมูลจำลองเพื่อเตรียมตัวอย่าง
        const sampleData = [
          {
            img_inv: "url_to_image",
            name: "ชื่อครุภัณฑ์ 1",
            id_inv: "123456",
            category: "หมวดหมู่ 1",
            building: "อาคาร A",
            floor: "ชั้น 1",
            room: "ห้อง 101",
            responsible: "ผู้ดูแล 1",
            how_to_get: "วิธีการได้มา 1",
            sourceMoney: "แหล่งงบประมาณ 1",
            year_money_get: "2567",
            DateOrder: "01/01/2567",
            DateRecive: "01/02/2567",
            company_inventory: "บริษัท A",
            serialNumber: "SN123",
            brand: "ยี่ห้อ A",
            model: "รุ่น A",
            prize: "5000",
            age_use: "3 ปี",
            information: "รายละเอียดเพิ่มเติม 1",
          },
          // เพิ่มข้อมูลครุภัณฑ์เพิ่มเติมตามต้องการ
        ];
    
      }, [inventoryData2]);

  console.log("form Detail",inventoryData.name)
  

  return (
    <>
                {/* ข้อมูลครุภัณฑ์ */}
                <div className='border-b-2 border-black mb-10 mt-10'>
                <h1 className='text-lg text-blue-800'>ข้อมูลครุภัณฑ์</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className='mt-5'>
                    {/* คอลัมน์ซ้าย */}
                    <label htmlFor="name" className='text-base text-gray-500 m-2'>ชื่อครุภัณฑ์ :</label>
                    {inventoryData.map((item, index) => (
                        <p className='text-lg text-blue-800 m-2' key={index}>{item.name}</p>
                    ))}

                    <label htmlFor="id_inv" className='text-base text-gray-500 m-2'>หมายเลขครุภัณฑ์ :</label>
                    {inventoryData.map((item, index) => (
                        <p className='text-lg text-blue-800 m-2' key={index}>{item.id_inv}</p>
                    ))}

                    <label htmlFor="category" className='text-base text-gray-500 m-2'>หมวดหมู่ครุภัณฑ์ :</label>
                    {inventoryData.map((item, index) => (
                        <p className='text-lg text-blue-800 m-2' key={index}>{item.category}</p>
                    ))}
                </div>

                <div>
                    {/* คอลัมน์ขวา */}
                    
                    <div className="flex flex-col space-x-2 mt-6">
                        
                        
                        {inventoryData.map((item, index) => (
                            <div  className="flex flex-row " key={index}>
                                <div>
                                <label htmlFor="building" className='text-base text-gray-500 m-2'>อาคาร :</label>
                                <p className='text-lg text-blue-800 m-2'>{item.building}</p>
                                </div>
                                <div>
                                <label htmlFor="floor" className="w-full text-base text-gray-500 m-2">ชั้น :</label>
                                <p className='text-lg text-blue-800 m-2'>{item.floor}</p>
                                </div>
                                <div>
                                <label htmlFor="room" className="w-full text-base text-gray-500 m-2">ห้อง :</label>
                                <p className='text-lg text-blue-800 m-2'>{item.room}</p>
                                </div>
                            </div>
                        ))}

                        <label htmlFor="responsible" className='text-base text-gray-500 m-2'>ผู้ดูแล :</label>
                        {inventoryData.map((item, index) => (
                            <p className='text-lg text-blue-800 m-2' key={index}>{item.responsible}</p>
                        ))}

                        <label htmlFor="img_inv" className='text-base text-gray-500 m-2'>รูปครุภัณฑ์ :</label>
                        {inventoryData.map((item, index) => (
                            <img src={item.img_inv} alt="Inventory" key={index} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ข้อมูลวิธีการได้มา */}
            <div className='border-b-2 border-black mb-10 mt-10'>
                <h1 className='text-lg text-blue-800'>วิธีการได้มา</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    {/* คอลัมน์ซ้าย */}
                    <label htmlFor="howToGet" className="w-full text-base text-gray-500 m-2">วิธีได้มา :</label>
                    {inventoryData.map((item, index) => (
                        <p className='text-lg text-blue-800 m-2' key={index}>{item.how_to_get}</p>
                    ))}

                    <label htmlFor="sourceMoney" className="w-full text-base text-gray-500 m-2">แหล่งงบประมาณ :</label>
                    {inventoryData.map((item, index) => (
                        <p className='text-lg text-blue-800 m-2' key={index}>{item.sourceMoney}</p>
                    ))}


                    <label htmlFor="YearMoneyGet" className="w-full text-base text-gray-500 m-2">ปีงบประมาณ :</label>
                    {inventoryData.map((item, index) => (
                        <p className='text-lg text-blue-800 m-2' key={index}>{item.year_money_get}</p>
      ))}
    </div>
    <div>
      {/* คอลัมน์ขวา */}
      <label htmlFor="DateOrder" className='text-base text-gray-500 m-2'>วันที่สั่งซื้อ :</label>
        {inventoryData.map((item, index) => (
        <p className='text-lg text-blue-800 m-2' key={index}>{item.DateOrder}</p>
        ))}

<label htmlFor="DateRecive" className='text-base text-gray-500 m-2'>วันที่ตรวจรับ/วันที่รับโอน :</label>
                {inventoryData.map((item, index) => (
                    <p className='text-lg text-blue-800 m-2' key={index}>{item.DateRecive}</p>
                ))}
            </div>
        </div>

        {/* ข้อมูลบริษัทที่ติดต่อซื้อขาย */}
        <label htmlFor="company_inventory" className="w-full text-base text-gray-500 m-2">บริษัทที่ติดต่อซื้อขาย :</label>
        {inventoryData.map((item, index) => (
            <p className='text-lg text-blue-800 m-2' key={index}>{item.company_inventory}</p>
        ))}

        {/* ข้อมูลรายละเอียดครุภัณฑ์ */}
        <div className='border-b-2 border-black mb-10 mt-10'>
            <h1 className='text-lg text-blue-800'>รายละเอียดครุภัณฑ์</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                {/* คอลัมน์ซ้าย */}
                <label htmlFor="serialNumber" className='text-base text-gray-500 m-2'>หมายเลข SN :</label>
                {inventoryData.map((item, index) => (
                    <p className='text-lg text-blue-800 m-2' key={index}>{item.serialNumber}</p>
                ))}
                <label htmlFor="brand" className='text-base text-gray-500 m-2'>ยี่ห้อ :</label>
                {inventoryData.map((item, index) => (
                    <p className='text-lg text-blue-800 m-2' key={index}>{item.brand}</p>
                ))}
                <label htmlFor="model" className='text-base text-gray-500 m-2'>รุ่น :</label>
                {inventoryData.map((item, index) => (
                    <p className='text-lg text-blue-800 m-2' key={index}>{item.model}</p>
                ))}
                <label htmlFor="prize" className='text-base text-gray-500 m-2'>ราคาที่ซื้อ (บาท) :</label>
                {inventoryData.map((item, index) => (
                    <p className='text-lg text-blue-800 m-2' key={index}>{item.prize}</p>
                ))}
            </div>
            <div>
                {/* คอลัมน์ขวา */}
                <label htmlFor="age_use" className="w-full text-base text-gray-500 m-2">อายุการใช้งานโดยประเมิน :</label>
                {inventoryData.map((item, index) => (
                    <p className='text-lg text-blue-800 m-2' key={index}>{item.age_use}</p>
                ))}
                <div className="mb-2">
                    {/* <span className="text-sm font-medium">อายุการใช้งานเครื่อง</span> */}
                </div>
                <label htmlFor="information" className='text-base text-gray-500 m-2'>รายละเอียดเพิ่มเติม :</label>
                {inventoryData.map((item, index) => (
                    <p className='text-lg text-blue-800 m-2' key={index}>{item.information}</p>
                ))}
            </div>
        </div>
    </>
  )
}

export default DetailInventory