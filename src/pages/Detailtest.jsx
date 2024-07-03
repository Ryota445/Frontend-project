import React from 'react'
import { useState } from 'react'
import TableDetailMantenant from '../components/TableDetailMantenant';
import TableDetailRepair from '../components/TableDetailRepair';




function Detailtest() {
    const imageUrl ='https://www.scilution.co.th/wp-content/uploads/2019/08/Scilution-FAITHFUL-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%9A%E0%B9%81%E0%B8%AB%E0%B9%89%E0%B8%87%E0%B9%81%E0%B8%8A%E0%B9%88%E0%B9%81%E0%B8%82%E0%B9%87%E0%B8%87%E0%B8%AA%E0%B8%B8%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8-Vacuum-Freeze-Dryer-FSF-10N.jpg'
    const [statusBTN,setStatusBTN] =useState('mantenant')


    const handelMantenantBTN = ()=>{
        setStatusBTN('mantenant')
    }
    const handelRepairBTN = ()=>{
        setStatusBTN('repair')
    }
   


  return (
    <>

    <div className='w-full '>
       
        <div className=' w-full h-[300px] mt-5 grid grid-cols-8 '>
                    <div></div>
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

                            
                                <div className='border-2 border-gray-300 rounded-md   p-2 mt-4 flex flex-row-reverse w-3/4'>

                                    <button class="font-bold rounded-lg text-sm   mt-2 mr-24 w-24 h-8 bg-[#92abd9] hover:bg-[#1161f5] text-[#ffffff] justify-center">บันทึก</button>
 

                                    <select className="select select-bordered w-1/4 mr-2">
                                    <option>ปกติ</option>
                                    <option>เสีย</option>
                                    <option>ไม่ได้ใช้งาน</option>
                                    </select>

                                    <h1 className='text-lg text-gray-400 mr-4 mt-2  '>สถานะครุภัณฑ์</h1>  
                                </div>
                                

                                


                                <div className='flex flex-row mt-4'>  
                                <button class="font-bold rounded-lg text-base  w-32 h-8 bg-[#c9190d] text-[#ffffff] justify-center mr-20">ทำจำหน่าย</button>
                                <button class="font-bold rounded-lg text-base  w-32 h-8 bg-[#58c90d] text-[#ffffff] justify-center ml-28 mr-4">บำรุงรักษา</button>
                                <button class="font-bold rounded-lg text-base  w-32 h-8 bg-[#276ff4] text-[#ffffff] justify-center ">ซ่อมแซม</button>

                                </div>
                              
                            </div>
                            </div>
                            
                        </div>
                    </div>
                    <div></div>
                </div>


                <div className=' w-full h-[300px] mt-10 grid grid-cols-8 '> 

                <div className=''></div>

                                                    <div className='col-span-6 border-2 border-blue-500 rounded-md'>
                
                <div className='border-b-2 m-4 '>
                <h1 className='text-xl font-thin text-blue-800 '>วิธีได้มา</h1>
                </div>

                <div className='grid grid-cols-2'>
                    <div className='flex flex-col ml-8'>
                        <div className='flex flex-row my-2'>
                        <h1 className='text-lg text-gray-400 mr-4'>วิธีได้มา</h1>  <h1 className='text-lg'>e-bidding แผ่นดิน</h1>
                        </div>
                        <div className='flex flex-row my-2'>
                        <h1 className='text-lg text-gray-400 mr-4'>ปีงบประมาณ</h1>  <h1 className='text-lg'>2566</h1>
                        </div>

                        <div className='flex flex-row my-2'>
                        <h1 className='text-lg text-gray-400 mr-4'>ตัวแทนบริษัท</h1>  <h1 className='text-lg'> <a>นางสาวสมพร สุขใจ บริษัท เคมีวัน จำกัด</a> </h1>
                        </div>



                
                    </div>
                    <div className='flex flex-col '>
                            <div className='flex flex-row my-2'>
                                <h1 className='text-lg text-gray-400 mr-4'>วันที่สั่งซื้อ</h1>  <h1 className='text-lg'>27-07-2565</h1>
                            </div>
                            <div className='flex flex-row my-2'>
                                <h1 className='text-lg text-gray-400 mr-4'>วันที่ตรวจรับ/วันที่รับโอน</h1>  <h1 className='text-lg'>29-07-2565</h1>
                            </div>
                    </div>


                </div>
                
                <div className='border-b-2 m-4 '>
                <h1 className='text-xl font-thin text-blue-800 '>รายละเอียดครุภัณฑ์</h1>
                </div>


                <div className='grid grid-cols-2'>
                    <div className='flex flex-col ml-8'>
                        <div className='flex flex-row my-2'>
                        <h1 className='text-lg text-gray-400 mr-4'>หมายเลข SN</h1>  <h1 className='text-lg'>FA131KXN</h1>
                        </div>
                        <div className='flex flex-row my-2'>
                        <h1 className='text-lg text-gray-400 mr-4'>ยี่ห้อ</h1>  <h1 className='text-lg'>FAITHFUL</h1>
                        </div>

                        <div className='flex flex-row my-2'>
                        <h1 className='text-lg text-gray-400 mr-4'>รุ่น</h1>  <h1 className='text-lg'> FSF-N Series</h1>
                        </div>

                        <div className='flex flex-row my-2'>
                        <h1 className='text-lg text-gray-400 mr-4'>ราคาที่ซื้อ </h1>  <h1 className='text-lg'> 20,000</h1> <h1 className='text-lg text-gray-400 ml-2'> บาท</h1>
                        </div>



                
                    </div>
                    <div className='flex flex-col '>
                            <div className='flex flex-row my-2'>
                                <h1 className='text-lg text-gray-400 mr-4'>อายุการใช้งานโดยประเมิน</h1>  <h1 className='text-lg'>5 ปี</h1>
                            </div>

                            <div className='flex flex-row my-2'>
                                <h1 className='text-lg text-gray-400 mr-4'>อายุการใช้งานจริง</h1>  <h1 className='text-lg'></h1>
                            </div>
                            
                            <div className='flex flex-row my-2'>
                                <h1 className='text-lg text-gray-400 mr-4'>รายละเอียดเพิ่มเติม</h1>  <h1 className='text-lg'></h1>
                            </div>
                    </div>


                </div>








                                                             </div>
                
                <div className=''></div>
                
                </div>

               


        


        <div className='w-full h-[150px]'></div>



        </div>
         {/* subset */}
         <div className=' w-full h-[100px] mt-10 grid grid-cols-8 '> 
                <div className=''></div>
                <div className='col-span-6 border-2 border-blue-500 rounded-md'>
                <div className='border-b-2 m-4 '>
                <h1 className='text-xl font-thin text-blue-800 '>ข้อมูลครุภัณฑ์ภายในชุด</h1>
                </div>


                <div className=' flex flex-row border-2 border-blue-500 rounded-md m-4 p-2 '>
                <h1 className='text-lg text-gray-400 mr-4'>หมายเลขครุภัณฑ์</h1>  <h1 className='text-lg'>110231213/1</h1> 
                <h1 className='text-lg text-gray-400 mx-4'>ชื่อครุภัณฑ์</h1>  <h1 className='text-lg'>Liquid nitrogen</h1>  
                <h1 className='text-lg text-gray-400 mx-4'>หมายเลขSN</h1>  <h1 className='text-lg'>-</h1>  
                <button class="font-bold rounded-lg text-base  w-32 h-8 bg-[#276ff4] text-[#ffffff] justify-center ml-24">ซ่อมแซม</button>
                </div>

                </div>
                <div className=''></div>
                </div>




                
   
    <div className='w-full h-[100px]'></div>

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
    </>
  )
}

export default Detailtest