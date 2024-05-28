import React, { useState, useEffect } from 'react';

const DateDifferenceCalculator = ({ dateReceive }) => {
  const [difference, setDifference] = useState('');

  useEffect(() => {
    // ตรวจสอบว่ามีค่า dateReceive หรือไม่
    if (dateReceive) {
      const currentDate = new Date();
      const targetDate = new Date(dateReceive);

      let years = currentDate.getFullYear() - targetDate.getFullYear();
      let months = currentDate.getMonth() - targetDate.getMonth();
      let days = currentDate.getDate() - targetDate.getDate();

      if (days < 0) {
        months -= 1;
        days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      // กำหนดค่าให้กับ state difference
      setDifference(`${years} ปี ${months} เดือน ${days} วัน`);
    }
  }, [dateReceive]);

  return (
    <div>
      {/* แสดงผลลัพธ์ */}
      {difference && <p>ความแตกต่าง: {difference}</p>}
    </div>
  );
};

export default DateDifferenceCalculator;
