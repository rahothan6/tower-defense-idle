import React from 'react';
import { Search, Plus, Package, Archive } from 'lucide-react';

export default function StorageHeader({
  activeTab,
  setActiveTab,
  basketsCount,
  itemsCount,
  onOpenAddBasket,
  onOpenAddItem
}) {
  return (
    <header style={{
      backgroundColor: '#111827',
      borderBottom: '2px solid #1f2937',
      padding: '16px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '14px'
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: '#3b82f6',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            flexShrink: 0
          }}>
            🧺
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: '900',
              color: '#ffffff',
              letterSpacing: '-0.3px',
              lineHeight: 1.2
            }}>
              ระบบค้นหาของในตะกร้า
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#9ca3af', fontWeight: 'bold' }}>
              มี <strong style={{ color: '#60a5fa' }}>{basketsCount}</strong> ตะกร้า •{' '}
              <strong style={{ color: '#34d399' }}>{itemsCount}</strong> รายการสิ่งของ
            </p>
          </div>
        </div>

        {/* Tab Navigation & Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Main Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: '#1f2937',
            padding: '4px',
            borderRadius: '12px',
            border: '2px solid #374151'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'search' ? '#3b82f6' : 'transparent',
                color: activeTab === 'search' ? '#ffffff' : '#9ca3af',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Search size={18} />
              ค้นหาของ
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('baskets')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'baskets' ? '#3b82f6' : 'transparent',
                color: activeTab === 'baskets' ? '#ffffff' : '#9ca3af',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Archive size={18} />
              ดูตะกร้า ({basketsCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('items')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'items' ? '#3b82f6' : 'transparent',
                color: activeTab === 'items' ? '#ffffff' : '#9ca3af',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Package size={18} />
              ของทั้งหมด ({itemsCount})
            </button>
          </div>

          {/* Action: Add Basket */}
          <button
            type="button"
            onClick={onOpenAddBasket}
            title="เพิ่มตะกร้าใหม่"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '2px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#f3f4f6',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} color="#60a5fa" />
            เพิ่มตะกร้า
          </button>

          {/* Action: Add Item */}
          <button
            type="button"
            onClick={onOpenAddItem}
            title="เพิ่มของลงตะกร้า"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Plus size={18} />
            เพิ่มของ
          </button>
        </div>
      </div>
    </header>
  );
}
