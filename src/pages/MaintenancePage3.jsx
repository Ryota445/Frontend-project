import React, { useState, useEffect } from 'react';
import { Button, message, Steps, Modal } from 'antd';
import MaintenanceState1 from '../components/MaintenanceState1';
import MaintenanceState2 from '../components/MaintenanceState2';
import MaintenanceState3 from '../components/MaintenanceState3';
import MaintenanceState4 from '../components/MaintenanceState4';
import MaintenanceState5 from '../components/MaintenanceState5';

function MaintenancePage3({ visible, onClose, repairReportId, selectedStatus }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [dataInv, setDataInv] = useState(null);
  const [dataRepairReport, setDataRepairReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});
  const [formDataFile, setFormDataFile] = useState({});

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
      const response = await fetch(`${API_URL}/api/repair-reports/${repairReportId}?populate=*`);
      if (!response.ok) throw new Error(`HTTP Error status: ${response.status}`);
      const repairReportData = await response.json();
      setDataRepairReport(repairReportData.data);

      const inventoryId = repairReportData.data.attributes.inventory.data.id;
      const inventoryResponse = await fetch(`${API_URL}/api/inventories/${inventoryId}?populate=*`);
      if (!inventoryResponse.ok) throw new Error(`HTTP Error status: ${inventoryResponse.status}`);
      const inventoryData = await inventoryResponse.json();
      setDataInv(inventoryData.data);

      setFormData(repairReportData.data.attributes);
      setFormDataFile({
        FileRepairByAdmin: repairReportData.data.attributes.FileRepairByAdmin?.data || [],
        FileRepairDone: repairReportData.data.attributes.FileRepairDone?.data || [],
        FileConsider: repairReportData.data.attributes.FileConsider?.data || [],
      });
    } catch (error) {
      console.error("Error Fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleFormDataChangeFile = (newData) => {
    setFormDataFile((prevData) => ({ ...prevData, ...newData }));
  };

  const submitForm = async () => {
    try {
      const formDataToSend = new FormData();

      const { FileRepairByAdmin, FileRepairDone, FileConsider, ...filteredFormData } = formData;

      const requestBody = {
        ...filteredFormData,
        status_repair: selectedStatus,
        isDone: selectedStatus == 4 || selectedStatus == 5,
        isCanRepair: selectedStatus != 5,
        allowedRepair: selectedStatus != 5,
      };

      formDataToSend.append('data', JSON.stringify(requestBody));

      Object.entries(formDataFile).forEach(([key, fileList]) => {
        if (fileList && fileList.length > 0) {
          fileList.forEach((file) => {
            formDataToSend.append(`files.${key}`, file.originFileObj);
          });
        }
      });

      const response = await fetch(`${API_URL}/api/repair-reports/${repairReportId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }

      message.success('บันทึกข้อมูลสำเร็จ');
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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
    const commonProps = {
      dataInvForCard: dataInv,
      dataRepairReport: dataRepairReport,
      onFormDataChange: handleFormDataChange,
      onFormDataChangeFile: handleFormDataChangeFile,
      initialFormData: formData,
      initialFormDataFile: formDataFile,
    };

    switch (current) {
      case 0:
        return <MaintenanceState1 {...commonProps} />;
      case 1:
        return <MaintenanceState2 {...commonProps} />;
      case 2:
        return <MaintenanceState4 {...commonProps} />;
      case 3:
        return <MaintenanceState5 onFormDataChange={handleFormDataChange} onFormDataChangeFile={handleFormDataChangeFile} />;
      case 4:
        return <MaintenanceState3 {...commonProps} />;
      default:
        return null;
    }
  };

  const items = steps.map(item => ({ key: item.title, title: item.title }));

  const handlePrevious = () => {
    setCurrent(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrent(prev => Math.min(steps.length - 1, prev + 1));
  };

  const isCurrentStatusSelected = current === parseInt(selectedStatus, 10) - 1;
  const canGoNext = current < Math.min(steps.length - 1, parseInt(selectedStatus, 10) - 1);

  return (
    <Modal visible={visible} onCancel={onClose} footer={null} width={1200}>
      <Steps current={current} items={items} />
      <div style={{ padding: '10px', minHeight: '500px', marginTop: 16 }}>
        {getContent()}
      </div>
      <div className='flex flex-row justify-between' style={{ marginTop: 24 }}>
        <div>
          {current !== 4 && (
            <>
              <Button onClick={handlePrevious} disabled={current === 0}>
                หน้าก่อนหน้า
              </Button>
              {canGoNext && (
                <Button onClick={handleNext} style={{ marginLeft: 8 }}>
                  หน้าถัดไป
                </Button>
              )}
            </>
          )}
        </div>
        <div>
          <Button style={{ margin: '0 8px' }} onClick={onClose}>
            ยกเลิก
          </Button>
          {isCurrentStatusSelected && (
            <Button className="bg-blue-300" type="primary" onClick={submitForm}>
              บันทึก
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default MaintenancePage3;