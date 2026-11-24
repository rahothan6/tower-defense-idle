import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, targetType, targetName, itemCount = 0 }) {
  if (!isOpen) return null;

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
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #ef4444',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        padding: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        color: '#f3f4f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            padding: '10px',
            borderRadius: '12px',
            color: '#ef4444'
          }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
              ยืนยันการลบ{targetType === 'basket' ? 'ตะกร้า' : 'สิ่งของ'}
            </h3>
          </div>
        </div>

        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#d1d5db', lineHeight: '1.5' }}>
          คุณแน่ใจหรือไม่ว่าต้องการลบ <strong>"{targetName}"</strong> ออกจากระบบ?
        </p>

        {targetType === 'basket' && itemCount > 0 && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#fca5a5',
            marginBottom: '16px'
          }}>
            ⚠️ คำเตือน: ในตะกร้านี้มีสิ่งของอยู่ <strong>{itemCount} รายการ</strong> สิ่งของทั้งหมดในตะกร้านี้จะถูกลบออกไปด้วย
          </div>
        )}

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
            type="button"
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={16} />
            ลบทันที
          </button>
        </div>
      </div>
    </div>
  );
}
