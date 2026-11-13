import React from 'react';
import { CARDS_DATABASE, CARD_TYPES, MAX_SLOTS } from '../data/cardsData';

export default function InventoryBar({ skills, maxActiveSlots = 4, maxPassiveSlots = 4 }) {
  // skills หน้าตาแบบ { multishot: 2, chronos: 1 }
  const activeCards = [];
  const passiveCards = [];

  Object.entries(skills).forEach(([id, level]) => {
    const info = CARDS_DATABASE.find(c => c.id === id);
    if (!info) return;
    if (info.type === CARD_TYPES.ACTIVE) activeCards.push({ ...info, level });
    if (info.type === CARD_TYPES.PASSIVE) passiveCards.push({ ...info, level });
  });

  const renderSlots = (items, type, totalSlots) => {
    const slots = [];
    const count = totalSlots || MAX_SLOTS;
    const slotSize = count > 5 ? 26 : (count > 4 ? 28 : 30);
    const iconSize = count > 5 ? '13px' : '14px';

    for (let i = 0; i < count; i++) {
      const item = items[i];
      const slotLabel = type === CARD_TYPES.ACTIVE ? `Active Slot ${i + 1}` : `Passive Slot ${i + 1}`;
      slots.push(
        <div
          key={i}
          title={item ? `${item.name} (${item.subName || ''}) - Lv.${item.level}` : slotLabel}
          style={{
            width: `${slotSize}px`,
            height: `${slotSize}px`,
            borderRadius: '5px',
            backgroundColor: item ? '#1e293b' : 'rgba(15, 23, 42, 0.6)',
            border: item ? `1.5px solid ${item.color}` : '1px dashed #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontSize: iconSize
          }}
        >
          {item ? (
            <>
              <span>{item.icon}</span>
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '1px',
                fontSize: '8px',
                fontWeight: '900',
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: '0 2px',
                borderRadius: '3px'
              }}>
                {item.level}
              </span>
            </>
          ) : null}
        </div>
      );
    }
    return slots;
  };

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      padding: '4px 8px',
      borderRadius: '8px',
      border: '1px solid #1e293b'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '8.5px', color: '#60a5fa', fontWeight: 'bold' }}>ACTIVE ({activeCards.length}/{maxActiveSlots})</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {renderSlots(activeCards, CARD_TYPES.ACTIVE, maxActiveSlots)}
        </div>
      </div>

      <div style={{ width: '1px', height: '32px', backgroundColor: '#334155' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '8.5px', color: '#ec4899', fontWeight: 'bold' }}>PASSIVE ({passiveCards.length}/{maxPassiveSlots})</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {renderSlots(passiveCards, CARD_TYPES.PASSIVE, maxPassiveSlots)}
        </div>
      </div>
    </div>
  );
}