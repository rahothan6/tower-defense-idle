import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import GameCanvas from './components/GameCanvas';
import UpgradePanel from './components/UpgradePanel';
import LeaderboardModal from './components/LeaderboardModal';
import CardSelectModal from './components/CardSelectModal';
import InventoryBar from './components/InventoryBar';
import { TRANSLATIONS } from './data/translations';
import { GAME_VERSION } from './config/version';

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('idle_game_lang') || 'th');
  const handleToggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('idle_game_lang', newLang);
  };
  const t = TRANSLATIONS[lang] || TRANSLATIONS.th;

  const [playerName, setPlayerName] = useState(() => localStorage.getItem('idle_player_name') || '');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [coins, setCoins] = useState(0);
  const [wave, setWave] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameRunId, setGameRunId] = useState(0);

  const [skills, setSkills] = useState({});
  const [isPickingCard, setIsPickingCard] = useState(false);

  const [rerollsLeft, setRerollsLeft] = useState(3);

  const [personalBest, setPersonalBest] = useState(() => {
    return parseInt(localStorage.getItem('idle_personal_best') || '1', 10);
  });

  const [leaders, setLeaders] = useState([]);
  const [loadingLeaders, setLoadingLeaders] = useState(true);

  // ตัวกันการบันทึกคะแนนซ้ำใน 1 รอบ
  const hasSavedScoreRef = useRef(false);

  const initialStats = {
    damage: 22,
    damageLevel: 1,
    attackSpeed: 2.0,
    attackSpeedLevel: 1,
    range: 150,
    rangeLevel: 1,
    hp: 100,
    maxHp: 100,
    maxHpLevel: 1
  };

  const [towerStats, setTowerStats] = useState(initialStats);

  // ฟังก์ชันดึงคะแนน Top 10
  const fetchScores = async () => {
    try {
      if (db) {
        const q = query(collection(db, 'scores'), orderBy('wave', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data());
        setLeaders(data);
      }
    } catch (err) {
      console.error("Firestore error:", err);
    } finally {
      setLoadingLeaders(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // นับเวลา Wave ละ 13 วินาที
  useEffect(() => {
    if (!isGameStarted || isGameOver || isPickingCard) return;
    const interval = setInterval(() => {
      setWave((w) => w + 1);
    }, 13000);
    return () => clearInterval(interval);
  }, [isGameStarted, isGameOver, isPickingCard]);

  // ระบบตรวจจับ Game Over แล้วบันทึกคะแนนรอบเดียว
  useEffect(() => {
    if (!isGameOver) return;

    if (wave > personalBest) {
      setPersonalBest(wave);
      localStorage.setItem('idle_personal_best', wave.toString());
    }

    if (hasSavedScoreRef.current) return;

    hasSavedScoreRef.current = true;

    const saveScore = async () => {
      try {
        const finalName = playerName.trim() || 'Player';
        if (db) {
          await addDoc(collection(db, 'scores'), {
            name: finalName,
            wave: Number(wave),
            createdAt: serverTimestamp()
          });
          fetchScores();
        }
      } catch (err) {
        console.error("Firestore Save Error:", err);
      }
    };

    saveScore();
  }, [isGameOver, wave, playerName]);

  // เริ่มเกมจากหน้าแรก (รีเซ็ตสเตตัสให้คลีนทุกครั้ง)
  const handleStartGame = (e) => {
    setRerollsLeft(3);
    e.preventDefault();
    if (!playerName.trim()) return;
    localStorage.setItem('idle_player_name', playerName.trim());
    
    hasSavedScoreRef.current = false;
    setGameRunId((prev) => prev + 1);
    setTowerStats(initialStats);
    setCoins(0);
    setWave(1);
    setSkills({});
    setIsPickingCard(false);
    setIsGameOver(false);
    setIsGameStarted(true);
  };

  // ปุ่มเล่นใหม่อีกรอบจาก Modal
  const handleRestart = () => {
    hasSavedScoreRef.current = false;
    setGameRunId((prev) => prev + 1);
    setTowerStats(initialStats);
    setCoins(0);
    setWave(1);
    setSkills({});
    setIsPickingCard(false);
    setIsGameOver(false);
    fetchScores();
    setRerollsLeft(3);
  };

  // ปุ่มกลับหน้าแรกจาก Modal
  const handleGoHome = () => {
    hasSavedScoreRef.current = false;
    setGameRunId((prev) => prev + 1);
    setIsGameOver(false);
    setIsGameStarted(false);
    setTowerStats(initialStats);
    setCoins(0);
    setWave(1);
    setSkills({});
    fetchScores();
    setRerollsLeft(3);
  };

  const handleUseReroll = () => {
    setRerollsLeft(prev => Math.max(0, prev - 1));
  };

  const handleEnemyKilled = (reward) => {
    setCoins((c) => c + reward);

    const vampLevel = skills.vampiric || 0;
    if (vampLevel > 0) {
      setTowerStats(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + vampLevel * 2)
      }));
    }
  };

  const handleTowerDamaged = (remainingHp) => {
    setTowerStats((prev) => ({ ...prev, hp: remainingHp }));
    if (remainingHp <= 0) {
      setIsGameOver(true);
    }
  };

  const handleUpgrade = (type, cost) => {
    if (coins < cost) return;
    setCoins((c) => c - cost);

    if (navigator.vibrate) navigator.vibrate(10);

    setTowerStats((prev) => {
      switch (type) {
        case 'damage':
          return { ...prev, damage: prev.damage + 5, damageLevel: prev.damageLevel + 1 };
        case 'attackSpeed':
          return { ...prev, attackSpeed: +(prev.attackSpeed + 0.25).toFixed(2), attackSpeedLevel: prev.attackSpeedLevel + 1 };
        case 'range':
          return { ...prev, range: prev.range + 15, rangeLevel: prev.rangeLevel + 1 };
        case 'maxHp':
          return { 
            ...prev, 
            maxHp: prev.maxHp + 30, 
            hp: Math.min(prev.maxHp + 30, prev.hp + 30),
            maxHpLevel: prev.maxHpLevel + 1 
          };
        default:
          return prev;
      }
    });
  };

  const handleCardSelected = (cardId) => {
    if (cardId === 'coin_bonus_500') {
      setCoins(prev => prev + 500);
      setIsPickingCard(false);
      return;
    }
    setSkills(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1
    }));
    setIsPickingCard(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      maxWidth: '480px',
      height: '100vh',
      margin: '0 auto',
      backgroundColor: '#090d16',
      color: '#ffffff',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'sans-serif'
    }}>
      {!isGameStarted ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          padding: '24px 20px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '340px',
            margin: 'auto 0'
          }}>
            {/* สลับภาษา [ TH | EN ] */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '10px' }}>
              <div style={{
                display: 'inline-flex',
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                padding: '2px',
                border: '1px solid #334155'
              }}>
                <button
                  type="button"
                  onClick={() => handleToggleLang('th')}
                  style={{
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: lang === 'th' ? '#2563eb' : 'transparent',
                    color: lang === 'th' ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  TH
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLang('en')}
                  style={{
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: lang === 'en' ? '#2563eb' : 'transparent',
                    color: lang === 'en' ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  EN
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
              <div style={{ fontSize: '42px', marginBottom: '6px' }}>🧙‍♂️</div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 4px 0', color: '#60a5fa' }}>{t.gameTitle}</h1>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>{t.gameSubtitle}</p>

              <form onSubmit={handleStartGame} style={{ width: '100%' }}>
                <input
                  type="text"
                  maxLength={15}
                  placeholder={t.namePlaceholder}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', textAlign: 'center', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <button
                  type="submit"
                  disabled={!playerName.trim()}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', backgroundColor: playerName.trim() ? '#2563eb' : '#334155', color: '#ffffff', fontWeight: 'bold', fontSize: '14px', cursor: playerName.trim() ? 'pointer' : 'not-allowed' }}
                >
                  {t.startGame}
                </button>
              </form>
            </div>

            <div style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '12px 14px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>{t.top10Title}</span>
                <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>{t.personalBest}: Wave {personalBest}</span>
              </div>
              <div>
                {loadingLeaders ? (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', padding: '16px 0' }}>{t.loading}</div>
                ) : leaders.length === 0 ? (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', padding: '16px 0' }}>{t.noScores}</div>
                ) : (
                  leaders.map((lead, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 2px', borderBottom: idx === leaders.length - 1 ? 'none' : '1px solid rgba(30, 41, 59, 0.5)', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '22px', fontSize: idx < 3 ? '13px' : '11px', color: '#64748b' }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}</span>
                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{lead.name}</span>
                      </div>
                      <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Wave {lead.wave}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            backgroundColor: '#111827',
            borderBottom: '1px solid #1f2937',
            flexShrink: 0,
            position: 'relative',
            zIndex: 110
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                WAVE {wave}
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>({playerName})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '13px' }}>
              <span style={{ color: '#fbbf24' }}>🟡 {coins.toLocaleString()}</span>
              <span style={{ color: '#f87171' }}>❤️ {Math.max(0, Math.round(towerStats.hp))}</span>
              <button
                onClick={() => {
                  if (window.confirm(t.restartConfirm)) {
                    handleRestart();
                  }
                }}
                title={t.restartBtn}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontWeight: 'normal'
                }}
              >
                {t.restartBtn}
              </button>
            </div>
          </header>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '6px 0',
            backgroundColor: '#0b1120',
            borderBottom: isPickingCard ? '1px solid #3b82f6' : '1px solid #1e293b',
            boxShadow: isPickingCard ? '0 4px 14px rgba(0, 0, 0, 0.6)' : 'none',
            flexShrink: 0,
            position: 'relative',
            zIndex: 110,
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}>
            <InventoryBar skills={skills} />
          </div>

          <main style={{
            flex: 1,
            position: 'relative',
            width: '100%',
            minHeight: 0,
            backgroundColor: '#030712',
            overflow: 'hidden'
          }}>
            <GameCanvas
              key={gameRunId}
              towerStats={towerStats}
              wave={wave}
              skills={skills}
              isPaused={isPickingCard}
              onGameOver={() => setIsGameOver(true)}
              onEnemyKilled={handleEnemyKilled}
              onTowerDamaged={handleTowerDamaged}
              onTriggerCardPick={() => setIsPickingCard(true)}
            />
          </main>

          <footer style={{
            height: '240px',
            backgroundColor: '#0f172a',
            borderTop: '1px solid #1e293b',
            flexShrink: 0,
            zIndex: 10,
            padding: '10px 12px',
            boxSizing: 'border-box'
          }}>
            <UpgradePanel towerStats={towerStats} coins={coins} onUpgrade={handleUpgrade} lang={lang} />
          </footer>

          {isPickingCard && (
            <CardSelectModal
              wave={wave}
              currentSkills={skills}
              rerollsLeft={rerollsLeft}
              onUseReroll={handleUseReroll}
              onSelectCard={handleCardSelected}
              onRestartGame={handleRestart}
              lang={lang}
            />
          )}

          {isGameOver && (
            <LeaderboardModal 
              playerName={playerName} 
              wave={wave} 
              onRestart={handleRestart}
              onGoHome={handleGoHome}
              lang={lang}
            />
          )}
        </>
      )}

      {/* Version Tag */}
      <div style={{
        position: 'absolute',
        bottom: '6px',
        right: '10px',
        fontSize: '10px',
        fontFamily: 'monospace',
        color: '#64748b',
        letterSpacing: '0.5px',
        pointerEvents: 'none',
        zIndex: 50,
        userSelect: 'none',
        opacity: 0.75
      }}>
        {GAME_VERSION}
      </div>
    </div>
  );
}