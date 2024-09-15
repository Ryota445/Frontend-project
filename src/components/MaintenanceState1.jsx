import React ,{useState,useEffect} from 'react'
import {  Select, Button, DatePicker, Upload ,Image,message,Input, Checkbox , Form } from 'antd';
import { UploadOutlined,InboxOutlined,FileOutlined } from '@ant-design/icons';
const { TextArea } = Input;
import CardInventoryDetail from './CardInventoryDetail';


function MaintenanceState1( {dataInvForCard ,dataRepairReport} ) {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [dataInv, setdataInv] = useState(dataInvForCard)

  const fileUrl = dataRepairReport?.attributes?.ReportFileByResponsible?.data?.[0]?.attributes?.url 
    ? `${API_URL}${dataRepairReport.attributes.ReportFileByResponsible.data[0].attributes.url}`
    : null;

  const fileName = dataRepairReport?.attributes?.ReportFileByResponsible?.data?.[0]?.attributes?.name || "ไฟล์";

 
  useEffect(() => {
    console.log('fileUrl: ',fileUrl)
    console.log('fileName: ',dataRepairReport?.attributes?.ReportFileByResponsible.data)
  
  
  }, [])

  useEffect(() => {
    if (dataInvForCard) {
      setdataInv(dataInvForCard);
    }
  }, [dataInvForCard]);

  const [componentDisabled, setComponentDisabled] = useState(false);
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>

      <div className='grid grid-cols-5'>

      <div>{/* ขอบซ้าย*/}</div>

      <div className='col-span-3'>
      {/* ใส่เนื้อหาตรงนี้ */}
      <h1 className='text-2xl text-gray-500  my-2 mb-2'> ข้อมูลแจ้งซ่อมแซมครุภัณฑ์ </h1>

      <CardInventoryDetail data={dataInv}/>
      <div className='border-2 border-blue-500 rounded-md  px-4 pb-4 mb-2'>
                {/* ข้อมูลฟอร์ม */}

                <h1 className='text-2xl text-gray-500  mb-3'>เหตุผลและเอกสารในการแจ้งซ่อมจากผู้รับผิดชอบ : </h1>


                <h1 className='text-lg text-gray-500 my-2'>เหตุผลในการแจ้งซ่อม : </h1>
                <p>{dataRepairReport?.attributes?.RepairReasonByResponsible}</p>
                <h1 className='text-lg text-gray-500 my-2 '>ไฟล์แจ้งซ่อมโดย :<span className='text-black'>{dataRepairReport?.attributes?.reportedBy?.data?.attributes?.responsibleName }</span></h1>
                
                <a href={fileUrl} target="_blank" rel="noopener noreferrer"><FileOutlined /><span className='ml-2'>{fileName}</span></a>
      </div>


      



      </div>

      <div>{/* ขอบขวา*/}</div>




      </div>


      
    </>
  )
}
export default MaintenanceState1