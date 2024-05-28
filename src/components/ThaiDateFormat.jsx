import React from 'react';

const ThaiDateFormat = ({ dateString }) => {
    // ฟังก์ชันสำหรับแปลงวันที่ให้เป็นรูปแบบไทย
    const formatThaiDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear() + 543; // เพิ่ม 543 เพื่อเปลี่ยนจาก ค.ศ. เป็น พ.ศ.
        
        // แปลงเดือนเป็นชื่อภาษาไทย
        const thaiMonths = [
            "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
            "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
        ];
        const thaiMonth = thaiMonths[monthIndex];
        
        return `${day} ${thaiMonth} ${year}`;
    };

    // แปลงวันที่ให้เป็นรูปแบบไทย
    const thaiDate = formatThaiDate(dateString);

    return (
        <span>{thaiDate}</span>
    );
};

export default ThaiDateFormat;
