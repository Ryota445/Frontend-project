import React ,{useState,useEffect} from 'react';
import { Card, Input ,Image} from 'antd';
import no_image from "../assets/img/Image.png";
import { Link } from 'react-router-dom';

function CardSubInventoryDetail({data,idSubInventory}) {
  console.log("Data received in CardInventoryDetail:", data);
    const API_URL = import.meta.env.VITE_API_URL;
    const [dataInv, setDataInv] = useState(data);
    const [IdSubInv, setIdSubInv] = useState(idSubInventory);
    
    useEffect(() => {
      if (data) {
        setDataInv(data);
        setIdSubInv(idSubInventory)
      }
      
    }, [data,idSubInventory]);
    // console.log("dataInv?.attributes?.sub_inventories?.attributes?.name",dataInv?.attributes?.sub_inventories?.[].attributes?.name)
    const subInventoryData = dataInv?.attributes?.sub_inventories?.data?.find(subInv => subInv.id === idSubInventory);
    return (
    <>
    
    <div className=" col-span-6 grid grid-cols-6 gap-1 border-2 border-blue-500 rounded-md p-4 mb-4">
            <div className=" col-span-2 flex justify-center items-center">
              <Image
                src={
                  dataInv?.attributes?.img_inv?.data?.attributes?.url
                    ? `${API_URL}${dataInv.attributes.img_inv.data.attributes.url}`
                    : no_image
                }
                alt="รูปครุภัณฑ์"
                className=" w-[200px] h-[200px]"
              />
            </div>

            <div className=" col-span-4">
              <div className="mt-4">
                {dataInv?.attributes?.name && (
                  <h1 className="text-2xl font-semibold text-blue-600 my-2">
                    <span className='text-red-500'>(ครุภัณฑ์ในองค์ประกอบ)</span> {subInventoryData?.attributes?.name}
                    
                  </h1>
                )}
                <div>
                  <div className="flex flex-row">
                    <h1 className="text-lg text-gray-400 mr-4">
                      หมายเลขครุภัณฑ์
                    </h1>
                    {dataInv?.attributes?.id_inv &&
                    !isNaN(dataInv.attributes.id_inv) ? (
                      <h1 className="text-lg">{dataInv.attributes.id_inv} <span className='text-red-500'>{subInventoryData?.attributes?.id_inv}</span></h1>
                    ) : (
                      <h1 className="text-lg">-</h1>
                    )}
                    {/* <h1 className="text-lg text-gray-400 mx-4">
                      หมวดหมู่ครุภัณฑ์
                    </h1>{" "}
                    {dataInv?.attributes?.category?.data?.attributes
                      ?.CategoryName ? (
                      <h1 className="text-lg">
                        {
                          dataInv?.attributes?.category?.data?.attributes
                            ?.CategoryName
                        }
                      </h1>
                    ) : (
                      <h1 className="text-lg">-</h1>
                    )} */}
                  </div>
                  
                  <div className='flex flex-row  '>

                  <div className='flex flex-row  '>
                    <h1 className="text-lg text-gray-400 mr-4">
                      ยี่ห้อ
                    </h1>{" "}
                  {subInventoryData?.attributes?.brand ? (
                      <h1 className="text-lg">
                        {
                          subInventoryData?.attributes?.brand
                        }
                      </h1>
                    ) : (
                      <h1 className="text-lg">-</h1>
                    )}
                    </div>

                  <div className='flex flex-row  '>
                    <h1 className="text-lg text-gray-400 mx-4">
                      รุ่น
                    </h1>{" "}
                  {subInventoryData?.attributes?.model ? (
                      <h1 className="text-lg">
                        {
                          subInventoryData?.attributes?.model
                        }
                      </h1>
                    ) : (
                      <h1 className="text-lg">-</h1>
                    )}
                    </div>

                   
                 
                  </div>

                  <div>
                  <div className='flex flex-row   '>
                    <h1 className="text-lg text-gray-400 mr-4">
                      หมายเลข SN
                    </h1>{" "}
                  {subInventoryData?.attributes?.serialNumber ? (
                      <h1 className="text-lg">
                        {
                          subInventoryData?.attributes?.serialNumber
                        }
                      </h1>
                    ) : (
                      <h1 className="text-lg">-</h1>
                    )}
                    </div>
                  </div>
                  

                  <div className="flex flex-col">
                    <div className="flex flex-col  mt-2 border-2 border-blue-500 rounded-md">
                      <h1 className="text-lg text-gray-400 ">
                        ที่ตั้งครุภัณฑ์ 
                        {/* <span className='text-red-500'>(ครุภัณฑ์หลัก)</span> */}
                      </h1>
                      <div className="flex flex-row">
                        <h1 className="text-lg text-gray-400 mr-2 ">อาคาร</h1>{" "}
                        {dataInv?.attributes?.building?.data?.attributes
                          ?.buildingName ? (
                          <h1 className="text-lg">
                            {
                              dataInv?.attributes?.building?.data?.attributes
                                ?.buildingName
                            }
                          </h1>
                        ) : (
                          <h1 className="text-lg">-</h1>
                        )}
                        <h1 className="text-lg text-gray-400 mx-4">ชั้น</h1>{" "}
                        {dataInv?.attributes?.floor ? (
                          <h1 className="text-lg">
                            {dataInv?.attributes?.floor}
                          </h1>
                        ) : (
                          <h1 className="text-lg">-</h1>
                        )}
                        <h1 className="text-lg text-gray-400 mx-4">ห้อง</h1>{" "}
                        {dataInv?.attributes?.room ? (
                          <h1 className="text-lg">
                            {dataInv?.attributes?.room}
                          </h1>
                        ) : (
                          <h1 className="text-lg">-</h1>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row mt-4">
                      <h1 className="text-lg text-gray-400 ">ผู้ดูแล</h1>{" "}
                      {dataInv?.attributes?.responsible?.data?.attributes
                        ?.responsibleName ? (
                        <h1 className="text-lg ml-2">
                          {
                            dataInv?.attributes?.responsible?.data?.attributes
                              ?.responsibleName
                          }
                        </h1>
                      ) : (
                        <h1 className="text-lg">-</h1>
                      )}
                    </div>

                    {dataInv?.attributes?.name && (
                  <h1 className="text-lg font-semibold text-blue-600 my-2">
                    <span className='text-gray-400 font-normal '>ครุภัณฑ์หลัก :</span> <Link to={`/UserDetailInventory/${dataInv.id}`}> {dataInv?.attributes?.name}</Link>
                  </h1>
                )}
                  </div>

                  

                 

                  
                </div>
              </div>
            </div>
          </div>


    </>
  )
}

export default CardSubInventoryDetail