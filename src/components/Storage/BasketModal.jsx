import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { BASKET_COLORS, BASKET_ICONS } from './constants';

export default function BasketModal({ isOpen, onClose, onSave, basketToEdit = null, existingBaskets = [] }) {
  const [basketNumber, setBasketNumber] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState(BASKET_COLORS[0].hex);
  const [icon, setIcon] = useState('🧺');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // กำหนดค่าเริ่มต้นหรือสร้างเลขตะกร้าถัดไปอัตโนมัติ
  useEffect(() => {
    if (!isOpen) return;
    if (basketToEdit) {
      setBasketNumber(basketToEdit.basketNumber || '');
      setName(basketToEdit.name || '');
      setLocation(basketToEdit.location || '');
      setColor(basketToEdit.color || BASKET_COLORS[0].hex);
      setIcon(basketToEdit.icon || '🧺');
      setDescription(basketToEdit.description || '');
      setError('');
    } else {
      // แนะนำเลขตะกร้าลำดับถัดไป เช่น 1, 2, 3...
      const numbers = existingBaskets
        .map((b) => parseInt(b.basketNumber, 10))
        .filter((n) => !isNaN(n));
      const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

      setBasketNumber(String(nextNum));
      setName('');
      setLocation('');
      // สลับสีถัดไปตามจำนวนตะกร้าที่มี
      const colorIdx = existingBaskets.length % BASKET_COLORS.length;
      setColor(BASKET_COLORS[colorIdx].hex);
      setIcon('🧺');
      setDescription('');
      setError('');
    }
  }, [isOpen, basketToEdit, existingBaskets]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!basketNumber.trim()) {
      setError('กรุณาระบุเลขตะกร้า');
      return;
    }
    if (!name.trim()) {
      setError('กรุณาระบุชื่อของในตะกร้า');
      return;
    }

    // ตรวจสอบเลขตะกร้าซ้ำ (เฉพาะตอนสร้างใหม่ หรือเปลี่ยนเลข)
    const isDuplicate = existingBaskets.some(
      (b) =>
        b.basketNumber.trim().toLowerCase() === basketNumber.trim().toLowerCase() &&
        (!basketToEdit || b.id !== basketToEdit.id)
    );
    if (isDuplicate) {
      setError(`มีตะกร้าหมายเลข "${basketNumber.trim()}" อยู่แล้ว กรุณาใช้เลขอื่น`);
      return;
    }

    onSave({
      basketNumber: basketNumber.trim(),
      name: name.trim(),
      location: location.trim(),
      color,
      icon,
      description: description.trim()
    });
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
        maxWidth: '500px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        color: '#f3f4f6'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 24px',
          borderBottom: '1px solid #1f2937'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{icon}</span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
              {basketToEdit ? 'แก้ไขข้อมูลตะกร้า' : 'เพิ่มตะกร้าเก็บของใหม่'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', overflowY: 'auto' }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginBottom: '16px' }}>
            {/* เลขตะกร้า */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '6px' }}>
                เลขตะกร้า <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={basketNumber}
                onChange={(e) => setBasketNumber(e.target.value)}
                placeholder="1"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* ชื่อตะกร้า */}
            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: 'bold', color: '#e5e7eb', marginBottom: '6px' }}>
                ชื่อของในตะกร้า <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ยาสามัญ, เครื่องเขียน"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#1f2937',
                  border: '2px solid #374151',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          </div>

          {/* เลือกไอคอน */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '6px' }}>
              เลือกไอคอนประจำตะกร้า
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BASKET_ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  style={{
                    fontSize: '20px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: icon === ic ? '#374151' : '#1f2937',
                    border: icon === ic ? '2px solid #3b82f6' : '1px solid #374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* เลือกสีป้ายกำกับ */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '6px' }}>
              เลือกสีป้ายกำกับ
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {BASKET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: color === c.hex ? '3px solid #ffffff' : '2px solid transparent',
                    boxShadow: color === c.hex ? '0 0 10px ' + c.hex : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s'
                  }}
                >
                  {color === c.hex && <Check size={16} color="#fff" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* คำอธิบายเพิ่มเติม */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '6px' }}>
              คำอธิบาย / บันทึกเพิ่มเติม (ไม่บังคับ)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="คำอธิบายเพิ่มเติม..."
              rows={2}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Action Buttons */}
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
              {basketToEdit ? 'บันทึกการแก้ไข' : 'สร้างตะกร้า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
