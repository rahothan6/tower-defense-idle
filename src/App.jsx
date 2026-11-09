import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import GameCanvas from './components/GameCanvas';
import UpgradePanel from './components/UpgradePanel';
import LeaderboardModal from './components/LeaderboardModal';
import CardSelectModal from './components/CardSelectModal';
import InventoryBar from './components/InventoryBar';

export default function App() {
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('idle_player_name') || '');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [coins, setCoins] = useState(0);
  const [wave, setWave] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  const [skills, setSkills] = useState({});
  const [isPickingCard, setIsPickingCard] = useState(false);

  const [rerollsLeft, setRerollsLeft] = useState(3);

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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '300px', marginTop: '12px', marginBottom: '20px' }}>
            <div style={{ fontSize: '42px', marginBottom: '6px' }}>🏰</div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 4px 0', color: '#60a5fa' }}>TOWER DEFENSE</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>ป้องกันป้อมตรงกลางให้นานที่สุด</p>

            <form onSubmit={handleStartGame} style={{ width: '100%' }}>
              <input
                type="text"
                maxLength={15}
                placeholder="ใส่ชื่อของคุณ..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '14px', textAlign: 'center', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
              />
              <button
                type="submit"
                disabled={!playerName.trim()}
                style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', backgroundColor: playerName.trim() ? '#2563eb' : '#334155', color: '#ffffff', fontWeight: 'bold', fontSize: '14px', cursor: playerName.trim() ? 'pointer' : 'not-allowed' }}
              >
                เริ่มเล่นเกม ⚔️
              </button>
            </form>
          </div>

          <div style={{ width: '100%', maxWidth: '320px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '14px', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '200px', maxHeight: '340px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>🏆 TOP 10 อันดับรอดชีวิต</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>สถิติสูงสุด</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {loadingLeaders ? (
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', padding: '24px 0' }}>กำลังโหลด...</div>
              ) : leaders.length === 0 ? (
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', padding: '24px 0' }}>ยังไม่มีข้อมูลคะแนน</div>
              ) : (
                leaders.map((lead, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', borderBottom: '1px solid #1e293b/60', fontSize: '12px' }}>
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
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                WAVE {wave}
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>({playerName})</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontWeight: 'bold', fontSize: '13px' }}>
              <span style={{ color: '#fbbf24' }}>🟡 {coins.toLocaleString()}</span>
              <span style={{ color: '#f87171' }}>❤️ {Math.max(0, Math.round(towerStats.hp))}</span>
            </div>
          </header>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0', backgroundColor: '#0b1120', flexShrink: 0 }}>
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
            <UpgradePanel towerStats={towerStats} coins={coins} onUpgrade={handleUpgrade} />
          </footer>

          {isPickingCard && (
            <CardSelectModal
              wave={wave}
              currentSkills={skills}
              rerollsLeft={rerollsLeft}
              onUseReroll={handleUseReroll}
              onSelectCard={handleCardSelected}
            />
          )}

          {isGameOver && (
            <LeaderboardModal 
              playerName={playerName} 
              wave={wave} 
              onRestart={handleRestart}
              onGoHome={handleGoHome}
            />
          )}
        </>
      )}
    </div>
  );
}