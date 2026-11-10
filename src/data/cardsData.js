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
    getDesc: (lvl, lang = 'th') => {
      const nextBullets = Math.min(4, lvl + 2);
      const nextDmg = 50 + (lvl * 10);
      if (lang === 'en') {
        if (lvl === 0) return 'Fires 2 arrows simultaneously (50% dmg each)';
        if (lvl < 3) return `Increases to ${nextBullets} arrows (${nextDmg}% dmg each)`;
        return `Capped at 4 arrows (increases dmg to ${nextDmg}% each)`;
      }
      if (lvl === 0) return 'ยิงกระสุน 2 นัดพร้อมกัน (ดาเมจต่อนัด 50%)';
      if (lvl < 3) return `เพิ่มกระสุนเป็น ${nextBullets} นัด (ดาเมจต่อนัด ${nextDmg}%)`;
      return `จำกัดสูงสุด 4 นัด (เพิ่มดาเมจต่อนัดเป็น ${nextDmg}%)`;
    }
  },
  {
    id: 'bouncing',
    type: CARD_TYPES.ACTIVE,
    name: 'Bouncing Shot',
    subName: 'กระสุนชิ่งต่อทอด',
    icon: '💫',
    color: '#a855f7',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Bullets bounce to 1 nearby enemy' 
          : `Increases bounces to ${lvl + 1} times`;
      }
      return lvl === 0 
        ? 'กระสุนชิ่งไปโดนศัตรูข้างๆ 1 ครั้ง' 
        : `เพิ่มจำนวนการชิ่งเป็น ${lvl + 1} ครั้ง`;
    }
  },
  {
    id: 'drone',
    type: CARD_TYPES.ACTIVE,
    name: 'Orbital Drone',
    subName: 'ลูกแก้วมนตราบริวาร',
    icon: '🔮',
    color: '#fbbf24',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Summons 1 magic orb orbiting the wizard to damage enemies' 
          : `Adds 1 additional magic orb (total ${lvl + 1} orbs)`;
      }
      return lvl === 0 
        ? 'เรียกลูกแก้วมนตรา 1 ลูก บินวนรอบจอมเวทชนศัตรู' 
        : `เพิ่มลูกแก้วอีก 1 ลูก (รวมเป็น ${lvl + 1} ลูก)`;
    }
  },
  {
    id: 'poison_puddle',
    type: CARD_TYPES.ACTIVE,
    name: 'Poison Puddle',
    subName: 'บ่อพิษ Venom Dust',
    icon: '🧪',
    color: '#22c55e',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Spawns a venom puddle dealing continuous damage for 4s' 
          : `Poison dmg +50% and spawns ${lvl + 1} puddles simultaneously`;
      }
      return lvl === 0 
        ? 'สุ่มเกิดบ่อพิษเดือดบนพื้น สร้างดาเมจต่อเนื่อง 4 วิ' 
        : `ดาเมจพิษแรงขึ้น +50% และเกิดพร้อมกัน ${lvl + 1} บ่อ`;
    }
  },
  {
    id: 'orbit_shield',
    type: CARD_TYPES.ACTIVE,
    name: 'Orbiting Shield',
    subName: 'เกราะหมุนผลักกระแทก',
    icon: '🛡️',
    color: '#06b6d4',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Creates a rotating force shield that pushes back enemies for 5s' 
          : 'Expands shield radius and enhances knockback force';
      }
      return lvl === 0 
        ? 'สร้างบาเรียผลักมอนสเตอร์ ทำงาน 5 วิ แล้วคูลดาวน์' 
        : 'บาเรียหมุนกว้างขึ้น และผลักศัตรูแรงขึ้น';
    }
  },

  // --- หมวด PASSIVE (บัฟสนับสนุน) สูงสุด 4 ช่อง ---
  {
    id: 'time_extension',
    type: CARD_TYPES.PASSIVE,
    name: 'Chronos Gear',
    subName: 'ยืดระยะเวลาผลลัพธ์',
    icon: '⏳',
    color: '#ec4899',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Increases all skill effect durations by +30%' 
          : `Increases all skill effect durations to +${(lvl + 1) * 30}%`;
      }
      return lvl === 0 
        ? 'เพิ่มระยะเวลาแสดงผลของสกิลทั้งหมด +30%' 
        : `เพิ่มระยะเวลาแสดงผลของสกิลเป็น +${(lvl + 1) * 30}%`;
    }
  },
  {
    id: 'cooldown_reduct',
    type: CARD_TYPES.PASSIVE,
    name: 'Overclock Battery',
    subName: 'เร่งคูลดาวน์สกิล',
    icon: '🔋',
    color: '#eab308',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Reduces all skill cooldowns by -15%' 
          : `Reduces all skill cooldowns to -${(lvl + 1) * 15}%`;
      }
      return lvl === 0 
        ? 'ลดเวลาคูลดาวน์ของสกิลทั้งหมด -15%' 
        : `ลดเวลาคูลดาวน์ของสกิลทั้งหมดเป็น -${(lvl + 1) * 15}%`;
    }
  },
  {
    id: 'area_expansion',
    type: CARD_TYPES.PASSIVE,
    name: 'Expansion Lens',
    subName: 'ขยายขนาดสกิล',
    icon: '🔍',
    color: '#f97316',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Increases AoE size and radius of all skills by +25%' 
          : `Increases AoE size and radius of all skills to +${(lvl + 1) * 25}%`;
      }
      return lvl === 0 
        ? 'ขยายขนาดและระยะพื้นที่สกิลทั้งหมด +25%' 
        : `ขยายขนาดและระยะพื้นที่สกิลเป็น +${(lvl + 1) * 25}%`;
    }
  },
  {
    id: 'vampiric',
    type: CARD_TYPES.PASSIVE,
    name: 'Vampiric Core',
    subName: 'ฟื้นฟูเลือดต่อนัดฆ่า',
    icon: '💖',
    color: '#ef4444',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Restores +2 HP to the wizard upon defeating an enemy' 
          : `Increases HP restore to +${(lvl + 1) * 2} HP per kill`;
      }
      return lvl === 0 
        ? 'สังหารมอนสเตอร์สำเร็จ ฟื้นเลือดจอมเวท +2 HP' 
        : `ฟื้นฟูเลือดเพิ่มขึ้นเป็น +${(lvl + 1) * 2} HP`;
    }
  },
  {
    id: 'meteor_strike',
    type: CARD_TYPES.ACTIVE,
    name: 'Meteor Strike',
    subName: 'อุกกาบาตเพลิงถล่ม',
    icon: '☄️',
    color: '#f97316',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Drops a massive meteor dealing 250% AoE blast damage' 
          : `Increases meteor damage to ${(lvl + 1) * 150 + 100}% with wider blast`;
      }
      return lvl === 0 
        ? 'สุ่มทิ้งอุกกาบาตระเบิดพื้นที่กว้าง ดาเมจ 250%' 
        : `เพิ่มดาเมจระเบิดเป็น ${(lvl + 1) * 150 + 100}% และขยายวงกว้างขึ้น`;
    }
  },
  {
    id: 'frost_nova',
    type: CARD_TYPES.ACTIVE,
    name: 'Frost Nova',
    subName: 'คลื่นเยือกแข็งสะกดทัพ',
    icon: '❄️',
    color: '#38bdf8',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Unleashes a frost wave dealing 80% dmg and freezes enemies for 1.5s' 
          : `Increases damage to ${Math.round((0.8 + (lvl + 1) * 0.4) * 100)}% and freeze duration to ${(1.5 + (lvl + 1) * 0.4).toFixed(1)}s`;
      }
      return lvl === 0 
        ? 'ระเบิดคลื่นน้ำแข็ง ดาเมจ 80% พร้อมแช่แข็ง 1.5 วิ' 
        : `เพิ่มดาเมจเป็น ${Math.round((0.8 + (lvl + 1) * 0.4) * 100)}% และแช่แข็งนานขึ้นเป็น ${(1.5 + (lvl + 1) * 0.4).toFixed(1)} วิ`;
    }
  },

  // --- หมวด PASSIVE เวทมนตร์ ---
  {
    id: 'spell_amp',
    type: CARD_TYPES.PASSIVE,
    name: 'Arcane Relic',
    subName: 'ศาสตร์เวทระเบิดซาก',
    icon: '📖',
    color: '#8b5cf6',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Magic skills deal +35% damage and enemies explode upon death' 
          : `Increases magic damage to +${(lvl + 1) * 35}% with wider corpse explosion`;
      }
      return lvl === 0 
        ? 'สกิลเวทแรงขึ้น +35% และศัตรูที่ตายจากเวทจะระเบิดกระจาย' 
        : `ดาเมจเวทแรงขึ้นเป็น +${(lvl + 1) * 35}% และรัศมีระเบิดกว้างขึ้น`;
    }
  },
  {
    id: 'duplicate_cast',
    type: CARD_TYPES.PASSIVE,
    name: 'Multicast Mirror',
    subName: 'กระจกเสกทวีคูณ',
    icon: '✨',
    color: '#06b6d4',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0 
          ? 'Triggers +1 additional simultaneous cast for magic skills' 
          : `Increases simultaneous casts to +${lvl + 1} times`;
      }
      return lvl === 0 
        ? 'เพิ่มจำนวนการทำงานของสกิลเวท +1 ครั้งพร้อมกัน' 
        : `เพิ่มจำนวนการปล่อยสกิลเวทเป็น +${lvl + 1} ครั้งพร้อมกัน`;
    }
  },

  // --- อาวุธสายยิงใหม่ (Active Skills) ---
  {
    id: 'railgun',
    type: CARD_TYPES.ACTIVE,
    name: 'Railgun Piercer',
    subName: 'ลำแสงทะลวงแถว',
    icon: '⚡',
    color: '#06b6d4',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Fires a high-energy beam piercing through an enemy line for 300% dmg'
          : `Increases piercing beam damage to ${(lvl + 1) * 80 + 300}% with wider beam`;
      }
      return lvl === 0
        ? 'ยิงลำแสงพลังงานทะลุมอนสเตอร์ทั้งแถว ดาเมจ 300%'
        : `เพิ่มดาเมจทะลวงเป็น ${(lvl + 1) * 80 + 300}% และลำแสงกว้างขึ้น`;
    }
  },
  {
    id: 'shrapnel',
    type: CARD_TYPES.ACTIVE,
    name: 'Shrapnel Round',
    subName: 'กระสุนแตกสะเก็ด',
    icon: '💥',
    color: '#f97316',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Bullets shatter into 4 explosive shrapnels upon target impact'
          : `Increases shrapnels to ${(lvl + 1) * 2 + 4} pellets with higher damage`;
      }
      return lvl === 0
        ? 'เมื่อกระสุนโดนเป้าหมาย แตกเป็นสะเก็ด 4 เม็ดกระจายรอบตัว'
        : `เพิ่มจำนวนสะเก็ดเป็น ${(lvl + 1) * 2 + 4} เม็ด และแรงขึ้น`;
    }
  },
  {
    id: 'sniper',
    type: CARD_TYPES.ACTIVE,
    name: 'Heavy Sniper',
    subName: 'สไนเปอร์ล่าบอส',
    icon: '🔭',
    color: '#ef4444',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Snipes highest HP target every 4.5s dealing 450% guaranteed Crit dmg'
          : `Increases sniper damage to ${(lvl + 1) * 150 + 450}% with faster rate`;
      }
      return lvl === 0
        ? 'ล็อคเป้าศัตรูเลือดสูงสุดทุก 4.5 วิ ดาเมจ 450% ติดคริติคอล 100%'
        : `ดาเมจสไนเปอร์เพิ่มเป็น ${(lvl + 1) * 150 + 450}% และยิงไวขึ้น`;
    }
  },
  {
    id: 'gatling',
    type: CARD_TYPES.ACTIVE,
    name: 'Gatling Overdrive',
    subName: 'ปืนกลเร่งรอบยิงรัว',
    icon: '🔫',
    color: '#eab308',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Enters Overdrive every 8s, boosting fire rate by +200% for 3s'
          : `Increases Overdrive fire rate to +${(lvl + 1) * 50 + 200}% with longer duration`;
      }
      return lvl === 0
        ? 'ทุก 8 วิ เข้าสู่โหมด Overdrive สปีดยิงรัวขึ้น +200% นาน 3 วิ'
        : `สปีดรัวแรงขึ้นเป็น +${(lvl + 1) * 50 + 200}% และอยู่นานขึ้น`;
    }
  },

  // --- การ์ดซัพพอร์ตสายยิง (Passive Skills) ---
  {
    id: 'deadly_optic',
    type: CARD_TYPES.PASSIVE,
    name: 'Deadly Optic',
    subName: 'เลนส์จุดตาย',
    icon: '🎯',
    color: '#f43f5e',
    getDesc: (lvl, lang = 'th') => {
      const chance = (lvl + 1) * 10;
      const critBonus = 20 + (lvl * 10);
      if (lang === 'en') {
        return lvl === 0
          ? `Crit chance +${chance}% and Crit damage +${critBonus}%`
          : `Crit chance increases to +${chance}% and Crit damage to +${critBonus}%`;
      }
      return lvl === 0
        ? `โอกาสคริติคอล +${chance}% และคริแรงขึ้น +${critBonus}%`
        : `โอกาสคริติคอลเป็น +${chance}% และคริแรงขึ้นเป็น +${critBonus}%`;
    }
  },
  {
    id: 'kinetic_accel',
    type: CARD_TYPES.PASSIVE,
    name: 'Kinetic Accel',
    subName: 'แรงส่งจลน์สะสม',
    icon: '🌀',
    color: '#8b5cf6',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Chain hits and shrapnels deal +25% bonus damage per bounce'
          : `Increases chain bonus damage to +${(lvl + 1) * 25}% per bounce`;
      }
      return lvl === 0
        ? 'การโจมตีต่อเนื่องหรือแตกตัวแรงขึ้น +25% ต่อทอด'
        : `โบนัสดาเมจโจมตีต่อเนื่องเพิ่มขึ้นเป็น +${(lvl + 1) * 25}% ต่อทอด`;
    }
  },
  {
    id: 'heavy_caliber',
    type: CARD_TYPES.PASSIVE,
    name: 'Heavy Caliber',
    subName: 'หัวกระสุนผลักกระแทก',
    icon: '⚙️',
    color: '#64748b',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Bullets knock back monsters upon impact'
          : `Increases knockback force by +${(lvl + 1) * 35}%`;
      }
      return lvl === 0
        ? 'กระสุนมีแรงผลักมอนสเตอร์ให้ถอยหลังกลับไปเมื่อโดนยิง'
        : `แรงผลักกระแทกแรงขึ้น +${(lvl + 1) * 35}%`;
    }
  },
  {
    id: 'overclock_barrel',
    type: CARD_TYPES.PASSIVE,
    name: 'Overclock Barrel',
    subName: 'ลำกล้องโอเวอร์คล็อก',
    icon: '🔥',
    color: '#10b981',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Permanently increases fire rate by +25% and accelerates bullet velocity'
          : `Increases fire rate to +${(lvl + 1) * 25}%`;
      }
      return lvl === 0
        ? 'ความเร็วการยิงถาวร +25% และกระสุนพุ่งเร็วขึ้น'
        : `ความเร็วการยิงเพิ่มขึ้นเป็น +${(lvl + 1) * 25}%`;
    }
  },

  // --- สายโดรน & ซัมมอน (Drone Active Skills) ---
  {
    id: 'laser_drone',
    type: CARD_TYPES.ACTIVE,
    name: 'Laser Drone',
    subName: 'ภูตสายฟ้าเลเซอร์',
    icon: '💠',
    color: '#38bdf8',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Summons 1 lightning drone orbiting and firing continuous lasers'
          : `Adds 1 additional drone (total ${lvl + 1} drones) with boosted dmg`;
      }
      return lvl === 0
        ? 'เรียกภูตสายฟ้า 1 ตน บินวนคอยยิงเลเซอร์ใส่ศัตรู'
        : `เพิ่มภูตสายฟ้าอีก 1 ตน (รวมเป็น ${lvl + 1} ตน) และยิงแรงขึ้น`;
    }
  },
  {
    id: 'repair_drone',
    type: CARD_TYPES.ACTIVE,
    name: 'Nanite Repairer',
    subName: 'แฟรี่ฮีลพยาบาล',
    icon: '🧚',
    color: '#22c55e',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Summons 1 healing fairy restoring +5 HP to the wizard every 2.5s'
          : `Increases HP restoration to +${(lvl + 1) * 4 + 5} HP per cycle`;
      }
      return lvl === 0
        ? 'เรียกแฟรี่ฮีล 1 ตน คอยปล่อยละอองฟื้นฟูเลือดจอมเวท +5 HP ทุก 2.5 วิ'
        : `เพิ่มการฟื้นฟูเลือดเป็น +${(lvl + 1) * 4 + 5} HP ต่อนัด`;
    }
  },

  // --- สายถึก & กองยานโดรน (Tank & Drone Passive Skills) ---
  {
    id: 'regen_core',
    type: CARD_TYPES.PASSIVE,
    name: 'Nano Regen Core',
    subName: 'แกนฟื้นฟูเลือดอัตโนมัติ',
    icon: '💚',
    color: '#10b981',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Passively regenerates +3 HP per second'
          : `Increases passive HP regeneration to +${(lvl + 1) * 3} HP/sec`;
      }
      return lvl === 0
        ? 'จอมเวทฟื้นฟูเลือดตัวเองอัตโนมัติ +3 HP ต่อวินาที'
        : `ฟื้นฟูเลือดเพิ่มขึ้นเป็น +${(lvl + 1) * 3} HP/วินาที`;
    }
  },
  {
    id: 'thorns',
    type: CARD_TYPES.PASSIVE,
    name: 'Spiked Retaliation',
    subName: 'เกราะหนามสะท้อนดาเมจ',
    icon: '🌵',
    color: '#eab308',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Reflects 250% damage back to enemies when they touch the wizard'
          : `Increases reflected damage to +${(lvl + 1) * 100 + 150}%`;
      }
      return lvl === 0
        ? 'เมื่อมอนสเตอร์แตะตัวจอมเวท สะท้อนดาเมจสวนกลับ 250%'
        : `ดาเมจสะท้อนแรงขึ้นเป็น +${(lvl + 1) * 100 + 150}%`;
    }
  },
  {
    id: 'titan_plating',
    type: CARD_TYPES.PASSIVE,
    name: 'Titanium Plating',
    subName: 'เกราะไททาเนียมลดทอนดาเมจ',
    icon: '🔩',
    color: '#94a3b8',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Reduces all incoming damage to the wizard by 20%'
          : `Increases damage reduction to ${Math.min(55, (lvl + 1) * 7 + 20)}%`;
      }
      return lvl === 0
        ? 'ลดความเสียหายทุกชนิดที่จอมเวทได้รับลง 20%'
        : `ลดความเสียหายลงอีกเป็น ${Math.min(55, (lvl + 1) * 7 + 20)}%`;
    }
  },
  {
    id: 'shockwave',
    type: CARD_TYPES.PASSIVE,
    name: 'Emergency Shockwave',
    subName: 'คลื่นผลักฉุกเฉิน',
    icon: '🌊',
    color: '#f59e0b',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'When HP drops below 35%, releases a shockwave knocking back all enemies (20s CD)'
          : `Enhances knockback and deals ${(lvl + 1) * 80}% explosion damage (20s CD)`;
      }
      return lvl === 0
        ? 'เมื่อเลือดจอมเวทต่ำกว่า 35% ระเบิดคลื่นผลักมอนสเตอร์ทั้งจอกระเด็นถอย (คูลดาวน์ 20 วิ)'
        : `คลื่นผลักแรงขึ้นและสร้างดาเมจระเบิด ${(lvl + 1) * 80}% (คูลดาวน์ 20 วิ)`;
    }
  },
  {
    id: 'hive_overdrive',
    type: CARD_TYPES.PASSIVE,
    name: 'Hive Overdrive',
    subName: 'เร่งรอบใบมีดโดรน',
    icon: '🌪️',
    color: '#06b6d4',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'All drones orbit +80% faster and deal +40% collision damage'
          : `Drones orbit +${(lvl + 1) * 50 + 80}% faster and deal +${(lvl + 1) * 30 + 40}% damage`;
      }
      return lvl === 0
        ? 'โดรนทุกชนิดหมุนเร็วขึ้น +80% และดาเมจชนแรงขึ้น +40%'
        : `โดรนหมุนเร็วขึ้น +${(lvl + 1) * 50 + 80}% และชนแรงขึ้น +${(lvl + 1) * 30 + 40}%`;
    }
  },
  {
    id: 'drone_duplicator',
    type: CARD_TYPES.PASSIVE,
    name: 'Swarm Duplicator',
    subName: 'ฝูงโดรนวงแหวนคู่',
    icon: '🌐',
    color: '#a855f7',
    getDesc: (lvl, lang = 'th') => {
      if (lang === 'en') {
        return lvl === 0
          ? 'Splits drones into dual orbits (inner & outer) covering a wider area'
          : `Expands outer orbit and boosts outer drone damage by +${(lvl + 1) * 30}%`;
      }
      return lvl === 0
        ? 'แยกวงโคจรโดรนเป็น 2 ชั้น (วงใน + วงนอก) กวาดพื้นที่กว้างขึ้น'
        : `ขยายระยะวงนอกกว้างขึ้น และเพิ่มดาเมจโดรนวงนอก +${(lvl + 1) * 30}%`;
    }
  }
];
