import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// ข้อมูลสำหรับแผนภูมิ Pie Chart
const pieData = [
  { name: 'เครื่องมือวิทยาศาสตร์', value: 400 },
  { name: 'เครื่องใช้ไฟฟ้า', value: 300 },
  { name: 'เฟอร์นิเจอร์', value: 300 },
  { name: 'อื่นๆ', value: 200 },
];

// สีสำหรับแต่ละส่วนใน Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


function HomePage() {
  return (
    <>
    
    
    <div className="m-4">
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="ครุภัณฑ์ทั้งหมด"
              value={1}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="ชิ้น"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="ครุภัณฑ์ใหม่เดือนนี้"
              value={1}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="ชิ้น"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {/* เพิ่ม Pie Chart ที่นี่ */}
            <PieChart width={400} height={400} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={pieData}
                cx={200} // ปรับค่านี้เพื่อเปลี่ยนตำแหน่งแกน X ของ Pie Chart
                cy={200} // ปรับค่านี้เพื่อเปลี่ยนตำแหน่งแกน Y ของ Pie Chart
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100} // ขยายรัศมีภายนอกเพื่อให้มีพื้นที่มากขึ้นสำหรับข้อความ
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </Card>
        </Col>
      </Row>
      {/* คุณสามารถเพิ่มรายงานอื่นๆ หรือตารางข้อมูลในนี้ */}
    </div>
    
    </>
  )
}

export default HomePage