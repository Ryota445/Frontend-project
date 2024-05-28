import React from 'react'

function FixMantenantPage2() {
    const imageUrl ='https://www.scilution.co.th/wp-content/uploads/2019/08/Scilution-FAITHFUL-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%9A%E0%B9%81%E0%B8%AB%E0%B9%89%E0%B8%87%E0%B9%81%E0%B8%8A%E0%B9%88%E0%B9%81%E0%B8%82%E0%B9%87%E0%B8%87%E0%B8%AA%E0%B8%B8%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8-Vacuum-Freeze-Dryer-FSF-10N.jpg'
  return (
    <>
    

    
    
    
    <div className='grid grid-cols-10 '>
        <div >
            {/* col-1 */}
            
        </div>

        <div className='col-span-8 '>
            {/* col-2 */}
            <h1 className='text-3xl font-semibold pb-10 '>ซ่อมแซมครุภัณฑ์</h1>    
            <div className=' border-2 border-gray-600 rounded'>
                
                <div className='my-8 mx-4 border-2 border-sky-600 rounded'>

                <div className='my-8 mx-4  grid grid-cols-4'>
                       
                    <div className='bg-blue-200 w-[200px] h-[250px] bg-cover rounded-md' style={{backgroundImage:`url('${imageUrl}')`}}>
                           {/* inside col-1 image bg */}
                    </div>

                    <div className='col-span-3'>
                        {/* inside col-2 */}
                        <h1 className='text-3xl text-blue-600 font-normal'><span className='font-bold'>เครื่องอบแห้งแช่แข็งสุญญากาศ</span> Vacuum Freeze Dryer <span className='font-bold'>รุ่น</span> FSF series</h1>
                        <div className='mt-2 flex flex-row'>
                            <p className='text-xl text-gray-500 mr-2'>หมายเลขครุภัณฑ์</p> <p className='text-xl text-black  font-medium'>110213213</p>

                            <p className='ml-4 text-xl text-gray-500 mr-2'>หมวดหมู่ครุภัณฑ์</p> <p className='text-xl text-black font-medium'>เครื่องใช้ไฟฟ้า</p>
                        </div>
                    </div>
                </div>

                </div>



            </div>
        </div>

        <div>
            {/* col-3 */}
            
        </div>


    </div>
    
    
    </>
  )
}

export default FixMantenantPage2