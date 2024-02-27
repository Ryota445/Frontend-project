import React from 'react';
import ExcelJS from 'exceljs';
import { Button, Table } from 'antd';

function ExportExcelComponent({ data }) {
  const columns = [
    { title: 'ชื่อ', dataIndex: 'itemName' },
    { title: 'เลขครุภัณฑ์', dataIndex: 'inventory_number' },
    { title: 'รหัสสินทรัพย์', dataIndex: 'Inventory_number_faculty' },
    { title: 'ประเภท', dataIndex: 'category' },
    { title: 'อาคาร', dataIndex: 'building' },
    { title: 'ชั้น', dataIndex: 'floor' },
    { title: 'ห้อง', dataIndex: 'room' },
    { title: 'อาจารย์ผู้สอน', dataIndex: 'taeacer' },
    { title: 'บริษัท', dataIndex: 'company' },
    { title: 'วิธีการได้มา', dataIndex: 'howToGet' },
    { title: 'ปีที่ได้มา', dataIndex: 'YearMoneyGet' },
    { title: 'วันที่สั่งซื้อ', dataIndex: 'DateOrder' },
    { title: 'วันที่รับ', dataIndex: 'DateRecive' },
    { title: 'Serial Number', dataIndex: 'serialNumber' },
    { title: 'Model', dataIndex: 'model' },
    { title: 'Brand', dataIndex: 'brand' },
    { title: 'ราคา', dataIndex: 'prize' },
    { title: 'อายุการใช้งาน', dataIndex: 'age-use' },
    { title: 'ข้อมูลเพิ่มเติม', dataIndex: 'information' },
  ];

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Database');

    // สร้างหัวข้อคอลัมน์
    worksheet.columns = columns.map(col => ({
      header: col.title,
      key: col.dataIndex,
      width: 20 // กำหนดความกว้างของคอลัมน์
    }));
    data.forEach(item => {
      const row = {};
      columns.forEach(col => {
        row[col.dataIndex] = item[col.dataIndex];
      });
      worksheet.addRow(row);
    });

    // สร้างไฟล์ Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // ดาวน์โหลดไฟล์ Excel
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Table dataSource={data} pagination={false} bordered rowKey={(record, index) => index}>
        {columns.map(column => (
          <Table.Column title={column.title} dataIndex={column.dataIndex} key={column.dataIndex} />
        ))}
      </Table>
      <Button onClick={exportToExcel} type="primary">
        Export เป็น Excel
      </Button>
    </>
  );
}

export default ExportExcelComponent;
