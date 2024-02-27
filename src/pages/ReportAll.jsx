
import React from 'react';
import ExportExcelComponent from '../components/ExportExcelComponent';

function ReportAll() {

  const database = [
    {
      itemName: 'คอมพิวเตอร์',
      inventory_number: 'C001',
      Inventory_number_faculty: '12345',
      category: 'electric',
      building: 'MATH',
      floor: '2',
      room: '204',
      taeacer: 'ผศ.ดร.สมชาย ใจดี',
      company: 'C-A',
      howToGet: 'buy',
      YearMoneyGet: '2564',
      DateOrder: '2024-02-14',
      DateRecive: '2024-02-15',
      serialNumber: 'SN001',
      model: 'Model X',
      brand: 'Brand A',
      prize: '20000',
      'age-use': '2',
      information: 'ข้อมูลเพิ่มเติมเกี่ยวกับอุปกรณ์',
    },
    {
      itemName: 'โทรศัพท์มือถือ',
      inventory_count: '5',
      inventory_number_m_start: 'M001',
      inventory_number_m_end: 'M005',
      Inventory_number_faculty: '54321',
      category: 'electric',
      building: 'MHMK',
      floor: '3',
      room: '302',
      taeacer: 'ผศ.ดร.มั่งมี ศรีสุข',
      company: 'C-B',
      howToGet: 'donate',
      YearMoneyGet: '2563',
      DateOrder: '2023-01-20',
      DateRecive: '2023-01-21',
      serialNumber: 'SN002',
      model: 'Model Y',
      brand: 'Brand B',
      prize: '15000',
      'age-use': '3',
      information: 'ข้อมูลเพิ่มเติมเกี่ยวกับโทรศัพท์มือถือ',
    },
    // เพิ่มข้อมูลเพิ่มเติมตามต้องการ
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Export ฐานข้อมูลเป็น Excel</h1>
      <ExportExcelComponent data={database} />
    </div>
  );
}

export default ReportAll;