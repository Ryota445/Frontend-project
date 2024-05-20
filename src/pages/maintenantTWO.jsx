import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Space, message } from 'antd';
import axios from 'axios';
import { DotsHorizontalIcon } from '@heroicons/react/solid';


const maintenantTWO = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/requests');
      setRequests(response.data);
    } catch (error) {
      message.error('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!selectedRequest) {
      message.warning('Please select a request first');
      return;
    }

    try {
      await axios.post(`/api/requests/${selectedRequest.id}/actions`, { action });
      message.success('Request action successful');
      fetchRequests();
    } catch (error) {
      message.error('Error performing request action');
    }
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Requester',
      dataIndex: 'requester',
      key: 'requester',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => setSelectedRequest(record)}
            icon={<DotsHorizontalIcon className="h-4 w-4" />}
          >
            Actions
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const RequestActions = ({ request }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Add buttons for repair, approval, or system notifications */}
        <Button onClick={() => handleAction('repair')}>Repair</Button>
        <Button onClick={() => handleAction('approve')}>Approve</Button>
        <Button onClick={() => handleAction('system')}>System Notification</Button>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={requests}
        loading={loading}
        rowKey={(record) => record.id}
      />
      {selectedRequest && (
        <RequestActions request={selectedRequest} />
      )}
    </div>
  );
};

export default maintenantTWO;