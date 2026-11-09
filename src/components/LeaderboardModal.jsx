import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function LeaderboardModal({ playerName, wave, onRestart, onGoHome }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTopScores = async () => {
      try {
        if (db) {
          const q = query(collection(db, 'scores'), orderBy('wave', 'desc'), limit(10));
          const snapshot = await getDocs(q);
          if (isMounted) {
            const data = snapshot.docs.map((doc) => doc.data());
            setLeaders(data);
          }
        }
      } catch (err) {
        console.error("Firestore fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopScores();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.88)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 9999
    }}>
      <div style={{
        width: '100%',
        maxWidth: '340px',
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        padding: '24px 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#ef4444', margin: '0 0 6px 0', letterSpacing: '1px' }}>
          GAME OVER
        </h2>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '2px' }}>
          ผู้เล่น: <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{playerName}</span>
        </div>
        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
          รอดชีวิตถึง: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Wave {wave}</span>
        </div>

        {/* ตาราง TOP 10 */}
        <div style={{
          backgroundColor: '#0b0f19',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          padding: '12px',
          marginBottom: '16px',
          maxHeight: '180px',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 'bold', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '6px' }}>
            <span>🏆 TOP 10 ผู้รอดชีวิต</span>
            <span>สถิติสูงสุด</span>
          </div>

          {loading ? (
            <div style={{ fontSize: '12px', color: '#64748b', padding: '16px 0' }}>กำลังโหลด...</div>
          ) : leaders.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#64748b', padding: '16px 0' }}>ยังไม่มีข้อมูล</div>
          ) : (
            leaders.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '4px 0' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', width: '18px', textAlign: 'left' }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                  </span>
                  <span style={{ color: '#e2e8f0', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Wave {item.wave}</span>
              </div>
            ))
          )}
        </div>

        {/* ปุ่มเล่นใหม่ */}
        <button
          onClick={onRestart}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            marginBottom: '8px'
          }}
        >
          เล่นใหม่อีกรอบ 🔄
        </button>

        {/* ปุ่มกลับหน้าแรก */}
        <button
          onClick={onGoHome}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '1px solid #334155',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          กลับหน้าแรก 🏠
        </button>
      </div>
    </div>
  );
}