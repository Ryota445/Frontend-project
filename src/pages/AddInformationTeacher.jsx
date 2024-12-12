import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, message,Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined ,SaveOutlined ,UserAddOutlined } from '@ant-design/icons';

const { Search } = Input;

function AddInformationTeacher() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [changedRoles, setChangedRoles] = useState({});

 const [responsibles, setResponsibles] = useState([]);
 const [useExistingResponsible, setUseExistingResponsible] = useState(false);
 const [useExistingResponsibleForNewUser, setUseExistingResponsibleForNewUser] = useState(false);

const fetchResponsibles = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`${API_URL}/api/responsibles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    setResponsibles(result.data);
  } catch (error) {
    console.error('Error fetching responsibles:', error);
  }
};

useEffect(() => {
  fetchUsers();
  fetchRoles();
  fetchResponsibles();
}, []);
 

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_URL}/api/users?populate=*`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setData(result.map(user => ({
        ...user,
        roleChanged: false,
        responsible: user.responsible?.data?.attributes || user.responsible
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };
  
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${API_URL}/api/role-in-webs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setRoles(result.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };


  const handleRoleChange = (userId, roleId) => {
    setChangedRoles(prev => ({...prev, [userId]: roleId}));
    setData(prevData => prevData.map(user => 
      user.id === userId ? {...user, role_in_web: {id: roleId}, roleChanged: true} : user
    ));
  };
  
  const handleSaveRole = async (userId) => {
    try {
      const newRoleId = changedRoles[userId];
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          role_in_web: newRoleId
        })
      });
  
      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการเปลี่ยน role บัญชีผู้ใช้');
      }
  
      message.success('เปลี่ยน role บัญชีผู้ใช้สำเร็จ');
      setChangedRoles(prev => {
        const newChangedRoles = {...prev};
        delete newChangedRoles[userId];
        return newChangedRoles;
      });
      setData(prevData => prevData.map(user => 
        user.id === userId ? {...user, role_in_web: {id: newRoleId}, roleChanged: false} : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      message.error('Error ในการเปลี่ยนบัญชีผู้ใช้');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      responsibleName: record.responsible?.attributes?.responsibleName,
      responsiblePhone: record.responsible?.attributes?.responsiblePhone,
      responsibleEmail: record.responsible?.attributes?.responsibleEmail,
      role_in_web: record.role_in_web?.id
    });
    setIsEditModalVisible(true);
  };
  
 const handleSave = async (record) => {
  try {
    const values = await form.validateFields();
    let responsibleData;

    if (values.useExistingResponsible) {
      responsibleData = values.responsibleId;
    } else {
      responsibleData = {
        responsibleName: values.responsibleName,
        responsiblePhone: values.responsiblePhone,
        responsibleEmail: values.responsibleEmail
      };
    }

    const response = await fetch(`${API_URL}/api/users/${record.id}?populate=*`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        responsible: responsibleData
      })
    });

    if (!response.ok) {
      throw new Error('เกิดข้อผิดพลาดในการบันทึกการแก้ไขข้อมูลผู้ดูแล');
    }

    message.success('แก้ไขข้อมูลผู้ดูแลสำเร็จ');
    fetchUsers();
    setIsEditModalVisible(false);
  } catch (error) {
    console.error('Error updating user:', error);
    message.error('เกิดข้อผิดพลาดในการบันทึกการแก้ไขข้อมูลผู้ดูแล');
  }
};


  const handleSearch = value => {
    setSearchText(value);
  };

  const filteredData = data.filter(item =>
    item.responsible?.employee_id?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.responsible?.responsibleName?.toLowerCase().includes(searchText.toLowerCase())
  );


  const [isAddResponsibleModalVisible, setIsAddResponsibleModalVisible] = useState(false);
  const [addResponsibleForm] = Form.useForm();

  const handleAddResponsible = async () => {
    try {
      const values = await addResponsibleForm.validateFields();
      
      // Post responsible data
      const response = await fetch(`${API_URL}/api/responsibles`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          data: {
            responsibleName: values.responsibleName,
            responsiblePhone: values.responsiblePhone,
            responsibleEmail: values.responsibleEmail
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add responsible');
      }

      message.success('เพิ่มข้อมูลผู้ดูแลสำเร็จ');
      setIsAddResponsibleModalVisible(false);
      addResponsibleForm.resetFields();
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error adding responsible:', error);
      message.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ดูแล');
    }
  };

  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [addUserForm] = Form.useForm();

  // Modify handleAddUser function
 const handleAddUser = async () => {
  try {
    const values = await addUserForm.validateFields();
    
    if (values.password !== values.confirmPassword) {
      message.error('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    let responsibleId;

    if (values.useExistingResponsible) {
      responsibleId = values.responsibleId;
    } else {
      // Create new responsible
      const responsibleResponse = await fetch(`${API_URL}/api/responsibles`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({ data: {
          responsibleName: values.responsibleName,
          responsiblePhone: values.responsiblePhone,
          responsibleEmail: values.email
        }})
      });

      if (!responsibleResponse.ok) {
        throw new Error('Failed to create responsible');
      }

      const responsibleData = await responsibleResponse.json();
      responsibleId = responsibleData.data.id;
    }

    // Create User
    const userResponse = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
        responsible: responsibleId,
        role: 1,
        role_in_web: 2
      })
    });

    if (!userResponse.ok) {
      throw new Error('Failed to create user');
    }

    message.success('เพิ่มบัญชีผู้ใช้สำเร็จ');
    setIsAddUserModalVisible(false);
    addUserForm.resetFields();
    fetchUsers();
  } catch (error) {
    console.error('Error adding user:', error);
    message.error(`เกิดข้อผิดพลาดในการเพิ่มบัญชีผู้ใช้: ${error.message}`);
  }
};

  const handleDeleteUser = async (record) => {
    // ตรวจสอบว่า Role เป็น Admin หรือไม่
    if (record.role_in_web?.id === 1 || record.role_in_web?.attributes?.RoleName.toLowerCase() === 'admin') {
      message.error('ไม่สามารถลบบัญชี Admin ได้');
      return;
    }

    Modal.confirm({
      title: 'ยืนยันการลบบัญชีผู้ใช้',
      content: 'คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้นี้?',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      okButtonProps: {
        style: { backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }
      },
      onOk: async () => {
        try {
          const response = await fetch(`${API_URL}/api/users/${record.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete user');
          }

          message.success('ลบบัญชีผู้ใช้สำเร็จ');
          fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
          message.error('เกิดข้อผิดพลาดในการลบบัญชีผู้ใช้');
        }
      }
    });
  };

  const columns = [
    {
      title: 'เลขประจำตัวพนักงาน',
      dataIndex: ['responsible', 'employee_id'],
      key: 'employee_id',
      render: (text, record) => record.responsible?.employee_id || text,
    },
    // {
    //   title: 'เลขประจำตัวพนักงาน',
    //   dataIndex: 'username',
    //   key: 'username',
    // },
    // {
    //   title: 'อีเมล',
    //   dataIndex: 'email',
    //   key: 'email',
    // },
    {
      title: 'ชื่อ',
      dataIndex: ['responsible', 'responsibleName'],
      key: 'responsibleName',
      render: (text, record) => record.responsible?.responsibleName || text,
    },
    {
      title: 'สิทธิ์การใช้งาน',
      dataIndex: 'role_in_web',
      key: 'role_in_web',
      render: (role, record) => (
        <Space>
          <Select
            value={changedRoles[record.id] || role?.id || record.role?.id}
            style={{ width: 120 }}
            onChange={(value) => handleRoleChange(record.id, value)}
          >
            {roles.map(r => (
              <Select.Option key={r.id} value={r.id}>{r.attributes.RoleName}</Select.Option>
            ))}
          </Select>
          <Button 
            icon={<SaveOutlined />} 
            onClick={() => handleSaveRole(record.id)}
            disabled={!record.roleChanged}
          >บันทึก</Button>
        </Space>
      ),
    },
    
    // {
    //   title: 'เบอร์โทรผู้ดูแล',
    //   dataIndex: ['responsible', 'responsiblePhone'],
    //   key: 'responsiblePhone',
    //   render: (text, record) => record.responsible?.responsiblePhone || text,
    // },
      // {
      //   title: 'อีเมลผู้ดูแล',
      //   dataIndex: ['responsible', 'responsibleEmail'],
      //   key: 'responsibleEmail',
      //   render: (text, record) => record.responsible?.responsibleEmail || text,
      // },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record.id)} danger />
        </Space>
      ),
    },
   
  ];

  return (
    <>
      <div className='border-b-2 border-black mb-10 flex justify-between items-center'>
        <h1 className='text-3xl text-blue-800'>จัดการข้อมูลผู้ดูแล</h1>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="ค้นหาตามชื่อผู้ใช้หรือชื่อผู้ดูแล"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
      </Space>

      <div className='flex flex-row justify-end'>
      <div className='flex flex-col justify-end'>
        <Button className='w-32 h-12 mr-10 mb-2' style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }} type="primary" onClick={() => setIsAddUserModalVisible(true)} icon={<UserAddOutlined />}>
          เพิ่มบัญชีผู้ใช้
        </Button>

        {/* <Button className='w-32 h-12 mr-10 mb-2' style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }} type="primary" onClick={() => setIsAddResponsibleModalVisible(true)} >
          เพิ่มผู้ดูแล
        </Button> */}

      </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={record => record.id}
        pagination={{ pageSize: 10 }}
      />

  <Modal
      title="เพิ่มผู้ดูแล"
      visible={isAddResponsibleModalVisible}
      onOk={handleAddResponsible}
      onCancel={() => {
        setIsAddResponsibleModalVisible(false);
        addResponsibleForm.resetFields();
      }}
      okText="ยืนยัน"
      cancelText="ยกเลิก"
      okButtonProps={{
        style: { backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }
      }}
      cancelButtonProps={{
        style: { borderColor: '#52c41a', color: '#52c41a' }
      }}
    >
      <Form form={addResponsibleForm} layout="vertical">
        <Form.Item
          name="responsibleName"
          label="ชื่อผู้ดูแล"
          rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ดูแล' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="responsiblePhone"
          label="เบอร์โทรศัพท์"
          rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="responsibleEmail"
          label="อีเมล"
          rules={[
            { required: true, message: 'กรุณากรอกอีเมล' },
            { type: 'email', message: 'กรุณากรอกอีเมลที่ถูกต้อง' }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>

      <Modal
  title="เพิ่มบัญชีผู้ใช้"
  visible={isAddUserModalVisible}
  onOk={handleAddUser}
  onCancel={() => {
    setIsAddUserModalVisible(false);
    addUserForm.resetFields();
    setUseExistingResponsibleForNewUser(false);
  }}
  okText="ยืนยัน"
  cancelText="ยกเลิก"
  okButtonProps={{
    style: { backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }
  }}
  cancelButtonProps={{
    style: { borderColor: '#1890ff', color: '#1890ff' }
  }}
>
  <div className="bg-gradient-to-b from-blue-200 to-blue-500 p-6 rounded-lg">
    <Form form={addUserForm} layout="vertical" className="space-y-4">
  <div className="text-lg font-semibold mb-2">ข้อมูลบัญชีผู้ใช้</div>
  <Form.Item name="username" rules={[{ required: true, message: 'กรุณากรอกชื่อบัญชี!' }]}>
    <Input id="add-username" placeholder="ชื่อบัญชี" className="rounded-md" />
  </Form.Item>
  <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'กรุณากรอกอีเมลที่ถูกต้อง!' }]}>
    <Input id="add-email" placeholder="อีเมล" className="rounded-md" />
  </Form.Item>
  <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}>
    <Input.Password id="add-password" placeholder="รหัสผ่าน" className="rounded-md" />
  </Form.Item>
  <Form.Item name="confirmPassword" rules={[{ required: true, message: 'กรุณายืนยันรหัสผ่าน!' }]}>
    <Input.Password id="add-confirmPassword" placeholder="ยืนยันรหัสผ่าน" className="rounded-md" />
  </Form.Item>
  
  <div className="text-lg font-semibold mt-6 mb-2">ข้อมูลผู้ดูแล</div>
  
      {/* <Form.Item name="useExistingResponsible" valuePropName="checked">
        <Checkbox onChange={(e) => setUseExistingResponsibleForNewUser(e.target.checked)}>
          ใช้ข้อมูลผู้ดูแลที่มีอยู่
        </Checkbox>
      </Form.Item> */}
      
      {useExistingResponsibleForNewUser ? (
        <Form.Item name="responsibleId" rules={[{ required: true, message: 'กรุณาเลือกผู้ดูแล!' }]}>
          <Select placeholder="เลือกผู้ดูแล">
            {responsibles.map(responsible => (
              <Select.Option key={responsible.id} value={responsible.id}>
                {responsible.attributes.responsibleName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ) : (
        <>
         <Form.Item name="responsibleName" rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ดูแล!' }]}>
    <Input id="add-responsibleName" placeholder="ชื่อผู้ดูแล" className="rounded-md" />
  </Form.Item>

  
  <Form.Item name="responsiblePhone" rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์ผู้ดูแล!' }]}>
    <Input id="add-responsiblePhone" placeholder="เบอร์โทรศัพท์ผู้ดูแล" className="rounded-md" />
  </Form.Item>
        </>
      )}
    </Form>
  </div>
</Modal>



      <Modal
  title="แก้ไขข้อมูลบัญชีผู้ใช้"
  visible={isEditModalVisible}
  onOk={() => handleSave(editingRecord)}
  onCancel={() => {
    setIsEditModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
    setUseExistingResponsible(false);
  }}
  okText="บันทึกการแก้ไข"
  cancelText="ยกเลิก"
  okButtonProps={{ 
    style: { backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' } 
  }}
  cancelButtonProps={{ 
    style: { borderColor: '#1890ff', color: '#1890ff' } 
  }}
>
  <Form form={form} layout="vertical">
  <Form.Item name="useExistingResponsible" valuePropName="checked">
    <Checkbox onChange={(e) => setUseExistingResponsible(e.target.checked)}>
      ใช้ข้อมูลผู้ดูแลที่มีอยู่
    </Checkbox>
  </Form.Item>
  
  {useExistingResponsible ? (
    <Form.Item name="responsibleId" label="เลือกผู้ดูแล" rules={[{ required: true }]}>
      <Select id="edit-responsibleId">
        {responsibles.map(responsible => (
          <Select.Option key={responsible.id} value={responsible.id}>
            {responsible.attributes.responsibleName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  ) : (
    <>
      <Form.Item name="responsibleName" label="ชื่อผู้ดูแล" rules={[{ required: true }]}>
        <Input id="edit-responsibleName" />
      </Form.Item>
      <Form.Item name="responsiblePhone" label="เบอร์โทรผู้ดูแล" rules={[{ required: true }]}>
        <Input id="edit-responsiblePhone" />
      </Form.Item>
      <Form.Item name="responsibleEmail" label="อีเมลผู้ดูแล" rules={[{ required: true, type: 'email' }]}>
        <Input id="edit-responsibleEmail" />
      </Form.Item>
    </>
  )}
</Form>
</Modal>
    </>
  );
}

export default AddInformationTeacher;