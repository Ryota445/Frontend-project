import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import DateIsoToThai from '../components/DateIsoToThai';
import RepairReportTable from '../components/RepairReportTable'; 
import FilteredMaintenanceTable from '../components/FilteredMaintenanceTable';
import MaintenancePage3 from './MaintenancePage3';

const { Option } = Select;

const MantenantPage1 = () => {
  const [data, setData] = useState([]);
  const [dataMaintenance, setDataMaintenance] = useState([]);
  const [isRepairActive, setIsRepairActive] = useState(true);
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);
  const [statusRepair_inventoryOptions, setStatusRepair_inventoryOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRepairReportId, setSelectedRepairReportId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statusRepairResponse = await fetch("http://localhost:1337/api/status-repairs");
      const statusRepairData = await statusRepairResponse.json();
      setStatusRepair_inventoryOptions(
        statusRepairData.data.map(item => ({
          id: item.id,
          name: item.attributes.nameStatusRepair,
        }))
      );
    } catch (error) {
      console.error("Error Fetching data:", error);
    }
  };

  useEffect(() => {
    fetch('http://localhost:1337/api/repair-reports?populate=*')
      .then(response => response.json())
      .then(data => {
        if (data && data.data) {
          const formattedData = data.data
            .filter(item => !item.attributes.isDone)
            .map(item => {
              const inventory = item.attributes.inventory?.data?.attributes;
              const inventoryId = item.attributes.inventory?.data?.id;
              const user = item.attributes.users_permissions_user?.data?.attributes;
              const statusRepair = item.attributes.status_repair?.data?.attributes;

              const currentStatus = item.attributes.status_repair?.data?.id;

              return {
                key: item.id,
                date: <DateIsoToThai isoDate={item.attributes.createdAt} typeTime={1} />,
                id: <Link to={`/UserDetailInventory/${inventoryId}`}>{inventory?.id_inv}</Link> ?? 'N/A',
                name: <Link to={`/UserDetailInventory/${inventoryId}`}>{inventory?.name}</Link> ?? 'N/A',
                reportedBy: user?.username ?? 'N/A',
                description: item.attributes.RepairReasonByResponsible ?? 'N/A',
                FileReport: <a href={`http://localhost:1337${item?.attributes?.ReportFileByResponsible?.data?.[0]?.attributes?.url}`} target="_blank" rel="noopener noreferrer"><FileOutlined /><span className='ml-2'>{item?.attributes?.ReportFileByResponsible?.data?.[0]?.attributes?.name || "ไฟล์"}</span></a>,
                appointmentDate: 'DueDateRepair',
                maintenanceType: 'repair',
                
                status: (
                  <select
                    className="select select-bordered w-40 mr-4"
                    onChange={(e) => handleStatusChange(e, item.id)}
                    value={selectedStatus[item.id] || currentStatus}
                  >
                    {statusRepair_inventoryOptions.map(status => (
                      <option
                        key={status.id}
                        value={status.id}
                        disabled={status.id <= currentStatus}
                      >
                        {status.name}
                      </option>
                    ))}
                  </select>
                ),
                action: (
                  <Button
                    className="bg-gray-300"
                    type="primary"
                    onClick={() => {
                      setSelectedRepairReportId(item.id);
                      setModalVisible(true);
                    }}
                    disabled={!isStatusChanged(item.id, currentStatus)}
                  >
                    ดำเนินการต่อ
                  </Button>
                ),
              };
            });
          setData(formattedData);
        } else {
          console.error('Unexpected API response structure:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [statusRepair_inventoryOptions, selectedStatus]);

  useEffect(() => {
    fetch('http://localhost:1337/api/maintenance-reports?populate=*')
      .then(response => response.json())
      .then(data => {
        if (data && data.data) {
          const formattedData = data.data.map(item => {
            const inventory = item.attributes.inventory?.data?.attributes;
            const inventoryId = item.attributes.inventory?.data?.id;

            return {
              key: item.id,
              date: <DateIsoToThai isoDate={item.attributes.createdAt} typeTime={1} />,
              appointmentDate: <DateIsoToThai isoDate={item.attributes.DueDate} typeTime={1} />,
              id: <Link to={`/UserDetailInventory/${inventoryId}`}>{inventory?.id_inv}</Link> ?? 'N/A',
              name: <Link to={`/UserDetailInventory/${inventoryId}`}>{inventory?.name}</Link> ?? 'N/A',
              description: item.attributes.FileMaintenanceByAdmin ? (
                <Link to={`/MaintenanceDetail/${item.id}`}>กดดูเพิ่มเติม</Link>
              ) : 'N/A',
              action: (
                <Button className="bg-gray-300" type="primary">
                  ดำเนินการต่อ
                </Button>
              ),
            };
          });
          setDataMaintenance(formattedData);
        } else {
          console.error('Unexpected API response structure:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleStatusChange = (e, id) => {
    const newStatus = e.target.value;
    setSelectedStatus({ ...selectedStatus, [id]: newStatus });
  };

  const isStatusChanged = (id, currentStatus) => {
    return selectedStatus[id] && selectedStatus[id] !== currentStatus;
  };

  return (
    <>
      <div className="">
        <h1 className="text-2xl font-bold mb-8">ดูแลครุภัณฑ์</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-2">
          <SearchBox />
        </div>

        <div className='flex flex-row justify-end align-middle'>
          <div>
            <Button
              className={`text-md text-gray-700 ${isRepairActive ? 'bg-blue-500 text-white' : 'bg-gray-300'} h-[40px] mr-2`}
              type='primary'
              onClick={() => {
                setIsRepairActive(true);
                setIsMaintenanceActive(false);
              }}
            >
              แสดงคำร้องซ่อมแซมครุภัณฑ์
            </Button>
            <Button
              className={`text-md text-gray-700 ${isMaintenanceActive ? 'bg-blue-500 text-white' : 'bg-gray-300'} h-[40px]`}
              type='primary'
              onClick={() => {
                setIsRepairActive(false);
                setIsMaintenanceActive(true);
              }}
            >
              แสดงแจ้งเตือนบำรุงรักษาครุภัณฑ์
            </Button>
          </div>
        </div>

        {isRepairActive && <RepairReportTable data={data} />}
        {isMaintenanceActive && <FilteredMaintenanceTable data={dataMaintenance} />}

        <MaintenancePage3
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          repairReportId={selectedRepairReportId}
          selectedStatus={selectedStatus[selectedRepairReportId]}
        />
      </div>
    </>
  );
};

export default MantenantPage1;
