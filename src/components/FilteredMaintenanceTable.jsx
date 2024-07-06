import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Radio } from 'antd';
import { Link } from 'react-router-dom';
import DateIsoToThai from '../components/DateIsoToThai';
import moment from 'moment';

const { RangePicker } = DatePicker;

const FilteredMaintenanceTable = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedOption, setSelectedOption] = useState("7");

  const columns = [
  
    {
      title: 'วันที่บำรุงรักษารอบถัดไป',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
    },
    {
      title: 'หมายเลขครุภัณฑ์',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'ชื่อครุภัณฑ์',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
      width: 400,
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  useEffect(() => {
    let startDate, endDate;
    if (selectedOption === 'range') {
      [startDate, endDate] = dateRange;
    } else {
      const days = parseInt(selectedOption, 10);
      startDate = moment().startOf('day');
      endDate = moment().add(days, 'days').endOf('day');
    }

    if (!startDate && !endDate) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => {
        const dueDate = moment(item.appointmentDate.props.isoDate);
        return (!startDate || dueDate.isSameOrAfter(startDate)) && (!endDate || dueDate.isSameOrBefore(endDate));
      });
      setFilteredData(filtered);
    }
  }, [dateRange, selectedOption, data]);

  const handleRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
    <div className='flex flex-col  border-2 border-gray-400 w-2/5 px-4 py-2 rounded-md mb-2'>
        <h1 className='text-lg font-semibold '>บำรุงรักษาที่ต้องทำ : </h1>
            <div className='flex flex-col items-center'>
            <Radio.Group onChange={handleOptionChange} value={selectedOption}>
                <Radio.Button value="7">ภายใน 7 วัน</Radio.Button>
                <Radio.Button value="15">ภายใน 15 วัน</Radio.Button>
                <Radio.Button value="30">ภายใน 30 วัน</Radio.Button>
                <Radio.Button value="range">ภายในช่วงวันที่</Radio.Button>
            </Radio.Group>
            {selectedOption === "range" && <div className='w-2/3 mt-2'><RangePicker onChange={handleRangeChange} /></div>}
            </div>     
      </div>
      <div>
              <h1 className='text-2xl font-semibold'>แจ้งเตือนบำรุงรักษาครุภัณฑ์</h1>
              <p className='text-lg'>มีทั้งหมด {filteredData.length} รายการ</p>
            </div>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );
};

export default FilteredMaintenanceTable;
