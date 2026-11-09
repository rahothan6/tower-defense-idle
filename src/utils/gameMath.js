// คำนวณระยะทางระหว่างจุดสองจุด
export const getDistance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

// คำนวณมุม (Radian) มุ่งหน้าหาเป้าหมาย
export const getAngle = (fromX, fromY, toX, toY) => Math.atan2(toY - fromY, toX - fromX);

// สูตรคิดราคาอัปเกรดชิ้นถัดไป (Exponential Scaling)
export const getUpgradeCost = (baseCost, multiplier, level) => {
  return Math.floor(baseCost * Math.pow(multiplier, level));
};