import React, { useState, useEffect, useMemo } from 'react';
import ThaiDateFormat from '../components/ThaiDateFormat';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function InventoryMaintenanceHistory({ dataInv, subInventories }) {
  const [statusBTN, setStatusBTN] = useState('maintenance');
  const [combinedData, setCombinedData] = useState({ maintenance: [], repair: [] });
  const [selectedInventories, setSelectedInventories] = useState({
    main: true,
    sub: subInventories.map(() => true)
  });

  const fetchData = useMemo(() => {
    return () => {
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
      if (selectedInventories.main && dataInv?.attributes?.maintenance_reports?.data) {
        maintenanceData = maintenanceData.concat(dataInv.attributes.maintenance_reports.data
          .filter(item => item.attributes.isDone)
          .map(item => ({ ...item, type: 'maintenance', isSubInventory: false })));
      }
      if (selectedInventories.main && dataInv?.attributes?.repair_reports?.data) {
        repairData = repairData.concat(dataInv.attributes.repair_reports.data
          .filter(item => item.attributes.isDone && item.attributes.isCanRepair)
          .map(item => ({ ...item, type: 'repair', isSubInventory: false })));
      }

      // ดึงข้อมูลจากครุภัณฑ์ในองค์ประกอบ
      if (subInventories && subInventories.length > 0) {
        subInventories.forEach((subInv, index) => {
          if (selectedInventories.sub[index]) {
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
      
      return { maintenance: maintenanceData, repair: repairData };
    };
  }, [dataInv, subInventories, selectedInventories]);

  useEffect(() => {
    const newData = fetchData();
    setCombinedData(newData);
  }, [fetchData, selectedInventories]);

  const handleStatusChange = (newStatus) => setStatusBTN(newStatus);

  const handleInventorySelection = (index) => {
    setSelectedInventories(prev => {
      if (index === -1) {
        return { ...prev, main: !prev.main };
      } else {
        const newSub = [...prev.sub];
        newSub[index] = !newSub[index];
        return { ...prev, sub: newSub };
      }
    });
  };

  const exportToExcel = () => {
    let dataToExport = [];

    if (statusBTN === 'maintenance' || statusBTN === 'both') {
      dataToExport = [...dataToExport, ...combinedData.maintenance.map(item => ({ ...item, type: 'บำรุงรักษา' }))];
    }
    if (statusBTN === 'repair' || statusBTN === 'both') {
      dataToExport = [...dataToExport, ...combinedData.repair.map(item => ({ ...item, type: 'ซ่อมแซม' }))];
    }

    // เรียงข้อมูลโดยให้การบำรุงรักษาอยู่ก่อนการซ่อมแซม และเรียงตามวันที่
    dataToExport.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'บำรุงรักษา' ? -1 : 1;
      }
      const dateA = a.type === 'ซ่อมแซม' ? new Date(a.attributes.dateFinishRepair) : new Date(a.attributes.DateToDo);
      const dateB = b.type === 'ซ่อมแซม' ? new Date(b.attributes.dateFinishRepair) : new Date(b.attributes.DateToDo);
      return dateB - dateA;
    });

    const excelData = dataToExport.map(item => ({
      'วันที่': item.type === 'ซ่อมแซม' 
        ? new Date(item.attributes.dateFinishRepair).toLocaleDateString('th-TH') 
        : new Date(item.attributes.DateToDo).toLocaleDateString('th-TH'),
      'หมายเลขครุภัณฑ์': item.isSubInventory 
        ? `${dataInv.attributes.id_inv} ${item.subInventory.attributes.id_inv}`
        : dataInv.attributes.id_inv,
      'ชื่อครุภัณฑ์': item.isSubInventory 
        ? item.subInventory.attributes.name
        : dataInv.attributes.name,
      'ประเภท': item.type,
      'รายละเอียด': item.type === 'ซ่อมแซม' 
        ? item.attributes.ListDetailRepair 
        : item.attributes.DetailMaintenance,
      'ค่าใช้จ่าย (บาท)': item.type === 'ซ่อมแซม' 
        ? formatNumber(parseFloat(item.attributes.RepairPrice).toFixed(2))
        : formatNumber(parseFloat(item.attributes.prize).toFixed(2)),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    XLSX.utils.book_append_sheet(wb, ws, "ประวัติบำรุงรักษาและซ่อมแซม");

    const fileName = `${dataInv.attributes.id_inv}-${dataInv.attributes.name}-ประวัติบำรุงรักษาและซ่อมแซม-${new Date().toLocaleDateString('th-TH')}.xlsx`;

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };
  
  
  return (
    <div className="col-span-3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">เลือกครุภัณฑ์หรือองค์ประกอบที่ต้องการดูประวัติ</h3>
        <div className="flex flex-col space-y-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedInventories.main}
              onChange={() => handleInventorySelection(-1)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">{dataInv.attributes.name}</span>
          </label>
          {subInventories.map((subInv, index) => (
            <label key={index} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedInventories.sub[index]}
                onChange={() => handleInventorySelection(index)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">{subInv.attributes.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full mb-0">
        <div className="flex justify-between items-end">
          <div className="flex">
            <button
              className={`font-bold rounded-t-lg text-lg w-48 h-12 text-white justify-center ${
                statusBTN === "maintenance" ? "bg-[#8dd15c]" : "bg-[#c8e6b1] hover:bg-[#a5d681]"
              }`}
              onClick={() => handleStatusChange("maintenance")}
            >
              การบำรุงรักษา
            </button>
            <button
              className={`font-bold rounded-t-lg text-lg w-48 h-12 text-white justify-center ${
                statusBTN === "repair" ? "bg-[#2d6eca]" : "bg-[#a6c1dc] hover:bg-[#6da3db]"
              }`}
              onClick={() => handleStatusChange("repair")}
            >
              การซ่อมแซม
            </button>
            <button
              className={`font-bold rounded-t-lg text-lg w-48 h-12 text-white justify-center ${
                statusBTN === "both" ? "bg-[#9c27b0]" : "bg-[#c89dd2] hover:bg-[#c154db]"
              }`}
              onClick={() => handleStatusChange("both")}
            >
              แสดงทั้งสองตาราง
            </button>
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-1"
            onClick={exportToExcel}
          >
            นำออกเป็น Excel
          </button>
        </div>
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
                <td className="py-4 border text-center p-4">{formatNumber(totalPrice.toFixed(2))}</td>
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
  const formattedPrice = price ? formatNumber(parseFloat(price).toFixed(2)) : 'ไม่มีข้อมูล';

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