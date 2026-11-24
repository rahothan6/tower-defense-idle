import React, { useState, useMemo } from 'react';
import { ArrowLeft, Edit3, Trash2, Search, X, Package } from 'lucide-react';

export default function BasketDetailView({
  basket,
  items = [],
  onBack,
  onOpenAddItemInBasket,
  onEditBasket,
  onDeleteBasket,
  onEditItem,
  onDeleteItem,
  onMoveItem
}) {
  const [basketSearch, setBasketSearch] = useState('');

  // กรองเฉพาะของในตะกร้านี้
  const itemsInBasket = useMemo(() => {
    return items.filter((item) => item.basketId === basket.id);
  }, [items, basket.id]);

  // ค้นหาของเฉพาะในตะกร้านี้
  const filteredItems = useMemo(() => {
    const q = basketSearch.trim().toLowerCase();
    if (!q) return itemsInBasket;
    return itemsInBasket.filter((item) => {
      return (
        item.name?.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
    });
  }, [itemsInBasket, basketSearch]);

  const basketColor = basket.color || '#3b82f6';

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid #374151',
          backgroundColor: '#1f2937',
          color: '#d1d5db',
          fontSize: '13px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={16} />
        กลับไปหน้ารวมตะกร้า
      </button>

      {/* Basket Info Banner */}
      <div style={{
        backgroundColor: '#111827',
        border: `1px solid ${basketColor}44`,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          {/* Left Details */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              backgroundColor: basketColor,
              color: '#ffffff',
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '800',
              boxShadow: `0 8px 16px ${basketColor}66`,
              flexShrink: 0
            }}>
              #{basket.basketNumber}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
                  {basket.name}
                </h2>
                <span style={{ fontSize: '22px' }}>{basket.icon || '🧺'}</span>
              </div>

              {basket.description && (
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#9ca3af', lineHeight: '1.4' }}>
                  {basket.description}
                </p>
              )}

              <div style={{ marginTop: '10px', fontSize: '13px', color: '#60a5fa' }}>
                📦 มีของทั้งหมด <strong>{itemsInBasket.length}</strong> รายการในตะกร้านี้
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onEditBasket(basket)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #374151',
                backgroundColor: '#1f2937',
                color: '#d1d5db',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={15} />
              แก้ไขตะกร้า
            </button>

            <button
              type="button"
              onClick={() => onDeleteBasket(basket, itemsInBasket.length)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={15} />
              ลบตะกร้า
            </button>
          </div>
        </div>
      </div>

      {/* Search inside this basket */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            value={basketSearch}
            onChange={(e) => setBasketSearch(e.target.value)}
            placeholder="ค้นหาสิ่งของในตะกร้านี้..."
            style={{
              width: '100%',
              padding: '10px 36px 10px 38px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          {basketSearch && (
            <button
              type="button"
              onClick={() => setBasketSearch('')}
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
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ fontSize: '13px', color: '#9ca3af' }}>
          แสดง {filteredItems.length} จาก {itemsInBasket.length} รายการ
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div style={{
          backgroundColor: '#111827',
          border: '1px dashed #374151',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff' }}>
            {basketSearch ? 'ไม่พบของที่ตรงกับคำค้นหาในตะกร้านี้' : 'ยังไม่มีสิ่งของในตะกร้านี้'}
          </h3>
          <p style={{ margin: 0, fontSize: '15px', color: '#9ca3af' }}>
            {basketSearch ? 'ลองค้นหาคำอื่น' : 'กดปุ่ม "เพิ่มของ" ด้านบนเพื่อเริ่มใส่ของลงในตะกร้านี้'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                      📦 {item.name}
                    </h4>
                    <span style={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#93c5fd'
                    }}>
                      มี {item.quantity} {item.unit || 'ชิ้น'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid #1f2937'
                }}>
                  <button
                    type="button"
                    onClick={() => onEditItem(item)}
                    title="แก้ไขสิ่งของ"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #374151',
                      backgroundColor: '#1f2937',
                      color: '#d1d5db',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteItem(item)}
                    title="ลบสิ่งของ"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#f87171',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
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
