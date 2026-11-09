export const CARD_TYPES = {
  ACTIVE: 'active',
  PASSIVE: 'passive'
};

export const MAX_SLOTS = 4;
export const MAX_CARD_LEVEL = 5;

export const CARDS_DATABASE = [
  // --- หมวด ACTIVE (อาวุธ/สกิลหลัก) สูงสุด 4 ช่อง ---
  {
    id: 'multishot',
    type: CARD_TYPES.ACTIVE,
    name: 'Multishot',
    subName: 'ลูกปรายสาดรอบทิศ',
    icon: '🏹',
    color: '#38bdf8',
    getDesc: (lvl) => lvl === 0 
      ? 'ยิงกระสุนออก 2 นัดพร้อมกันมุมกว้าง' 
      : `เพิ่มกระสุนเป็น ${lvl + 2} นัดพร้อมกัน`
  },
  {
    id: 'bouncing',
    type: CARD_TYPES.ACTIVE,
    name: 'Bouncing Shot',
    subName: 'กระสุนชิ่งต่อทอด',
    icon: '⚡',
    color: '#a855f7',
    getDesc: (lvl) => lvl === 0 
      ? 'กระสุนชิ่งไปโดนศัตรูข้างๆ 1 ครั้ง' 
      : `เพิ่มจำนวนการชิ่งเป็น ${lvl + 1} ครั้ง`
  },
  {
    id: 'drone',
    type: CARD_TYPES.ACTIVE,
    name: 'Orbital Drone',
    subName: 'โดรนหมุนใบมีด',
    icon: '🛰️',
    color: '#fbbf24',
    getDesc: (lvl) => lvl === 0 
      ? 'เรียกโดรน 1 ลำ บินวนรอบป้อมชนศัตรู' 
      : `เพิ่มโดรนอีก 1 ลำ (รวมเป็น ${lvl + 1} ลำ)`
  },
  {
    id: 'poison_puddle',
    type: CARD_TYPES.ACTIVE,
    name: 'Poison Puddle',
    subName: 'บ่อพิษกัดกร่อน',
    icon: '🧪',
    color: '#22c55e',
    getDesc: (lvl) => lvl === 0 
      ? 'สุ่มเกิดบ่อพิษบนพื้น สร้างดาเมจต่อเนื่อง 4 วิ' 
      : `ดาเมจพิษแรงขึ้น +50% และเกิดพร้อมกัน ${lvl + 1} บ่อ`
  },
  {
    id: 'orbit_shield',
    type: CARD_TYPES.ACTIVE,
    name: 'Orbiting Shield',
    subName: 'เกราะหมุนผลักกระแทก',
    icon: '🛡️',
    color: '#06b6d4',
    getDesc: (lvl) => lvl === 0 
      ? 'สร้างบาเรียผลักมอนสเตอร์ ทำงาน 5 วิ แล้วคูลดาวน์' 
      : `บาเรียหมุนกว้างขึ้น และผลักศัตรูแรงขึ้น`
  },

  // --- หมวด PASSIVE (บัฟสนับสนุน) สูงสุด 4 ช่อง ---
  {
    id: 'time_extension',
    type: CARD_TYPES.PASSIVE,
    name: 'Chronos Gear',
    subName: 'ยืดระยะเวลาผลลัพธ์',
    icon: '⏳',
    color: '#ec4899',
    getDesc: (lvl) => lvl === 0 
      ? 'ยืดเวลาบ่อพิษและเกราะหมุนให้นานขึ้น +30%' 
      : `ยืดระยะเวลาสกิลขึ้นอีกเป็น +${(lvl + 1) * 30}%`
  },
  {
    id: 'cooldown_reduct',
    type: CARD_TYPES.PASSIVE,
    name: 'Overclock Battery',
    subName: 'เร่งคูลดาวน์สกิล',
    icon: '🔋',
    color: '#eab308',
    getDesc: (lvl) => lvl === 0 
      ? 'ลดเวลาคูลดาวน์ของเกราะและจังหวะสกิล -15%' 
      : `ลดเวลาคูลดาวน์ลงอีกเป็น -${(lvl + 1) * 15}%`
  },
  {
    id: 'area_expansion',
    type: CARD_TYPES.PASSIVE,
    name: 'Expansion Lens',
    subName: 'ขยายขนาดสกิล',
    icon: '🔍',
    color: '#f97316',
    getDesc: (lvl) => lvl === 0 
      ? 'ขยายขนาดบ่อพิษและระยะป้องป้อง +25%' 
      : `ขยายขนาดขอบเขตสกิลขึ้นเป็น +${(lvl + 1) * 25}%`
  },
  {
    id: 'vampiric',
    type: CARD_TYPES.PASSIVE,
    name: 'Vampiric Core',
    subName: 'ฟื้นฟูเลือดต่อนัดฆ่า',
    icon: '🩸',
    color: '#ef4444',
    getDesc: (lvl) => lvl === 0 
      ? 'สังหารมอนสเตอร์สำเร็จ ฟื้นเลือดป้อม +2 HP' 
      : `ฟื้นฟูเลือดเพิ่มขึ้นเป็น +${(lvl + 1) * 2} HP`
  },
  {
    id: 'meteor_strike',
    type: CARD_TYPES.ACTIVE,
    name: 'Meteor Strike',
    subName: 'อุกกาบาตเพลิงถล่ม',
    icon: '☄️',
    color: '#f97316',
    getDesc: (lvl) => lvl === 0 
      ? 'สุ่มทิ้งอุกกาบาตระเบิดพื้นที่กว้าง ดาเมจ 250%' 
      : `เพิ่มดาเมจระเบิดเป็น ${(lvl + 1) * 150 + 100}% และขยายวงกว้างขึ้น`
  },
  {
    id: 'frost_nova',
    type: CARD_TYPES.ACTIVE,
    name: 'Frost Nova',
    subName: 'คลื่นเยือกแข็งสะกดทัพ',
    icon: '❄️',
    color: '#38bdf8',
    getDesc: (lvl) => lvl === 0 
      ? 'ระเบิดคลื่นน้ำแข็ง ดาเมจ 80% พร้อมแช่แข็ง 1.5 วิ' 
      : `เพิ่มดาเมจเป็น ${Math.round((0.8 + (lvl + 1) * 0.4) * 100)}% และแช่แข็งนานขึ้นเป็น ${(1.5 + (lvl + 1) * 0.4).toFixed(1)} วิ`
  },

  // --- เพิ่มต่อท้ายในหมวด PASSIVE ---
  {
    id: 'spell_amp',
    type: CARD_TYPES.PASSIVE,
    name: 'Arcane Relic',
    subName: 'ศาสตร์เวทระเบิดซาก',
    icon: '🔮',
    color: '#8b5cf6',
    getDesc: (lvl) => lvl === 0 
      ? 'สกิลเวทแรงขึ้น +35% และศัตรูที่ตายจากเวทจะระเบิดกระจาย' 
      : `ดาเมจเวทแรงขึ้นเป็น +${(lvl + 1) * 35}% และรัศมีระเบิดกว้างขึ้น`
  },
  {
    id: 'duplicate_cast',
    type: CARD_TYPES.PASSIVE,
    name: 'Multicast Mirror',
    subName: 'กระจกเสกทวีคูณ',
    icon: '🪄', // เปลี่ยนจาก 🪞 เป็น 🪄 (หรือใช้ 🎴 หรือ 👥)
    color: '#06b6d4',
    getDesc: (lvl) => lvl === 0 
      ? 'เพิ่มจำนวนการทำงานของสกิลเวท (อุกกาบาต +1 ลูก, บ่อพิษ +1 บ่อ)' 
      : `เพิ่มจำนวนเสกสกิลเวทอีก +${lvl + 1} ชิ้นพร้อมกัน`
  }
];