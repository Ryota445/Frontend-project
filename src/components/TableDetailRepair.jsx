import React from 'react'
import ThaiDateFormat from '../components/ThaiDateFormat'

function TableDetailRepair() {
  return (
    <>


<div class="relative overflow-hidden shadow-md rounded-b-lg">
                        <table class="table-fixed w-full text-left">
                            <thead class="text-gray-200  bg-sky-500">
                                <tr>
                                    <td class="py-2 border text-center  p-4" contenteditable="false">วันที่</td>
                                    <td class="py-2 border text-center  p-4" contenteditable="false">หมายเลขครุภัณฑ์</td>
                                    <td class="py-2 border text-center  p-4" contenteditable="false">ชื่อครุภัณฑ์</td>
                                    <td class="py-2 border text-center  p-4" contenteditable="false">รายละเอียดการซ่อมแซม</td>
                                    <td class="py-2 border text-center  p-4" contenteditable="false">ราคา (บาท)</td>
                                </tr>
                            </thead>
                            <tbody class="bg-white text-gray-500">
                                <tr class="py-4">
                                    <td class="py-4 border text-center  p-4" contenteditable="false"> <ThaiDateFormat dateString={'2019-02-18'}/> </td>
                                    <td class="py-4 border text-center  p-4" contenteditable="false">12331312</td>
                                    <td class="py-4 border text-center  p-4" contenteditable="false">เครื่องทำความเย็น</td>
                                    <td class="py-4 border text-center  p-4" contenteditable="false">เปลี่ยนอุปกรณ์ภายใน</td>
                                    <td class="py-4 border text-center  p-4" contenteditable="false">500.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
    
    
    
    </>
  )
}

export default TableDetailRepair