import React, { useMemo } from 'react';
import { Edit3, Trash2, Package, ArrowRight } from 'lucide-react';

export default function BasketsSection({
  baskets = [],
  items = [],
  onOpenAddBasket,
  onOpenAddItemInBasket,
  onEditBasket,
  onDeleteBasket,
  onSelectBasket,
  onSeedDemoData
}) {
  // จับกลุ่มสิ่งของตาม basketId
  const itemsByBasket = useMemo(() => {
    const map = {};
    for (const item of items) {
      if (!map[item.basketId]) {
        map[item.basketId] = [];
      }
      map[item.basketId].push(item);
    }
    return map;
  }, [items]);

  // เรียงลำดับตะกร้าตามเลข (1, 2, 3...)
  const sortedBaskets = useMemo(() => {
    return [...baskets].sort((a, b) => {
      const numA = parseInt(a.basketNumber, 10);
      const numB = parseInt(b.basketNumber, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return String(a.basketNumber).localeCompare(String(b.basketNumber));
    });
  }, [baskets]);

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Section Header */}
      <div style={{
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>
          🧺 รายการตะกร้าเก็บของทั้งหมด ({baskets.length} ตะกร้า)
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af' }}>
          คลิกที่ตะกร้าเพื่อดูสิ่งของข้างใน
        </p>
      </div>

      {/* Grid of Baskets */}
      {sortedBaskets.length === 0 ? (
        <div style={{
          backgroundColor: '#111827',
          border: '1px dashed #374151',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🧺</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#fff', fontWeight: 'bold' }}>
            ยังไม่มีตะกร้าในระบบ
          </h3>
          <p style={{ margin: 0, fontSize: '16px', color: '#9ca3af' }}>
            กดปุ่ม "เพิ่มตะกร้า" ด้านบนเพื่อเริ่มสร้างตะกร้า
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {sortedBaskets.map((basket) => {
            const basketItems = itemsByBasket[basket.id] || [];
            const basketColor = basket.color || '#3b82f6';

            return (
              <div
                key={basket.id}
                style={{
                  backgroundColor: '#111827',
                  border: `1px solid ${basketColor}44`,
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                {/* Basket Card Top Header */}
                <div style={{
                  backgroundColor: `${basketColor}18`,
                  borderBottom: `1px solid ${basketColor}33`,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      backgroundColor: basketColor,
                      color: '#ffffff',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '900',
                      boxShadow: `0 4px 10px ${basketColor}66`,
                      flexShrink: 0
                    }}>
                      {basket.basketNumber}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff', lineHeight: 1.3 }}>
                        {basket.name || basket.basketNumber}
                      </h3>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => onEditBasket(basket)}
                      title="แก้ไขข้อมูลตะกร้า"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px'
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBasket(basket, basketItems.length)}
                      title="ลบตะกร้า"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#f87171',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Basket Card Body */}
                <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Description */}
                    {basket.description && (
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#9ca3af', lineHeight: '1.4' }}>
                        {basket.description}
                      </p>
                    )}

                    {/* Items Preview Chips */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#9ca3af',
                        marginBottom: '8px'
                      }}>
                        <span>📦 สิ่งของในตะกร้า:</span>
                        <strong style={{ color: basketItems.length > 0 ? '#34d399' : '#6b7280' }}>
                          {basketItems.length} รายการ
                        </strong>
                      </div>

                      {basketItems.length === 0 ? (
                        <div style={{
                          backgroundColor: '#1f2937',
                          border: '1px dashed #374151',
                          padding: '10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#6b7280',
                          textAlign: 'center'
                        }}>
                          ยังไม่มีของในตะกร้านี้
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {basketItems.slice(0, 4).map((it) => (
                            <span
                              key={it.id}
                              style={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                color: '#e5e7eb'
                              }}
                            >
                              {it.name}
                            </span>
                          ))}
                          {basketItems.length > 4 && (
                            <span style={{
                              backgroundColor: `${basketColor}22`,
                              color: basketColor,
                              border: `1px solid ${basketColor}44`,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 'bold'
                            }}>
                              อีก {basketItems.length - 4} อย่าง
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div style={{
                    paddingTop: '12px',
                    borderTop: '1px solid #1f2937'
                  }}>
                    <button
                      type="button"
                      onClick={() => onSelectBasket(basket)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: basketColor,
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ดูสิ่งของในตะกร้า
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
