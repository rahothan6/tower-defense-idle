import React, { useState, useEffect, useCallback } from 'react';
import TowerDefenseGame from './TowerDefenseGame';
import StorageManager from './components/Storage/StorageManager';

// ฟังก์ชันตรวจสอบ URL ว่าอยู่ในเส้นทางของหน้าระบบค้นหาตะกร้าหรือไม่
function isStorageRoute() {
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  return (
    pathname.startsWith('/storage') ||
    pathname.startsWith('/basket') ||
    hash.startsWith('#/storage') ||
    hash.startsWith('#storage') ||
    hash.startsWith('#/basket') ||
    search.includes('page=storage') ||
    search.includes('tab=storage')
  );
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => (isStorageRoute() ? 'storage' : 'game'));

  // ฟังการเปลี่ยน URL ทั้ง popstate (ย้อนกลับ/ไปข้างหน้า) และ hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const isStorage = isStorageRoute();
      setCurrentRoute(isStorage ? 'storage' : 'game');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // ฟังก์ชันสลับหน้าอย่างนุ่มนวล
  const navigateTo = useCallback((route) => {
    if (route === 'storage') {
      window.history.pushState({}, '', '/storage');
      setCurrentRoute('storage');
    } else {
      window.history.pushState({}, '', '/');
      setCurrentRoute('game');
    }

    // เลื่อนหน้าจอกลับขึ้นบนสุดเมื่อเปลี่ยนหน้า
    window.scrollTo(0, 0);
  }, []);

  if (currentRoute === 'storage') {
    return <StorageManager onNavigateToGame={() => navigateTo('game')} />;
  }

  return <TowerDefenseGame onNavigateToStorage={() => navigateTo('storage')} />;
}
