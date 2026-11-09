import React from 'react';
import { CARDS_DATABASE, CARD_TYPES, MAX_SLOTS } from '../data/cardsData';

export default function InventoryBar({ skills }) {
  // skills หน้าตาแบบ { multishot: 2, chronos: 1 }
  const activeCards = [];
  const passiveCards = [];

  Object.entries(skills).forEach(([id, level]) => {
    const info = CARDS_DATABASE.find(c => c.id === id);
    if (!info) return;
    if (info.type === CARD_TYPES.ACTIVE) activeCards.push({ ...info, level });
    if (info.type === CARD_TYPES.PASSIVE) passiveCards.push({ ...info, level });
  });

  const renderSlots = (items, type) => {
    const slots = [];
    for (let i = 0; i < MAX_SLOTS; i++) {
      const item = items[i];
      slots.push(
        <div
          key={i}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: item ? '#1e293b' : 'rgba(15, 23, 42, 0.6)',
            border: item ? `1.5px solid ${item.color}` : '1px dashed #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontSize: '15px'
          }}
        >
          {item ? (
            <>
              <span>{item.icon}</span>
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '1px',
                fontSize: '9px',
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
      gap: '12px',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      padding: '4px 8px',
      borderRadius: '8px',
      border: '1px solid #1e293b'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ fontSize: '9px', color: '#60a5fa', fontWeight: 'bold' }}>ACTIVE</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {renderSlots(activeCards, CARD_TYPES.ACTIVE)}
        </div>
      </div>

      <div style={{ width: '1px', height: '36px', backgroundColor: '#334155' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ fontSize: '9px', color: '#ec4899', fontWeight: 'bold' }}>PASSIVE</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {renderSlots(passiveCards, CARD_TYPES.PASSIVE)}
        </div>
      </div>
    </div>
  );
}