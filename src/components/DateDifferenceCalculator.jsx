const DateDifferenceCalculator = ({ dateReceive }) => {
  // console.log("DateDifferenceCalculator called with:", dateReceive);
  
  if (!dateReceive) {
    return "ไม่มีข้อมูลวันที่";
  }

  const calculateTimeDifference = (dateReceive) => {
    const today = new Date();
    const receivedDate = new Date(dateReceive);
    
    let years = today.getFullYear() - receivedDate.getFullYear();
    let months = today.getMonth() - receivedDate.getMonth();
    let days = today.getDate() - receivedDate.getDate();

    // ปรับค่าเดือนและปีถ้าจำเป็น
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const { years, months, days } = calculateTimeDifference(dateReceive);
  // console.log("Calculated time difference:", { years, months, days });

  // สร้างข้อความผลลัพธ์
  let result = [];
  if (years > 0) result.push(`${years} ปี`);
  if (months > 0) result.push(`${months} เดือน`);
  if (days > 0) result.push(`${days} วัน`);

  // ถ้าไม่มีความแตกต่างของเวลา (วันเดียวกัน)
  if (result.length === 0) return "0 วัน";

  return result.join(" ");
};

export default DateDifferenceCalculator;