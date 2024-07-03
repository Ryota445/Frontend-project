import React from 'react'

const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

function DateIsoToThai({ isoDate ,typeTime}) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    const formattedDate2 = `${day} ${month} ${year}`;

    if(typeTime ==1){
      return <div>{formattedDate2}</div>

    }
  
  return (
    <div>{formattedDate}</div>
  )
}

export default DateIsoToThai