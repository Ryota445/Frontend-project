import React, { useState, useEffect } from 'react';
import ThaiDateFormat from '../components/ThaiDateFormat';

function InventoryMaintenanceHistory({ dataInv, subInventories }) {
  const [statusBTN, setStatusBTN] = useState('mantenant');
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      let data = [];
      // console.log('dataInv:', dataInv);
      // console.log('subInventories:', subInventories);
  
      // ฟังก์ชันสำหรับกรองข้อมูลซ้ำ
      const filterDuplicates = (arr) => {
        const idMap = new Map();
        return arr.filter(item => {
          if (!idMap.has(item.id)) {
            idMap.set(item.id, item);
            return true;
          }
          const existingItem = idMap.get(item.id);
          if (!existingItem.isSubInventory && item.isSubInventory) {
            idMap.set(item.id, item);
            return true;
          }
          return false;
        });
      };
  
      // ดึงข้อมูลจากครุภัณฑ์หลัก
      if (dataInv?.attributes?.maintenance_reports?.data) {
        data = data.concat(dataInv.attributes.maintenance_reports.data
          .filter(item => item.attributes.isDone)
          .map(item => ({ ...item, type: 'maintenance', isSubInventory: false })));
      }
      if (dataInv?.attributes?.repair_reports?.data) {
        data = data.concat(dataInv.attributes.repair_reports.data
          .filter(item => item.attributes.isDone && item.attributes.isCanRepair)
          .map(item => ({ ...item, type: 'repair', isSubInventory: false })));
      }
  
      // ดึงข้อมูลจากครุภัณฑ์ในองค์ประกอบ
      if (subInventories && subInventories.length > 0) {
        subInventories.forEach(subInv => {
          if (subInv?.attributes?.maintenance_reports?.data) {
            data = data.concat(subInv.attributes.maintenance_reports.data
              .filter(item => item.attributes.isDone)
              .map(item => ({ ...item, type: 'maintenance', isSubInventory: true, subInventory: subInv })));
          }
          if (subInv?.attributes?.repair_reports?.data) {
            data = data.concat(subInv.attributes.repair_reports.data
              .filter(item => item.attributes.isDone && item.attributes.isCanRepair)
              .map(item => ({ ...item, type: 'repair', isSubInventory: true, subInventory: subInv })));
          }
        });
      }
  
      // กรองข้อมูลซ้ำ
      data = filterDuplicates(data);
  
      // เรียงข้อมูลตามวันที่
      data.sort((a, b) => {
        const dateA = a.type === 'repair' ? new Date(a.attributes.dateFinishRepair) : new Date(a.attributes.DateToDo);
        const dateB = b.type === 'repair' ? new Date(b.attributes.dateFinishRepair) : new Date(b.attributes.DateToDo);
        return dateB - dateA;
      });
      
      // console.log('Combined data:', data);
      setCombinedData(data);
    };
  
    fetchData();
  }, [dataInv, subInventories]);

  const handleMantenantBTN = () => setStatusBTN('mantenant');
  const handleRepairBTN = () => setStatusBTN('repair');

  return (
    <div className="col-span-3">
      <div className="w-full">
        <button
          className={`font-bold rounded-t-lg text-lg w-48 h-16 bg-[#8dd15c] text-[#ffffff] justify-center ${
            statusBTN === "mantenant" ? "opacity-100" : "opacity-50"
          }`}
          onClick={handleMantenantBTN}
        >
          ประวัติการบำรุงรักษา
        </button>
        <button
          className={`font-bold rounded-t-lg text-lg w-48 h-16 bg-[#2d6eca] text-[#ffffff] justify-center ${
            statusBTN === "repair" ? "opacity-100" : "opacity-50"
          }`}
          onClick={handleRepairBTN}
        >
          ประวัติการซ่อมแซม
        </button>
      </div>
      <InventoryTable data={combinedData} statusBTN={statusBTN} dataInv={dataInv} />
    </div>
  );
}

