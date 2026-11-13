import React, { useState } from 'react';
import { WIZARD_SKINS, BULLET_SKINS } from '../data/skinsData';

export default function ShopModal({
  gems,
  saveId,
  unlockedActiveSlots,
  unlockedPassiveSlots,
  equippedWizardSkin,
  equippedBulletSkin,
  ownedWizardSkins,
  ownedBulletSkins,
  onBuyOrEquipSkin,
  onUnlockSlot,
  onRestoreSave,
  onClose,
  lang = 'th'
}) {
  const [activeTab, setActiveTab] = useState('wizards'); // 'wizards' | 'bullets' | 'slots'
  const [previewWizard, setPreviewWizard] = useState(equippedWizardSkin);
  const [previewBullet, setPreviewBullet] = useState(equippedBulletSkin);

  const [isRestoring, setIsRestoring] = useState(false);
  const [inputSaveId, setInputSaveId] = useState('');
  const [restoreMessage, setRestoreMessage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const isTh = lang === 'th';

  const handleCopySaveId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(saveId);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const handleDoRestore = async (e) => {
    e.preventDefault();
    if (!inputSaveId.trim()) return;
    setRestoreMessage(isTh ? 'กำลังค้นหาข้อมูล...' : 'Searching save data...');
    const res = await onRestoreSave(inputSaveId.trim());
    setRestoreMessage(res.message);
    if (res.success) {
      setTimeout(() => {
        setIsRestoring(false);
        setRestoreMessage('');
        setInputSaveId('');
      }, 1500);
    }
  };

  const currentWiz = WIZARD_SKINS.find(s => s.id === previewWizard) || WIZARD_SKINS[0];
  const currentBlt = BULLET_SKINS.find(s => s.id === previewBullet) || BULLET_SKINS[0];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.90)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 99999,
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '340px',
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        height: '92vh',
        maxHeight: '640px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>

        {/* Modal Header */}
        <div style={{
          backgroundColor: '#0f172a',
          padding: '12px 14px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🛍️</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff' }}>
                {isTh ? 'ร้านค้าเวทมนตร์' : 'Magic Shop'}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                {isTh ? 'สกินตัวละคร & ปลดช่องสกิล' : 'Skins & Slot Expansion'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Gem Badge (Matching Home Screen Pill Style) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(30, 58, 138, 0.45)',
              border: '1px solid rgba(59, 130, 246, 0.45)',
              padding: '3px 9px',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '13px' }}>💎</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#93c5fd', fontFamily: 'monospace' }}>
                {gems}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#94a3b8',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                padding: 0
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Preview Character & Bullet Stage (Matching inner leaderboard dark style) */}
        <div style={{
          backgroundColor: '#0b0f19',
          borderBottom: '1px solid #1e293b',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexShrink: 0
        }}>
          {/* Wizard Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '3px' }}>
              {isTh ? 'สกินจอมเวท' : 'Wizard Skin'}
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#1e293b',
              border: `2px solid ${currentWiz.colors.crystal}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: `0 0 12px ${currentWiz.colors.crystal}40`
            }}>
              {currentWiz.icon}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: currentWiz.colors.crystal, marginTop: '4px', maxWidth: '120px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isTh ? currentWiz.nameTh : currentWiz.name}
            </div>
          </div>

          {/* Bullet Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '3px' }}>
              {isTh ? 'สกินกระสุน' : 'Bullet Skin'}
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#1e293b',
              border: `2px solid ${currentBlt.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: `0 0 12px ${currentBlt.color}40`
            }}>
              {currentBlt.icon}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: currentBlt.color, marginTop: '4px', maxWidth: '120px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isTh ? currentBlt.nameTh : currentBlt.name}
            </div>
          </div>
        </div>

        {/* Tab Navigation (Matching Segmented Control of [ TH | EN ]) */}
        <div style={{
          backgroundColor: '#0f172a',
          padding: '8px 12px',
          borderBottom: '1px solid #1e293b',
          flexShrink: 0
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            backgroundColor: '#1e293b',
            borderRadius: '10px',
            padding: '3px',
            border: '1px solid #334155',
            gap: '3px'
          }}>
            <button
              onClick={() => setActiveTab('wizards')}
              style={{
                padding: '6px 4px',
                fontSize: '11px',
                fontWeight: 'bold',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'wizards' ? '#2563eb' : 'transparent',
                color: activeTab === 'wizards' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              🧙‍♂️ {isTh ? 'สกินตัว' : 'Skins'}
            </button>
            <button
              onClick={() => setActiveTab('bullets')}
              style={{
                padding: '6px 4px',
                fontSize: '11px',
                fontWeight: 'bold',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'bullets' ? '#2563eb' : 'transparent',
                color: activeTab === 'bullets' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              🔥 {isTh ? 'สกินกระสุน' : 'Bullets'}
            </button>
            <button
              onClick={() => setActiveTab('slots')}
              style={{
                padding: '6px 4px',
                fontSize: '11px',
                fontWeight: 'bold',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'slots' ? '#2563eb' : 'transparent',
                color: activeTab === 'slots' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              🎒 {isTh ? 'ปลดช่อง (6)' : 'Slots (6)'}
            </button>
          </div>
        </div>

        {/* Tab Content Area (Consistent dark palette #0b0f19) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 12px',
          boxSizing: 'border-box',
          backgroundColor: '#0b0f19',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>

          {/* TAB 1: WIZARD SKINS */}
          {activeTab === 'wizards' && (
            <>
              {WIZARD_SKINS.map((skin) => {
                const isOwned = ownedWizardSkins.includes(skin.id);
                const isEquipped = equippedWizardSkin === skin.id;
                const isSelected = previewWizard === skin.id;

                return (
                  <div
                    key={skin.id}
                    onClick={() => setPreviewWizard(skin.id)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.16)' : '#1e293b',
                      border: `1px solid ${isSelected ? '#3b82f6' : '#334155'}`,
                      borderRadius: '12px',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#0f172a',
                        border: `1px solid ${skin.colors.crystal}70`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}>
                        {skin.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ffffff' }}>
                          {isTh ? skin.nameTh : skin.name}
                        </div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', lineHeight: 1.2 }}>
                          {isTh ? skin.descTh : skin.descEn}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold', padding: '4px 8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                          {isTh ? 'สวมใส่อยู่' : 'Equipped'}
                        </span>
                      ) : isOwned ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyOrEquipSkin('wizard', skin.id, 0);
                          }}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#334155',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {isTh ? 'สวมใส่' : 'Equip'}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyOrEquipSkin('wizard', skin.id, skin.cost);
                          }}
                          disabled={gems < skin.cost}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: gems >= skin.cost ? '#2563eb' : '#0f172a',
                            border: gems >= skin.cost ? 'none' : '1px solid #334155',
                            borderRadius: '8px',
                            color: gems >= skin.cost ? '#ffffff' : '#64748b',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: gems >= skin.cost ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <span>{skin.cost}</span>
                          <span>💎</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* TAB 2: BULLET SKINS */}
          {activeTab === 'bullets' && (
            <>
              {BULLET_SKINS.map((blt) => {
                const isOwned = ownedBulletSkins.includes(blt.id);
                const isEquipped = equippedBulletSkin === blt.id;
                const isSelected = previewBullet === blt.id;

                return (
                  <div
                    key={blt.id}
                    onClick={() => setPreviewBullet(blt.id)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.16)' : '#1e293b',
                      border: `1px solid ${isSelected ? blt.color : '#334155'}`,
                      borderRadius: '12px',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#0f172a',
                        border: `1px solid ${blt.color}70`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}>
                        {blt.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ffffff' }}>
                          {isTh ? blt.nameTh : blt.name}
                        </div>
                        <div style={{ fontSize: '9px', color: '#94a3b8', lineHeight: 1.2 }}>
                          {isTh ? blt.descTh : blt.descEn}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold', padding: '4px 8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                          {isTh ? 'สวมใส่อยู่' : 'Equipped'}
                        </span>
                      ) : isOwned ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyOrEquipSkin('bullet', blt.id, 0);
                          }}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#334155',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {isTh ? 'สวมใส่' : 'Equip'}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyOrEquipSkin('bullet', blt.id, blt.cost);
                          }}
                          disabled={gems < blt.cost}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: gems >= blt.cost ? '#2563eb' : '#0f172a',
                            border: gems >= blt.cost ? 'none' : '1px solid #334155',
                            borderRadius: '8px',
                            color: gems >= blt.cost ? '#ffffff' : '#64748b',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: gems >= blt.cost ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <span>{blt.cost}</span>
                          <span>💎</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* TAB 3: SLOT EXPANSION */}
          {activeTab === 'slots' && (
            <>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', padding: '8px 10px', fontSize: '10px', color: '#93c5fd', lineHeight: 1.4 }}>
                {isTh 
                  ? '💡 ขยายช่องใส่สกิลถาวร จาก 4 ช่องเพิ่มได้สูงสุดเป็นอย่างละ 6 ช่อง (รวมใส่ได้ 12 สกิลในเกมเดียว)' 
                  : '💡 Permanently expand skill slots from 4 up to 6 slots each (Equip up to 12 skills simultaneously)'}
              </div>

              {/* Active Slots Box */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ffffff' }}>
                    ⚔️ {isTh ? 'ช่องสกิลโจมตี (Active)' : 'Active Slots'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {unlockedActiveSlots} / 6
                  </span>
                </div>

                {/* 6 Slots Visual */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5, 6].map(slotNum => {
                    const isUnlocked = slotNum <= unlockedActiveSlots;
                    return (
                      <div
                        key={slotNum}
                        style={{
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: isUnlocked ? 'rgba(37, 99, 235, 0.25)' : '#0f172a',
                          border: isUnlocked ? '1.5px solid #3b82f6' : '1px dashed #334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: isUnlocked ? '#93c5fd' : '#475569'
                        }}
                      >
                        {isUnlocked ? slotNum : `🔒${slotNum}`}
                      </div>
                    );
                  })}
                </div>

                {unlockedActiveSlots < 5 ? (
                  <button
                    onClick={() => onUnlockSlot('active', 5, 15)}
                    disabled={gems < 15}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: gems >= 15 ? '#2563eb' : '#0f172a',
                      color: gems >= 15 ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: gems >= 15 ? 'none' : '1px solid #334155',
                      cursor: gems >= 15 ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{isTh ? 'ปลดล็อคช่อง Active ที่ 5' : 'Unlock Active Slot 5'}</span>
                    <span>15 💎</span>
                  </button>
                ) : unlockedActiveSlots < 6 ? (
                  <button
                    onClick={() => onUnlockSlot('active', 6, 30)}
                    disabled={gems < 30}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: gems >= 30 ? '#2563eb' : '#0f172a',
                      color: gems >= 30 ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: gems >= 30 ? 'none' : '1px solid #334155',
                      cursor: gems >= 30 ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{isTh ? 'ปลดล็อคช่อง Active ที่ 6' : 'Unlock Active Slot 6'}</span>
                    <span>30 💎</span>
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>
                    ✓ {isTh ? 'ปลดล็อคช่อง Active เต็มครบ 6 ช่องแล้ว' : 'All 6 Active Slots Unlocked'}
                  </div>
                )}
              </div>

              {/* Passive Slots Box */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ffffff' }}>
                    📖 {isTh ? 'ช่องสกิลติดตัว (Passive)' : 'Passive Slots'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#c084fc', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {unlockedPassiveSlots} / 6
                  </span>
                </div>

                {/* 6 Slots Visual */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5, 6].map(slotNum => {
                    const isUnlocked = slotNum <= unlockedPassiveSlots;
                    return (
                      <div
                        key={slotNum}
                        style={{
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: isUnlocked ? 'rgba(168, 85, 247, 0.25)' : '#0f172a',
                          border: isUnlocked ? '1.5px solid #a855f7' : '1px dashed #334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: isUnlocked ? '#e9d5ff' : '#475569'
                        }}
                      >
                        {isUnlocked ? slotNum : `🔒${slotNum}`}
                      </div>
                    );
                  })}
                </div>

                {unlockedPassiveSlots < 5 ? (
                  <button
                    onClick={() => onUnlockSlot('passive', 5, 15)}
                    disabled={gems < 15}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: gems >= 15 ? '#7c3aed' : '#0f172a',
                      color: gems >= 15 ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: gems >= 15 ? 'none' : '1px solid #334155',
                      cursor: gems >= 15 ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{isTh ? 'ปลดล็อคช่อง Passive ที่ 5' : 'Unlock Passive Slot 5'}</span>
                    <span>15 💎</span>
                  </button>
                ) : unlockedPassiveSlots < 6 ? (
                  <button
                    onClick={() => onUnlockSlot('passive', 6, 30)}
                    disabled={gems < 30}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: gems >= 30 ? '#7c3aed' : '#0f172a',
                      color: gems >= 30 ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: gems >= 30 ? 'none' : '1px solid #334155',
                      cursor: gems >= 30 ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{isTh ? 'ปลดล็อคช่อง Passive ที่ 6' : 'Unlock Passive Slot 6'}</span>
                    <span>30 💎</span>
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>
                    ✓ {isTh ? 'ปลดล็อคช่อง Passive เต็มครบ 6 ช่องแล้ว' : 'All 6 Passive Slots Unlocked'}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Modal Footer: Save ID & Restore Save Bar (Consistent Slate-900 style) */}
        <div style={{
          backgroundColor: '#0f172a',
          padding: '10px 14px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexShrink: 0
        }}>
          {!isRestoring ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Save ID display */}
              <div 
                onClick={handleCopySaveId}
                title={isTh ? "คลิกเพื่อคัดลอกรหัสเซฟ" : "Click to copy save ID"}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(30, 58, 138, 0.25)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  padding: '3px 8px',
                  borderRadius: '8px'
                }}
              >
                <span>🔑 {isTh ? 'รหัสเซฟ:' : 'Save ID:'}</span>
                <span style={{ color: '#93c5fd', fontWeight: 'bold', fontFamily: 'monospace', textDecoration: 'underline' }}>
                  {saveId}
                </span>
                {copyFeedback && (
                  <span style={{ color: '#10b981', fontSize: '10px', fontWeight: 'bold' }}>
                    ✓ {isTh ? 'คัดลอกแล้ว' : 'Copied'}
                  </span>
                )}
              </div>

              {/* Restore Button */}
              <button
                onClick={() => setIsRestoring(true)}
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  borderRadius: '8px',
                  color: '#93c5fd',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>🔄</span>
                <span>{isTh ? 'กู้คืนเซฟ' : 'Restore'}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleDoRestore} style={{ display: 'flex', gap: '5px', width: '100%' }}>
              <input
                type="text"
                placeholder={isTh ? "พิมพ์รหัส 6 หลัก เช่น WIZ-XXXX" : "Enter Save ID..."}
                value={inputSaveId}
                onChange={(e) => setInputSaveId(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {isTh ? 'ยืนยัน' : 'OK'}
              </button>
              <button
                type="button"
                onClick={() => { setIsRestoring(false); setRestoreMessage(''); }}
                style={{
                  backgroundColor: '#334155',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '5px 8px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </form>
          )}

          {restoreMessage && (
            <div style={{ fontSize: '10px', color: '#f59e0b', textAlign: 'center' }}>
              {restoreMessage}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
