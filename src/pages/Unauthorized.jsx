import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <Result
    status="403"
    title="403"
    subTitle="ขอโทษด้วยคุณไม่ได้รับอนุญาตให้เข้าถึงหน้านี้."
    extra={<Button  ><Link to="/">กลับหน้าหลัก</Link></Button>}
  />
);

export default Unauthorized;