function InventoryTable({ data, statusBTN, dataInv }) {
  const filteredData = data.filter(item => 
    (statusBTN === 'mantenant' && item.type === 'maintenance') || 
    (statusBTN === 'repair' && item.type === 'repair')
  );

  const totalPrice = filteredData.reduce((sum, item) => {
    const price = item.type === 'repair' ? item.attributes.RepairPrice : item.attributes.prize;
    return sum + (parseFloat(price) || 0);
  }, 0);

  const hasPriceData = filteredData.some(item => {
    const price = item.type === 'repair' ? item.attributes.RepairPrice : item.attributes.prize;
    return price !== null && price !== undefined && price !== '';
  });
  
    const noDataMessage = statusBTN === 'mantenant' 
      ? 'ไม่มีข้อมูลประวัติการบำรุงรักษา' 
      : 'ไม่มีข้อมูลประวัติการซ่อมแซม';
  
    return (
      <div className="relative overflow-hidden shadow-md rounded-b-lg">
        <table className="table-fixed w-full text-left">
          <thead className={`text-gray-200 ${statusBTN === 'mantenant' ? 'bg-gray-500' : 'bg-sky-500'}`}>
            <tr>
              <th className="py-2 border text-center p-4">วันที่</th>
              <th className="py-2 border text-center p-4">หมายเลขครุภัณฑ์</th>
              <th className="py-2 border text-center p-4">ชื่อครุภัณฑ์</th>
              <th className="py-2 border text-center p-4">รายละเอียด{statusBTN === 'mantenant' ? 'การบำรุงรักษา' : 'การซ่อมแซม'}</th>
              <th className="py-2 border text-center p-4">ค่าใช้จ่าย (บาท)</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500">
          {filteredData.length > 0 ? (
            <>
              {filteredData.map((item, index) => (
                <TableRow key={index} item={item} dataInv={dataInv} />
              ))}
              {hasPriceData && (
                <tr className="font-bold">
                  <td colSpan="4" className="py-4 border text-right p-4">ค่าใช้จ่าย รวม:</td>
                  <td className="py-4 border text-center p-4">{totalPrice.toFixed(2)}</td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan="5" className="py-4 border text-center p-4">
                {statusBTN === 'mantenant' ? 'ไม่มีข้อมูลประวัติการบำรุงรักษา' : 'ไม่มีข้อมูลประวัติการซ่อมแซม'}
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }

  function TableRow({ item, dataInv }) {
    const date = item.type === 'repair' ? item.attributes.dateFinishRepair : item.attributes.DateToDo;
    
    let idInv, name;
  
    if (item.isSubInventory) {
      // สำหรับครุภัณฑ์ในองค์ประกอบ
      idInv = (
        <>
          {dataInv.attributes.id_inv} <span className='text-red-500'>{item.subInventory.attributes.id_inv}</span>
        </>
      );
      name = (
        <>
          <span className='text-red-500'>(องค์ประกอบในชุดครุภัณฑ์)</span> {item.subInventory.attributes.name} 
        </>
      );
    } else {
      // สำหรับครุภัณฑ์หลัก
      idInv = dataInv.attributes.id_inv;
      name = dataInv.attributes.name;
    }
  
    const details = item.type === 'repair' ? item.attributes.ListDetailRepair : item.attributes.DetailMaintenance;
    const price = item.type === 'repair' ? item.attributes.RepairPrice : item.attributes.prize;
  const formattedPrice = price ? parseFloat(price).toFixed(2) : 'ไม่มีข้อมูล';

    
    return (
      <tr className="py-4">
        <td className="py-4 border text-center p-4"><ThaiDateFormat dateString={date} /></td>
        <td className="py-4 border text-center p-4">{idInv}</td>
        <td className="py-4 border text-center p-4">{name}</td>
        <td className="py-4 border text-center p-4">{details}</td>
        <td className="py-4 border text-center p-4">{formattedPrice}</td>

      </tr>
    );
  }
export default InventoryMaintenanceHistory;