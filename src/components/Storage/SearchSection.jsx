import React, { useState, useMemo } from 'react';
import { Search, X, Edit3, Trash2 } from 'lucide-react';

export default function SearchSection({
  items = [],
  baskets = [],
  onOpenAddItem,
  onEditItem,
  onDeleteItem,
  onMoveItem,
  onSelectBasket
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBasketId, setSelectedBasketId] = useState('all');

  // แผนที่จับคู่ basketId -> basket object
  const basketMap = useMemo(() => {
    const map = {};
    for (const b of baskets) {
      map[b.id] = b;
    }
    return map;
  }, [baskets]);

  // ค้นหากรองข้อมูล (ตัดหมวดหมู่ออกทั้งหมด ค้นหาตรงๆ จากชื่อ โน้ต เลขตะกร้า และที่วาง)
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      // 1. กรองตามตะกร้า (ถ้าเลือก)
      if (selectedBasketId !== 'all' && item.basketId !== selectedBasketId) {
        return false;
      }
      // 2. คำค้นหา
      if (!q) return true;

      const basket = basketMap[item.basketId];
      const matchName = item.name?.toLowerCase().includes(q);
      const matchNote = item.note?.toLowerCase().includes(q);
      const matchBasketNum = String(item.basketNumber || '').toLowerCase().includes(q);
      const matchBasketName = (item.basketName || basket?.name || '').toLowerCase().includes(q);
      const matchBasketLoc = (basket?.location || '').toLowerCase().includes(q);

      return matchName || matchNote || matchBasketNum || matchBasketName || matchBasketLoc;
    });
  }, [items, searchQuery, selectedBasketId, basketMap]);

  // ฟังก์ชันไฮไลท์คำค้นหา
  const highlightMatch = (text, query) => {
    if (!text || !query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{
            backgroundColor: '#fef08a',
            color: '#854d0e',
            borderRadius: '4px',
            padding: '2px 4px',
            fontWeight: '900'
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div style={{ padding: '20px 16px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* กล่องค้นหาขนาดใหญ่ - ตัวหนังสือใหญ่ ชัดเจน */}
      <div style={{
        backgroundColor: '#111827',
        border: '2px solid #374151',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        marginBottom: '20px'
      }}>
        <label style={{
          display: 'block',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#e5e7eb',
          marginBottom: '10px'
        }}>
          🔍 พิมพ์ชื่อของที่กำลังหา:
        </label>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="พิมพ์ชื่อของ เช่น ยาพารา, แว่นตา, สายชาร์จ..."
            autoFocus
            style={{
              width: '100%',
              padding: '18px 56px 18px 20px',
              backgroundColor: '#1f2937',
              border: searchQuery ? '3px solid #3b82f6' : '2px solid #4b5563',
              borderRadius: '16px',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 'bold',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              boxShadow: searchQuery ? '0 0 16px rgba(59, 130, 246, 0.35)' : 'none'
            }}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              title="ล้างข้อความ"
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#374151',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d1d5db',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* ตัวเลือกกรองตามตะกร้า (เรียบง่าย ชัดเจน) */}
        {baskets.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid #1f2937',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '15px', color: '#9ca3af', fontWeight: 'bold' }}>
              🧺 เลือกดูเฉพาะตะกร้า:
            </span>
            <select
              value={selectedBasketId}
              onChange={(e) => setSelectedBasketId(e.target.value)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#1f2937',
                border: '2px solid #374151',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <option value="all">ดูของในทุกตะกร้า ({items.length} อย่าง)</option>
              {baskets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.basketNumber}{b.name ? ` - ${b.name}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ผลลัพธ์การค้นหา: ไม่แสดงของจนกว่าจะเริ่มพิมพ์ค้นหา */}
      {!searchQuery.trim() && selectedBasketId === 'all' ? (
        <div style={{
          backgroundColor: '#111827',
          border: '1px dashed #374151',
          borderRadius: '20px',
          padding: '60px 20px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '14px' }}>🔍</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#ffffff', fontWeight: 'bold' }}>
            พิมพ์ชื่อของในช่องค้นหาด้านบน
          </h3>
          <p style={{ margin: 0, fontSize: '16px', color: '#9ca3af' }}>
            ระบบจะค้นหาและแสดงเบอร์ตะกร้าให้ทันที
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{
          backgroundColor: '#111827',
          border: '2px dashed #374151',
          borderRadius: '20px',
          padding: '50px 20px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '50px', marginBottom: '14px' }}>🔍</div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', color: '#ffffff', fontWeight: 'bold' }}>
            {searchQuery ? `หาของชื่อ "${searchQuery}" ไม่เจอ` : 'ไม่พบของในตะกร้านี้'}
          </h3>
          <p style={{ margin: 0, fontSize: '16px', color: '#9ca3af' }}>
            ลองตรวจสอบตัวสะกด หรือกดปุ่ม "เพิ่มของ" ด้านบน
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* แถบสรุปผล */}
          <div style={{ marginBottom: '6px', fontSize: '16px', color: '#d1d5db' }}>
            ค้นพบ <strong style={{ color: '#60a5fa', fontSize: '20px' }}>{filteredItems.length}</strong> รายการ
          </div>
          {filteredItems.map((item) => {
            const basket = basketMap[item.basketId];
            const basketColor = basket?.color || '#3b82f6';

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#111827',
                  border: `2px solid ${basketColor}`,
                  borderRadius: '18px',
                  padding: '20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)'
                }}
              >
                {/* ข้อมูลซ้าย: เลขตะกร้าเด่นชัด + ชื่อของ + ที่วาง */}
                <div style={{ flex: '1 1 340px' }}>
                  {/* แถบเลขตะกร้าขนาดใหญ่ สะดุดตา (มีแค่เลขตะกร้า) */}
                  <div style={{ marginBottom: '12px' }}>
                    <button
                      type="button"
                      onClick={() => basket && onSelectBasket(basket)}
                      title="กดเพื่อดูของทั้งหมดในตะกร้านี้"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: basketColor,
                        color: '#ffffff',
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        fontSize: '30px',
                        fontWeight: '900',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: `0 4px 14px ${basketColor}66`
                      }}
                    >
                      {item.basketNumber || basket?.basketNumber || '?'}
                    </button>
                  </div>

                  {/* ชื่อสิ่งของ - ตัวหนังสือใหญ่ หนา ชัดเจน */}
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    lineHeight: '1.4'
                  }}>
                    {highlightMatch(item.name, searchQuery)}
                    <span style={{
                      marginLeft: '14px',
                      fontSize: '17px',
                      fontWeight: 'bold',
                      color: '#93c5fd',
                      backgroundColor: '#1f2937',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      border: '1px solid #374151',
                      display: 'inline-block'
                    }}>
                      {item.quantity} {item.unit || 'ชิ้น'}
                    </span>
                  </div>
                </div>

                {/* ปุ่มจัดการ (ปุ่มใหญ่ กดง่าย) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  {/* ปุ่มแก้ไข */}
                  <button
                    type="button"
                    onClick={() => onEditItem(item)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      border: '2px solid #374151',
                      backgroundColor: '#1f2937',
                      color: '#e5e7eb',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={18} />
                    แก้ไข
                  </button>

                  {/* ปุ่มลบ */}
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item)}
                    title="ลบสิ่งของ"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={18} />
                    ลบ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
