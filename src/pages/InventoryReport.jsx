import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Modal, Radio, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ExcelExport } from './ExcelExport';
import { dummyData } from './dummyData';

const InventoryReport = () => {
  const [selectedColumns, setSelectedColumns] = useState([
    'inventoryNumber', 'name', 'supervisor', 'type', 'location', 'status'
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exportType, setExportType] = useState('selected');
  const [data, setData] = useState(dummyData);



// เดียวมาใส่

// const fetchDataFromBackend = async () => {
//     try {
//       const response = await fetch('YOUR_API_ENDPOINT');
//       const data = await response.json();
//       setData(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
  
//   const saveDataToBackend = async (updatedData) => {
//     try {
//       await fetch('YOUR_API_ENDPOINT', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedData),
//       });
//     } catch (error) {
//       console.error('Error saving data:', error);
//     }
//   };
  
//   useEffect(() => {
//     fetchDataFromBackend();
//   }, []);





  const handleColumnSelect = (columnKey) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleRowSelect = (selectedRowKeys) => {
    setSelectedRows(selectedRowKeys);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExport = () => {
    ExcelExport(data, selectedColumns, exportType);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // ฟังก์ชันค้นหาจริงควรทำที่ backend
    const filteredData = dummyData.filter(item => 
      item[dataIndex].toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
    );
    setData(filteredData);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setData(dummyData);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`ค้นหา ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            ค้นหา
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            รีเซ็ต
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    {
      title: 'หมายเลขครุภัณฑ์',
      dataIndex: 'inventoryNumber',
      key: 'inventoryNumber',
      ...getColumnSearchProps('inventoryNumber'),
    },
    {
      title: 'ชื่อครุภัณฑ์',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'ผู้ดูแล',
      dataIndex: 'supervisor',
      key: 'supervisor',
      ...getColumnSearchProps('supervisor'),
    },
    {
      title: 'ประเภทครุภัณฑ์',
      dataIndex: 'type',
      key: 'type',
      ...getColumnSearchProps('type'),
    },
    {
      title: 'ที่ตั้ง',
      dataIndex: 'location',
      key: 'location',
      ...getColumnSearchProps('location'),
    },
    {
      title: 'สถานะครุภัณฑ์',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
    },
    {
      title: 'หมายเลข SN',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      ...getColumnSearchProps('serialNumber'),
    },
    {
      title: 'ยี่ห้อ',
      dataIndex: 'brand',
      key: 'brand',
      ...getColumnSearchProps('brand'),
    },
    {
      title: 'รุ่น',
      dataIndex: 'model',
      key: 'model',
      ...getColumnSearchProps('model'),
    },
    {
      title: 'ราคาที่ซื้อ',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      ...getColumnSearchProps('purchasePrice'),
    },
    {
      title: 'อายุการใช้งานจริง',
      dataIndex: 'actualLifespan',
      key: 'actualLifespan',
      ...getColumnSearchProps('actualLifespan'),
    },
    {
      title: 'อายุการใช้งานโดยประเมิน',
      dataIndex: 'estimatedLifespan',
      key: 'estimatedLifespan',
      ...getColumnSearchProps('estimatedLifespan'),
    },
    {
      title: 'รายละเอียดเพิ่มเติม',
      dataIndex: 'additionalDetails',
      key: 'additionalDetails',
      ...getColumnSearchProps('additionalDetails'),
    },
    {
      title: 'ปีงบประมาณ',
      dataIndex: 'fiscalYear',
      key: 'fiscalYear',
      ...getColumnSearchProps('fiscalYear'),
    },
    {
      title: 'ตัวแทนบริษัท/ผู้บริจาค',
      dataIndex: 'supplier',
      key: 'supplier',
      ...getColumnSearchProps('supplier'),
    },
    {
      title: 'วันที่สั่งซื้อ',
      dataIndex: 'orderDate',
      key: 'orderDate',
      ...getColumnSearchProps('orderDate'),
    },
    {
      title: 'วันที่ตรวจรับ/วันที่รับโอน',
      dataIndex: 'receiveDate',
      key: 'receiveDate',
      ...getColumnSearchProps('receiveDate'),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        {columns.map(col => (
          <Checkbox
            key={col.key}
            onChange={() => handleColumnSelect(col.key)}
            checked={selectedColumns.includes(col.key)}
          >
            {col.title}
          </Checkbox>
        ))}
      </div>
      <Table
        columns={columns.filter(col => selectedColumns.includes(col.key))}
        dataSource={data}
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: handleRowSelect,
        }}
        rowKey="id"
      />
      <Button onClick={showModal}>เลือก ({selectedRows.length})</Button>
      <Modal
        title="รายการที่เลือก"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="export" type="primary" onClick={handleExport}>
            นำออกไฟล์ Excel
          </Button>,
        ]}
      >
        <Radio.Group onChange={(e) => setExportType(e.target.value)} value={exportType}>
          <Radio value="selected">นำออกไฟล์ Excel ตามคอลัมน์ที่เลือก</Radio>
          <Radio value="maintenance">นำออกไฟล์ Excel การบำรุงรักษา</Radio>
          <Radio value="repair">นำออกไฟล์ Excel การซ่อมแซม</Radio>
          <Radio value="general">นำออกไฟล์ Excel นำออกรายการข้อมูลทั่วไปครุภัณฑ์</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default InventoryReport;