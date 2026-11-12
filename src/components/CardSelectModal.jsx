import React, { useState, useMemo } from 'react';
import { CARDS_DATABASE, CARD_TYPES, MAX_SLOTS, MAX_CARD_LEVEL } from '../data/cardsData';
import { TRANSLATIONS } from '../data/translations';

// ตารางแมปปิ้งความสัมพันธ์ของ Passive ว่าส่งผลกับ Active สกิลไหนบ้าง
const PASSIVE_AFFECTED_SKILLS = {
  area_expansion: [
    { icon: '☄️', name: 'Meteor' },
    { icon: '❄️', name: 'Frost Nova' },
    { icon: '🧪', name: 'Poison' },
    { icon: '🔮', name: 'Orb Drone' },
    { icon: '🛡️', name: 'Shield' },
    { icon: '⚡', name: 'Railgun' }
  ],
  time_extension: [
    { icon: '❄️', name: 'Frost Nova' },
    { icon: '🧪', name: 'Poison' },
    { icon: '🔫', name: 'Gatling' }
  ],
  cooldown_reduct: [
    { icon: '☄️', name: 'Meteor' },
    { icon: '❄️', name: 'Frost Nova' },
    { icon: '🧪', name: 'Poison' },
    { icon: '⚡', name: 'Railgun' },
    { icon: '🔭', name: 'Sniper' },
    { icon: '🔫', name: 'Gatling' }
  ],
  duplicate_cast: [
    { icon: '☄️', name: 'Meteor' },
    { icon: '🧪', name: 'Poison' },
    { icon: '🛡️', name: 'Shield' }
  ],
  spell_amp: [
    { icon: '☄️', name: 'Meteor' },
    { icon: '❄️', name: 'Frost Nova' },
    { icon: '🧪', name: 'Poison' },
    { icon: '🛡️', name: 'Shield' }
  ],
  vampiric: [
    { icon: '🏹', name: 'Multishot' },
    { icon: '💫', name: 'Bounce' },
    { icon: '🔮', name: 'Orb Drone' },
    { icon: '💥', name: 'Shrapnel' },
    { icon: '🔫', name: 'Gatling' }
  ],
  deadly_optic: [
    { icon: '🏹', name: 'Multishot' },
    { icon: '💫', name: 'Bounce' },
    { icon: '🔭', name: 'Sniper' },
    { icon: '🔫', name: 'Gatling' }
  ],
  kinetic_accel: [
    { icon: '💫', name: 'Bounce' },
    { icon: '💥', name: 'Shrapnel' }
  ],
  heavy_caliber: [
    { icon: '🏹', name: 'Multishot' },
    { icon: '🔫', name: 'Gatling' },
    { icon: '🔭', name: 'Sniper' }
  ],
  overclock_barrel: [
    { icon: '🏹', name: 'Multishot' },
    { icon: '💫', name: 'Bounce' },
    { icon: '🔫', name: 'Gatling' },
    { icon: '💥', name: 'Shrapnel' }
  ],
  regen_core: [
    { icon: '🧙‍♂️', name: 'Wizard' },
    { icon: '🧚', name: 'Repair Fairy' }
  ],
  thorns: [
    { icon: '🧙‍♂️', name: 'Wizard' },
    { icon: '🛡️', name: 'Shield' }
  ],
  titan_plating: [
    { icon: '🧙‍♂️', name: 'Wizard' }
  ],
  shockwave: [
    { icon: '🧙‍♂️', name: 'Wizard' },
    { icon: '🛡️', name: 'Shield' }
  ],
  hive_overdrive: [
    { icon: '🔮', name: 'Orb Drone' },
    { icon: '💠', name: 'Laser Drone' },
    { icon: '🧚', name: 'Repair Fairy' }
  ],
  drone_duplicator: [
    { icon: '🔮', name: 'Orb Drone' },
    { icon: '💠', name: 'Laser Drone' }
  ]
};

