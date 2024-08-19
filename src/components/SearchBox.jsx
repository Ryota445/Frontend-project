import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, Checkbox } from "antd";
import { SearchOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";

const { Option } = Select;

function SearchBox({ onSearch, mode, onSubInventorySearchChange }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [responsibleOptions, setResponsibleOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [statusInventoryOptions, setStatusInventoryOptions] = useState([]);
  const [searchSubInventory, setSearchSubInventory] = useState(false);
  const [formData, setFormData] = useState({
    id_inv: "",
    name: "",
    responsible: "",
    category: "",
    building: "",
    floor: "",
    room: "",
    statusInventory: "",
    sub_inventory: "",
  });
  const [modeSearch, setModeSearch] = useState(mode);

  // Refs for input fields
  const idInvRef = useRef(null);
  const nameRef = useRef(null);
  const responsibleRef = useRef(null);
  const categoryRef = useRef(null);
  const buildingRef = useRef(null);
  const floorRef = useRef(null);
  const roomRef = useRef(null);
  const statusInventoryRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch responsibles
        const responsibleResponse = await fetch(`${API_URL}/api/responsibles`);
        const responsibleData = await responsibleResponse.json();
        setResponsibleOptions(
          responsibleData.data.map((item) => ({
            id: item.id,
            name: item.attributes.responsibleName,
          }))
        );

        // Fetch categories
        const categoryResponse = await fetch(`${API_URL}/api/categories`);
        const categoryData = await categoryResponse.json();
        setCategoryOptions(
          categoryData.data.map((item) => ({
            id: item.id,
            name: item.attributes.CategoryName,
          }))
        );

        // Fetch buildings
        const buildingResponse = await fetch(`${API_URL}/api/buildings`);
        const buildingData = await buildingResponse.json();
        setBuildingOptions(
          buildingData.data.map((item) => ({
            id: item.id,
            name: item.attributes.buildingName,
          }))
        );

        // Fetch status inventories
        const statusInventoryResponse = await fetch(
          `${API_URL}/api/status-inventories`
        );
        const statusInventoryData = await statusInventoryResponse.json();
        setStatusInventoryOptions(
          statusInventoryData.data.map((item) => ({
            id: item.id,
            name: item.attributes.StatusInventoryName,
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

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSearchSubInventory(isChecked);
    onSubInventorySearchChange(isChecked); // ส่งสถานะ checkbox ไปยัง parent component
  };

  const handleSearch = () => {
    const searchData = { ...formData, searchSubInventory };
    onSearch(searchData);
  };

  const filteredStatusInventoryOptions =
    mode !== "Disposal"
      ? statusInventoryOptions.filter((option) => option.id !== 3)
      : statusInventoryOptions;

  // Handle Enter key to move focus to the next field
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1"></div>
        <div className="col-span-10">
          <div className="border-4 rounded-lg">
            <div className="flex flex-col m-4 mt-4 md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div>
                <label
                  htmlFor="id_inv"
                  className="block text-sm font-medium text-gray-700 mb-2 mx-1"
                >
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
                  style={{ width: 200 }}
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2 mx-1"
                >
                  ชื่อครุภัณฑ์
                </label>
                <Input
                  ref={nameRef}
                  placeholder="ชื่อครุภัณฑ์"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, responsibleRef)}
                  style={{ width: 330 }}
                />
              </div>
              <div>
                <label
                  htmlFor="responsible"
                  className="block text-sm font-medium text-gray-700 mb-2 mx-1"
                >
                  ผู้ดูแล
                </label>
                <Select
                  ref={responsibleRef}
                  placeholder="เลือกผู้ดูแล"
                  id="responsible"
                  name="responsible"
                  value={formData.responsible}
                  onChange={(value) =>
                    setFormData({ ...formData, responsible: value })
                  }
                  style={{ width: 200 }}
                  onKeyDown={(e) => handleKeyDown(e, categoryRef)}
                  showSearch // เพิ่มคุณสมบัตินี้เพื่อให้สามารถค้นหาตัวเลือกได้
                  optionFilterProp="children" // ใช้คุณสมบัตินี้เพื่อให้สามารถกรองตัวเลือกตามที่พิมพ์ได้
                  suffixIcon={
                    formData.responsible ? (
                      <Button
                        type="text"
                        onClick={() =>
                          setFormData({ ...formData, responsible: "" })
                        }
                        icon={<CloseOutlined />}
                      />
                    ) : (
                      <DownOutlined />
                    )
                  }
                >
                  {responsibleOptions.map((responsible) => (
                    <Option key={responsible.id} value={responsible.id}>
                      {responsible.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="mt-10">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2 mx-1"
                >
                  ประเภทครุภัณฑ์
                </label>
                <Select
                  ref={categoryRef}
                  placeholder="เลือกประเภทครุภัณฑ์"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  style={{ width: 200 }}
                  onKeyDown={(e) => handleKeyDown(e, buildingRef)}
                  showSearch 
                  optionFilterProp="children" 
                  suffixIcon={
                    formData.category ? (
                      <Button
                        type="text"
                        onClick={() =>
                          setFormData({ ...formData, category: "" })
                        }
                        icon={<CloseOutlined />}
                      />
                    ) : (
                      <DownOutlined />
                    )
                  }
                >
                  {categoryOptions.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex-col m-4 mt-4 md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="border-2 border-gray500 rounded-md flex flex-col p-2">
                <div className="flex flex-row gap-2">
                  <div>
                    <label
                      htmlFor="building"
                      className="block text-sm font-medium text-gray-700 mb-2 mx-1"
                    >
                      อาคาร
                    </label>
                    <Select
                      ref={buildingRef}
                      placeholder="เลือกอาคาร"
                      id="building"
                      name="building"
                      value={formData.building}
                      onChange={(value) =>
                        setFormData({ ...formData, building: value })
                      }
                      style={{ width: 200 }}
                      onKeyDown={(e) => handleKeyDown(e, floorRef)}
                      showSearch 
                      optionFilterProp="children" 
                      suffixIcon={
                        formData.building ? (
                          <Button
                            type="text"
                            onClick={() =>
                              setFormData({ ...formData, building: "" })
                            }
                            icon={<CloseOutlined />}
                          />
                        ) : (
                          <DownOutlined />
                        )
                      }
                    >
                      {buildingOptions.map((building) => (
                        <Option key={building.id} value={building.id}>
                          {building.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="floor"
                      className="block text-sm font-medium text-gray-700 mb-2 mx-1"
                    >
                      ชั้น
                    </label>
                    <Input
                      ref={floorRef}
                      placeholder="ชั้น"
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, roomRef)}
                      style={{ width: 100 }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="room"
                      className="block text-sm font-medium text-gray-700 mb-2 mx-1"
                    >
                      ห้อง
                    </label>
                    <Input
                      ref={roomRef}
                      placeholder="ห้อง"
                      id="room"
                      name="room"
                      value={formData.room}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, statusInventoryRef)} // เปลี่ยนเป็น statusInventoryRef
                      style={{ width: 100 }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-2">
                <label
                  htmlFor="statusInventory"
                  className="block text-sm font-medium text-gray-700 mb-2 mx-1"
                >
                  สถานะครุภัณฑ์
                </label>

                <Select
                  ref={statusInventoryRef}
                  placeholder="เลือกสถานะครุภัณฑ์"
                  id="statusInventory"
                  name="statusInventory"
                  value={formData.statusInventory}
                  onChange={(value) =>
                    setFormData({ ...formData, statusInventory: value })
                  }
                  style={{ width: 200 }}
                  onKeyDown={(e) => handleKeyDown(e, statusInventoryRef)}
                  suffixIcon={
                    formData.statusInventory ? (
                      <Button
                        type="text"
                        onClick={() =>
                          setFormData({ ...formData, statusInventory: "" })
                        }
                        icon={<CloseOutlined />}
                      />
                    ) : (
                      <DownOutlined />
                    )
                  }
                >
                  {filteredStatusInventoryOptions.map((statusInventory) => (
                    <Option key={statusInventory.id} value={statusInventory.id}>
                      {statusInventory.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <div>
                  <Checkbox
                    id="searchSubInventory"
                    checked={searchSubInventory}
                    onChange={handleCheckboxChange}
                  >
                    ครุภัณฑ์ที่มีองค์ประกอบ
                  </Checkbox>
                </div>
                {searchSubInventory && (
                  <div>
                    <Input
                      placeholder="ชื่อองค์ประกอบในชุดครุภัณฑ์"
                      id="sub_inventory"
                      name="sub_inventory"
                      value={formData.sub_inventory}
                      onChange={handleInputChange}
                      style={{ width: 200 }}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center">
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
        </div>
        <div className="col-span-1"></div>
      </div>
    </>
  );
}

export default SearchBox;
