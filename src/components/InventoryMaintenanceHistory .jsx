import React, { useState, useEffect } from 'react';
import ThaiDateFormat from '../components/ThaiDateFormat';

function InventoryMaintenanceHistory({ dataInv, subInventories }) {
  const [statusBTN, setStatusBTN] = useState('maintenance'); 
  const [combinedData, setCombinedData] = useState({ maintenance: [], repair: [] });

  useEffect(() => {
    const fetchData = () => {
      let maintenanceData = [];
      let repairData = [];

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
        maintenanceData = maintenanceData.concat(dataInv.attributes.maintenance_reports.data
          .filter(item => item.attributes.isDone)
          .map(item => ({ ...item, type: 'maintenance', isSubInventory: false })));
      }
      if (dataInv?.attributes?.repair_reports?.data) {
        repairData = repairData.concat(dataInv.attributes.repair_reports.data
          .filter(item => item.attributes.isDone && item.attributes.isCanRepair)
          .map(item => ({ ...item, type: 'repair', isSubInventory: false })));
      }

      // ดึงข้อมูลจากครุภัณฑ์ในองค์ประกอบ
      if (subInventories && subInventories.length > 0) {
        subInventories.forEach(subInv => {
          if (subInv?.attributes?.maintenance_reports?.data) {
            maintenanceData = maintenanceData.concat(subInv.attributes.maintenance_reports.data
              .filter(item => item.attributes.isDone)
              .map(item => ({ ...item, type: 'maintenance', isSubInventory: true, subInventory: subInv })));
          }
          if (subInv?.attributes?.repair_reports?.data) {
            repairData = repairData.concat(subInv.attributes.repair_reports.data
              .filter(item => item.attributes.isDone && item.attributes.isCanRepair)
              .map(item => ({ ...item, type: 'repair', isSubInventory: true, subInventory: subInv })));
          }
        });
      }

      // กรองข้อมูลซ้ำ
      maintenanceData = filterDuplicates(maintenanceData);
      repairData = filterDuplicates(repairData);

      // เรียงข้อมูลตามวันที่
      const sortByDate = (a, b) => {
        const dateA = a.type === 'repair' ? new Date(a.attributes.dateFinishRepair) : new Date(a.attributes.DateToDo);
        const dateB = b.type === 'repair' ? new Date(b.attributes.dateFinishRepair) : new Date(b.attributes.DateToDo);
        return dateB - dateA;
      };

      maintenanceData.sort(sortByDate);
      repairData.sort(sortByDate);
      
      setCombinedData({ maintenance: maintenanceData, repair: repairData });
    };
  
    fetchData();
  }, [dataInv, subInventories]);

  const handleStatusChange = (newStatus) => setStatusBTN(newStatus);

  return (
    <div className="col-span-3">
      <div className="w-full flex ">
        <button
          className={`font-bold rounded-t-lg text-lg w-48 h-18  text-white justify-center ${
            statusBTN === "maintenance" ? "bg-[#8dd15c]" : "bg-[#c8e6b1] hover:bg-[#a5d681]"
          }`}
          onClick={() => handleStatusChange("maintenance")}
        >
          การบำรุงรักษา
        </button>
        <button
          className={`font-bold rounded-t-lg text-lg w-48 h-16 text-white justify-center ${
            statusBTN === "repair" ? "bg-[#2d6eca]" : "bg-[#a6c1dc] hover:bg-[#6da3db]"
          }`}
          onClick={() => handleStatusChange("repair")}
        >
          การซ่อมแซม
        </button>
        <button
          className={`font-bold rounded-t-lg text-lg w-48 h-16 text-white justify-center ${
            statusBTN === "both" ? "bg-[#9c27b0]" : "bg-[#c89dd2] hover:bg-[#c154db]"
          }`}
          onClick={() => handleStatusChange("both")}
        >
          แสดงทั้งสองตาราง
        </button>
      </div>
      <div className="space-y-8">
        {(statusBTN === 'maintenance' || statusBTN === 'both') && (
          <InventoryTable 
            data={combinedData.maintenance} 
            type="maintenance" 
            title="ประวัติการบำรุงรักษา" 
            dataInv={dataInv} 
          />
        )}
        {(statusBTN === 'repair' || statusBTN === 'both') && (
          <InventoryTable 
            data={combinedData.repair} 
            type="repair" 
            title="ประวัติการซ่อมแซม" 
            dataInv={dataInv} 
          />
        )}
      </div>
    </div>
  );
}

function InventoryTable({ data, type, title, dataInv }) {
  const totalPrice = data.reduce((sum, item) => {
    const price = type === 'repair' ? item.attributes.RepairPrice : item.attributes.prize;
    return sum + (parseFloat(price) || 0);
  }, 0);

  const hasPriceData = data.some(item => {
    const price = type === 'repair' ? item.attributes.RepairPrice : item.attributes.prize;
    return price !== null && price !== undefined && price !== '';
  });

  const tableHeaderColor = type === 'maintenance' ? 'bg-[#8dd15c]' : 'bg-[#2d6eca]';
  
  return (
    <div className="relative overflow-hidden shadow-md rounded-b-lg">
      <h2 className={`text-xl font-bold text-white p-4 ${tableHeaderColor}`}>{title}</h2>
      <table className="table-fixed w-full text-left">
        <thead className={`text-gray-200 ${tableHeaderColor}`}>
          <tr>
            <th className="py-2 border text-center p-4">วันที่</th>
            <th className="py-2 border text-center p-4">หมายเลขครุภัณฑ์</th>
            <th className="py-2 border text-center p-4">ชื่อครุภัณฑ์</th>
            <th className="py-2 border text-center p-4">รายละเอียด{type === 'maintenance' ? 'การบำรุงรักษา' : 'การซ่อมแซม'}</th>
            <th className="py-2 border text-center p-4">ค่าใช้จ่าย (บาท)</th>
          </tr>
        </thead>
        <tbody className="bg-white text-gray-500">
          {data.length > 0 ? (
            <>
              {data.map((item, index) => (
                <TableRow key={index} item={item} dataInv={dataInv} type={type} />
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
                {`ไม่มีข้อมูล${title}`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ item, dataInv, type }) {
  const date = type === 'repair' ? item.attributes.dateFinishRepair : item.attributes.DateToDo;
  
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
         {item.subInventory.attributes.name} 
      </>
    );
  } else {
    // สำหรับครุภัณฑ์หลัก
    idInv = dataInv.attributes.id_inv;
    name = dataInv.attributes.name;
  }

  const details = type === 'repair' ? item.attributes.ListDetailRepair : item.attributes.DetailMaintenance;
  const price = type === 'repair' ? item.attributes.RepairPrice : item.attributes.prize;
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