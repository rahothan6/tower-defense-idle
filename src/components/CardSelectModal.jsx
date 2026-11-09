import React, { useState, useMemo } from 'react';
import { CARDS_DATABASE, CARD_TYPES, MAX_SLOTS, MAX_CARD_LEVEL } from '../data/cardsData';

export default function CardSelectModal({ wave, currentSkills, rerollsLeft, onUseReroll, onSelectCard }) {
  // state ตัวนับรอบการรี เพื่อบังคับให้คำนวณสุ่มการ์ดใหม่
  const [rerollCount, setRerollCount] = useState(0);

  // คำนวณจำนวนช่องที่ใช้ไป
  const activeCount = Object.keys(currentSkills).filter(id => {
    const c = CARDS_DATABASE.find(item => item.id === id);
    return c && c.type === CARD_TYPES.ACTIVE;
  }).length;

  const passiveCount = Object.keys(currentSkills).filter(id => {
    const c = CARDS_DATABASE.find(item => item.id === id);
    return c && c.type === CARD_TYPES.PASSIVE;
  }).length;

  // กรองการ์ดที่ยังไม่ตัน และช่องยังไม่เต็ม
  const availablePool = CARDS_DATABASE.filter(card => {
    const currentLvl = currentSkills[card.id] || 0;
    if (currentLvl >= MAX_CARD_LEVEL) return false;

    if (currentLvl === 0) {
      if (card.type === CARD_TYPES.ACTIVE && activeCount >= MAX_SLOTS) return false;
      if (card.type === CARD_TYPES.PASSIVE && passiveCount >= MAX_SLOTS) return false;
    }
    return true;
  });

  // สุ่ม 3 ใบ (จะสุ่มใหม่ทุกครั้งที่กด rerollCount เพิ่ม)
  const randomCards = useMemo(() => {
    const shuffled = [...availablePool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [rerollCount]);

  const handleRerollClick = () => {
    if (rerollsLeft <= 0) return;
    onUseReroll();
    setRerollCount(c => c + 1);
  };

  const isBossWave = wave % 5 === 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.94)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 100
    }}>
      <div style={{ width: '100%', maxWidth: '340px', textAlign: 'center' }}>
        <div style={{ 
          fontSize: '11px', 
          color: isBossWave ? '#ef4444' : '#a855f7', 
          fontWeight: 'bold', 
          letterSpacing: '2px', 
          marginBottom: '4px' 
        }}>
          {isBossWave ? `🔥 BOSS WAVE ${wave} DEFEATED 🔥` : `⚡ MINI-BOSS WAVE ${wave} CLEARED ⚡`}
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: '0 0 14px 0' }}>
          เลือกการ์ด 1 ใบ
        </h2>

        {/* รายการการ์ด 3 ใบ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          {randomCards.map((card) => {
            const currentLevel = currentSkills[card.id] || 0;
            const nextLevel = currentLevel + 1;
            const isActive = card.type === CARD_TYPES.ACTIVE;

            return (
              <button
                key={card.id}
                onClick={() => onSelectCard(card.id)}
                style={{
                  backgroundColor: '#1e293b',
                  border: `1.5px solid ${currentLevel > 0 ? card.color : '#334155'}`,
                  borderRadius: '12px',
                  padding: '12px 14px',
                  textAlign: 'left',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>{card.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc' }}>{card.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: isActive ? '#38bdf8' : '#ec4899',
                      border: `1px solid ${isActive ? '#38bdf8' : '#ec4899'}`,
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}>
                      {card.type.toUpperCase()}
                    </span>
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
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                  {card.getDesc(currentLevel)}
                </div>
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
          <span>🎲 สุ่มการ์ดใหม่</span>
          <span style={{
            fontSize: '11px',
            backgroundColor: rerollsLeft > 0 ? '#f59e0b' : '#475569',
            color: '#0f172a',
            padding: '1px 6px',
            borderRadius: '12px'
          }}>
            เหลือ {rerollsLeft}
          </span>
        </button>
      </div>
    </div>
  );
}