import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThaiDateFormat from "../components/ThaiDateFormat";
import { Steps, Spin } from 'antd';
import { PhoneOutlined, SolutionOutlined, ToolOutlined, SmileOutlined, CloseOutlined } from '@ant-design/icons';

const API_URL = import.meta.env.VITE_API_URL;

const RepairReportSteps = ({ id, setHasActiveReport }) => {
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataReport, setDataReport] = useState(null);

  useEffect(() => {
    const fetchRepairReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/repair-reports`, {
          params: {
            populate: '*',
            'filters[inventory][id]': id,
            'filters[isDone]': false,
            sort: 'createdAt:desc',
            'pagination[limit]': 1,
          },
        });

        if (response.data.data.length > 0) {
          const report = response.data.data[0];
          setDataReport(response.data.data[0]);
          const statusRepairId = (report.attributes?.status_repair?.data?.id) - 1;
          setCurrent(statusRepairId);
          setHasActiveReport(true);
        } else {
          setCurrent(null);
          setHasActiveReport(false);
        
        }
      } catch (error) {
        console.error('Error fetching repair report:', error);
        setHasActiveReport(false);
        setError('ไม่สามารถดึงข้อมูลรายงานการซ่อมได้');
      } finally {
        setLoading(false);
      }
    };

    fetchRepairReport();
  }, [id]);

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (current === null && !loading) {
    return null;
  }
  


  const steps = [
    { title: 'แจ้งซ่อม', icon: <PhoneOutlined /> },
    { title: 'รอพิจารณาซ่อม', icon: <SolutionOutlined /> },
    { title: 'ดำเนินการซ่อม', icon: <ToolOutlined /> },
    { title: 'เสร็จสิ้นการซ่อม', icon: <SmileOutlined /> },
  ];

  if (current === 4) {
    steps.splice(2, 2, { title: 'ไม่อนุมัติการซ่อม', icon: <CloseOutlined /> });
  }

  const items = steps.map((step, index) => ({
    key: index,
    title: step.title,
    icon: step.icon,
    status: index === current ? 'process' : index < current ? 'finish' : 'wait',
  }));

  return (
    <div>
      <Steps items={items} current={current} />
      <p>เลขที่ใบแจ้งซ่อม : {dataReport?.attributes?.NumberRepairFaculty ?? " - "} </p>
      <p>อัปเดตล่าสุดวันที่ :  
      {dataReport?.attributes?.updatedAt ? (
                          <span className='ml-1'>
                         <ThaiDateFormat 
                          dateString={dataReport?.attributes?.updatedAt}
                        />
                        </span>
                      
                    ) : (
                     <span  className='ml-1'> -  </span>
                      )}
                      </p>
    </div>
  );
};

export default RepairReportSteps;
