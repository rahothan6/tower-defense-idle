import React, { useState, useMemo } from 'react';
import { Search, X, Edit3, Trash2 } from 'lucide-react';

export default function AllItemsSection({
  items = [],
  baskets = [],
  onOpenAddItem,
  onEditItem,
  onDeleteItem,
  onMoveItem,
  onSelectBasket
}) {
  const [filterText, setFilterText] = useState('');
  const [selectedBasketId, setSelectedBasketId] = useState('all');
  const [sortBy, setSortBy] = useState('basketNumber'); // 'basketNumber' | 'name' | 'newest'

  const basketMap = useMemo(() => {
    const map = {};
    for (const b of baskets) {
      map[b.id] = b;
    }
    return map;
  }, [baskets]);

  const filteredItems = useMemo(() => {
    const q = filterText.trim().toLowerCase();

    const list = items.filter((item) => {
      if (selectedBasketId !== 'all' && item.basketId !== selectedBasketId) return false;
      if (!q) return true;

      const basket = basketMap[item.basketId];
      return (
        item.name?.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        String(item.basketNumber || '').toLowerCase().includes(q) ||
        basket?.name?.toLowerCase().includes(q) ||
        basket?.location?.toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'newest') {
        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
        return timeB - timeA;
      }
      // default: basketNumber
      const numA = parseInt(a.basketNumber, 10);
      const numB = parseInt(b.basketNumber, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        if (numA !== numB) return numA - numB;
      }
      return (a.name || '').localeCompare(b.name || '');
    });

    return list;
  }, [items, filterText, selectedBasketId, sortBy, basketMap]);

  return (
    <div style={{ padding: '20px 16px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Controls Bar */}
      <div style={{
        backgroundColor: '#111827',
        border: '2px solid #374151',
        borderRadius: '18px',
        padding: '18px 20px',
        marginBottom: '20px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* ค้นหาข้อความ */}
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
            <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="ค้นหาชื่อของหรือโน้ต..."
              style={{
                width: '100%',
                padding: '12px 38px 12px 42px',
                backgroundColor: '#1f2937',
                border: '2px solid #4b5563',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                boxSizing: 'border-box'
              }}
            />
            {filterText && (
              <button
                type="button"
                onClick={() => setFilterText('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters & Sorting */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            {/* Basket filter */}
            <select
              value={selectedBasketId}
              onChange={(e) => setSelectedBasketId(e.target.value)}
              style={{
                padding: '12px 14px',
                backgroundColor: '#1f2937',
                border: '2px solid #4b5563',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <option value="all">🧺 ดูทุกตะกร้า</option>
              {baskets.map((b) => (
                <option key={b.id} value={b.id}>
                  ตะกร้า #{b.basketNumber}
                </option>
              ))}
            </select>

            {/* Sort filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 14px',
                backgroundColor: '#1f2937',
                border: '2px solid #4b5563',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <option value="basketNumber">🔢 เรียงตามเลขตะกร้า</option>
              <option value="name">🔤 เรียงตามชื่อ ก-ฮ / A-Z</option>
              <option value="newest">🕒 รายการล่าสุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Count Header */}
      <div style={{ fontSize: '16px', color: '#d1d5db', marginBottom: '14px', fontWeight: 'bold' }}>
        แสดงสิ่งของทั้งหมด <strong style={{ color: '#60a5fa', fontSize: '18px' }}>{filteredItems.length}</strong> รายการ
      </div>

      {/* Table / List layout */}
      {filteredItems.length === 0 ? (
        <div style={{
          backgroundColor: '#111827',
          border: '2px dashed #374151',
          borderRadius: '18px',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '42px', marginBottom: '10px' }}>📦</div>
          <p style={{ margin: 0, fontSize: '17px', fontWeight: 'bold' }}>ไม่พบรายการสิ่งของที่ค้นหา</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredItems.map((item) => {
            const basket = basketMap[item.basketId];
            const basketColor = basket?.color || '#3b82f6';

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#111827',
                  border: '2px solid #1f2937',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                }}
              >
                {/* Left: Basket Badge + Item Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 320px' }}>
                  {/* Basket Badge */}
                  <button
                    type="button"
                    onClick={() => basket && onSelectBasket(basket)}
                    title="กดเพื่อเปิดดูตะกร้านี้"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: basketColor,
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '18px',
                      fontWeight: '900',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ตะกร้า #{item.basketNumber || basket?.basketNumber || '?'}
                  </button>

                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                      {item.name}
                    </div>
                  </div>
                </div>

                {/* Right: Quantity, Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Quantity */}
                  <span style={{
                    backgroundColor: '#1f2937',
                    border: '2px solid #374151',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#93c5fd',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.quantity} {item.unit || 'ชิ้น'}
                  </span>

                  {/* Edit action */}
                  <button
                    type="button"
                    onClick={() => onEditItem(item)}
                    title="แก้ไข"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '2px solid #374151',
                      backgroundColor: '#1f2937',
                      color: '#d1d5db',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit3 size={16} />
                    แก้ไข
                  </button>

                  {/* Delete action */}
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item)}
                    title="ลบ"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={16} />
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
