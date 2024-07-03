import React ,{useState,useEffect} from 'react';
import { Card, Input ,Image} from 'antd';
import no_image from "../assets/img/Image.png";


function CardInventoryDetail({data}) {
  console.log("Data received in CardInventoryDetail:", data);

    const [dataInv, setDataInv] = useState(data);
    
    useEffect(() => {
      if (data) {
        setDataInv(data);
      }
    }, [data]);
  return (
    <>
    
    <div className=" col-span-6 grid grid-cols-6 gap-1 border-2 border-blue-500 rounded-md p-4 mb-4">
            <div className=" col-span-2 flex justify-center items-center">
              <Image
                src={
                  dataInv?.attributes?.img_inv?.data?.attributes?.url
                    ? `http://localhost:1337${dataInv.attributes.img_inv.data.attributes.url}`
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
                    {dataInv?.attributes?.name}
                  </h1>
                )}
                <div>
                  <div className="flex flex-row">
                    <h1 className="text-lg text-gray-400 mr-4">
                      หมายเลขครุภัณฑ์
                    </h1>
                    {dataInv?.attributes?.id_inv &&
                    !isNaN(dataInv.attributes.id_inv) ? (
                      <h1 className="text-lg">{dataInv.attributes.id_inv}</h1>
                    ) : (
                      <h1 className="text-lg">-</h1>
                    )}
                    <h1 className="text-lg text-gray-400 mx-4">
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
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-col w-3/4 mt-2 border-2 border-blue-500 rounded-md">
                      <h1 className="text-lg text-gray-400 ">
                        ที่ตั้งครุภัณฑ์
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
                  </div>

                  

                 

                  
                </div>
              </div>
            </div>
          </div>


    </>
  )
}

export default CardInventoryDetail