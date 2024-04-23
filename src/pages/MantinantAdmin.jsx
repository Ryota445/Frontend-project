import React from 'react'
import { useState } from 'react'
import TableDetailMantenant from '../components/TableDetailMantenant';
import TableDetailRepair from '../components/TableDetailRepair';

function MantinantAdmin() {

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

        </div>
    </>
  )
}

export default MantinantAdmin