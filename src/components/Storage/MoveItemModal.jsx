import React, { useState } from 'react';
import { X, Check, MoveRight } from 'lucide-react';

export default function MoveItemModal({ isOpen, onClose, onMove, item, baskets = [] }) {
  const [selectedBasketId, setSelectedBasketId] = useState(() => {
    // เลือกตะกร้าอื่นที่ไม่ใช่ตะกร้าปัจจุบันเป็นค่าเริ่มต้น
    const other = baskets.find((b) => b.id !== item?.basketId);
    return other ? other.id : (baskets[0]?.id || '');
  });

  if (!isOpen || !item) return null;

  const currentBasket = baskets.find((b) => b.id === item.basketId);
  const targetBasket = baskets.find((b) => b.id === selectedBasketId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBasketId || selectedBasketId === item.basketId) {
      onClose();
      return;
    }
    onMove(item, targetBasket);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #374151',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        padding: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        color: '#f3f4f6'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MoveRight size={20} color="#3b82f6" />
            ย้ายของไปตะกร้าอื่น
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ข้อมูลสิ่งของที่จะย้าย */}
        <div style={{
          backgroundColor: '#1f2937',
          padding: '14px',
          borderRadius: '10px',
          marginBottom: '18px',
          border: '1px solid #374151'
        }}>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>สิ่งของที่จะย้าย:</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#60a5fa' }}>{item.name}</div>
          <div style={{ fontSize: '13px', color: '#d1d5db', marginTop: '4px' }}>
            ปัจจุบันอยู่ใน: <strong>{item.basketNumber} {currentBasket?.name || item.basketName ? `(${currentBasket?.name || item.basketName})` : ''}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '8px' }}>
              🧺 ย้ายไปใส่ในตะกร้า:
            </label>
            <select
              value={selectedBasketId}
              onChange={(e) => setSelectedBasketId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
              required
            >
              {baskets
                .filter((b) => b.id !== item.basketId)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.basketNumber}{b.name ? ` - ${b.name}` : ''}
                  </option>
                ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #4b5563',
                backgroundColor: 'transparent',
                color: '#d1d5db',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={!selectedBasketId || selectedBasketId === item.basketId}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Check size={16} />
              ยืนยันการย้าย
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
