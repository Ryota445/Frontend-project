import * as XLSX from 'xlsx';

export const ExcelExport = (data, selectedColumns, exportType) => {
  let exportData = data;

  if (exportType === 'selected') {
    exportData = data.map(item => {
      const newItem = {};
      selectedColumns.forEach(col => {
        newItem[col] = item[col];
      });
      return newItem;
    });
  } else if (exportType === 'maintenance') {
    // ตรงนี้คุณสามารถเพิ่มลอจิกสำหรับการ export ข้อมูลการบำรุงรักษา
    console.log('Export maintenance data');
  } else if (exportType === 'repair') {
    // ตรงนี้คุณสามารถเพิ่มลอจิกสำหรับการ export ข้อมูลการซ่อมแซม
    console.log('Export repair data');
  } else if (exportType === 'general') {
    // ตรงนี้คุณสามารถเพิ่มลอจิกสำหรับการ export ข้อมูลทั่วไป
    console.log('Export general data');
  }

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "InventoryReport");
  XLSX.writeFile(workbook, "InventoryReport.xlsx");
};