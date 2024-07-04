import React, { useState, useEffect } from 'react';
import { Button, message, Steps, Modal } from 'antd';
import MaintenanceState1 from '../components/MaintenanceState1';
import MaintenanceState2 from '../components/MaintenanceState2';
import MaintenanceState3 from '../components/MaintenanceState3';
import MaintenanceState4 from '../components/MaintenanceState4';
import MaintenanceState5 from '../components/MaintenanceState5';

function MaintenancePage3({ visible, onClose, repairReportId, selectedStatus }) {
  const [dataInv, setDataInv] = useState(null);
  const [dataRepairReport, setDataRepairReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  useEffect(() => {
    if (selectedStatus !== undefined && selectedStatus !== null && !isNaN(selectedStatus)) {
      setCurrent(parseInt(selectedStatus, 10) - 1);
    }
  }, [selectedStatus]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:1337/api/repair-reports/${repairReportId}?populate=*`);
      if (!response.ok) throw new Error(`HTTP Error status: ${response.status}`);
      const repairReportData = await response.json();
      setDataRepairReport(repairReportData.data);

      const inventoryId = repairReportData.data.attributes.inventory.data.id;
      const inventoryResponse = await fetch(`http://localhost:1337/api/inventories/${inventoryId}?populate=*`);
      if (!inventoryResponse.ok) throw new Error(`HTTP Error status: ${inventoryResponse.status}`);
      const inventoryData = await inventoryResponse.json();
      setDataInv(inventoryData.data);
    } catch (error) {
      console.error("Error Fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = current === 4
    ? [
        { title: 'แจ้งซ่อม' },
        { title: 'รอพิจารณาซ่อม' },
        { title: 'ไม่อนุมัติการซ่อม' },
      ]
    : [
        { title: 'แจ้งซ่อม' },
        { title: 'รอพิจารณาซ่อม' },
        { title: 'ดำเนินการซ่อม' },
        { title: 'เสร็จสิ้นการซ่อม' },
      ];

  const getContent = () => {
    switch (parseInt(selectedStatus, 10) - 1) {
      case 0:
        return <MaintenanceState1 dataInvForCard={dataInv} dataRepairReport={dataRepairReport} />;
      case 1:
        return <MaintenanceState2 dataInvForCard={dataInv} dataRepairReport={dataRepairReport} />;
      case 2:
        return  <MaintenanceState4 />;
      case 3:
        return <MaintenanceState5 />;
      case 4:
        return <MaintenanceState3 />;
      default:
        return null;
    }
  };

  const items = steps.map(item => ({ key: item.title, title: item.title }));

  return (
    <Modal visible={visible} onCancel={onClose} footer={null} width={1200}>
      <Steps current={current} items={items} />
      <div style={{ padding: '10px', minHeight: '500px', marginTop: 16 }}>
        {getContent()}
      </div>
      <div className='flex flex-row justify-end' style={{ marginTop: 24 }}>
        <Button style={{ margin: '0 8px' }} onClick={onClose}>
          ยกเลิก
        </Button>
        <Button className="bg-blue-300" type="primary" onClick={() => message.success('Processing complete!')}>
          บันทึก
        </Button>
      </div>
    </Modal>
  );
}

export default MaintenancePage3;
