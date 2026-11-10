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
    icon: '💫',
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
    icon: '☠️',
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
      ? 'เพิ่มระยะเวลาแสดงผลของสกิลทั้งหมด +30%' 
      : `เพิ่มระยะเวลาแสดงผลของสกิลเป็น +${(lvl + 1) * 30}%`
  },
  {
    id: 'cooldown_reduct',
    type: CARD_TYPES.PASSIVE,
    name: 'Overclock Battery',
    subName: 'เร่งคูลดาวน์สกิล',
    icon: '🔋',
    color: '#eab308',
    getDesc: (lvl) => lvl === 0 
      ? 'ลดเวลาคูลดาวน์ของสกิลทั้งหมด -15%' 
      : `ลดเวลาคูลดาวน์ของสกิลทั้งหมดเป็น -${(lvl + 1) * 15}%`
  },
  {
    id: 'area_expansion',
    type: CARD_TYPES.PASSIVE,
    name: 'Expansion Lens',
    subName: 'ขยายขนาดสกิล',
    icon: '🔍',
    color: '#f97316',
    getDesc: (lvl) => lvl === 0 
      ? 'ขยายขนาดและระยะพื้นที่สกิลทั้งหมด +25%' 
      : `ขยายขนาดและระยะพื้นที่สกิลเป็น +${(lvl + 1) * 25}%`
  },
  {
    id: 'vampiric',
    type: CARD_TYPES.PASSIVE,
    name: 'Vampiric Core',
    subName: 'ฟื้นฟูเลือดต่อนัดฆ่า',
    icon: '💖',
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
    icon: '✨',
    color: '#06b6d4',
    getDesc: (lvl) => lvl === 0 
      ? 'เพิ่มจำนวนการทำงานของสกิลเวท +1 ครั้งพร้อมกัน' 
      : `เพิ่มจำนวนการปล่อยสกิลเวทเป็น +${lvl + 1} ครั้งพร้อมกัน`
  },

  // --- อาวุธสายยิงใหม่ (Active Skills) ---
  {
    id: 'railgun',
    type: CARD_TYPES.ACTIVE,
    name: 'Railgun Piercer',
    subName: 'ลำแสงทะลวงแถว',
    icon: '⚡',
    color: '#06b6d4',
    getDesc: (lvl) => lvl === 0
      ? 'ยิงลำแสงพลังงานทะลุมอนสเตอร์ทั้งแถว ดาเมจ 300%'
      : `เพิ่มดาเมจทะลวงเป็น ${(lvl + 1) * 80 + 300}% และลำแสงกว้างขึ้น`
  },
  {
    id: 'shrapnel',
    type: CARD_TYPES.ACTIVE,
    name: 'Shrapnel Round',
    subName: 'กระสุนแตกสะเก็ด',
    icon: '💥',
    color: '#f97316',
    getDesc: (lvl) => lvl === 0
      ? 'เมื่อกระสุนโดนเป้าหมาย แตกเป็นสะเก็ด 4 เม็ดกระจายรอบตัว'
      : `เพิ่มจำนวนสะเก็ดเป็น ${(lvl + 1) * 2 + 4} เม็ด และแรงขึ้น`
  },
  {
    id: 'sniper',
    type: CARD_TYPES.ACTIVE,
    name: 'Heavy Sniper',
    subName: 'สไนเปอร์ล่าบอส',
    icon: '🔭',
    color: '#ef4444',
    getDesc: (lvl) => lvl === 0
      ? 'ล็อคเป้าศัตรูเลือดสูงสุดทุก 4.5 วิ ดาเมจ 450% ติดคริติคอล 100%'
      : `ดาเมจสไนเปอร์เพิ่มเป็น ${(lvl + 1) * 150 + 450}% และยิงไวขึ้น`
  },
  {
    id: 'gatling',
    type: CARD_TYPES.ACTIVE,
    name: 'Gatling Overdrive',
    subName: 'ปืนกลเร่งรอบยิงรัว',
    icon: '🔫',
    color: '#eab308',
    getDesc: (lvl) => lvl === 0
      ? 'ทุก 8 วิ เข้าสู่โหมด Overdrive สปีดยิงรัวขึ้น +200% นาน 3 วิ'
      : `สปีดรัวแรงขึ้นเป็น +${(lvl + 1) * 50 + 200}% และอยู่นานขึ้น`
  },

  // --- การ์ดซัพพอร์ตสายยิง (Passive Skills) ---
  {
    id: 'deadly_optic',
    type: CARD_TYPES.PASSIVE,
    name: 'Deadly Optic',
    subName: 'เลนส์จุดตาย',
    icon: '🎯',
    color: '#f43f5e',
    getDesc: (lvl) => lvl === 0
      ? 'โอกาสคริติคอล +15% และดาเมจคริติคอลแรงขึ้น +50%'
      : `โอกาสคริติคอล +${(lvl + 1) * 15}% และคริแรงขึ้น +${(lvl + 1) * 50}%`
  },
  {
    id: 'kinetic_accel',
    type: CARD_TYPES.PASSIVE,
    name: 'Kinetic Accel',
    subName: 'แรงส่งจลน์สะสม',
    icon: '🌀',
    color: '#8b5cf6',
    getDesc: (lvl) => lvl === 0
      ? 'การโจมตีต่อเนื่องหรือแตกตัวแรงขึ้น +25% ต่อทอด'
      : `โบนัสดาเมจโจมตีต่อเนื่องเพิ่มขึ้นเป็น +${(lvl + 1) * 25}% ต่อทอด`
  },
  {
    id: 'heavy_caliber',
    type: CARD_TYPES.PASSIVE,
    name: 'Heavy Caliber',
    subName: 'หัวกระสุนผลักกระแทก',
    icon: '⚙️',
    color: '#64748b',
    getDesc: (lvl) => lvl === 0
      ? 'กระสุนมีแรงผลักมอนสเตอร์ให้ถอยหลังกลับไปเมื่อโดนยิง'
      : `แรงผลักกระแทกแรงขึ้น +${(lvl + 1) * 35}%`
  },
  {
    id: 'overclock_barrel',
    type: CARD_TYPES.PASSIVE,
    name: 'Overclock Barrel',
    subName: 'ลำกล้องโอเวอร์คล็อก',
    icon: '🔥',
    color: '#10b981',
    getDesc: (lvl) => lvl === 0
      ? 'ความเร็วการยิงถาวร +25% และกระสุนพุ่งเร็วขึ้น'
      : `ความเร็วการยิงเพิ่มขึ้นเป็น +${(lvl + 1) * 25}%`
  },

  // --- สายโดรน & ซัมมอน (Drone Active Skills) ---
  {
    id: 'laser_drone',
    type: CARD_TYPES.ACTIVE,
    name: 'Laser Drone',
    subName: 'โดรนปืนเลเซอร์',
    icon: '🛸',
    color: '#38bdf8',
    getDesc: (lvl) => lvl === 0
      ? 'เรียกโดรนเลเซอร์ 1 ลำ บินยิงศัตรูรอบๆ อัตโนมัติ'
      : `เพิ่มโดรนเลเซอร์อีก 1 ลำ (รวมเป็น ${lvl + 1} ลำ) และยิงแรงขึ้น`
  },
  {
    id: 'repair_drone',
    type: CARD_TYPES.ACTIVE,
    name: 'Nanite Repairer',
    subName: 'โดรนพยาบาลซ่อมบำรุง',
    icon: '🔧',
    color: '#22c55e',
    getDesc: (lvl) => lvl === 0
      ? 'เรียกโดรนพยาบาล 1 ลำ คอยยิงแสงฮีลเลือดป้อม +5 HP ทุก 2.5 วิ'
      : `เพิ่มการฟื้นฟูเลือดเป็น +${(lvl + 1) * 4 + 5} HP ต่อนัด`
  },

  // --- สายถึก & กองยานโดรน (Tank & Drone Passive Skills) ---
  {
    id: 'regen_core',
    type: CARD_TYPES.PASSIVE,
    name: 'Nano Regen Core',
    subName: 'แกนฟื้นฟูเลือดอัตโนมัติ',
    icon: '💚',
    color: '#10b981',
    getDesc: (lvl) => lvl === 0
      ? 'ป้อมฟื้นฟูเลือดตัวเองอัตโนมัติ +3 HP ต่อวินาที'
      : `ฟื้นฟูเลือดเพิ่มขึ้นเป็น +${(lvl + 1) * 3} HP/วินาที`
  },
  {
    id: 'thorns',
    type: CARD_TYPES.PASSIVE,
    name: 'Spiked Retaliation',
    subName: 'เกราะหนามสะท้อนดาเมจ',
    icon: '🌵',
    color: '#eab308',
    getDesc: (lvl) => lvl === 0
      ? 'เมื่อมอนสเตอร์ชนป้อม สะท้อนดาเมจสวนกลับ 250%'
      : `ดาเมจสะท้อนแรงขึ้นเป็น +${(lvl + 1) * 100 + 150}%`
  },
  {
    id: 'titan_plating',
    type: CARD_TYPES.PASSIVE,
    name: 'Titanium Plating',
    subName: 'เกราะไททาเนียมลดทอนดาเมจ',
    icon: '🔩',
    color: '#94a3b8',
    getDesc: (lvl) => lvl === 0
      ? 'ลดความเสียหายทุกชนิดที่ป้อมได้รับลง 20%'
      : `ลดความเสียหายลงอีกเป็น ${Math.min(55, (lvl + 1) * 7 + 20)}%`
  },
  {
    id: 'shockwave',
    type: CARD_TYPES.PASSIVE,
    name: 'Emergency Shockwave',
    subName: 'คลื่นผลักฉุกเฉิน',
    icon: '🌊',
    color: '#f59e0b',
    getDesc: (lvl) => lvl === 0
      ? 'เมื่อเลือดป้อมต่ำกว่า 35% ระเบิดคลื่นผลักมอนสเตอร์ทั้งจอกระเด็นถอย'
      : `คลื่นผลักแรงขึ้นและสร้างดาเมจระเบิด ${(lvl + 1) * 80}%`
  },
  {
    id: 'hive_overdrive',
    type: CARD_TYPES.PASSIVE,
    name: 'Hive Overdrive',
    subName: 'เร่งรอบใบมีดโดรน',
    icon: '🌪️',
    color: '#06b6d4',
    getDesc: (lvl) => lvl === 0
      ? 'โดรนทุกชนิดหมุนเร็วขึ้น +80% และดาเมจชนแรงขึ้น +40%'
      : `โดรนหมุนเร็วขึ้น +${(lvl + 1) * 50 + 80}% และชนแรงขึ้น +${(lvl + 1) * 30 + 40}%`
  },
  {
    id: 'drone_duplicator',
    type: CARD_TYPES.PASSIVE,
    name: 'Swarm Duplicator',
    subName: 'ฝูงโดรนวงแหวนคู่',
    icon: '🌐',
    color: '#a855f7',
    getDesc: (lvl) => lvl === 0
      ? 'แยกวงโคจรโดรนเป็น 2 ชั้น (วงใน + วงนอก) กวาดพื้นที่กว้างขึ้น'
      : `ขยายระยะวงนอกกว้างขึ้น และเพิ่มดาเมจโดรนวงนอก +${(lvl + 1) * 30}%`
  }
];