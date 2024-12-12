import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select } from "antd";
import { SearchOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import { useAuth } from '../context/AuthContext'; // เพิ่ม import useAuth

const { Option } = Select;

function SearchBoxRM({ onSearch, mode }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [reportedByOptions, setReportedByOptions] = useState([]);
  const [formData, setFormData] = useState({
    id_inv: "",
    name: "",
    reportedBy: "",
    NumberRepairFaculty: "",
  });

  
  const { user } = useAuth(); // เพิ่ม user context
  const isAdmin = user?.role_in_web?.RoleName === "Admin"; // เช็คว่าเป็น Admin หรือไม่

  // Refs for input fields
  const idInvRef = useRef(null);
  const nameRef = useRef(null);
  const reportedByRef = useRef(null);
  const numberRepairFacultyRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const reportedByResponse = await fetch(`${API_URL}/api/responsibles`);
        const reportedByData = await reportedByResponse.json();
        setReportedByOptions(
          reportedByData.data.map((item) => ({
            id: item.id,
            name: item.attributes.responsibleName,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = () => {
    onSearch(formData);
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const isRepairMode = mode === 'repair';

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-1"></div>
      <div className="col-span-10">
        <div className="border-4 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="id_inv" className="block text-sm font-medium text-gray-700 mb-2">
                หมายเลขครุภัณฑ์
              </label>
              <Input
                ref={idInvRef}
                placeholder="หมายเลขครุภัณฑ์"
                id="id_inv"
                name="id_inv"
                value={formData.id_inv}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, nameRef)}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อครุภัณฑ์
              </label>
              <Input
                ref={nameRef}
                placeholder="ชื่อครุภัณฑ์"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, reportedByRef)}
              />
            </div>
            <div>
              <label htmlFor="reportedBy" className="block text-sm font-medium text-gray-700 mb-2">
                แจ้งโดย
              </label>
              <Select
  ref={reportedByRef}
  placeholder="เลือกผู้แจ้ง"
  id="reportedBy"
  name="reportedBy"
  value={formData.reportedBy}
  onChange={(value) => setFormData({ ...formData, reportedBy: value })}
  onKeyDown={(e) => handleKeyDown(e, numberRepairFacultyRef)}
  disabled={!isRepairMode || !isAdmin} // เพิ่มเงื่อนไข !isAdmin
  showSearch
  optionFilterProp="children"
  suffixIcon={
    formData.reportedBy && isRepairMode && isAdmin ? ( // เพิ่มเงื่อนไข isAdmin
      <Button
        type="text"
        onClick={() => setFormData({ ...formData, reportedBy: "" })}
        icon={<CloseOutlined />}
      />
    ) : (
      <DownOutlined />
    )
  }
  className="w-full"  // ใช้ w-full เพื่อให้ความกว้างเต็มที่
>
  {reportedByOptions.map((reportedBy) => (
    <Option key={reportedBy.id} value={reportedBy.id}>
      {reportedBy.name}
    </Option>
  ))}
</Select>
            </div>
            <div>
              <label htmlFor="NumberRepairFaculty" className="block text-sm font-medium text-gray-700 mb-2">
                เลขที่ใบแจ้งซ่อม
              </label>
              <Input
                ref={numberRepairFacultyRef}
                placeholder="เลขที่ใบแจ้งซ่อม"
                id="NumberRepairFaculty"
                name="NumberRepairFaculty"
                value={formData.NumberRepairFaculty}
                onChange={handleInputChange}
                disabled={!isRepairMode}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              className="text-gray-800 bg-gray-300 px-10 w-32 h-10"
              type="primary"
              onClick={handleSearch}
              htmlType="submit"
            >
              <SearchOutlined className="text-base" />{" "}
              <span className="hidden md:inline">ค้นหา</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
}

export default SearchBoxRM;