import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Checkbox, Space, Button, Table, Modal, Upload, Dropdown, Menu, Select, Input } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, CloseOutlined, UploadOutlined, DownOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";

function TableViewInventory({ inventoryList, onDeleteSuccess, foundDataNumber }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortedInventoryList, setSortedInventoryList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showLocationFields, setShowLocationFields] = useState(false);
  const [showDisposalFields, setShowDisposalFields] = useState(false);
  const [newLocation, setNewLocation] = useState({ building: "", floor: "", room: "" });
  const [disposalReason, setDisposalReason] = useState("");
  const [disposalFileList, setDisposalFileList] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(['id_inv', 'name', 'responsible', 'category','location','action','status_inventory']);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const buildingResponse = await fetch("http://localhost:1337/api/buildings");
        const buildingData = await buildingResponse.json();
        setBuildingOptions(
          buildingData.data.map((item) => ({
            id: item.id,
            name: item.attributes.buildingName,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleView = (inventoryId) => {
    navigate(`/UserDetailInventory/${inventoryId}`);
  };

  const handleEdit = (inventoryId) => {
    navigate(`/EditInventory/${inventoryId}`);
  };

  const handleShowLocationFields = (value) => {
    setShowLocationFields(value);
  };

  const openModal = () => {
    if (selectedRows.length > 0) {
      setIsModalVisible(true);
    } else {
      message.warning("กรุณาเลือกรายการครุภัณฑ์ก่อน");
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setShowLocationFields(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowLocationFields(false);
    setShowDisposalFields(false);
  };

  const handleLocationChange = async () => {
    const data = {
      data: {
        NewLocationRoom: newLocation.room,
        NewLocationFloor: newLocation.floor,
        building: newLocation.building,
        inventories: selectedRows.map(row => row.id),
        isDone:false,
      },
    };

    try {
      const response = await fetch("http://localhost:1337/api/request-change-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("ไม่สามารถเปลี่ยนที่ตั้งได้");

      const responseData = await response.json();
      console.log("Change Location Success:", responseData);
      message.success("เปลี่ยนที่ตั้งสำเร็จ");
      // Refresh the data
      fetchChangeLocationData();
    } catch (error) {
      console.error("Error:", error);
      message.error("เกิดข้อผิดพลาดในการเปลี่ยนที่ตั้ง");
    }

    setIsModalVisible(false);
    setShowLocationFields(false);
  };

  const handleDisposal = async () => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
      ReasonDisposal: disposalReason,
      inventories: selectedRows.map(row => row.id),
    }));
    disposalFileList.forEach(file => {
      formData.append("files.FileReasonDisposal", file.originFileObj);
    });

    try {
      const response = await fetch("http://localhost:1337/api/request-disposals", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("ไม่สามารถทำจำหน่ายครุภัณฑ์ได้");

      const responseData = await response.json();
      console.log("Disposal Success:",JSON.stringify(responseData));
      message.success("ทำจำหน่ายครุภัณฑ์สำเร็จ");
      
    } catch (error) {
      console.error("Error:", error);
      message.error("เกิดข้อผิดพลาดในการทำจำหน่ายครุภัณฑ์");
    }

    setIsModalVisible(false);
    setShowDisposalFields(false);
  };

  const handleLocationInputChange = (key, value) => {
    setNewLocation({ ...newLocation, [key]: value });
  };

  const allColumns = [
    {
      title: 'หมายเลขครุภัณฑ์',
      dataIndex: ['attributes', 'id_inv'],
      key: 'id_inv',
    },
    {
      title: 'ชื่อครุภัณฑ์',
      dataIndex: ['attributes', 'name'],
      key: 'name',
    },
    {
      title: 'ผู้ดูแล',
      dataIndex: ['attributes', 'responsible', 'data', 'attributes', 'responsibleName'],
      key: 'responsible',
    },
    {
      title: 'หมวดหมู่',
      dataIndex: ['attributes', 'category', 'data', 'attributes', 'CategoryName'],
      key: 'category',
    },
    {
      title: 'ที่ตั้ง',
      key: 'location',
      children: [
        { title: 'อาคาร', dataIndex: ['attributes', 'building', 'data', 'attributes', 'buildingName'], key: 'building' },
        { title: 'ชั้น', dataIndex: ['attributes', 'floor'], key: 'floor' },
        { title: 'ห้อง', dataIndex: ['attributes', 'room'], key: 'room' },
      ],
    },
    {
      title: 'สถานะครุภัณฑ์',
      dataIndex: ['attributes', 'status_inventory', 'data', 'attributes', 'StatusInventoryName'],
      key: 'status_inventory',
    },
    {
      title: 'ดู/แก้ไข',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <EyeOutlined
            className="text-xl"
            onClick={() => handleView(record.id)}
          />
          <EditOutlined 
          className="text-xl" 
          onClick={() => handleEdit(record.id)}
          />
        </Space>
      ),
    },
    {
      title: 'ลบ',
      key: 'delete',
      render: (text, record) => (
        <Space size="middle">
          <DeleteOutlined
            className="text-xl"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const modalColumns = allColumns.filter(col => col.key !== 'action').concat({
    title: 'การจัดการ',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <CloseOutlined
          className="text-xl text-gray-600 opacity-50 hover:opacity-100 cursor-pointer"
          onClick={() => handleDeleteFromSelected(record.id)}
        />
      </Space>
    ),
  });

  const columns = allColumns.filter(col => visibleColumns.includes(col.key));

  useEffect(() => {
    const sortedInventoryList = [...inventoryList].sort((a, b) => {
      return a.attributes.id_inv.localeCompare(b.attributes.id_inv);
    });
    setSortedInventoryList(sortedInventoryList);
  }, [inventoryList]);

  const handleCheckboxChange = (id, inventory) => {
    const updatedSelectedItems = selectedItems.includes(id)
      ? selectedItems.filter((itemId) => itemId !== id)
      : [...selectedItems, id];

    const updatedSelectedRows = selectedItems.includes(id)
      ? selectedRows.filter((row) => row.id !== id)
      : [...selectedRows, inventory];

    setSelectedItems(updatedSelectedItems);
    setSelectedRows(updatedSelectedRows);

    message.info(`เลือกแล้ว ${updatedSelectedItems.length} รายการ`);
  };

  const handleDeleteFromSelected = (id) => {
    const updatedSelectedItems = selectedItems.filter((itemId) => itemId !== id);
    const updatedSelectedRows = selectedRows.filter((row) => row.id !== id);

    setSelectedItems(updatedSelectedItems);
    setSelectedRows(updatedSelectedRows);

    message.info(`ลบรายการออกจากที่เลือกแล้ว`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:1337/api/inventories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("ไม่สามารถลบข้อมูลได้");
      const responseData = await response.json();
      console.log("Deleted:", responseData);
      message.success("ลบข้อมูลสำเร็จ");
      onDeleteSuccess();
    } catch (error) {
      console.error("Error:", error);
      message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const menu = (
    <Menu
      multiple
      onClick={({ key }) => {
        if (visibleColumns.includes(key)) {
          setVisibleColumns(visibleColumns.filter(col => col !== key));
        } else {
          setVisibleColumns([...visibleColumns, key]);
        }
      }}
    >
      {allColumns.map(col => (
        <Menu.Item key={col.key}>
          <Checkbox checked={visibleColumns.includes(col.key)}>{col.title}</Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <div>
        <div className="flex justify-between mr-4">
          <h2 className="ml-4 text-xl font-bold ">
            ค้นพบ {foundDataNumber} รายการ
          </h2>
          
          <Button
            className="bg-gray-400 w-[120px] h-[40px]"
            type="primary"
            onClick={openModal}
          >
            เลือก
          </Button>
        </div>
      </div>

      <Modal
        title="จัดการครุภัณฑ์"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="w-3/4 max-w-screen-lg"
        width={1000}
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold">เลือก {selectedRows.length} รายการ</h2>
        </div>
        <Table
          columns={modalColumns}
          dataSource={selectedRows}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 240 }}
          rowKey="id"
        />

        {!showLocationFields && !showDisposalFields && (
          <div className="flex justify-end mt-4 space-x-2">
            <Button className="bg-blue-300" type="primary" onClick={() => setShowLocationFields(true)}>เปลี่ยนที่ตั้งครุภัณฑ์</Button>
            <Button className="bg-red-300" danger type="primary" onClick={() => setShowDisposalFields(true)}>ทำจำหน่ายครุภัณฑ์</Button>
          </div>
        )}

        {showLocationFields && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold">เปลี่ยนที่ตั้งครุภัณฑ์</h2>
            </div>
            <div className="flex flex-col space-y-4">
              <h2 className="text-lg font-bold">ที่ตั้งใหม่</h2>
              <h2 className="text-md font-bold">อาคาร</h2>
              <Select placeholder="อาคาร" onChange={(value) => handleLocationInputChange("building", value)}>
                {buildingOptions.map((building) => (
                  <Option key={building.id} value={building.id}>
                    {building.name}
                  </Option>
                ))}
              </Select>
              <h2 className="text-md font-bold">ชั้น</h2>
              <Input type="number" placeholder="ชั้น" onChange={(e) => handleLocationInputChange("floor", e.target.value)} />
              <h2 className="text-md font-bold">ห้อง</h2>
              <Input type="number" placeholder="ห้อง" onChange={(e) => handleLocationInputChange("room", e.target.value)} />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button className="bg-blue-300" type="primary" onClick={handleLocationChange}>ยืนยัน</Button>
              <Button onClick={() => setShowLocationFields(false)}>ยกเลิก</Button>
            </div>
          </>
        )}

        {showDisposalFields && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold">ทำจำหน่ายครุภัณฑ์</h2>
            </div>
            <div className="flex flex-col space-y-4">
              <Input placeholder="เหตุผลในการจำหน่าย" onChange={(e) => setDisposalReason(e.target.value)} />
              <Upload fileList={disposalFileList} onChange={({ fileList }) => setDisposalFileList(fileList)}>
                <Button icon={<UploadOutlined />}>อัพโหลดไฟล์</Button>
              </Upload>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button className="bg-blue-300" type="primary" onClick={handleDisposal}>ยืนยัน</Button>
              <Button onClick={() => setShowDisposalFields(false)}>ยกเลิก</Button>
            </div>
          </>
        )}
      </Modal>

      <div className="flex flex-row justify-start mt-2">
        <Dropdown overlay={menu} trigger={['click']}>
          <Button>เลือกคอลัมน์<DownOutlined /></Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={sortedInventoryList}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400 }}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedItems,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedItems(selectedRowKeys);
            setSelectedRows(selectedRows);
          },
        }}
      />
    </>
  );
}

export default TableViewInventory;
