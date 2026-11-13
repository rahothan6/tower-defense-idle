export const TRANSLATIONS = {
  th: {
    // หน้าแรก (Start / Home Screen)
    gameTitle: 'HIGH WIZARD DEFENSE',
    gameSubtitle: 'ปกป้องจอมเวทตรงกลางให้นานที่สุด',
    namePlaceholder: 'ใส่ชื่อของคุณ...',
    startGame: 'เริ่มเล่นเกม ⚔️',
    top10Title: '🏆 TOP 10 อันดับรอดชีวิต',
    personalBest: 'สถิติคุณ',
    loading: 'กำลังโหลด...',
    noScores: 'ยังไม่มีข้อมูลคะแนน',
    wave: 'Wave',

    // แถบด้านบน (Header Bar)
    restartBtn: '🔄 เริ่มใหม่',
    restartConfirm: 'ต้องการเริ่มเกมใหม่ตั้งแต่ Wave 1 ทันทีหรือไม่?',

    // แผงอัปเกรด (Upgrade Panel)
    statDamage: 'พลังโจมตี',
    statSpeed: 'ความเร็วยิง',
    statRange: 'ระยะยิง',
    statMaxHp: 'ฟื้นฟู/เพิ่ม HP',
    current: 'ปัจจุบัน',
    upgrade: 'อัปเกรด',
    upgradeHint: 'แตะเพื่ออัปเกรดแบบเรียลไทม์',

    // กล่องเลือกการ์ด (Card Select Modal)
    bossWaveTitle: (w) => `🔥 เตรียมรับมือบอส WAVE ${w} 🔥`,
    miniBossWaveTitle: (w) => `⚡ เตรียมรับมือมินิบอส WAVE ${w} ⚡`,
    chooseCard: 'เลือกการ์ด 1 ใบ',
    affects: 'มีผลกับ:',
    rerollCards: '🎲 สุ่มการ์ดใหม่',
    rerollLeft: (c) => `เหลือ ${c}`,
    quickRestart: '🔄 เริ่มเกมรอบใหม่ (Wave 1)',
    bonusTitle: 'Max Mastery Bonus',
    bonusDesc: 'คุณครอบครองและอัปเกรดการ์ดจนเต็มครบทุกใบแล้ว! รับโบนัสเหรียญ +500 Coins',
    cardTypeActive: 'ACTIVE',
    cardTypePassive: 'PASSIVE',
    cardTypeBonus: 'BONUS',
    cardNew: 'NEW',

    // หน้าจบเกม (Game Over Modal)
    gameOverTitle: 'GAME OVER',
    playerLabel: 'ผู้เล่น',
    survivedTo: 'รอดชีวิตถึง',
    top10Survivors: '🏆 TOP 10 ผู้รอดชีวิต',
    highScoreHeader: 'สถิติสูงสุด',
    noLeaderboardData: 'ยังไม่มีข้อมูล',
    playAgain: 'เล่นใหม่อีกรอบ 🔄',
    goHome: 'กลับหน้าแรก 🏠',
    shopBtn: '🛍️ ร้านค้าสกิน & ปลดช่อง',
    gemsLabel: 'อัญมณี'
  },
  en: {
    // Start / Home Screen
    gameTitle: 'HIGH WIZARD DEFENSE',
    gameSubtitle: 'Protect the center wizard as long as possible',
    namePlaceholder: 'Enter your name...',
    startGame: 'Start Game ⚔️',
    top10Title: '🏆 TOP 10 SURVIVORS',
    personalBest: 'Your Best',
    loading: 'Loading...',
    noScores: 'No score data yet',
    wave: 'Wave',

    // Header Bar
    restartBtn: '🔄 Restart',
    restartConfirm: 'Restart game from Wave 1 now?',

    // Upgrade Panel
    statDamage: 'Damage',
    statSpeed: 'Fire Rate',
    statRange: 'Range',
    statMaxHp: 'Heal / Max HP',
    current: 'Current',
    upgrade: 'Upgrade',
    upgradeHint: 'Tap to upgrade stats in real-time',

    // Card Select Modal
    bossWaveTitle: (w) => `🔥 PREPARE FOR BOSS WAVE ${w} 🔥`,
    miniBossWaveTitle: (w) => `⚡ PREPARE FOR MINI-BOSS WAVE ${w} ⚡`,
    chooseCard: 'Choose 1 Card',
    affects: 'Affects:',
    rerollCards: '🎲 Reroll Cards',
    rerollLeft: (c) => `${c} left`,
    quickRestart: '🔄 Quick Restart (Wave 1)',
    bonusTitle: 'Max Mastery Bonus',
    bonusDesc: 'All cards fully upgraded! Claim +500 Coins bonus',
    cardTypeActive: 'ACTIVE',
    cardTypePassive: 'PASSIVE',
    cardTypeBonus: 'BONUS',
    cardNew: 'NEW',

    // Game Over Modal
    gameOverTitle: 'GAME OVER',
    playerLabel: 'Player',
    survivedTo: 'Survived up to',
    top10Survivors: '🏆 TOP 10 Survivors',
    highScoreHeader: 'Best Record',
    noLeaderboardData: 'No records yet',
    playAgain: 'Play Again 🔄',
    goHome: 'Main Menu 🏠',
    shopBtn: '🛍️ Shop & Slots',
    gemsLabel: 'Gems'
  }
};
