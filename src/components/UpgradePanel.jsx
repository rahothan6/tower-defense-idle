import React from 'react';
import { getUpgradeCost } from '../utils/gameMath';

export default function UpgradePanel({ towerStats, coins, onUpgrade }) {
  const upgrades = [
    {
      key: 'damage',
      name: 'พลังโจมตี',
      icon: '⚔️',
      currentVal: towerStats.damage,
      unit: '',
      level: towerStats.damageLevel,
      cost: getUpgradeCost(10, 1.25, towerStats.damageLevel)
    },
    {
      key: 'attackSpeed',
      name: 'ความเร็วยิง',
      icon: '⚡',
      currentVal: towerStats.attackSpeed,
      unit: '/s',
      level: towerStats.attackSpeedLevel,
      cost: getUpgradeCost(25, 1.35, towerStats.attackSpeedLevel)
    },
    {
      key: 'range',
      name: 'ระยะยิง',
      icon: '🎯',
      currentVal: towerStats.range,
      unit: 'px',
      level: towerStats.rangeLevel,
      cost: getUpgradeCost(15, 1.2, towerStats.rangeLevel)
    },
    {
      key: 'maxHp',
      name: 'ฟื้นฟู/เพิ่ม HP',
      icon: '❤️',
      currentVal: `${Math.round(towerStats.hp)}/${towerStats.maxHp}`,
      unit: '',
      level: towerStats.maxHpLevel,
      cost: getUpgradeCost(20, 1.3, towerStats.maxHpLevel)
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px'
      }}>
        {upgrades.map((item) => {
          const canAfford = coins >= item.cost;
          return (
            <button
              key={item.key}
              disabled={!canAfford}
              onClick={() => onUpgrade(item.key, item.cost)}
              style={{
                backgroundColor: canAfford ? '#1e293b' : '#0f172a',
                border: `1px solid ${canAfford ? '#3b82f6' : '#334155'}`,
                borderRadius: '10px',
                padding: '8px 10px',
                textAlign: 'left',
                color: canAfford ? '#ffffff' : '#64748b',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '84px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '12px', fontWeight: 'bold' }}>
                <span>{item.icon} {item.name}</span>
                <span style={{ fontSize: '10px', color: '#93c5fd' }}>Lv.{item.level}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                ปัจจุบัน: {item.currentVal} {item.unit}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: 'bold',
                borderTop: '1px solid #334155',
                paddingTop: '4px',
                color: canAfford ? '#fbbf24' : '#64748b'
              }}>
                <span>อัปเกรด</span>
                <span>🟡 {item.cost.toLocaleString()}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
        แตะเพื่ออัปเกรดแบบเรียลไทม์
      </div>
    </div>
  );
}