export default function CardSelectModal({ 
  wave, 
  currentSkills, 
  rerollsLeft, 
  onUseReroll, 
  onSelectCard,
  onRestartGame,
  lang = 'th'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.th;
  const [rerollCount, setRerollCount] = useState(0);

  const activeCount = Object.keys(currentSkills).filter(id => {
    const c = CARDS_DATABASE.find(item => item.id === id);
    return c && c.type === CARD_TYPES.ACTIVE;
  }).length;

  const passiveCount = Object.keys(currentSkills).filter(id => {
    const c = CARDS_DATABASE.find(item => item.id === id);
    return c && c.type === CARD_TYPES.PASSIVE;
  }).length;

  const availablePool = CARDS_DATABASE.filter(card => {
    const currentLvl = currentSkills[card.id] || 0;
    if (currentLvl >= MAX_CARD_LEVEL) return false;

    if (currentLvl === 0) {
      if (card.type === CARD_TYPES.ACTIVE && activeCount >= MAX_SLOTS) return false;
      if (card.type === CARD_TYPES.PASSIVE && passiveCount >= MAX_SLOTS) return false;
    }
    return true;
  });

  const randomCards = useMemo(() => {
    if (availablePool.length === 0) {
      return [{
        id: 'coin_bonus_500',
        name: t.bonusTitle,
        icon: '💰',
        type: 'bonus',
        color: '#fbbf24',
        getDesc: () => t.bonusDesc
      }];
    }
    const shuffled = [...availablePool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [rerollCount, availablePool.length]);

  const handleRerollClick = () => {
    if (rerollsLeft <= 0 || availablePool.length === 0) return;
    onUseReroll();
    setRerollCount(c => c + 1);
  };

  const isBossWave = wave % 5 === 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.88)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '105px 16px 20px 16px',
      overflowY: 'auto',
      zIndex: 100,
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', maxWidth: '340px', textAlign: 'center', margin: 'auto 0' }}>
        <div style={{ 
          fontSize: '11px', 
          color: isBossWave ? '#ef4444' : '#a855f7', 
          fontWeight: 'bold', 
          letterSpacing: '2px', 
          marginBottom: '4px' 
        }}>
          {isBossWave ? t.bossWaveTitle(wave) : t.miniBossWaveTitle(wave)}
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: '0 0 14px 0' }}>
          {t.chooseCard}
        </h2>

        {/* รายการการ์ด 3 ใบ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          {randomCards.map((card) => {
            const isBonus = card.type === 'bonus';
            const currentLevel = currentSkills[card.id] || 0;
            const nextLevel = currentLevel + 1;
            const isActive = card.type === CARD_TYPES.ACTIVE;
            const affectedSkills = PASSIVE_AFFECTED_SKILLS[card.id] || [];

            return (
              <button
                key={card.id}
                onClick={() => onSelectCard(card.id)}
                style={{
                  backgroundColor: '#1e293b',
                  border: `1.5px solid ${isBonus ? '#f59e0b' : (currentLevel > 0 ? card.color : '#334155')}`,
                  borderRadius: '12px',
                  padding: '12px 14px',
                  textAlign: 'left',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* แถบหัวการ์ด */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '18px' }}>{card.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc' }}>{card.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: isBonus ? '#fbbf24' : (isActive ? '#38bdf8' : '#ec4899'),
                      border: `1px solid ${isBonus ? '#fbbf24' : (isActive ? '#38bdf8' : '#ec4899')}`,
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}>
                      {isBonus ? 'BONUS' : card.type.toUpperCase()}
                    </span>
                    {!isBonus && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        border: '1px solid #3b82f6',
                        padding: '1px 5px',
                        borderRadius: '4px'
                      }}>
                        {currentLevel === 0 ? 'NEW' : `Lv.${nextLevel}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* คำอธิบายผลลัพธ์ของการ์ด */}
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                  {card.getDesc(currentLevel, lang)}
                </div>

                {/* แถบแสดงไอคอนสกิล Active ที่ได้รับผล (เฉพาะการ์ด Passive) */}
                {!isActive && !isBonus && affectedSkills.length > 0 && (
                  <div style={{
                    marginTop: '2px',
                    paddingTop: '6px',
                    borderTop: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{t.affects}</span>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {affectedSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          title={sk.name}
                          style={{
                            fontSize: '12px',
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            padding: '2px 6px',
                            borderRadius: '5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'help'
                          }}
                        >
                          {sk.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ปุ่มสุ่มการ์ดใหม่ (Reroll Button) */}
        <button
          onClick={handleRerollClick}
          disabled={rerollsLeft <= 0}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: `1px solid ${rerollsLeft > 0 ? '#f59e0b' : '#334155'}`,
            backgroundColor: rerollsLeft > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(30, 41, 59, 0.5)',
            color: rerollsLeft > 0 ? '#fbbf24' : '#64748b',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: rerollsLeft > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>{t.rerollCards}</span>
          <span style={{
            fontSize: '11px',
            backgroundColor: rerollsLeft > 0 ? '#f59e0b' : '#475569',
            color: '#0f172a',
            padding: '1px 6px',
            borderRadius: '12px'
          }}>
            {t.rerollLeft(rerollsLeft)}
          </span>
        </button>

        {/* ปุ่มยอมแพ้เริ่มเกมใหม่ (Quick Restart) */}
        {onRestartGame && (
          <button
            onClick={() => {
              if (window.confirm(t.restartConfirm)) {
                onRestartGame();
              }
            }}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '7px',
              borderRadius: '8px',
              border: '1px solid #334155',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              color: '#94a3b8',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <span>{t.quickRestart}</span>
          </button>
        )}
      </div>
    </div>
  );
}